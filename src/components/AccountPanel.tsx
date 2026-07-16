import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { loadNickname, updateNickname } from '../lib/sportdexDb';
import './AccountPanel.css';

export function AccountPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [signup, setSignup] = useState(false);
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('Player');
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); if (data.user) loadNickname().then(setDisplayName); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadNickname().then(setDisplayName);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    const result = signup
      ? await supabase.auth.signUp({ email, password, options: { data: { nickname: nickname.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setMessage(result.error ? result.error.message : signup ? 'Check your email to confirm your account.' : 'Signed in.');
  }

  async function saveUsername(event: React.FormEvent) {
    event.preventDefault(); setMessage('');
    try {
      const saved = await updateNickname(nickname);
      setDisplayName(saved); setNickname(''); setEditingName(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Username could not be changed.'); }
  }

  if (user) return editingName ? <form className="account-panel" onSubmit={saveUsername}><span>Choose a new username</span><input type="text" placeholder="Username" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={24} required autoFocus /><button type="submit">Save username</button><button type="button" className="account-switch" onClick={() => setEditingName(false)}>Cancel</button>{message && <small>{message}</small>}</form> : <div className="account-panel"><span>Playing as <strong>{displayName}</strong></span><button onClick={() => { setNickname(displayName); setEditingName(true); }}>Change username</button><button onClick={() => supabase.auth.signOut()}>Sign out</button></div>;

  return <form className="account-panel" onSubmit={submit}>
    <span>Sign in to save scores and Dream Teams</span>
    {signup && <input type="text" placeholder="Nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={24} required />}
    <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
    <button type="submit">{signup ? 'Create account' : 'Sign in'}</button>
    <button type="button" className="account-switch" onClick={() => setSignup((value) => !value)}>{signup ? 'Use sign in' : 'Register'}</button>
    {message && <small>{message}</small>}
  </form>;
}
