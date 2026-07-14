import { useMemo, useState } from 'react';
import type { Sport } from '../lib/sportsData';

export function SportsQuiz({ sport }: { sport: Sport }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string>();
  const player = sport.players[round % sport.players.length];
  const choices = useMemo(() => [player, ...sport.players.filter((item) => item.name !== player.name).slice(round, round + 3)].sort(() => .5 - Math.random()), [player, round, sport]);
  const choose = (name: string) => { if (answer) return; setAnswer(name); if (name === player.name) setScore((value) => value + 1); };
  const next = () => { setAnswer(undefined); setRound((value) => value + 1); };
  return <section className="quiz-card">
    <div className="quiz-top"><span>ROUND {round + 1}</span><strong>{score} correct</strong></div>
    <div className="mystery" style={{ background: sport.accent }}>{player.badge}</div>
    <p className="eyebrow">GUESS THE STAR</p><h3>{player.detail}</h3><p className="clue">Plays for {player.team}</p>
    <div className="choices">{choices.map((choice) => <button key={choice.name} className={answer ? (choice.name === player.name ? 'correct' : choice.name === answer ? 'wrong' : '') : ''} onClick={() => choose(choice.name)}>{choice.name}</button>)}</div>
    {answer && <button className="next" onClick={next}>Next challenge →</button>}
  </section>;
}
