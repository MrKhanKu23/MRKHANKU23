import { useEffect, useState } from 'react';
import './LandscapeGate.css';

type OrientationWithLock = ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void> };

export function LandscapeGate() {
  const [phonePortrait, setPhonePortrait] = useState(false);

  useEffect(() => {
    const update = () => setPhonePortrait(window.innerWidth <= 700 && window.innerHeight > window.innerWidth);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('orientationchange', update); };
  }, []);

  async function rotate() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      await (screen.orientation as OrientationWithLock).lock?.('landscape');
    } catch {
      // iOS and some browsers require the user to rotate the device manually.
    }
  }

  if (!phonePortrait) return null;
  return <aside className="landscape-gate" role="dialog" aria-label="Rotate phone sideways">
    <div className="rotate-phone" aria-hidden="true">📱</div>
    <p className="eyebrow">MOBILE GAME MODE</p>
    <h2>Flip your phone sideways</h2>
    <p>Sportify adapts into its full landscape game layout when your phone is sideways.</p>
    <button onClick={rotate}>Switch to landscape</button>
  </aside>;
}
