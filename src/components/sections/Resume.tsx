import { Download, FileText } from 'lucide-react';

export default function Resume() {
  return (
    <section id="resume" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Resume</p>
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2 className="section-title text-3xl text-[var(--text)] sm:text-4xl">A closer look</h2>
          <a
            href="/Resume.pdf"
            download="Srujan-Resume.pdf"
            className="btn-ghost inline-flex w-fit items-center gap-2"
          >
            <Download size={17} /> Download Resume
          </a>
        </div>

        <div className="glass overflow-hidden rounded-2xl p-3 sm:p-5">
          <div className="mb-4 flex items-center gap-3 px-2 text-sm text-[var(--text-dim)]">
            <FileText size={17} className="text-[var(--accent)]" />
            <span>Embedded resume preview</span>
          </div>
          <iframe
            src="/Resume.pdf#view=FitH"
            title="Srujan's resume"
            className="h-[620px] w-full rounded-xl border"
            style={{ borderColor: 'var(--card-border)', background: '#fff' }}
          />
        </div>
      </div>
    </section>
  );
}
