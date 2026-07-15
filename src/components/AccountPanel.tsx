import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import './AccountPanel.css';

export function AccountPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signup, setSignup] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    const result = signup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setMessage(result.error ? result.error.message : signup ? 'Check your email to confirm your account.' : 'Signed in.');
  }

  if (user) return <div className="account-panel"><span>Scores and teams save to {user.email}</span><button onClick={() => supabase.auth.signOut()}>Sign out</button></div>;

  return <form className="account-panel" onSubmit={submit}>
    <span>Sign in to save scores and Dream Teams</span>
    <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
    <button type="submit">{signup ? 'Create account' : 'Sign in'}</button>
    <button type="button" className="account-switch" onClick={() => setSignup((value) => !value)}>{signup ? 'Use sign in' : 'Register'}</button>
    {message && <small>{message}</small>}
  </form>;
}
