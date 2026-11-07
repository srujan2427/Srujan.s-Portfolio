export default function Footer() {
  return (
    <footer className="relative px-6 py-10 text-center">
      <div className="mx-auto max-w-5xl border-t pt-8" style={{ borderColor: 'var(--card-border)' }}>
        <p className="font-display text-sm tracking-widest text-[var(--text)]">SRUJAN</p>
        <p className="mt-2 text-xs text-[var(--text-dim)]">
          CSE Student · MS Ramaiah University of Applied Sciences
        </p>
        <p className="mt-4 text-xs text-[var(--text-dim)]">
          Built with React & a custom battleground canvas. © {new Date().getFullYear()} Srujan.
        </p>
      </div>
    </footer>
  );
}
