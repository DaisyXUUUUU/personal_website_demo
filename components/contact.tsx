'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'sending' | 'done'

const CHANNELS = [
  { label: 'Email', value: 'daisy.ziyue0526@outlook.com', href: 'mailto:daisy.ziyue0526@outlook.com' },
  { label: 'Phone', value: '+86 139 5797 2965', href: 'tel:+8613957972965' },
  { label: 'LinkedIn', value: 'in/ziyue-xu', href: 'https://www.linkedin.com' },
  { label: 'WeChat', value: 'add via email first', href: null },
]

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setTimeout(() => setStatus('done'), 1600)
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '' })
    setStatus('idle')
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 border-b border-border pb-4">
          <h2 className="flex items-baseline gap-4 text-5xl font-black uppercase tracking-tighter md:text-7xl">
            <span className="font-mono text-base font-normal text-primary md:text-lg">04</span>
            Contact
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          {/* Terminal */}
          <div className="overflow-hidden border border-border bg-card font-mono text-sm">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
              <span className="size-3 rounded-full bg-destructive" />
              <span className="size-3 rounded-full bg-chart-2" />
              <span className="size-3 rounded-full bg-primary" />
              <span className="ml-3 text-xs uppercase tracking-widest text-muted-foreground">
                ziyue@portfolio: ~/contact
              </span>
            </div>

            <div className="p-5 md:p-6">
              {status === 'done' ? (
                <div className="space-y-2 leading-relaxed">
                  <p className="text-muted-foreground">
                    <span className="text-primary">$</span> ./send_message.sh
                  </p>
                  <p className="text-muted-foreground">{'> encrypting payload... ok'}</p>
                  <p className="text-muted-foreground">{'> transmitting... ok'}</p>
                  <p className="text-foreground">
                    {'> message from '}
                    <span className="text-primary">{form.name || 'anon'}</span>
                    {' delivered. ✓'}
                  </p>
                  <p className="text-muted-foreground">
                    {'// This is a front-end demo — nothing is actually sent yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 border border-border px-4 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary"
                  >
                    ↻ Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-muted-foreground">
                    <span className="text-primary">$</span> ./send_message.sh --to ziyue
                  </p>

                  <TerminalField
                    label="name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    placeholder="your name"
                  />
                  <TerminalField
                    label="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    placeholder="you@domain.com"
                  />
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <span className="text-primary">›</span> message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="tell me about your idea..."
                      className="w-full resize-none border border-border bg-background px-3 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {status === 'sending' ? (
                      <>
                        transmitting<span className="cursor-blink">_</span>
                      </>
                    ) : (
                      <>execute ↵</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Channels */}
          <div className="flex flex-col justify-between gap-8">
            <p className="text-pretty text-2xl font-medium leading-tight md:text-3xl">
              Got a project, a role, or a wild idea? The terminal is open.
            </p>
            <ul className="divide-y divide-border border-y border-border">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between py-4 transition-colors hover:text-primary"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="font-bold tracking-tight">{c.value}</span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between py-4">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="font-bold tracking-tight">{c.value}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function TerminalField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">›</span> {label}
      </label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border bg-background px-3 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
      />
    </div>
  )
}
