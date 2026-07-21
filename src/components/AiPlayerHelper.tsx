import { useEffect, useState } from 'react';
import { researchPlayer } from '../lib/playerResearch';
import './AiPlayerHelper.css';

export function AiPlayerHelper({ query, sport }: { query: string; sport: string }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { setAnswer(''); setError(''); }, [query, sport]);

  async function research() {
    if (query.trim().length < 2 || loading) return;
    setLoading(true); setAnswer(''); setError('');
    try { setAnswer(await researchPlayer(query.trim(), sport)); }
    catch { setError('The AI helper is unavailable right now. Please try again.'); }
    finally { setLoading(false); }
  }

  return <section className="ai-player-helper">
    <div><p className="eyebrow">AI TROPHY RESEARCH</p><span>Find competitions, trophies and awards this player won.</span></div>
    <button onClick={research} disabled={loading || query.trim().length < 2}>{loading ? 'Checking facts…' : 'Ask AI helper'}</button>
    {answer && <div className="ai-player-answer"><strong>Verified wins found</strong><p>{answer}</p><small>AI list grounded with public sports information. Unsupported wins are omitted.</small></div>}
    {error && <p className="ai-player-error">{error}</p>}
  </section>;
}
