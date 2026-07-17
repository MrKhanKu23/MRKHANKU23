import { useEffect, useMemo, useState } from 'react';
import type { Sport } from '../lib/sportsData';
import { saveQuizScore } from '../lib/sportdexDb';
import { loadPlayerImage } from '../lib/playerImages';
import './SportsQuiz.css';

type Difficulty = 'easy' | 'medium' | 'hard';
const rules = {
  easy: { choices: 3, showTeam: true, label: 'Easy' },
  medium: { choices: 4, showTeam: true, label: 'Medium' },
  hard: { choices: 6, showTeam: false, label: 'Hard' },
} satisfies Record<Difficulty, { choices: number; showTeam: boolean; label: string }>;
const quizLength = 10;

function seededShuffle<T>(items: T[], seed: number) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const value = Math.sin(seed + index * 71) * 10000;
    const swapIndex = Math.floor((value - Math.floor(value)) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function nationality(detail: string, fallback: string) {
  const parts = detail.split('·');
  return parts.slice(1).join('·').trim() || fallback;
}

function primaryEra(years?: string) {
  const values = years?.match(/\d{4}/g)?.map(Number) ?? [];
  const start = values[0] ?? 1980;
  const end = years?.toLowerCase().includes('present') ? new Date().getFullYear() : values[1] ?? start;
  let era = Math.floor(start / 10) * 10;
  let longest = 0;
  for (let decade = era; decade <= Math.floor(end / 10) * 10; decade += 10) {
    const duration = Math.min(end, decade + 9) - Math.max(start, decade) + 1;
    if (duration > longest) { era = decade; longest = duration; }
  }
  return era;
}

export function SportsQuiz({ sport }: { sport: Sport }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [quizSeed, setQuizSeed] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [playerImage, setPlayerImage] = useState<string>();
  const playerPool = sport.quizPlayers ?? sport.players;
  const quizPlayers = useMemo(() => seededShuffle(playerPool, quizSeed), [playerPool, quizSeed]);
  const player = quizPlayers[round % quizPlayers.length];
  const mode = rules[difficulty];
  const detailParts = player.detail.split('·');
  const role = detailParts[0]?.trim();
  const playerNationality = detailParts.slice(1).join('·').trim() || player.team;
  const choices = useMemo(() => {
    const alternatives = quizPlayers.filter((item) => item.name !== player.name);
    const correctNationality = nationality(player.detail, player.team);
    const correctEra = primaryEra(player.years);
    const related = alternatives.filter((item) => nationality(item.detail, item.team) === correctNationality || primaryEra(item.years) === correctEra);
    const shuffled = seededShuffle(related, quizSeed + round * 419);
    return seededShuffle([player, ...shuffled.slice(0, mode.choices - 1)], quizSeed + round * 997);
  }, [mode.choices, player, quizPlayers, quizSeed, round]);

  useEffect(() => {
    let current = true;
    setPlayerImage(undefined);
    loadPlayerImage(player.name, `${sport.name} ${player.detail} ${player.team}`).then((source) => { if (current) setPlayerImage(source); });
    return () => { current = false; };
  }, [player.detail, player.name, player.team, sport.name]);

  function choose(name: string) {
    if (answer) return;
    setAnswer(name);
    if (name === player.name) setScore((value) => value + 1);
  }

  function changeDifficulty(next: Difficulty) {
    setDifficulty(next); setRound(0); setScore(0); setAnswer(undefined); setFinished(false); setSaveMessage(''); setQuizSeed(Date.now());
  }

  async function next() {
    if (round + 1 < quizLength) { setAnswer(undefined); setRound((value) => value + 1); return; }
    setFinished(true);
    try {
      const saved = await saveQuizScore(sport.id, difficulty, score, quizLength);
      setSaveMessage(saved === 'saved' ? 'Score saved to your account.' : saved === 'duplicate' ? 'You already saved this score.' : 'Sign in above to save this score.');
    } catch { setSaveMessage('The score could not be saved. Try again.'); }
  }

  if (finished) return <section className="quiz-card">
    <p className="eyebrow">QUIZ COMPLETE</p><h3>{score} / {quizLength}</h3><p className="clue">{saveMessage || 'Saving score…'}</p>
    <button className="next" onClick={() => changeDifficulty(difficulty)}>Play again →</button>
  </section>;

  return <section className="quiz-card">
    <div className="quiz-top"><span>ROUND {round + 1} / {quizLength}</span><strong>{score} correct</strong></div>
    <div className="difficulty" aria-label="Quiz difficulty">
      {(Object.keys(rules) as Difficulty[]).map((level) => <button key={level} className={difficulty === level ? 'active' : ''} onClick={() => changeDifficulty(level)}>{rules[level].label}</button>)}
    </div>
    <div className={`mystery quiz-player-icon ${playerImage ? 'revealed' : ''}`} style={{ background: sport.accent }}>{playerImage ? <img src={playerImage} alt={answer ? `Portrait of ${player.name}` : 'Mystery player portrait'} /> : <strong>?</strong>}</div>
    {answer && <strong className="revealed-player-name">{player.name}</strong>}
    <p className="eyebrow">GUESS THE STAR · {mode.label.toUpperCase()}</p><h3>{role}</h3>
    <p className="quiz-player-meta"><span>{playerNationality}</span><b>{player.years}</b></p>
    <p className="clue">{mode.showTeam ? `Represented by ${player.team}` : 'Team hidden — use the record alone'}</p>
    <div className="choices">{choices.map((choice) => <button key={choice.name} className={answer ? (choice.name === player.name ? 'correct' : choice.name === answer ? 'wrong' : '') : ''} onClick={() => choose(choice.name)}>{choice.name}</button>)}</div>
    {answer && <button className="next" onClick={next}>{round + 1 === quizLength ? 'Finish quiz →' : 'Next challenge →'}</button>}
  </section>;
}
