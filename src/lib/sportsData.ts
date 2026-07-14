export type RankedItem = { name: string; detail: string; stat: string; badge: string };
export type Player = RankedItem & { team: string };
export type Sport = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  teams: RankedItem[];
  players: Player[];
};

const footballTeams: RankedItem[] = [
  ['Real Madrid', 'Spain · La Liga', '15 UCL titles', 'RM'], ['Manchester City', 'England · Premier League', '10 league titles', 'MC'],
  ['Bayern Munich', 'Germany · Bundesliga', '33 league titles', 'BM'], ['Liverpool', 'England · Premier League', '6 UCL titles', 'LFC'],
  ['Barcelona', 'Spain · La Liga', '27 league titles', 'FCB'], ['Inter Milan', 'Italy · Serie A', '20 league titles', 'INT'],
  ['Arsenal', 'England · Premier League', '13 league titles', 'ARS'], ['Paris Saint-Germain', 'France · Ligue 1', '12 league titles', 'PSG'],
  ['Atlético Madrid', 'Spain · La Liga', '11 league titles', 'ATM'], ['Bayer Leverkusen', 'Germany · Bundesliga', '2024 champions', 'B04'],
].map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));

const footballPlayers: Player[] = [
  ['Kylian Mbappé', 'Forward · France', 'Explosive finisher', 'KM', 'Real Madrid'], ['Erling Haaland', 'Forward · Norway', 'Goal machine', 'EH', 'Manchester City'],
  ['Vinícius Júnior', 'Winger · Brazil', 'Elite dribbler', 'VJ', 'Real Madrid'], ['Jude Bellingham', 'Midfielder · England', 'Box-to-box star', 'JB', 'Real Madrid'],
  ['Rodri', 'Midfielder · Spain', 'Tempo controller', 'RO', 'Manchester City'], ['Mohamed Salah', 'Forward · Egypt', 'Premier League icon', 'MS', 'Liverpool'],
  ['Harry Kane', 'Forward · England', 'Complete striker', 'HK', 'Bayern Munich'], ['Lamine Yamal', 'Winger · Spain', 'Teenage phenomenon', 'LY', 'Barcelona'],
  ['Bukayo Saka', 'Winger · England', 'Creative threat', 'BS', 'Arsenal'], ['Lautaro Martínez', 'Forward · Argentina', 'Clinical captain', 'LM', 'Inter Milan'],
].map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

const makeItems = (items: string[][]): RankedItem[] => items.map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));
const makePlayers = (items: string[][]): Player[] => items.map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

export const sports: Sport[] = [
  { id: 'football', name: 'Football', icon: '⚽', accent: '#b7f34a', teams: footballTeams, players: footballPlayers },
  { id: 'basketball', name: 'Basketball', icon: '🏀', accent: '#ff8a3d', teams: makeItems([
    ['Boston Celtics', 'NBA · Eastern', '18 championships', 'BOS'], ['Oklahoma City Thunder', 'NBA · Western', 'Young contenders', 'OKC'],
    ['Denver Nuggets', 'NBA · Western', '2023 champions', 'DEN'], ['New York Knicks', 'NBA · Eastern', '2 championships', 'NYK'],
    ['Minnesota Timberwolves', 'NBA · Western', 'Elite defense', 'MIN'], ['Milwaukee Bucks', 'NBA · Eastern', '2 championships', 'MIL'],
    ['Dallas Mavericks', 'NBA · Western', '2011 champions', 'DAL'], ['Cleveland Cavaliers', 'NBA · Eastern', '2016 champions', 'CLE'],
    ['Golden State Warriors', 'NBA · Western', '7 championships', 'GSW'], ['Los Angeles Lakers', 'NBA · Western', '17 championships', 'LAL'],
  ]), players: makePlayers([
    ['Nikola Jokić', 'Center · Serbia', 'Triple-double threat', 'NJ', 'Denver Nuggets'], ['Giannis Antetokounmpo', 'Forward · Greece', 'Two-way force', 'GA', 'Milwaukee Bucks'],
    ['Luka Dončić', 'Guard · Slovenia', 'Elite playmaker', 'LD', 'Dallas Mavericks'], ['Shai Gilgeous-Alexander', 'Guard · Canada', 'Scoring leader', 'SGA', 'Oklahoma City Thunder'],
    ['Jayson Tatum', 'Forward · USA', 'Champion scorer', 'JT', 'Boston Celtics'], ['Stephen Curry', 'Guard · USA', '3-point icon', 'SC', 'Golden State Warriors'],
    ['Anthony Edwards', 'Guard · USA', 'Explosive scorer', 'AE', 'Minnesota Timberwolves'], ['Victor Wembanyama', 'Center · France', 'Generational defender', 'VW', 'San Antonio Spurs'],
    ['LeBron James', 'Forward · USA', 'All-time great', 'LJ', 'Los Angeles Lakers'], ['Jalen Brunson', 'Guard · USA', 'Clutch creator', 'JB', 'New York Knicks'],
  ]) },
  { id: 'tennis', name: 'Tennis', icon: '🎾', accent: '#ffd44a', teams: makeItems([
    ['Italy', 'Davis Cup', 'Recent champions', 'ITA'], ['United States', 'Davis Cup', '32 titles', 'USA'], ['Australia', 'Davis Cup', '28 titles', 'AUS'],
    ['Spain', 'Davis Cup', '6 titles', 'ESP'], ['France', 'Davis Cup', '10 titles', 'FRA'], ['Great Britain', 'Davis Cup', '10 titles', 'GBR'],
    ['Canada', 'Davis Cup', '2022 champions', 'CAN'], ['Germany', 'Davis Cup', '3 titles', 'GER'], ['Serbia', 'Davis Cup', '2010 champions', 'SRB'], ['Croatia', 'Davis Cup', '2 titles', 'CRO'],
  ]), players: makePlayers([
    ['Jannik Sinner', 'Right-handed · Italy', 'Baseline power', 'JS', 'Italy'], ['Carlos Alcaraz', 'Right-handed · Spain', 'All-court speed', 'CA', 'Spain'],
    ['Novak Djokovic', 'Right-handed · Serbia', '24 major titles', 'ND', 'Serbia'], ['Alexander Zverev', 'Right-handed · Germany', 'Powerful serve', 'AZ', 'Germany'],
    ['Daniil Medvedev', 'Right-handed · Russia', 'Elite defense', 'DM', 'Independent'], ['Taylor Fritz', 'Right-handed · USA', 'First-strike tennis', 'TF', 'United States'],
    ['Coco Gauff', 'Right-handed · USA', 'Speed and defense', 'CG', 'United States'], ['Aryna Sabalenka', 'Right-handed · Belarus', 'Power hitter', 'AS', 'Independent'],
    ['Iga Świątek', 'Right-handed · Poland', 'Clay specialist', 'IS', 'Poland'], ['Jasmine Paolini', 'Right-handed · Italy', 'Relentless competitor', 'JP', 'Italy'],
  ]) },
];
