import { useState } from 'react';
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const CONTACTS = [
  { icon: Mail, label: 'Email', value: 'srujanchowdary24@gmail.com', href: 'mailto:srujanchowdary24@gmail.com' },
  { icon: MapPin, label: 'Location', value: 'Bengaluru, Karnataka, India' },
  { icon: Github, label: 'GitHub', value: 'srujan2427', href: 'https://github.com/srujan2427' },
  { icon: Linkedin, label: 'LinkedIn', value: 'p-srujan', href: 'https://www.linkedin.com/in/p-srujan-56b169429/' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.message.trim()) e.message = 'Please enter a message.';
    else if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || `Delivery failed (${res.status}).`);
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Contact</p>
        <h2 className="section-title mb-10 text-3xl text-[var(--text)] sm:text-4xl">Get in touch</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* contact details */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-5 font-display text-lg font-bold text-[var(--text)]">Reach me directly</h3>
            <ul className="space-y-3">
              {CONTACTS.map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl p-3 transition-all hover:translate-x-1"
                      style={{ background: 'rgba(127,127,127,0.06)' }}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: 'var(--glow)' }}>
                        <c.icon size={18} className="text-[var(--accent)]" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[var(--text-dim)]">{c.label}</span>
                        <span className="font-medium text-[var(--text)]">{c.value}</span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(127,127,127,0.06)' }}>
                      <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: 'var(--glow)' }}>
                        <c.icon size={18} className="text-[var(--accent)]" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[var(--text-dim)]">{c.label}</span>
                        <span className="font-medium text-[var(--text)]">{c.value}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* form */}
          <form className="glass rounded-2xl p-6" action="https://api.web3forms.com/submit" method="POST">

            <input type="hidden" name="access_key" value="37962aa7-a629-4ead-b0a9-29b06c3086a7" />
            <input type="hidden" name="subject" value="New message from your portfolio" />
            
            <h3 className="mb-5 font-display text-lg font-bold text-[var(--text)]">Send a message</h3>

            <div className="space-y-4">
              <div>
                <input
                  name="name"
                  required
                  className="input-field"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                  disabled={status === 'sending'}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="email"
                  required
                  className="input-field"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  disabled={status === 'sending'}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <textarea
                  name="Message"
                  required
                  className="input-field min-h-[120px] resize-y"
                  placeholder="Your message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  aria-invalid={!!errors.message}
                  disabled={status === 'sending'}
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>
            </div>

            <button type="submit" className="btn-primary mt-5 w-full" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Sending…</span>
              ) : (
                <span className="inline-flex items-center gap-2"><Send size={16} /> Send Message</span>
              )}
            </button>

            {status === 'success' && (
              <div className="mt-4 flex items-center gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                <CheckCircle2 size={18} /> Message delivered — thank you, I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
