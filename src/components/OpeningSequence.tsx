import { useEffect, useState } from 'react';
import IntroBattleground from '@/components/IntroBattleground';

interface Props {
  onComplete: () => void;
  onBegin: () => void;
}

type Phase = 'ready' | 'loading' | 'complete';

export default function OpeningSequence({ onComplete, onBegin }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');

  useEffect(() => {
    if (phase !== 'loading') return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 900 : 2400;
    const timer = window.setTimeout(() => {
      setPhase('complete');
      window.setTimeout(onComplete, 520);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [onComplete, phase]);

  const begin = () => {
    if (phase === 'ready') {
      onBegin();
      setPhase('loading');
    }
  };

  if (phase === 'complete') return null;

  return (
    <div
      className={`intro-screen ${phase === 'loading' ? 'intro-screen-loading' : ''}`}
      onClick={begin}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') begin();
      }}
      role="button"
      tabIndex={0}
      aria-label="Enter Srujan's portfolio"
    >
      <IntroBattleground />
      <div className="intro-copy">
        <p className="intro-kicker">Welcome to</p>
        <h1 className="intro-title">SRUJAN’S PORTFOLIO</h1>
        <div className="intro-rule" />
      </div>

      <div className="intro-cta">
        {phase === 'ready' ? (
          <>
            <p>CLICK ANYWHERE TO</p>
            <span className="intro-enter-button">VIEW PORTFOLIO <span aria-hidden="true">→</span></span>
          </>
        ) : (
          <>
            <div className="supply-emblem" aria-hidden="true">
              <span className="supply-emblem-ring" />
              <span className="supply-emblem-cross supply-emblem-cross-horizontal" />
              <span className="supply-emblem-cross supply-emblem-cross-vertical" />
              <span className="supply-emblem-drop" />
            </div>
            <p className="intro-loading-label">Establishing drop zone</p>
            <div className="intro-loading-track"><span /></div>
          </>
        )}
      </div>
    </div>
  );
}
