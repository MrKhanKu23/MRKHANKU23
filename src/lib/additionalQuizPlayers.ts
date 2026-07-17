import type { Player } from './sportsData';

const makePlayers = (rows: string[][]): Player[] => rows.map(([name, detail, stat, badge, team]) => ({ name, detail, stat, badge, team }));

export const additionalQuizPlayers: Record<string, Player[]> = {
  fortnite: makePlayers([
    ['MrSavage', 'Fragger · Norway', 'DreamHack Anaheim champion', 'MS', '100 Thieves'], ['Benjyfishy', 'Fragger · Great Britain', 'World Cup finalist and FNCS finalist', 'BEN', 'NRG'],
    ['Clix', 'Fragger · USA', 'Multiple FNCS finals', 'CLX', 'XSET'], ['Rehx', 'Fragger · USA', 'Multiple FNCS titles', 'RHX', 'North America'],
    ['Setty', 'IGL · Poland', 'DreamHack and FNCS champion', 'SET', 'Europe'], ['Malibuca', 'Fragger · Russia', 'FNCS champion', 'MAL', 'Europe'],
    ['Mongraal', 'Fragger · Great Britain', 'Multiple major tournament wins', 'MON', 'FaZe Clan'], ['Mitr0', 'Fragger · Netherlands', 'Multiple major tournament wins', 'MIT', 'Team Liquid'],
    ['Zayt', 'IGL · Canada', 'Multiple FNCS titles', 'ZAY', 'NRG'], ['Saf', 'Support · USA', 'ESL Katowice Royale champion', 'SAF', 'Ghost Gaming'],
    ['Arkhram', 'Fragger · USA', 'Multiple FNCS titles', 'ARK', '100 Thieves'], ['Reet', 'Fragger · USA', 'Multiple FNCS titles', 'REE', 'North America'],
    ['Anas', 'Fragger · Denmark', 'Gamers8 champion', 'ANS', 'Guild Esports'], ['Acorn', 'IGL · Canada', 'Multiple FNCS titles', 'ACO', 'Dignitas'],
    ['Cold', 'Fragger · USA', 'FNCS champion', 'COL', 'Team Liquid'], ['Vadeal', 'Fragger · Germany', 'FNCS champion', 'VAD', 'Wave Esports'],
    ['Noahreyli', 'Fragger · Switzerland', 'FNCS champion', 'NOA', 'Europe'], ['Chapix', 'IGL · Sweden', 'Multiple FNCS titles', 'CHA', 'Europe'],
  ]),
  'counter-strike-2': makePlayers([
    ['karrigan', 'IGL · Denmark', 'Major champion and Intel Grand Slam winner', 'KAR', 'FaZe Clan'], ['apEX', 'IGL · France', 'Two Major championships', 'APX', 'Team Vitality'],
    ['electroNic', 'Rifler · Russia', 'Major champion and Intel Grand Slam winner', 'ELC', 'Russia'], ['Twistzz', 'Rifler · Canada', 'Two Major championships', 'TWZ', 'Team Liquid'],
    ['f0rest', 'Rifler · Sweden', 'Major champion and Counter-Strike legend', 'F0R', 'Ninjas in Pyjamas'], ['olofmeister', 'Rifler · Sweden', 'Two Major championships', 'OLF', 'FaZe Clan'],
    ['sh1ro', 'AWPer · Russia', 'Major champion and elite event MVP', 'SH1', 'Team Spirit'], ['Ax1Le', 'Rifler · Russia', 'Elite event champion and MVP', 'AXL', 'BetBoom Team'],
    ['FalleN', 'AWPer/IGL · Brazil', 'Two Major championships', 'FAL', 'FURIA'], ['fer', 'Rifler · Brazil', 'Two Major championships', 'FER', 'Brazil'],
    ['rain', 'Entry fragger · Norway', 'Major champion and Major MVP', 'RAI', 'FaZe Clan'], ['KRIMZ', 'Support · Sweden', 'Two Major championships', 'KRI', 'Fnatic'],
    ['flusha', 'Rifler · Sweden', 'Three Major championships', 'FLU', 'Fnatic'], ['JW', 'AWPer · Sweden', 'Three Major championships', 'JW', 'Fnatic'],
    ['GuardiaN', 'AWPer · Slovakia', 'Multiple Major finals', 'GUA', 'Europe'], ['ScreaM', 'Rifler · Belgium', 'Headshot record and elite event titles', 'SCR', 'Europe'],
    ['NAF', 'Rifler · Canada', 'Intel Grand Slam champion', 'NAF', 'Team Liquid'], ['EliGE', 'Rifler · USA', 'Intel Grand Slam champion', 'ELI', 'North America'],
  ]),
  football: makePlayers([
    ['Ronaldinho', 'Attacking Midfielder · Brazil', '2005 Ballon d’Or', 'R10', 'Brazil'], ['Paolo Maldini', 'Defender · Italy', '5 European Cups', 'PM', 'AC Milan'],
    ['Garrincha', 'Winger · Brazil', '2 World Cup titles', 'GAR', 'Brazil'], ['Xavi Hernández', 'Midfielder · Spain', 'World Cup and 2 Euros', 'XH', 'Barcelona'],
    ['Andrés Iniesta', 'Midfielder · Spain', '2010 World Cup winner', 'AI', 'Barcelona'], ['Gerd Müller', 'Forward · Germany', '68 goals in 62 caps', 'GM', 'Bayern Munich'],
  ]),
  basketball: makePlayers([
    ['Shaquille O’Neal', 'Center · USA', '4 NBA championships', 'SO', 'Los Angeles Lakers'], ['Hakeem Olajuwon', 'Center · Nigeria/USA', '2 Finals MVP awards', 'HO', 'Houston Rockets'],
    ['Oscar Robertson', 'Point Guard · USA', 'Triple-double pioneer', 'OR', 'Milwaukee Bucks'], ['Kevin Durant', 'Small Forward · USA', '2 Finals MVP awards', 'KD', 'Golden State Warriors'],
    ['Julius Erving', 'Small Forward · USA', 'ABA and NBA icon', 'JE', 'Philadelphia 76ers'], ['Moses Malone', 'Center · USA', '3 MVP awards', 'MM', 'Philadelphia 76ers'],
  ]),
  tennis: makePlayers([
    ['Björn Borg', 'Baseliner · Sweden', '11 major singles titles', 'BB', 'Sweden'], ['Rod Laver', 'All-court · Australia', '11 major singles titles', 'RL', 'Australia'],
    ['Billie Jean King', 'All-court · USA', '12 major singles titles', 'BJK', 'United States'], ['Andre Agassi', 'Baseliner · USA', 'Career Grand Slam', 'AA', 'United States'],
    ['Monica Seles', 'Baseliner · Yugoslavia/USA', '9 major singles titles', 'MS', 'United States'], ['John McEnroe', 'Serve-and-volley · USA', '7 major singles titles', 'JM', 'United States'],
  ]),
  f1: makePlayers([
    ['Fernando Alonso', 'Driver · Spain', '2 world titles', 'FA', 'Renault'], ['Mika Häkkinen', 'Driver · Finland', '2 world titles', 'MH', 'McLaren'],
    ['Jim Clark', 'Driver · Great Britain', '2 world titles', 'JC', 'Lotus'], ['Graham Hill', 'Driver · Great Britain', '2 world titles', 'GH', 'Lotus/BRM'],
    ['Kimi Räikkönen', 'Driver · Finland', '2007 world champion', 'KR', 'Ferrari'], ['Nigel Mansell', 'Driver · Great Britain', '1992 world champion', 'NM', 'Williams'],
  ]),
  baseball: makePlayers([
    ['Mickey Mantle', 'Center field · USA', '3 MVP awards', 'MM', 'New York Yankees'], ['Stan Musial', 'Outfield/First base · USA', '3,630 career hits', 'SM', 'St. Louis Cardinals'],
    ['Honus Wagner', 'Shortstop · USA', '8 batting titles', 'HW', 'Pittsburgh Pirates'], ['Roberto Clemente', 'Right field · Puerto Rico', '3,000 career hits', 'RC', 'Pittsburgh Pirates'],
    ['Sandy Koufax', 'Pitcher · USA', '3 Cy Young awards', 'SK', 'Los Angeles Dodgers'], ['Rickey Henderson', 'Left field · USA', '1,406 stolen bases', 'RH', 'Oakland Athletics'],
  ]),
  'american-football': makePlayers([
    ['Aaron Donald', 'Defensive tackle · USA', '3 Defensive POY awards', 'AD', 'Los Angeles Rams'], ['Deion Sanders', 'Cornerback · USA', '8 All-Pro selections', 'DS', 'Dallas Cowboys'],
    ['Johnny Unitas', 'Quarterback · USA', '3 NFL championships', 'JU', 'Baltimore Colts'], ['Randy Moss', 'Wide receiver · USA', '156 receiving touchdowns', 'RM', 'Minnesota Vikings'],
    ['Emmitt Smith', 'Running back · USA', '18,355 rushing yards', 'ES', 'Dallas Cowboys'], ['Ray Lewis', 'Linebacker · USA', '2 Defensive POY awards', 'RL', 'Baltimore Ravens'],
  ]),
  ufc: makePlayers([
    ['Daniel Cormier', 'Two-division champion · USA', '9 title-fight wins', 'DC', 'AKA'], ['Max Holloway', 'Featherweight · USA', 'UFC striking records', 'MH', 'Gracie Technics'],
    ['Conor McGregor', 'Two-division champion · Ireland', 'First simultaneous double champ', 'CM', 'SBG Ireland'], ['Randy Couture', 'Two-division champion · USA', '6 UFC title reigns', 'RC', 'Xtreme Couture'],
    ['Chuck Liddell', 'Light heavyweight · USA', '4 title defenses', 'CL', 'The Pit'], ['Joanna Jędrzejczyk', 'Strawweight · Poland', '5 title defenses', 'JJ', 'American Top Team'],
  ]),
  swimming: makePlayers([
    ['Ian Thorpe', 'Freestyle · Australia', '9 Olympic medals', 'IT', 'Australia'], ['Aleksandr Popov', 'Sprint freestyle · Russia', '4 Olympic gold medals', 'AP', 'Russia'],
    ['Katinka Hosszú', 'Medley · Hungary', '3 Olympic gold medals', 'KH', 'Hungary'], ['Janet Evans', 'Distance freestyle · USA', '4 Olympic gold medals', 'JE', 'United States'],
    ['Alexander Dityatin', 'Multiple events · USSR', '8 medals at one Games', 'AD', 'Soviet Union'], ['Inge de Bruijn', 'Sprint · Netherlands', '8 Olympic medals', 'IDB', 'Netherlands'],
  ]),
  volleyball: makePlayers([
    ['Ivan Zaytsev', 'Opposite · Italy', '3 Olympic medals', 'IZ', 'Italy'], ['Kim Yeon-koung', 'Outside hitter · South Korea', 'Olympic MVP', 'KYK', 'South Korea'],
    ['Ivan Miljković', 'Opposite · Serbia', 'Olympic champion', 'IM', 'Serbia'], ['Andrea Giani', 'Middle blocker · Italy', '3 world titles', 'AG', 'Italy'],
    ['Yekaterina Gamova', 'Opposite · Russia', '2 world titles', 'YG', 'Russia'], ['Sheilla Castro', 'Opposite · Brazil', '2 Olympic gold medals', 'SC', 'Brazil'],
  ]),
  'track-sprint': makePlayers([
    ['Yohan Blake', '100m · 200m · Jamaica', '9.69 / 19.26 bests', 'YB', 'Jamaica'], ['Donovan Bailey', '100m · Canada', '1996 Olympic champion', 'DB', 'Canada'],
    ['Maurice Greene', '100m · USA', 'Olympic and world champion', 'MG', 'United States'], ['Jeremy Wariner', '400m · USA', 'Olympic and world champion', 'JW', 'United States'],
    ['Sanya Richards-Ross', '400m · USA', '4 Olympic gold medals', 'SRR', 'United States'], ['Veronica Campbell-Brown', '100m · 200m · Jamaica', '8 Olympic medals', 'VCB', 'Jamaica'],
  ]),
};
