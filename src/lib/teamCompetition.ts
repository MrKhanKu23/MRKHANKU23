const footballLeagues: Record<string, string> = {
  'Real Madrid': 'La Liga',
  Barcelona: 'La Liga',
  'Atlético Madrid': 'La Liga',
  'Bayern Munich': 'Bundesliga',
  'Bayer Leverkusen': 'Bundesliga',
  Liverpool: 'Premier League',
  Arsenal: 'Premier League',
  'Manchester City': 'Premier League',
  'Inter Milan': 'Serie A',
  'Paris Saint-Germain': 'Ligue 1',
};

export function teamCompetition(sportId: string, teamName: string, detail: string) {
  if (sportId === 'football') return footballLeagues[teamName] ?? 'Domestic league and UEFA competitions';
  if (sportId === 'basketball') return 'NBA';
  if (sportId === 'baseball') return 'Major League Baseball (MLB)';
  if (sportId === 'american-football') return 'National Football League (NFL)';
  if (sportId === 'f1') return 'FIA Formula One World Championship';
  if (sportId === 'ufc') return 'Ultimate Fighting Championship (UFC)';
  if (sportId === 'fortnite') return 'Fortnite Championship Series (FNCS)';
  if (sportId === 'counter-strike-2') return 'Counter-Strike 2 Major and international circuit';
  if (sportId === 'swimming') return 'World Aquatics and Olympic Games';
  if (sportId === 'volleyball') return 'FIVB international competitions';
  if (sportId === 'track-sprint') return 'World Athletics and Olympic Games';
  if (sportId === 'tennis') return teamName.includes('(women)')
    ? 'Billie Jean King Cup' : 'Davis Cup';
  return detail;
}
