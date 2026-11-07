import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, Wallet, Lock } from 'lucide-react';

const projects = [
  {
    title: 'Pocket Campus',
    desc: 'A student expense tracker that helps manage spending on campus — track purchases, set budgets, and stay on top of your money.',
    link: 'https://github.com/srujan2427/PocketCampus',
    icon: Wallet,
    status: 'Live' as const,
  },
  {
    title: 'Veyloras',
    desc: 'STILL BEING BUILT.........................                                             Veyloras is an     AI-powered productivity platform that helps users manage deadlines, organize daily tasks, plan schedules, and streamline their workflow.',
    link: null,
    icon: Lock,
    status: 'In Progress' as const,
  },
];

function Card({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass group relative overflow-hidden rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1.5"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${i * 120}ms` }}
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: 'var(--accent)' }}
      />
      <div className="mb-5 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'var(--glow)' }}>
          <p.icon size={22} className="text-[var(--accent)]" />
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: p.status === 'In Progress' ? 'rgba(217,119,6,0.18)' : 'rgba(34,197,94,0.18)',
            color: p.status === 'In Progress' ? 'var(--accent)' : '#22c55e',
          }}
        >
          {p.status === 'In Progress' ? <Loader2 size={12} className="mr-1 inline animate-spin" /> : null}
          {p.status}
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold text-[var(--text)]">{p.title}</h3>
      {p.desc ? (
        <p className="mt-3 leading-relaxed text-[var(--text-dim)]">{p.desc}</p>
      ) : (
        <p className="mt-3 italic text-[var(--text-dim)]">Details coming soon — still being built.</p>
      )}
      {p.link && (
        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-all hover:gap-3"
        >
          View on GitHub <ExternalLink size={15} />
        </a>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Projects</p>
        <h2 className="section-title mb-10 text-3xl text-[var(--text)] sm:text-4xl">Things I've built</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => <Card key={i} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
