import { additionalSports } from './additionalSports';
import { additionalQuizPlayers } from './additionalQuizPlayers';
import { nameHonours } from './trophyNames';
import { careerYears } from './careerYears';
import { footballDraftPlayers } from './footballDraftPlayers';
import { footballClubPlayers } from './footballClubPlayers';
import { basketballClubPlayers } from './basketballClubPlayers';
import { baseballClubPlayers } from './baseballClubPlayers';
import { currentTeams } from './currentTeams';

export type RankedItem = { name: string; detail: string; stat: string; badge: string; honours?: string[] };
export type Player = RankedItem & { team: string; status?: 'active' | 'retired'; years?: string; rating?: number; currentTeam?: string; teamYears?: string };
export type Sport = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  teams: RankedItem[];
  players: Player[];
  quizPlayers?: Player[];
  draftPlayers?: Player[];
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
  ['Pelé', 'Forward · Brazil', '3 World Cup titles', 'PE', 'Brazil'], ['Diego Maradona', 'Attacking Midfielder · Argentina', '1986 World Cup winner', 'DM', 'Argentina'],
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
    ['Bill Russell', 'Center · USA', '11 NBA championships', 'BR', 'Boston Celtics'], ['Michael Jordan', 'Shooting Guard · USA', '6 Finals MVP awards', 'MJ', 'Chicago Bulls'],
    ['LeBron James', 'Small Forward · USA', 'NBA scoring record', 'LJ', 'Los Angeles Lakers'], ['Kareem Abdul-Jabbar', 'Center · USA', '6 MVP awards', 'KAJ', 'Los Angeles Lakers'],
    ['Wilt Chamberlain', 'Center · USA', '100 points in one game', 'WC', 'Philadelphia 76ers'], ['Magic Johnson', 'Point Guard · USA', '5 NBA championships', 'MJ', 'Los Angeles Lakers'],
    ['Kobe Bryant', 'Shooting Guard · USA', '5 NBA championships', 'KB', 'Los Angeles Lakers'], ['Tim Duncan', 'Power Forward · USA', '5 NBA championships', 'TD', 'San Antonio Spurs'],
    ['Larry Bird', 'Small Forward · USA', '3 MVP awards', 'LB', 'Boston Celtics'], ['Stephen Curry', 'Point Guard · USA', 'NBA 3-point record', 'SC', 'Golden State Warriors'],
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

const retiredPlayers = new Set([
  'Pelé', 'Diego Maradona', 'Johan Cruyff', 'Franz Beckenbauer', 'Alfredo Di Stéfano', 'Ronaldo Nazário', 'Zinedine Zidane', 'Michel Platini',
  'Ronaldinho', 'Paolo Maldini', 'Garrincha', 'Xavi Hernández', 'Andrés Iniesta', 'Gerd Müller',
  'Bill Russell', 'Michael Jordan', 'Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Magic Johnson', 'Kobe Bryant', 'Tim Duncan', 'Larry Bird',
  'Shaquille O’Neal', 'Hakeem Olajuwon', 'Oscar Robertson', 'Julius Erving', 'Moses Malone',
  'Margaret Court', 'Serena Williams', 'Rafael Nadal', 'Steffi Graf', 'Roger Federer', 'Helen Wills', 'Chris Evert', 'Martina Navratilova', 'Pete Sampras',
  'Björn Borg', 'Rod Laver', 'Billie Jean King', 'Andre Agassi', 'Monica Seles', 'John McEnroe',
  'Michael Schumacher', 'Juan Manuel Fangio', 'Alain Prost', 'Sebastian Vettel', 'Ayrton Senna', 'Jack Brabham', 'Niki Lauda', 'Nelson Piquet',
  'Mika Häkkinen', 'Jim Clark', 'Graham Hill', 'Kimi Räikkönen', 'Nigel Mansell',
  'Babe Ruth', 'Willie Mays', 'Hank Aaron', 'Ty Cobb', 'Barry Bonds', 'Ted Williams', 'Walter Johnson', 'Cy Young', 'Lou Gehrig', 'Jackie Robinson',
  'Mickey Mantle', 'Stan Musial', 'Honus Wagner', 'Roberto Clemente', 'Sandy Koufax', 'Rickey Henderson',
  'Tom Brady', 'Jerry Rice', 'Jim Brown', 'Lawrence Taylor', 'Peyton Manning', 'Walter Payton', 'Joe Montana', 'Reggie White', 'Barry Sanders',
  'Aaron Donald', 'Deion Sanders', 'Johnny Unitas', 'Randy Moss', 'Emmitt Smith', 'Ray Lewis',
  'Georges St-Pierre', 'Anderson Silva', 'Demetrious Johnson', 'Amanda Nunes', 'José Aldo', 'Khabib Nurmagomedov', 'Stipe Miocic',
  'Daniel Cormier', 'Randy Couture', 'Chuck Liddell', 'Joanna Jędrzejczyk',
  'Michael Phelps', 'Jenny Thompson', 'Ryan Lochte', 'Dara Torres', 'Natalie Coughlin', 'Mark Spitz', 'Matt Biondi', 'Emma McKeon', 'Kristin Otto',
  'Ian Thorpe', 'Aleksandr Popov', 'Katinka Hosszú', 'Janet Evans', 'Alexander Dityatin', 'Inge de Bruijn',
  'Karch Kiraly', 'Giba', 'Sergio Santos', 'Regla Torres', 'Lang Ping', 'Lorenzo Bernardi', 'Sergey Tetyukhin', 'Mireya Luis', 'Andrea Giani',
  'Usain Bolt', 'Michael Johnson', 'Allyson Felix', 'Florence Griffith Joyner', 'Wayde van Niekerk', 'Marie-José Pérec', 'Carl Lewis', 'Marita Koch',
  'Yohan Blake', 'Donovan Bailey', 'Maurice Greene', 'Jeremy Wariner', 'Sanya Richards-Ross', 'Veronica Campbell-Brown',
  'Benjyfishy', 'GeT_RiGhT',
]);

function withStatus(player: Player): Player {
  const status = retiredPlayers.has(player.name) ? 'retired' : 'active';
  const current = status === 'active' ? currentTeams[player.name] : undefined;
  return {
    ...player,
    status,
    years: careerYears[player.name] ?? 'Career years unavailable',
    currentTeam: current?.team,
    teamYears: current ? `${current.joined}–current` : careerYears[player.name]?.replace('present', 'current'),
  };
}

export const sports: Sport[] = rankedSports.map((sport) => {
  const players = sport.players.map((player) => ({ ...withStatus(player), honours: nameHonours(sport.id, player.stat, true) }));
  const teams = sport.teams.map((team) => ({ ...team, honours: nameHonours(sport.id, team.stat, false) }));
  const extras = (additionalQuizPlayers[sport.id] ?? []).map((player) => ({ ...withStatus(player), honours: nameHonours(sport.id, player.stat, true) }));
  const quizPlayers = [...players, ...extras];
  const clubPlayers = sport.id === 'football' ? footballClubPlayers : sport.id === 'basketball' ? basketballClubPlayers : sport.id === 'baseball' ? baseballClubPlayers : [];
  const draftPlayers = sport.id === 'football' ? [...quizPlayers, ...footballDraftPlayers, ...clubPlayers] : clubPlayers.length ? [...quizPlayers, ...clubPlayers] : quizPlayers;
  return { ...sport, teams, players, quizPlayers, draftPlayers };
});
