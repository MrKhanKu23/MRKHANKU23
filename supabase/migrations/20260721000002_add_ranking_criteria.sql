alter table public.sport_rankings
  add column all_time_team_basis text not null default 'trophies_won'
    check (all_time_team_basis = 'trophies_won'),
  add column current_team_basis text not null default 'trophies_won'
    check (current_team_basis = 'trophies_won'),
  add column all_time_player_basis text not null default 'career_performance_statistics'
    check (all_time_player_basis = 'career_performance_statistics'),
  add column current_player_basis text not null default 'current_performance_statistics'
    check (current_player_basis = 'current_performance_statistics');

create view public.sport_ranking_entries as
select rankings.sport_id, edition.name as edition, category.name as category,
  entry.position::integer as rank, entry.player_or_team_name as name,
  case
    when category.name = 'teams' and edition.name = 'all-time' then rankings.all_time_team_basis
    when category.name = 'teams' then rankings.current_team_basis
    when edition.name = 'all-time' then rankings.all_time_player_basis
    else rankings.current_player_basis
  end as ranking_basis
from public.sport_rankings rankings
cross join lateral (values ('all-time'), ('current')) edition(name)
cross join lateral (values ('teams'), ('players')) category(name)
cross join lateral jsonb_array_elements_text(
  case
    when edition.name = 'all-time' and category.name = 'teams' then rankings.all_time_teams
    when edition.name = 'all-time' then rankings.all_time_players
    when category.name = 'teams' then rankings.current_teams
    else rankings.current_players
  end
) with ordinality entry(player_or_team_name, position);

grant select on public.sport_ranking_entries to anon, authenticated;
