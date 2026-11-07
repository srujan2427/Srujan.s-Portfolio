import { useEffect, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export default function Home() {
  const [g, setG] = useState(greeting);
  useEffect(() => {
    const id = setInterval(() => setG(greeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative flex min-h-screen items-center px-6 pt-24">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-4 animate-fade-up text-sm font-medium uppercase tracking-[0.3em] text-[var(--accent)]">
          {g}, visitor
        </p>
        <h1 className="font-display animate-fade-up text-4xl font-black leading-tight text-[var(--text)] sm:text-6xl md:text-7xl" style={{ animationDelay: '0.1s' }}>
          Hi, I'm <span className="text-[var(--accent)] glow-text">Srujan</span>.
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-[var(--text-dim)] sm:text-xl" style={{ animationDelay: '0.25s' }}>
          I'm a second-year CSE student who enjoys learning and picks up new concepts quickly.
          I'm currently learning DSA and full-stack development.
        </p>
        <div className="mt-9 flex animate-fade-up flex-wrap gap-4" style={{ animationDelay: '0.4s' }}>
          <button onClick={() => go('projects')} className="btn-primary inline-flex items-center gap-2">
            View Projects <ArrowRight size={18} />
          </button>
          <button onClick={() => go('contact')} className="btn-ghost inline-flex items-center gap-2">
            <Mail size={18} /> Contact Me
          </button>
        </div>
      </div>

      <button
        onClick={() => go('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-dim)] transition-colors hover:text-[var(--accent)]"
        aria-label="Scroll down"
      >
        <span className="block animate-float text-xs uppercase tracking-widest">Scroll</span>
      </button>
    </section>
  );
}
