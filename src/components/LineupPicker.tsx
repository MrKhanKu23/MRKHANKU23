import type { Player } from '../lib/sportsData';
import type { LineupSlot } from '../lib/lineupSlots';
import './LineupPicker.css';

type Props = { slots: LineupSlot[]; assigned: Record<string, Player>; pending: Player; selected?: string; allowed: string[]; onSelect: (slot: string) => void };

export function LineupPicker({ slots, assigned, pending, selected, allowed, onSelect }: Props) {
  const rows = [...new Set(slots.map((slot) => slot.row))];
  return <section className="lineup-picker">
    <div className="lineup-title"><span>PLACE YOUR PICK</span><strong>{pending.name}</strong><small>Choose one highlighted position</small></div>
    <div className="formation-board">{rows.map((row) => <div className="formation-row" key={row}>{slots.filter((slot) => slot.row === row).map((slot) => {
      const player = assigned[slot.id];
      const enabled = !player && allowed.includes(slot.id);
      return <button key={slot.id} disabled={!enabled} className={`${player ? 'occupied' : enabled ? 'available' : ''} ${selected === slot.id ? 'selected' : ''}`} onClick={() => onSelect(slot.id)}>
        <b>{player?.badge ?? (selected === slot.id ? pending.badge : '+')}</b><span>{slot.label}</span><small>{player?.name ?? (selected === slot.id ? pending.name : '')}</small>
      </button>;
    })}</div>)}</div>
  </section>;
}
