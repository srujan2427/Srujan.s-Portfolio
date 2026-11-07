import { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const SECTIONS = ['home', 'about', 'skills', 'projects', 'resume', 'contact'] as const;
type Section = (typeof SECTIONS)[number];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState<Section>('home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const mid = window.innerHeight / 2;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= mid && r.bottom >= mid) { setActive(id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: Section) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 left-0 z-40 w-full transition-all duration-500 ${
        scrolled ? 'py-3 backdrop-blur-md' : 'py-5'
      }`}
      style={{
        background: scrolled ? 'var(--card)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--card-border)' : '1px solid transparent',
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <button
          onClick={() => go('home')}
          className="font-display text-lg font-bold tracking-widest text-[var(--text)] glow-text"
          aria-label="Go to home"
        >
          SR<span className="text-[var(--accent)]">.</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map(id => (
            <button
              key={id}
              onClick={() => go(id)}
              className="relative px-4 py-2 text-sm font-medium capitalize transition-colors"
              style={{ color: active === id ? 'var(--accent)' : 'var(--text-dim)' }}
            >
              {id}
              <span
                className="absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: active === id ? '18px' : '0px' }}
              />
            </button>
          ))}
          <button
            onClick={toggle}
            className="ml-3 grid h-9 w-9 place-items-center rounded-full border transition-all hover:scale-110"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text)' }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-full border"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text)' }}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-5 mt-3 flex flex-col gap-1 rounded-xl p-3 glass md:hidden">
          {SECTIONS.map(id => (
            <button
              key={id}
              onClick={() => go(id)}
              className="rounded-lg px-4 py-2 text-left text-sm font-medium capitalize transition-colors"
              style={{ color: active === id ? 'var(--accent)' : 'var(--text)', background: active === id ? 'var(--glow)' : 'transparent' }}
            >
              {id}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
