import type { Player } from './sportsData';

export type ClubPlayer = [name: string, role: string];

export function clubSquad(team: string, era: string, rows: ClubPlayer[]): Player[] {
  const start = era.replace('s', '');
  const end = `${Number(start) + 9}`;
  return rows.map(([name, role], index) => ({
    name, detail: `${role} · ${team}`, stat: `${team} ${era} standout`,
    badge: name.split(' ').map((part) => part[0]).join('').slice(0, 3), team,
    years: `${start}–${end}`, rating: Math.max(82, 94 - index), status: Number(start) >= 2020 ? 'active' : 'retired',
    honours: [`Represented ${team} in the ${era}`],
  }));
}
