import type { Player, RankedItem, Sport } from './sportsData';

const teams = (rows: string[][]): RankedItem[] => rows.map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));
const players = (rows: string[][]): Player[] => rows.map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

export const additionalSports: Sport[] = [
  { id: 'f1', name: 'Formula 1', icon: '🏎️', accent: '#ff3b30', teams: teams([
    ['Ferrari', 'Maranello · Italy', '16 constructors titles', 'FER'], ['McLaren', 'Woking · England', 'Iconic papaya team', 'MCL'],
    ['Mercedes', 'Brackley · England', '8 constructors titles', 'MER'], ['Red Bull Racing', 'Milton Keynes · England', 'Modern powerhouse', 'RBR'],
    ['Williams', 'Grove · England', '9 constructors titles', 'WIL'], ['Aston Martin', 'Silverstone · England', 'British racing heritage', 'AMR'],
    ['Alpine', 'Enstone · England', 'Renault works team', 'ALP'], ['Haas', 'Kannapolis · USA', 'American constructor', 'HAS'],
    ['Racing Bulls', 'Faenza · Italy', 'Red Bull sister team', 'RB'], ['Sauber', 'Hinwil · Switzerland', 'Swiss racing team', 'SAU'],
  ]), players: players([
    ['Max Verstappen', 'Driver · Netherlands', 'Multiple world champion', 'MV', 'Red Bull Racing'], ['Lewis Hamilton', 'Driver · Great Britain', '7 world titles', 'LH', 'Ferrari'],
    ['Lando Norris', 'Driver · Great Britain', 'Qualifying specialist', 'LN', 'McLaren'], ['Charles Leclerc', 'Driver · Monaco', 'One-lap speed', 'CL', 'Ferrari'],
    ['Oscar Piastri', 'Driver · Australia', 'Cool under pressure', 'OP', 'McLaren'], ['George Russell', 'Driver · Great Britain', 'Consistent racer', 'GR', 'Mercedes'],
    ['Fernando Alonso', 'Driver · Spain', '2 world titles', 'FA', 'Aston Martin'], ['Kimi Antonelli', 'Driver · Italy', 'Young talent', 'KA', 'Mercedes'],
    ['Carlos Sainz', 'Driver · Spain', 'Smooth operator', 'CS', 'Williams'], ['Alex Albon', 'Driver · Thailand', 'Race-day fighter', 'AA', 'Williams'],
  ]) },
  { id: 'baseball', name: 'Baseball', icon: '⚾', accent: '#57a5ff', teams: teams([
    ['Los Angeles Dodgers', 'MLB · National League', '8 World Series titles', 'LAD'], ['New York Yankees', 'MLB · American League', '27 World Series titles', 'NYY'],
    ['Atlanta Braves', 'MLB · National League', '4 World Series titles', 'ATL'], ['Houston Astros', 'MLB · American League', '2 World Series titles', 'HOU'],
    ['Philadelphia Phillies', 'MLB · National League', '2 World Series titles', 'PHI'], ['Baltimore Orioles', 'MLB · American League', '3 World Series titles', 'BAL'],
    ['San Diego Padres', 'MLB · National League', 'Dynamic lineup', 'SD'], ['Cleveland Guardians', 'MLB · American League', 'Elite pitching', 'CLE'],
    ['New York Mets', 'MLB · National League', '2 World Series titles', 'NYM'], ['Texas Rangers', 'MLB · American League', '2023 champions', 'TEX'],
  ]), players: players([
    ['Shohei Ohtani', 'Two-way star · Japan', 'Power and pitching', 'SO', 'Los Angeles Dodgers'], ['Aaron Judge', 'Outfielder · USA', 'Home-run power', 'AJ', 'New York Yankees'],
    ['Bobby Witt Jr.', 'Shortstop · USA', 'Five-tool talent', 'BW', 'Kansas City Royals'], ['Juan Soto', 'Outfielder · Dominican Republic', 'Elite plate vision', 'JS', 'New York Mets'],
    ['Mookie Betts', 'Utility · USA', 'All-around excellence', 'MB', 'Los Angeles Dodgers'], ['Ronald Acuña Jr.', 'Outfielder · Venezuela', 'Power and speed', 'RA', 'Atlanta Braves'],
    ['Gunnar Henderson', 'Shortstop · USA', 'Left-handed power', 'GH', 'Baltimore Orioles'], ['José Ramírez', 'Third base · Dominican Republic', 'Switch-hitting star', 'JR', 'Cleveland Guardians'],
    ['Bryce Harper', 'First base · USA', 'Big-game hitter', 'BH', 'Philadelphia Phillies'], ['Paul Skenes', 'Pitcher · USA', 'Triple-digit fastball', 'PS', 'Pittsburgh Pirates'],
  ]) },
  { id: 'american-football', name: 'American Football', icon: '🏈', accent: '#b98b5f', teams: teams([
    ['Kansas City Chiefs', 'NFL · AFC West', '4 Super Bowl titles', 'KC'], ['Philadelphia Eagles', 'NFL · NFC East', '2 Super Bowl titles', 'PHI'],
    ['Buffalo Bills', 'NFL · AFC East', 'High-powered offense', 'BUF'], ['Baltimore Ravens', 'NFL · AFC North', '2 Super Bowl titles', 'BAL'],
    ['Detroit Lions', 'NFL · NFC North', 'Historic franchise', 'DET'], ['San Francisco 49ers', 'NFL · NFC West', '5 Super Bowl titles', 'SF'],
    ['Green Bay Packers', 'NFL · NFC North', '4 Super Bowl titles', 'GB'], ['Los Angeles Rams', 'NFL · NFC West', '2 Super Bowl titles', 'LAR'],
    ['Cincinnati Bengals', 'NFL · AFC North', 'Explosive passing game', 'CIN'], ['Dallas Cowboys', 'NFL · NFC East', '5 Super Bowl titles', 'DAL'],
  ]), players: players([
    ['Patrick Mahomes', 'Quarterback · USA', 'Creative playmaker', 'PM', 'Kansas City Chiefs'], ['Josh Allen', 'Quarterback · USA', 'Dual-threat power', 'JA', 'Buffalo Bills'],
    ['Lamar Jackson', 'Quarterback · USA', 'Elite rushing QB', 'LJ', 'Baltimore Ravens'], ['Saquon Barkley', 'Running back · USA', 'Explosive runner', 'SB', 'Philadelphia Eagles'],
    ['Justin Jefferson', 'Wide receiver · USA', 'Route-running star', 'JJ', 'Minnesota Vikings'], ['Ja’Marr Chase', 'Wide receiver · USA', 'Deep-ball threat', 'JC', 'Cincinnati Bengals'],
    ['Myles Garrett', 'Defensive end · USA', 'Dominant pass rusher', 'MG', 'Cleveland Browns'], ['Micah Parsons', 'Linebacker · USA', 'Defensive playmaker', 'MP', 'Dallas Cowboys'],
    ['Joe Burrow', 'Quarterback · USA', 'Calm under pressure', 'JB', 'Cincinnati Bengals'], ['Amon-Ra St. Brown', 'Wide receiver · USA', 'Reliable target', 'ASB', 'Detroit Lions'],
  ]) },
  { id: 'ufc', name: 'UFC', icon: '🥊', accent: '#ff5252', teams: teams([
    ['American Top Team', 'Florida · USA', 'Championship gym', 'ATT'], ['City Kickboxing', 'Auckland · New Zealand', 'Elite striking camp', 'CKB'],
    ['AKA', 'California · USA', 'Wrestling tradition', 'AKA'], ['Xtreme Couture', 'Nevada · USA', 'MMA institution', 'XC'],
    ['Kill Cliff FC', 'Florida · USA', 'Top-level roster', 'KCF'], ['Team Alpha Male', 'California · USA', 'Lower-weight pioneers', 'TAM'],
    ['Kings MMA', 'California · USA', 'Muay Thai excellence', 'KM'], ['Nova União', 'Rio de Janeiro · Brazil', 'Brazilian legacy', 'NU'],
    ['Tiger Muay Thai', 'Phuket · Thailand', 'Global fight camp', 'TMT'], ['Renegade MMA', 'Birmingham · England', 'Grappling specialists', 'REN'],
  ]), players: players([
    ['Islam Makhachev', 'Lightweight · Russia', 'Elite grappler', 'IM', 'AKA'], ['Alex Pereira', 'Light heavyweight · Brazil', 'Knockout power', 'AP', 'Teixeira MMA'],
    ['Ilia Topuria', 'Featherweight · Spain', 'Complete finisher', 'IT', 'Climent Club'], ['Tom Aspinall', 'Heavyweight · England', 'Speed and power', 'TA', 'Team Kaobon'],
    ['Dricus du Plessis', 'Middleweight · South Africa', 'Relentless pressure', 'DDP', 'CIT Performance'], ['Merab Dvalishvili', 'Bantamweight · Georgia', 'Endless cardio', 'MD', 'Serra-Longo'],
    ['Jon Jones', 'Heavyweight · USA', 'All-time great', 'JJ', 'Fight Ready'], ['Alexander Volkanovski', 'Featherweight · Australia', 'High fight IQ', 'AV', 'Freestyle MMA'],
    ['Valentina Shevchenko', 'Flyweight · Kyrgyzstan', 'Elite technician', 'VS', 'Tiger Muay Thai'], ['Zhang Weili', 'Strawweight · China', 'Complete champion', 'ZW', 'Fight Ready'],
  ]) },
  { id: 'swimming', name: 'Swimming', icon: '🏊', accent: '#35d1e8', teams: teams([
    ['United States', 'World aquatics', 'Olympic powerhouse', 'USA'], ['Australia', 'World aquatics', 'Freestyle tradition', 'AUS'],
    ['China', 'World aquatics', 'Strong across disciplines', 'CHN'], ['Great Britain', 'World aquatics', 'Relay excellence', 'GBR'],
    ['France', 'World aquatics', 'Sprint strength', 'FRA'], ['Canada', 'World aquatics', 'Women’s powerhouse', 'CAN'],
    ['Italy', 'World aquatics', 'Distance tradition', 'ITA'], ['Japan', 'World aquatics', 'Medley specialists', 'JPN'],
    ['Hungary', 'World aquatics', 'Historic champions', 'HUN'], ['Netherlands', 'World aquatics', 'Sprint heritage', 'NED'],
  ]), players: players([
    ['Léon Marchand', 'Medley · France', 'Versatile champion', 'LM', 'France'], ['Katie Ledecky', 'Distance freestyle · USA', 'Distance legend', 'KL', 'United States'],
    ['Summer McIntosh', 'Medley · Canada', 'Multi-event star', 'SM', 'Canada'], ['Caeleb Dressel', 'Sprint · USA', 'Explosive speed', 'CD', 'United States'],
    ['Ariarne Titmus', 'Freestyle · Australia', 'Middle-distance ace', 'AT', 'Australia'], ['Pan Zhanle', 'Sprint freestyle · China', 'Record-setting speed', 'PZ', 'China'],
    ['Kaylee McKeown', 'Backstroke · Australia', 'Backstroke specialist', 'KM', 'Australia'], ['Kristóf Milák', 'Butterfly · Hungary', 'Butterfly powerhouse', 'KM', 'Hungary'],
    ['Sarah Sjöström', 'Sprint · Sweden', 'Sprint icon', 'SS', 'Sweden'], ['Adam Peaty', 'Breaststroke · Great Britain', 'Breaststroke legend', 'AP', 'Great Britain'],
  ]) },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', accent: '#f4c542', teams: teams([
    ['Poland', 'Men · International', 'World volleyball power', 'POL'], ['Italy', 'International', 'Technical excellence', 'ITA'],
    ['France', 'Men · International', 'Olympic pedigree', 'FRA'], ['Brazil', 'International', 'Historic powerhouse', 'BRA'],
    ['Japan', 'International', 'Speed and defense', 'JPN'], ['United States', 'International', 'Athletic roster', 'USA'],
    ['Türkiye', 'Women · International', 'Elite women’s team', 'TUR'], ['Serbia', 'Women · International', 'World champions', 'SRB'],
    ['Slovenia', 'Men · International', 'European contender', 'SLO'], ['China', 'Women · International', 'Olympic tradition', 'CHN'],
  ]), players: players([
    ['Wilfredo León', 'Outside hitter · Poland', 'Power server', 'WL', 'Poland'], ['Earvin N’Gapeth', 'Outside hitter · France', 'Creative attacker', 'EN', 'France'],
    ['Yuji Nishida', 'Opposite · Japan', 'Explosive jumper', 'YN', 'Japan'], ['Simone Giannelli', 'Setter · Italy', 'Elite playmaker', 'SG', 'Italy'],
    ['Tomasz Fornal', 'Outside hitter · Poland', 'Two-way star', 'TF', 'Poland'], ['Paola Egonu', 'Opposite · Italy', 'Scoring machine', 'PE', 'Italy'],
    ['Tijana Bošković', 'Opposite · Serbia', 'Left-handed power', 'TB', 'Serbia'], ['Zhu Ting', 'Outside hitter · China', 'Complete attacker', 'ZT', 'China'],
    ['Melissa Vargas', 'Opposite · Türkiye', 'Dominant server', 'MV', 'Türkiye'], ['Gabriela Guimarães', 'Outside hitter · Brazil', 'All-around leader', 'GG', 'Brazil'],
  ]) },
  { id: 'track-sprint', name: 'Track Sprint', icon: '🏃', accent: '#c8ff3d', teams: teams([
    ['United States', '100m · 200m · 400m', 'Sprint powerhouse', 'USA'], ['Jamaica', '100m · 200m', 'Global sprint legacy', 'JAM'],
    ['Botswana', '200m · 400m', 'Rising sprint nation', 'BOT'], ['Great Britain', '100m · 200m · relays', 'Deep relay tradition', 'GBR'],
    ['Canada', '100m · 200m · relays', 'Olympic sprint pedigree', 'CAN'], ['South Africa', '200m · 400m', 'One-lap strength', 'RSA'],
    ['Bahamas', '200m · 400m', '400m excellence', 'BAH'], ['Trinidad and Tobago', '100m · 200m', 'Caribbean speed', 'TTO'],
    ['Dominican Republic', '400m · mixed relay', 'One-lap specialists', 'DOM'], ['Nigeria', '100m · 200m · relays', 'African sprint tradition', 'NGR'],
  ]), players: players([
    ['Noah Lyles', '100m · 200m · USA', 'Elite top-end speed', 'NL', 'United States'], ['Letsile Tebogo', '100m · 200m · Botswana', 'Smooth sprint mechanics', 'LT', 'Botswana'],
    ['Marcell Jacobs', '100m · Italy', 'Explosive acceleration', 'MJ', 'Italy'], ['Kishane Thompson', '100m · Jamaica', 'Powerful starter', 'KT', 'Jamaica'],
    ['Wayde van Niekerk', '200m · 400m · South Africa', '400m world-record holder', 'WVN', 'South Africa'], ['Kirani James', '400m · Grenada', 'One-lap legend', 'KJ', 'Grenada'],
    ['Sydney McLaughlin-Levrone', '400m · USA', 'Elite one-lap speed', 'SML', 'United States'], ['Sha’Carri Richardson', '100m · 200m · USA', 'Explosive finisher', 'SR', 'United States'],
    ['Shericka Jackson', '100m · 200m · Jamaica', '200m specialist', 'SJ', 'Jamaica'], ['Marileidy Paulino', '400m · Dominican Republic', 'One-lap champion', 'MP', 'Dominican Republic'],
  ]) },
];
