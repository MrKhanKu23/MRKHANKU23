alter table public.sport_rankings drop constraint sport_rankings_sport_id_fkey;

insert into public.sport_rankings (sport_id, all_time_teams, all_time_players, current_teams, current_players) values
('fortnite',
 '["Team Falcons","Dignitas","Karmine Corp","Gentle Mates","Twisted Minds","XSET","Team Liquid","NRG","FaZe Clan","100 Thieves"]',
 '["Bugha","Aqua","Mero","Tayson","Peterbot","Pollo","Queasy","Veno","EpikWhale","Kami"]',
 '["Team Falcons","Dignitas","Gentle Mates","Karmine Corp","Twisted Minds","XSET","Team Liquid","NRG","FaZe Clan","100 Thieves"]',
 '["Bugha","Aqua","Mero","Tayson","Peterbot","Pollo","Queasy","Veno","EpikWhale","Kami"]'),
('counter-strike-2',
 '["Natus Vincere","Astralis","Team Vitality","Team Spirit","FaZe Clan","G2 Esports","MOUZ","FURIA","Team Liquid","Ninjas in Pyjamas"]',
 '["s1mple","dev1ce","ZywOo","donk","NiKo","coldzera","GeT_RiGhT","dupreeh","ropz","m0NESY"]',
 '["Team Spirit","Team Vitality","Natus Vincere","MOUZ","G2 Esports","FaZe Clan","FURIA","Team Liquid","Astralis","Ninjas in Pyjamas"]',
 '["s1mple","dev1ce","ZywOo","donk","NiKo","coldzera","dupreeh","ropz","m0NESY","karrigan"]');
