const number = (value: string) => value.match(/[\d,.–-]+/)?.[0];
const count = (value: string, label: string) => `${label}${number(value) ? ` — ${number(value)}` : ''}`;

export function nameHonours(sport: string, stat: string, isPlayer: boolean): string[] {
  const lower = stat.toLowerCase();
  if (sport === 'football') {
    if (lower.includes('european title')) return [count(stat, 'UEFA Champions League / European Cup titles')];
    if (lower.includes('league title')) return [count(stat, 'National league championships')];
    if (lower.includes('ballon')) return [count(stat, 'Ballon d’Or awards')];
    if (lower.includes('world cup and euro')) return ['FIFA World Cup', 'UEFA European Championship'];
    if (lower.includes('world cup')) return [count(stat, 'FIFA World Cup titles')];
    if (lower.includes('european cup')) return [count(stat, 'UEFA Champions League / European Cup titles')];
  }
  if (sport === 'basketball') {
    if (lower.includes('championship')) return [count(stat, 'NBA championships')];
    if (lower.includes('finals mvp')) return [count(stat, 'NBA Finals MVP awards')];
    if (lower.includes('mvp')) return [count(stat, 'NBA Most Valuable Player awards')];
    if (lower.includes('scoring')) return ['NBA all-time scoring record'];
    if (lower.includes('3-point')) return ['NBA all-time three-point record'];
  }
  if (sport === 'tennis') {
    if (lower.includes('major singles')) return [count(stat, 'Grand Slam singles titles')];
    if (lower.includes('career grand slam')) return ['Australian Open', 'Roland-Garros', 'Wimbledon', 'US Open'];
    if (lower.includes('title')) return [count(stat, stat.includes('Billie') ? 'Billie Jean King Cup titles' : 'Davis Cup titles')];
  }
  if (sport === 'f1') return [count(stat, `FIA Formula One ${isPlayer ? 'Drivers’' : 'Constructors’'} World Championships`)];
  if (sport === 'baseball') {
    if (lower.includes('championship')) return [count(stat, 'World Series championships')];
    if (lower.includes('mvp')) return [count(stat, 'MLB Most Valuable Player awards')];
    if (lower.includes('cy young')) return [count(stat, 'Cy Young Awards')];
    if (lower.includes('rookie')) return ['MLB Rookie of the Year Award'];
  }
  if (sport === 'american-football') {
    if (lower.includes('super bowl')) return [count(stat, 'Super Bowl championships')];
    if (lower.includes('mvp')) return [count(stat, 'NFL Most Valuable Player awards')];
    if (lower.includes('defensive poy')) return [count(stat, 'NFL Defensive Player of the Year awards')];
  }
  if (sport === 'ufc') {
    if (lower.includes('title defense')) return [count(stat, 'UFC championship title defenses')];
    if (lower.includes('title-fight')) return [count(stat, 'UFC championship-fight wins')];
    if (lower.includes('division champion') || lower.includes('double champ')) return ['UFC championship — two weight divisions'];
    if (lower.includes('championship gym')) return ['UFC and major MMA championship-producing gym'];
  }
  if (sport === 'swimming') {
    if (lower.includes('olympic medal')) return [count(stat, 'Olympic Games medals')];
    if (lower.includes('olympic gold') || lower.includes('golds')) return [count(stat, 'Olympic Games gold medals')];
  }
  if (sport === 'volleyball') {
    const honours: string[] = [];
    if (lower.includes('olympic')) honours.push(count(stat, 'Olympic volleyball medals/titles'));
    if (lower.includes('world title') || lower.includes('world champion')) honours.push(count(stat, 'FIVB World Championship titles'));
    if (honours.length) return honours;
  }
  if (sport === 'track-sprint') {
    const honours: string[] = [];
    if (lower.includes('world record')) honours.push(`World Athletics record — ${stat.split('world record')[0].trim()}`);
    if (lower.includes('olympic')) honours.push(count(stat, 'Olympic athletics medals/titles'));
    if (honours.length) return honours;
  }
  return [stat];
}
