import { useEffect, useState } from 'react';
import { loadLeaderboards, type DraftResult, type QuizResult } from '../lib/sportdexDb';
import './Leaderboards.css';

export function Leaderboards({ sportId }: { sportId: string }) {
  const [quiz, setQuiz] = useState<QuizResult[]>([]);
  const [drafts, setDrafts] = useState<DraftResult[]>([]);

  useEffect(() => {
    const refresh = () => loadLeaderboards(sportId).then((results) => {
      setQuiz(results.quiz);
      setDrafts(results.drafts);
    });
    refresh();
    window.addEventListener('leaderboard-updated', refresh);
    return () => window.removeEventListener('leaderboard-updated', refresh);
  }, [sportId]);

  return <section className="leaderboards">
    <div><p className="eyebrow">TOP QUIZ SCORES</p><h3>Quiz leaderboard</h3>
      {quiz.length ? <ol>{quiz.map((result) => <li key={result.id}><b>{result.score}/{result.rounds}</b><span>{result.difficulty}</span></li>)}</ol> : <p className="empty-board">No saved scores yet. Be the first.</p>}
    </div>
    <div><p className="eyebrow">BEST SQUADS</p><h3>Dream Draft leaderboard</h3>
      {drafts.length ? <ol>{drafts.map((result) => <li key={result.id}><b>{result.overall} OVR</b><span>Dream Team</span></li>)}</ol> : <p className="empty-board">No saved teams yet. Build the first.</p>}
    </div>
  </section>;
}
