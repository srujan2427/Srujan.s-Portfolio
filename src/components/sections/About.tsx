import { Trophy, Plane, Award, Film, Music, Gamepad2, PlaneTakeoff } from 'lucide-react';

const highlights = [
  { icon: Trophy, text: 'Participated in hackathons and ideathons.' },
  { icon: Plane, text: 'Worked with a team to design an aircraft model and develop its operating concept.' },
  { icon: Award, text: 'The team won third place at Pitch at Mach.' },
];

const interests = [
  { icon: Film, label: 'Movies' },
  { icon: Music, label: 'Listening to songs' },
  { icon: Gamepad2, label: 'Online games' },
  { icon: PlaneTakeoff, label: 'Travelling' },
];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">About</p>
        <h2 className="section-title mb-8 text-3xl text-[var(--text)] sm:text-4xl">Who I am</h2>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--text-dim)]">
          I'm Srujan, a second-year Computer Science & Engineering student at MS Ramaiah University of
          Applied Sciences. I enjoy breaking down problems and building things that work. Outside the
          syllabus, I tinker with code, collaborate on team projects, and keep learning new tools and ideas.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-5 font-display text-xl font-bold text-[var(--text)]">Highlights</h3>
            <ul className="space-y-4">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: 'var(--glow)' }}>
                    <h.icon size={18} className="text-[var(--accent)]" />
                  </span>
                  <p className="text-[var(--text-dim)]">{h.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="mb-5 font-display text-xl font-bold text-[var(--text)]">Beyond Coding</h3>
            <div className="grid grid-cols-2 gap-3">
              {interests.map((it, i) => (
                <div key={i} className="tag-chip justify-center py-3 transition-transform hover:scale-105">
                  <it.icon size={18} className="text-[var(--accent)]" />
                  <span className="text-[var(--text)]">{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
