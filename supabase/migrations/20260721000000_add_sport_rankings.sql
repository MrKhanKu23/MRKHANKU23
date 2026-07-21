create table public.sport_rankings (
  sport_id text primary key references public.sports_catalog (sport_id) on delete cascade,
  all_time_teams jsonb not null check (jsonb_typeof(all_time_teams) = 'array'),
  all_time_players jsonb not null check (jsonb_typeof(all_time_players) = 'array'),
  current_teams jsonb not null check (jsonb_typeof(current_teams) = 'array'),
  current_players jsonb not null check (jsonb_typeof(current_players) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.sport_rankings enable row level security;
create policy "public can read sport rankings" on public.sport_rankings
  for select to anon, authenticated using (true);

insert into public.sport_rankings (sport_id, all_time_teams, all_time_players, current_teams, current_players)
select sport_id,
  (select jsonb_agg(item->'name') from jsonb_array_elements(payload->'teams') item),
  (select jsonb_agg(item->'name') from jsonb_array_elements(payload->'players') item),
  case sport_id
    when 'football' then '["Paris Saint-Germain","Barcelona","Liverpool","Bayern Munich","Inter Milan","Arsenal","Manchester City","Real Madrid","Atlético Madrid","Bayer Leverkusen"]'
    when 'basketball' then '["Oklahoma City Thunder","Boston Celtics","New York Knicks","Indiana Pacers","Denver Nuggets","Minnesota Timberwolves","Cleveland Cavaliers","Los Angeles Lakers","Golden State Warriors","San Antonio Spurs"]'
    when 'tennis' then '["Italy","Spain","Germany","United States","Australia","Serbia","Great Britain","France","Sweden","Czech Republic (women)"]'
    when 'fortnite' then '["Team Falcons","Dignitas","Gentle Mates","Karmine Corp","Twisted Minds","XSET","Team Liquid","NRG","FaZe Clan","100 Thieves"]'
    when 'counter-strike-2' then '["Team Spirit","Team Vitality","Natus Vincere","MOUZ","G2 Esports","FaZe Clan","FURIA","Team Liquid","Astralis","Ninjas in Pyjamas"]'
    when 'f1' then '["Mercedes","Ferrari","McLaren","Red Bull Racing","Williams","Aston Martin","Renault","Haas","Lotus","Benetton"]'
    when 'baseball' then '["Los Angeles Dodgers","New York Yankees","Detroit Tigers","Chicago Cubs","New York Mets","Seattle Mariners","Cleveland Guardians","Toronto Blue Jays","Philadelphia Phillies","San Diego Padres"]'
    when 'american-football' then '["Philadelphia Eagles","Buffalo Bills","Kansas City Chiefs","Baltimore Ravens","Detroit Lions","Los Angeles Rams","Minnesota Vikings","Green Bay Packers","Denver Broncos","Washington Commanders"]'
    when 'ufc' then '["City Kickboxing","American Top Team","AKA","Tiger Muay Thai","Xtreme Couture","Kill Cliff FC","Kings MMA","Team Alpha Male","Nova União","Renegade MMA"]'
    when 'swimming' then '["United States","Australia","France","Canada","China","Italy","Great Britain","Romania","Japan","Hungary"]'
    when 'volleyball' then '["France","Italy","Poland","Brazil","Japan","United States","Türkiye","Serbia","Slovenia","China"]'
    when 'track-sprint' then '["United States","Jamaica","Botswana","Saint Lucia","Dominican Republic","South Africa","Canada","Great Britain","Bahamas","Nigeria"]'
  end::jsonb,
  case sport_id
    when 'football' then '["Kylian Mbappé","Erling Haaland","Lionel Messi","Harry Kane","Lamine Yamal","Ousmane Dembélé","Jude Bellingham","Vinícius Júnior","Mohamed Salah","Rodri"]'
    when 'basketball' then '["Nikola Jokić","Shai Gilgeous-Alexander","Luka Dončić","Victor Wembanyama","Giannis Antetokounmpo","Jalen Brunson","Stephen Curry","Jayson Tatum","Anthony Edwards","LeBron James"]'
    when 'tennis' then '["Jannik Sinner","Alexander Zverev","Carlos Alcaraz","Novak Djokovic","Ben Shelton","Taylor Fritz","Jack Draper","Lorenzo Musetti","Holger Rune","Alex de Minaur"]'
    when 'fortnite' then '["Bugha","Aqua","Mero","Tayson","Peterbot","Pollo","Queasy","Veno","EpikWhale","Kami"]'
    when 'counter-strike-2' then '["s1mple","dev1ce","ZywOo","donk","NiKo","coldzera","dupreeh","ropz","m0NESY","karrigan"]'
    when 'f1' then '["Kimi Antonelli","George Russell","Lewis Hamilton","Charles Leclerc","Max Verstappen","Lando Norris","Oscar Piastri","Pierre Gasly","Oliver Bearman","Fernando Alonso"]'
    when 'baseball' then '["Aaron Judge","Shohei Ohtani","Bobby Witt Jr.","Juan Soto","Tarik Skubal","Paul Skenes","Cal Raleigh","José Ramírez","Vladimir Guerrero Jr.","Kyle Tucker"]'
    when 'american-football' then '["Josh Allen","Patrick Mahomes","Lamar Jackson","Joe Burrow","Saquon Barkley","Jalen Hurts","Justin Jefferson","Ja’Marr Chase","Myles Garrett","Micah Parsons"]'
    when 'ufc' then '["Ilia Topuria","Islam Makhachev","Khamzat Chimaev","Alex Pereira","Tom Aspinall","Merab Dvalishvili","Alexandre Pantoja","Max Holloway","Alexander Volkanovski","Valentina Shevchenko"]'
    when 'swimming' then '["Léon Marchand","Summer McIntosh","Katie Ledecky","Mollie O’Callaghan","Pan Zhanle","David Popovici","Thomas Ceccon","Regan Smith","Torri Huske","Kate Douglass"]'
    when 'volleyball' then '["Wilfredo León","Earvin N’Gapeth","Tijana Bošković","Zhu Ting","Alessandro Michieletto","Paola Egonu","Gabi Guimarães","Antoine Brizard","Yuji Nishida","Simone Giannelli"]'
    when 'track-sprint' then '["Noah Lyles","Letsile Tebogo","Julien Alfred","Sydney McLaughlin-Levrone","Marileidy Paulino","Sha’Carri Richardson","Melissa Jefferson-Wooden","Kishane Thompson","Oblique Seville","Quincy Hall"]'
  end::jsonb
from public.sports_catalog;

grant select on public.sport_rankings to anon, authenticated;
