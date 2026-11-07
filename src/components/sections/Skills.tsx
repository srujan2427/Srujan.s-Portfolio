import { useEffect, useRef, useState } from 'react';
import { Code2, Wrench, GraduationCap } from 'lucide-react';

interface SkillBar {
  name: string;
  value: number; // editable placeholder, no invented proficiency claim
}

const groups: { title: string; icon: typeof Code2; bars: SkillBar[] }[] = [
  {
    title: 'Languages',
    icon: Code2,
    bars: [
      { name: 'Python' },
      { name: 'Java'},
      { name: 'C++'},
    ],
  },
  {
    title: 'Tools',
    icon: Wrench,
    bars: [
      { name: 'VS Code'},
      { name: 'Git'},
      { name: 'GitHub' },
      { name: 'Postman'},
    ],
  },
  {
    title: 'Currently learning',
    icon: GraduationCap,
    bars: [
      { name: 'DSA'},
      { name: 'Full-stack development'},
    ],
  },
];

function Bar({ skill, animate }: { skill: SkillBar; animate: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--text)]">{skill.name}</span>
        
      </div>
      <div className="h-0.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(127,127,127,0.18)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: animate ? `${skill.value}%` : '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--ember-soft))',
            transition: 'width 1.1s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 0 12px var(--glow)',
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Skills</p>
        <h2 className="section-title mb-10 text-3xl text-[var(--text)] sm:text-4xl">What I work with</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {groups.map((g, gi) => (
            <div key={gi} className="glass rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: 'var(--glow)' }}>
                  <g.icon size={20} className="text-[var(--accent)]" />
                </span>
                <h3 className="font-display text-lg font-bold text-[var(--text)]">{g.title}</h3>
              </div>
              <div className="space-y-4">
                {g.bars.map((b, bi) => (
                  <Bar key={bi} skill={b} animate={visible} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-[var(--text-dim)]">
          Progress shown as self-assessed learning stage, not an official proficiency rating.
        </p>
      </div>
    </section>
  );
}
