import { additionalSports } from './additionalSports';
import { additionalQuizPlayers } from './additionalQuizPlayers';

export type RankedItem = { name: string; detail: string; stat: string; badge: string };
export type Player = RankedItem & { team: string };
export type Sport = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  teams: RankedItem[];
  players: Player[];
  quizPlayers?: Player[];
};

const footballTeams: RankedItem[] = [
  ['Real Madrid', 'Spain · European Cup record', '15 European titles', 'RM'], ['Bayern Munich', 'Germany · European champions', '6 European titles', 'BM'],
  ['Liverpool', 'England · European champions', '6 European titles', 'LFC'], ['Barcelona', 'Spain · European champions', '5 European titles', 'FCB'],
  ['Inter Milan', 'Italy · European champions', '3 European titles', 'INT'], ['Manchester City', 'England · Treble winners', '1 European title', 'MC'],
  ['Arsenal', 'England · Domestic record', '13 league titles', 'ARS'], ['Atlético Madrid', 'Spain · Domestic record', '11 league titles', 'ATM'],
  ['Paris Saint-Germain', 'France · Domestic record', '12 league titles', 'PSG'], ['Bayer Leverkusen', 'Germany · Unbeaten champions', '1 league title', 'B04'],
].map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));

const footballPlayers: Player[] = [
  ['Lionel Messi', 'Forward · Argentina', '8 Ballon d’Or awards', 'LM', 'Argentina'], ['Cristiano Ronaldo', 'Forward · Portugal', '5 Ballon d’Or awards', 'CR', 'Portugal'],
  ['Pelé', 'Forward · Brazil', '3 World Cup titles', 'PE', 'Brazil'], ['Diego Maradona', 'Playmaker · Argentina', '1986 World Cup winner', 'DM', 'Argentina'],
  ['Johan Cruyff', 'Forward · Netherlands', '3 Ballon d’Or awards', 'JC', 'Netherlands'], ['Franz Beckenbauer', 'Defender · Germany', '2 Ballon d’Or awards', 'FB', 'Germany'],
  ['Alfredo Di Stéfano', 'Forward · Argentina/Spain', '5 European Cups', 'ADS', 'Real Madrid'], ['Ronaldo Nazário', 'Forward · Brazil', '2 Ballon d’Or awards', 'R9', 'Brazil'],
  ['Zinedine Zidane', 'Midfielder · France', 'World Cup and Euro winner', 'ZZ', 'France'], ['Michel Platini', 'Midfielder · France', '3 Ballon d’Or awards', 'MP', 'France'],
].map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

const makeItems = (items: string[][]): RankedItem[] => items.map(([name, detail, stat, badge]) => ({ name, detail, stat, badge }));
const makePlayers = (items: string[][]): Player[] => items.map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

const rankedSports: Sport[] = [
  { id: 'football', name: 'Football', icon: '⚽', accent: '#b7f34a', teams: footballTeams, players: footballPlayers },
  { id: 'basketball', name: 'Basketball', icon: '🏀', accent: '#ff8a3d', teams: makeItems([
    ['Boston Celtics', 'NBA · All-time record', '18 championships', 'BOS'], ['Los Angeles Lakers', 'NBA · All-time record', '17 championships', 'LAL'],
    ['Golden State Warriors', 'NBA · All-time record', '7 championships', 'GSW'], ['Chicago Bulls', 'NBA · All-time record', '6 championships', 'CHI'],
    ['San Antonio Spurs', 'NBA · All-time record', '5 championships', 'SAS'], ['Philadelphia 76ers', 'NBA · All-time record', '3 championships', 'PHI'],
    ['Detroit Pistons', 'NBA · All-time record', '3 championships', 'DET'], ['Miami Heat', 'NBA · All-time record', '3 championships', 'MIA'],
    ['New York Knicks', 'NBA · All-time record', '2 championships', 'NYK'], ['Houston Rockets', 'NBA · All-time record', '2 championships', 'HOU'],
  ]), players: makePlayers([
    ['Bill Russell', 'Center · USA', '11 NBA championships', 'BR', 'Boston Celtics'], ['Michael Jordan', 'Guard · USA', '6 Finals MVP awards', 'MJ', 'Chicago Bulls'],
    ['LeBron James', 'Forward · USA', 'NBA scoring record', 'LJ', 'Los Angeles Lakers'], ['Kareem Abdul-Jabbar', 'Center · USA', '6 MVP awards', 'KAJ', 'Los Angeles Lakers'],
    ['Wilt Chamberlain', 'Center · USA', '100 points in one game', 'WC', 'Philadelphia 76ers'], ['Magic Johnson', 'Guard · USA', '5 NBA championships', 'MJ', 'Los Angeles Lakers'],
    ['Kobe Bryant', 'Guard · USA', '5 NBA championships', 'KB', 'Los Angeles Lakers'], ['Tim Duncan', 'Forward · USA', '5 NBA championships', 'TD', 'San Antonio Spurs'],
    ['Larry Bird', 'Forward · USA', '3 MVP awards', 'LB', 'Boston Celtics'], ['Stephen Curry', 'Guard · USA', 'NBA 3-point record', 'SC', 'Golden State Warriors'],
  ]) },
  { id: 'tennis', name: 'Tennis', icon: '🎾', accent: '#ffd44a', teams: makeItems([
    ['United States', 'Davis Cup · All-time record', '32 titles', 'USA'], ['Australia', 'Davis Cup · All-time record', '28 titles', 'AUS'],
    ['Great Britain', 'Davis Cup · All-time record', '10 titles', 'GBR'], ['France', 'Davis Cup · All-time record', '10 titles', 'FRA'],
    ['Sweden', 'Davis Cup · All-time record', '7 titles', 'SWE'], ['Spain', 'Davis Cup · All-time record', '6 titles', 'ESP'],
    ['United States (women)', 'Billie Jean King Cup', '18 titles', 'USW'], ['Czech Republic (women)', 'Billie Jean King Cup', '11 titles', 'CZE'],
    ['Australia (women)', 'Billie Jean King Cup', '7 titles', 'AUW'], ['Germany', 'Davis Cup · All-time record', '3 titles', 'GER'],
  ]), players: makePlayers([
    ['Margaret Court', 'All-court · Australia', '24 major singles titles', 'MC', 'Australia'], ['Novak Djokovic', 'All-court · Serbia', '24 major singles titles', 'ND', 'Serbia'],
    ['Serena Williams', 'Power baseliner · USA', '23 major singles titles', 'SW', 'United States'], ['Rafael Nadal', 'Left-handed · Spain', '22 major singles titles', 'RN', 'Spain'],
    ['Steffi Graf', 'All-court · Germany', '22 major singles titles', 'SG', 'Germany'], ['Roger Federer', 'All-court · Switzerland', '20 major singles titles', 'RF', 'Switzerland'],
    ['Helen Wills', 'Baseliner · USA', '19 major singles titles', 'HW', 'United States'], ['Chris Evert', 'Baseliner · USA', '18 major singles titles', 'CE', 'United States'],
    ['Martina Navratilova', 'Serve-and-volley · USA', '18 major singles titles', 'MN', 'United States'], ['Pete Sampras', 'Serve-and-volley · USA', '14 major singles titles', 'PS', 'United States'],
  ]) },
  ...additionalSports,
];

export const sports: Sport[] = rankedSports.map((sport) => ({
  ...sport,
  quizPlayers: [...sport.players, ...(additionalQuizPlayers[sport.id] ?? [])],
}));
