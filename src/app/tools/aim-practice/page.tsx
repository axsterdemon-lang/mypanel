'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type Position = { x: number; y: number };

function nextPosition(): Position {
  return { x: 8 + Math.random() * 84, y: 12 + Math.random() * 72 };
}

export default function AimPracticePage() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && seconds === 0) setRunning(false);
  }, [running, seconds]);

  const start = () => {
    setHits(0);
    setAttempts(0);
    setSeconds(30);
    setPosition(nextPosition());
    setRunning(true);
  };

  const accuracy = attempts === 0 ? 0 : Math.round((hits / attempts) * 100);

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
          <Icon name="ArrowLeftIcon" size={16} /> Back to Featured Panels
        </Link>

        <header className="mb-8 text-center">
          <span className="mb-3 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Free browser game</span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Aim Practice Trainer</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            තත්පර 30ක් ඇතුළත ඉලක්කය හැකි තරම් ඉක්මනින් තට්ටු කරන්න. මෙය browser එක තුළ පමණක් ක්‍රියා කරන පුහුණු ක්‍රීඩාවක්.
          </p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-xl sm:p-6" aria-label="Aim practice game">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <div className="rounded-2xl bg-background px-4 py-2 text-sm"><span className="text-muted-foreground">Time</span><strong className="ml-2">{seconds}s</strong></div>
              <div className="rounded-2xl bg-background px-4 py-2 text-sm"><span className="text-muted-foreground">Hits</span><strong className="ml-2">{hits}</strong></div>
              <div className="rounded-2xl bg-background px-4 py-2 text-sm"><span className="text-muted-foreground">Accuracy</span><strong className="ml-2">{accuracy}%</strong></div>
            </div>
            <button onClick={start} className="rounded-full bg-fire-gradient px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
              {running ? 'Restart' : seconds === 0 ? 'Play Again' : 'Start Practice'}
            </button>
          </div>

          <div
            onPointerDown={() => { if (running) setAttempts((value) => value + 1); }}
            className="relative h-[380px] select-none overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_center,rgba(255,100,20,0.12),transparent_65%),linear-gradient(135deg,#151515,#090909)] sm:h-[460px]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {running ? (
              <button
                type="button"
                aria-label="Target"
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setHits((value) => value + 1);
                  setAttempts((value) => value + 1);
                  setPosition(nextPosition());
                }}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                className="absolute z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-primary shadow-[0_0_24px_rgba(255,100,20,.85)] transition-transform active:scale-90"
              >
                <span className="absolute inset-2 rounded-full border-2 border-white/90" />
              </button>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"><Icon name="CursorArrowRaysIcon" size={30} /></div>
                <p className="font-bold">{seconds === 0 ? `Round over · ${hits} hits · ${accuracy}% accuracy` : 'Start කළාම ඉලක්කය මෙතැන පෙන්වයි'}</p>
                <p className="mt-2 text-sm text-muted-foreground">ඉලක්කය මත තට්ටු කරන්න. වැරදි තැනකට තට්ටු කළොත් නිරවද්‍යතාව අඩුවේ.</p>
              </div>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">මෙය Free Fire සමඟ සම්බන්ධ නොවේ. ක්‍රීඩාවේ ගොනු, ගිණුම හෝ පාලන වෙනස් නොකරයි.</p>
        </section>
      </div>
    </main>
  );
}
