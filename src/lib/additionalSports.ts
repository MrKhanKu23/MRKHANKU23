import type { Player, RankedItem, Sport } from './sportsData';

const teams = (rows: string[][]): RankedItem[] => rows.map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));
const players = (rows: string[][]): Player[] => rows.map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

export const additionalSports: Sport[] = [
  { id: 'f1', name: 'Formula 1', icon: '🏎️', accent: '#ff3b30', teams: teams([
    ['Ferrari', 'Constructors’ Championship', '16 world titles', 'FER'], ['Williams', 'Constructors’ Championship', '9 world titles', 'WIL'],
    ['McLaren', 'Constructors’ Championship', '9+ world titles', 'MCL'], ['Mercedes', 'Constructors’ Championship', '8 world titles', 'MER'],
    ['Lotus', 'Historic constructor', '7 world titles', 'LOT'], ['Red Bull Racing', 'Constructors’ Championship', '6 world titles', 'RBR'],
    ['Cooper', 'Historic constructor', '2 world titles', 'COO'], ['Brabham', 'Historic constructor', '2 world titles', 'BRA'],
    ['Renault', 'Historic constructor', '2 world titles', 'REN'], ['Benetton', 'Historic constructor', '1 world title', 'BEN'],
  ]), players: players([
    ['Lewis Hamilton', 'Driver · Great Britain', '7 world titles', 'LH', 'Mercedes/Ferrari'], ['Michael Schumacher', 'Driver · Germany', '7 world titles', 'MS', 'Ferrari'],
    ['Juan Manuel Fangio', 'Driver · Argentina', '5 world titles', 'JMF', 'Mercedes/Maserati'], ['Max Verstappen', 'Driver · Netherlands', '4 world titles', 'MV', 'Red Bull Racing'],
    ['Alain Prost', 'Driver · France', '4 world titles', 'AP', 'McLaren/Williams'], ['Sebastian Vettel', 'Driver · Germany', '4 world titles', 'SV', 'Red Bull Racing'],
    ['Ayrton Senna', 'Driver · Brazil', '3 world titles', 'AS', 'McLaren'], ['Jack Brabham', 'Driver · Australia', '3 world titles', 'JB', 'Brabham'],
    ['Niki Lauda', 'Driver · Austria', '3 world titles', 'NL', 'Ferrari/McLaren'], ['Nelson Piquet', 'Driver · Brazil', '3 world titles', 'NP', 'Brabham/Williams'],
  ]) },
  { id: 'baseball', name: 'Baseball', icon: '⚾', accent: '#57a5ff', teams: teams([
    ['New York Yankees', 'MLB · World Series record', '27 championships', 'NYY'], ['St. Louis Cardinals', 'MLB · World Series record', '11 championships', 'STL'],
    ['Boston Red Sox', 'MLB · World Series record', '9 championships', 'BOS'], ['Athletics', 'MLB · World Series record', '9 championships', 'ATH'],
    ['Los Angeles Dodgers', 'MLB · World Series record', '9 championships', 'LAD'], ['San Francisco Giants', 'MLB · World Series record', '8 championships', 'SF'],
    ['Cincinnati Reds', 'MLB · World Series record', '5 championships', 'CIN'], ['Pittsburgh Pirates', 'MLB · World Series record', '5 championships', 'PIT'],
    ['Atlanta Braves', 'MLB · World Series record', '4 championships', 'ATL'], ['Detroit Tigers', 'MLB · World Series record', '4 championships', 'DET'],
  ]), players: players([
    ['Babe Ruth', 'Outfielder/Pitcher · USA', '714 career home runs', 'BR', 'New York Yankees'], ['Willie Mays', 'Center field · USA', '660 career home runs', 'WM', 'San Francisco Giants'],
    ['Hank Aaron', 'Right field · USA', '755 career home runs', 'HA', 'Atlanta Braves'], ['Ty Cobb', 'Center field · USA', '.366 career average', 'TC', 'Detroit Tigers'],
    ['Barry Bonds', 'Left field · USA', '762 career home runs', 'BB', 'San Francisco Giants'], ['Ted Williams', 'Left field · USA', '.482 career OBP', 'TW', 'Boston Red Sox'],
    ['Walter Johnson', 'Pitcher · USA', '110 career shutouts', 'WJ', 'Washington Senators'], ['Cy Young', 'Pitcher · USA', '511 career wins', 'CY', 'Cleveland Spiders'],
    ['Lou Gehrig', 'First base · USA', '2,130-game streak', 'LG', 'New York Yankees'], ['Jackie Robinson', 'Second base · USA', '1947 Rookie of the Year', 'JR', 'Brooklyn Dodgers'],
  ]) },
  { id: 'american-football', name: 'American Football', icon: '🏈', accent: '#b98b5f', teams: teams([
    ['New England Patriots', 'NFL · Super Bowl era', '6 Super Bowl wins', 'NE'], ['Pittsburgh Steelers', 'NFL · Super Bowl era', '6 Super Bowl wins', 'PIT'],
    ['Dallas Cowboys', 'NFL · Super Bowl era', '5 Super Bowl wins', 'DAL'], ['San Francisco 49ers', 'NFL · Super Bowl era', '5 Super Bowl wins', 'SF'],
    ['Kansas City Chiefs', 'NFL · Super Bowl era', '4+ Super Bowl wins', 'KC'], ['Green Bay Packers', 'NFL · Super Bowl era', '4 Super Bowl wins', 'GB'],
    ['New York Giants', 'NFL · Super Bowl era', '4 Super Bowl wins', 'NYG'], ['Denver Broncos', 'NFL · Super Bowl era', '3 Super Bowl wins', 'DEN'],
    ['Las Vegas Raiders', 'NFL · Super Bowl era', '3 Super Bowl wins', 'LV'], ['Washington Commanders', 'NFL · Super Bowl era', '3 Super Bowl wins', 'WAS'],
  ]), players: players([
    ['Tom Brady', 'Quarterback · USA', '7 Super Bowl wins', 'TB', 'Patriots/Buccaneers'], ['Jerry Rice', 'Wide receiver · USA', '22,895 receiving yards', 'JR', 'San Francisco 49ers'],
    ['Jim Brown', 'Running back · USA', '8 rushing titles', 'JB', 'Cleveland Browns'], ['Lawrence Taylor', 'Linebacker · USA', '3 Defensive POY awards', 'LT', 'New York Giants'],
    ['Peyton Manning', 'Quarterback · USA', '5 MVP awards', 'PM', 'Colts/Broncos'], ['Walter Payton', 'Running back · USA', '16,726 rushing yards', 'WP', 'Chicago Bears'],
    ['Joe Montana', 'Quarterback · USA', '4 Super Bowl wins', 'JM', 'San Francisco 49ers'], ['Reggie White', 'Defensive end · USA', '198 career sacks', 'RW', 'Eagles/Packers'],
    ['Barry Sanders', 'Running back · USA', '15,269 rushing yards', 'BS', 'Detroit Lions'], ['Patrick Mahomes', 'Quarterback · USA', 'Multiple MVP and SB wins', 'PM', 'Kansas City Chiefs'],
  ]) },
  { id: 'ufc', name: 'UFC', icon: '🥊', accent: '#ff5252', teams: teams([
    ['American Top Team', 'Florida · USA', 'Championship gym', 'ATT'], ['City Kickboxing', 'Auckland · New Zealand', 'Elite striking camp', 'CKB'],
    ['AKA', 'California · USA', 'Wrestling tradition', 'AKA'], ['Xtreme Couture', 'Nevada · USA', 'MMA institution', 'XC'],
    ['Kill Cliff FC', 'Florida · USA', 'Top-level roster', 'KCF'], ['Team Alpha Male', 'California · USA', 'Lower-weight pioneers', 'TAM'],
    ['Kings MMA', 'California · USA', 'Muay Thai excellence', 'KM'], ['Nova União', 'Rio de Janeiro · Brazil', 'Brazilian legacy', 'NU'],
    ['Tiger Muay Thai', 'Phuket · Thailand', 'Global fight camp', 'TMT'], ['Renegade MMA', 'Birmingham · England', 'Grappling specialists', 'REN'],
  ]), players: players([
    ['Jon Jones', 'Light heavyweight · USA', '11 title defenses', 'JJ', 'Jackson Wink/Fight Ready'], ['Georges St-Pierre', 'Welterweight · Canada', '9 title defenses', 'GSP', 'Tristar Gym'],
    ['Anderson Silva', 'Middleweight · Brazil', '16-fight UFC win streak', 'AS', 'Team Nogueira'], ['Demetrious Johnson', 'Flyweight · USA', '11 title defenses', 'DJ', 'AMC Pankration'],
    ['Amanda Nunes', 'Two-division champion · Brazil', 'Women’s UFC GOAT', 'AN', 'American Top Team'], ['José Aldo', 'Featherweight · Brazil', 'Historic title reign', 'JA', 'Nova União'],
    ['Khabib Nurmagomedov', 'Lightweight · Russia', '29–0 career record', 'KN', 'AKA'], ['Stipe Miocic', 'Heavyweight · USA', '4 title-fight wins', 'SM', 'Strong Style MMA'],
    ['Valentina Shevchenko', 'Flyweight · Kyrgyzstan', '7 title defenses', 'VS', 'Tiger Muay Thai'], ['Israel Adesanya', 'Middleweight · New Zealand', '5 title defenses', 'IA', 'City Kickboxing'],
  ]) },
  { id: 'swimming', name: 'Swimming', icon: '🏊', accent: '#35d1e8', teams: teams([
    ['United States', 'World aquatics', 'Olympic powerhouse', 'USA'], ['Australia', 'World aquatics', 'Freestyle tradition', 'AUS'],
    ['China', 'World aquatics', 'Strong across disciplines', 'CHN'], ['Great Britain', 'World aquatics', 'Relay excellence', 'GBR'],
    ['France', 'World aquatics', 'Sprint strength', 'FRA'], ['Canada', 'World aquatics', 'Women’s powerhouse', 'CAN'],
    ['Italy', 'World aquatics', 'Distance tradition', 'ITA'], ['Japan', 'World aquatics', 'Medley specialists', 'JPN'],
    ['Hungary', 'World aquatics', 'Historic champions', 'HUN'], ['Netherlands', 'World aquatics', 'Sprint heritage', 'NED'],
  ]), players: players([
    ['Michael Phelps', 'Medley/Butterfly · USA', '28 Olympic medals', 'MP', 'United States'], ['Katie Ledecky', 'Distance freestyle · USA', '14 Olympic medals', 'KL', 'United States'],
    ['Jenny Thompson', 'Freestyle/Butterfly · USA', '12 Olympic medals', 'JT', 'United States'], ['Ryan Lochte', 'Medley · USA', '12 Olympic medals', 'RL', 'United States'],
    ['Dara Torres', 'Sprint freestyle · USA', '12 Olympic medals', 'DT', 'United States'], ['Natalie Coughlin', 'Backstroke/Freestyle · USA', '12 Olympic medals', 'NC', 'United States'],
    ['Mark Spitz', 'Butterfly/Freestyle · USA', '11 Olympic medals', 'MS', 'United States'], ['Matt Biondi', 'Sprint freestyle · USA', '11 Olympic medals', 'MB', 'United States'],
    ['Emma McKeon', 'Freestyle/Butterfly · Australia', '14 Olympic medals', 'EM', 'Australia'], ['Kristin Otto', 'Multiple events · East Germany', '6 golds at one Games', 'KO', 'East Germany'],
  ]) },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', accent: '#f4c542', teams: teams([
    ['Poland', 'Men · International', 'World volleyball power', 'POL'], ['Italy', 'International', 'Technical excellence', 'ITA'],
    ['France', 'Men · International', 'Olympic pedigree', 'FRA'], ['Brazil', 'International', 'Historic powerhouse', 'BRA'],
    ['Japan', 'International', 'Speed and defense', 'JPN'], ['United States', 'International', 'Athletic roster', 'USA'],
    ['Türkiye', 'Women · International', 'Elite women’s team', 'TUR'], ['Serbia', 'Women · International', 'World champions', 'SRB'],
    ['Slovenia', 'Men · International', 'European contender', 'SLO'], ['China', 'Women · International', 'Olympic tradition', 'CHN'],
  ]), players: players([
    ['Karch Kiraly', 'Outside hitter · USA', '3 Olympic gold medals', 'KK', 'United States'], ['Giba', 'Outside hitter · Brazil', '3 Olympic medals', 'GIB', 'Brazil'],
    ['Sergio Santos', 'Libero · Brazil', '4 Olympic medals', 'SS', 'Brazil'], ['Regla Torres', 'Middle blocker · Cuba', '3 Olympic gold medals', 'RT', 'Cuba'],
    ['Lang Ping', 'Outside hitter · China', 'Olympic champion player/coach', 'LP', 'China'], ['Lorenzo Bernardi', 'Outside hitter · Italy', '2 world titles', 'LB', 'Italy'],
    ['Sergey Tetyukhin', 'Outside hitter · Russia', '4 Olympic medals', 'ST', 'Russia'], ['Mireya Luis', 'Outside hitter · Cuba', '3 Olympic gold medals', 'ML', 'Cuba'],
    ['Zhu Ting', 'Outside hitter · China', 'Olympic and world champion', 'ZT', 'China'], ['Tijana Bošković', 'Opposite · Serbia', '2 world titles', 'TB', 'Serbia'],
  ]) },
  { id: 'track-sprint', name: 'Track Sprint', icon: '🏃', accent: '#c8ff3d', teams: teams([
    ['United States', '100m · 200m · 400m', 'Sprint powerhouse', 'USA'], ['Jamaica', '100m · 200m', 'Global sprint legacy', 'JAM'],
    ['Botswana', '200m · 400m', 'Rising sprint nation', 'BOT'], ['Great Britain', '100m · 200m · relays', 'Deep relay tradition', 'GBR'],
    ['Canada', '100m · 200m · relays', 'Olympic sprint pedigree', 'CAN'], ['South Africa', '200m · 400m', 'One-lap strength', 'RSA'],
    ['Bahamas', '200m · 400m', '400m excellence', 'BAH'], ['Trinidad and Tobago', '100m · 200m', 'Caribbean speed', 'TTO'],
    ['Dominican Republic', '400m · mixed relay', 'One-lap specialists', 'DOM'], ['Nigeria', '100m · 200m · relays', 'African sprint tradition', 'NGR'],
  ]), players: players([
    ['Usain Bolt', '100m · 200m · Jamaica', '9.58 / 19.19 world records', 'UB', 'Jamaica'], ['Michael Johnson', '200m · 400m · USA', '4 individual Olympic golds', 'MJ', 'United States'],
    ['Allyson Felix', '200m · 400m · USA', '11 Olympic medals', 'AF', 'United States'], ['Florence Griffith Joyner', '100m · 200m · USA', '10.49 / 21.34 world records', 'FGJ', 'United States'],
    ['Wayde van Niekerk', '200m · 400m · South Africa', '43.03 world record', 'WVN', 'South Africa'], ['Shelly-Ann Fraser-Pryce', '100m · Jamaica', '3 Olympic gold medals', 'SFP', 'Jamaica'],
    ['Marie-José Pérec', '200m · 400m · France', '3 Olympic gold medals', 'MJP', 'France'], ['Carl Lewis', '100m · 200m · USA', '9 Olympic gold medals', 'CL', 'United States'],
    ['Elaine Thompson-Herah', '100m · 200m · Jamaica', 'Double-double Olympic gold', 'ETH', 'Jamaica'], ['Marita Koch', '400m · East Germany', '47.60 world record', 'MK', 'East Germany'],
  ]) },
];
