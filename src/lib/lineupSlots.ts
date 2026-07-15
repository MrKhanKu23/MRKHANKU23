export type LineupSlot = { id: string; label: string; row: number };

export const lineupSlots: Record<string, LineupSlot[]> = {
  football: [
    { id: 'LW', label: 'LW', row: 1 }, { id: 'ST', label: 'ST', row: 1 }, { id: 'RW', label: 'RW', row: 1 },
    { id: 'LM', label: 'LM', row: 2 }, { id: 'LCM', label: 'LCM', row: 2 }, { id: 'RCM', label: 'RCM', row: 2 }, { id: 'RM', label: 'RM', row: 2 },
    { id: 'LCB', label: 'LCB', row: 3 }, { id: 'CB', label: 'CB', row: 3 }, { id: 'RCB', label: 'RCB', row: 3 },
    { id: 'GK', label: 'GK', row: 4 },
  ],
  basketball: [{ id: 'PG', label: 'PG', row: 1 }, { id: 'SG', label: 'SG', row: 1 }, { id: 'SF', label: 'SF', row: 2 }, { id: 'PF', label: 'PF', row: 2 }, { id: 'C', label: 'C', row: 3 }],
  tennis: [{ id: 'P1', label: 'Player 1', row: 1 }, { id: 'P2', label: 'Player 2', row: 2 }],
  f1: [{ id: 'D1', label: 'Driver 1', row: 1 }, { id: 'D2', label: 'Driver 2', row: 1 }],
  baseball: ['P','C','1B','2B','3B','SS','LF','CF','RF'].map((id, index) => ({ id, label: id, row: Math.floor(index / 3) + 1 })),
  'american-football': ['QB','RB','WR1','WR2','WR3','TE','LT','LG','C','RG','RT'].map((id, index) => ({ id, label: id, row: Math.floor(index / 4) + 1 })),
  ufc: [{ id: 'RED', label: 'Red corner', row: 1 }, { id: 'BLUE', label: 'Blue corner', row: 1 }],
  swimming: [{ id: 'SW1', label: 'Swimmer 1', row: 1 }, { id: 'SW2', label: 'Swimmer 2', row: 1 }],
  volleyball: [{ id: 'S', label: 'Setter', row: 1 }, { id: 'OPP', label: 'Opposite', row: 1 }, { id: 'OH1', label: 'Outside 1', row: 2 }, { id: 'OH2', label: 'Outside 2', row: 2 }, { id: 'MB1', label: 'Middle 1', row: 3 }, { id: 'MB2', label: 'Middle 2', row: 3 }],
  'track-sprint': ['LEG1','LEG2','LEG3','LEG4'].map((id) => ({ id, label: id.replace('LEG', 'Leg '), row: 1 })),
};
