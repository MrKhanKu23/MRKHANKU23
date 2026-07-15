import { useMemo, useState } from 'react';
import type { Sport } from '../lib/sportsData';
import './SportsQuiz.css';

type Difficulty = 'easy' | 'medium' | 'hard';
const rules = {
  easy: { choices: 3, showTeam: true, label: 'Easy' },
  medium: { choices: 4, showTeam: true, label: 'Medium' },
  hard: { choices: 6, showTeam: false, label: 'Hard' },
} satisfies Record<Difficulty, { choices: number; showTeam: boolean; label: string }>;

function seededShuffle<T>(items: T[], seed: number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const value = Math.sin(seed + index * 71) * 10000;
    const swapIndex = Math.floor((value - Math.floor(value)) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function SportsQuiz({ sport }: { sport: Sport }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [quizSeed, setQuizSeed] = useState(() => Date.now());
  const playerPool = sport.draftPlayers ?? sport.quizPlayers ?? sport.players;
  const quizPlayers = useMemo(() => seededShuffle(playerPool, quizSeed), [playerPool, quizSeed]);
  const player = quizPlayers[round % quizPlayers.length];
  const mode = rules[difficulty];
  const choices = useMemo(() => {
    const alternatives = quizPlayers.filter((item) => item.name !== player.name);
    const rotated = [...alternatives.slice(round), ...alternatives.slice(0, round)];
    return seededShuffle([player, ...rotated.slice(0, mode.choices - 1)], quizSeed + round * 997);
  }, [mode.choices, player, quizPlayers, quizSeed, round]);

  function choose(name: string) {
    if (answer) return;
    setAnswer(name);
    if (name === player.name) setScore((value) => value + 1);
  }

  function changeDifficulty(next: Difficulty) {
    setDifficulty(next); setRound(0); setScore(0); setAnswer(undefined); setQuizSeed(Date.now());
  }

  return <section className="quiz-card">
    <div className="quiz-top"><span>ROUND {round + 1}</span><strong>{score} correct</strong></div>
    <div className="difficulty" aria-label="Quiz difficulty">
      {(Object.keys(rules) as Difficulty[]).map((level) => <button key={level} className={difficulty === level ? 'active' : ''} onClick={() => changeDifficulty(level)}>{rules[level].label}</button>)}
    </div>
    <div className="mystery career-years" style={{ background: sport.accent }}><small>CAREER</small>{player.years}</div>
    <p className="eyebrow">GUESS THE STAR · {mode.label.toUpperCase()}</p><h3>{player.detail}</h3>
    <p className="clue">{mode.showTeam ? `Represented by ${player.team}` : 'Team hidden — use the record alone'}</p>
    <div className="choices">{choices.map((choice) => <button key={choice.name} className={answer ? (choice.name === player.name ? 'correct' : choice.name === answer ? 'wrong' : '') : ''} onClick={() => choose(choice.name)}>{choice.name}</button>)}</div>
    {answer && <button className="next" onClick={() => { setAnswer(undefined); setRound((value) => value + 1); }}>Next challenge →</button>}
  </section>;
}
