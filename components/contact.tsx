'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'

type Status = 'idle' | 'sending' | 'done'

type Channel = {
  label: string
  value: string
  href: string | null
  logo: string
}

const CHANNELS: Channel[] = [
  {
    label: 'Email',
    value: 'daisy.ziyue0526@outlook.com',
    href: 'mailto:daisy.ziyue0526@outlook.com',
    logo: '/brand/outlook.svg',
  },
  {
    label: 'Github',
    value: 'DaisyXUUUUU',
    href: 'https://github.com/DaisyXUUUUU',
    logo: '/brand/github.svg',
  },
  {
    label: 'WeChat',
    value: 'daisy.ziyue0526@outlook.com',
    href: null,
    logo: '/brand/wechat.svg',
  },
  {
    label: 'LinkedIn',
    value: 'daisy.ziyue0526@outlook.com',
    href: 'https://www.linkedin.com',
    logo: '/brand/linkedin.svg',
  },
]

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setTimeout(() => setStatus('done'), 1200)
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '' })
    setStatus('idle')
  }

  return (
    <section
      id="contact"
      className="tx-curtain scroll-mt-24 border-t-4 border-hero-pink bg-hero-ink py-20 text-hero-card md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Section label + pink rule */}
        <div className="mb-10 flex items-center gap-6">
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">
            Contact
          </span>
          <span className="h-px flex-1 bg-hero-pink/60" aria-hidden />
        </div>

        <h2 className="text-pretty text-5xl font-black tracking-tighter text-hero-pink md:text-7xl">
          Let&apos;s build something.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — contact channels (hover to highlight pink) */}
          <div>
            <h3 className="text-3xl font-black tracking-tight text-hero-pink md:text-4xl">
              Open to conversations.
            </h3>
            <p className="mt-2 max-w-md text-pretty leading-relaxed text-hero-pink/70">
              Whether you&apos;re hiring, collaborating, or just curious — I&apos;d love to hear from
              you.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <ChannelRow channel={c} />
                </li>
              ))}
            </ul>
          </div>

          {/* Right — terminal-style form → thank-you reply */}
          <div className="overflow-hidden rounded-3xl border border-hero-pink/30 bg-hero-pink/25 shadow-2xl backdrop-blur">
            {/* title bar */}
            <div className="flex items-center gap-3 border-b border-hero-pink/20 px-5 py-4">
              <span className="flex gap-2" aria-hidden>
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </span>
              <span className="font-mono text-sm text-hero-card/90">contact-terminal.sh</span>
            </div>

            <div className="p-5 font-mono md:p-6">
              <div className="space-y-1 text-sm leading-relaxed text-hero-card/90">
                <p>
                  <span className="text-hero-card">$</span> ./contact-system init
                </p>
                <p>[INFO] Contact system initialized...</p>
                <p>[INFO] Awaiting user input...</p>
              </div>

              {status === 'done' ? (
                <div className="mt-8 space-y-5">
                  <p className="text-4xl" aria-hidden>
                    {'\u{1F49E}'}
                  </p>
                  <p className="text-pretty text-xl font-black leading-snug text-hero-card md:text-2xl">
                    Thank you for your connection!
                    <br />I will reply you as soon as possible!
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-2 rounded-xl border border-hero-card/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-hero-card transition-colors hover:border-hero-card hover:bg-hero-card hover:text-hero-ink"
                  >
                    $ send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="$ NAME"
                      value={form.name}
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                      placeholder="Jane Smith"
                    />
                    <Field
                      label="$ EMAIL"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-hero-card">$ MESSAGE</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Hi, I'd love to chat..."
                      className="w-full resize-none rounded-xl border border-hero-pink/30 bg-hero-pink/20 px-4 py-3 text-hero-card outline-none transition-colors placeholder:text-hero-card/50 focus:border-hero-card"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl bg-hero-ink px-6 py-4 text-base font-black tracking-tight text-hero-pink transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {status === 'sending' ? (
                      <>
                        $ sending<span className="cursor-blink">_</span>
                      </>
                    ) : (
                      <>$ Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChannelRow({ channel }: { channel: Channel }) {
  const inner = (
    <div className="group flex items-center gap-5">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-hero-card p-3 transition-transform group-hover:scale-105">
        <Image
          src={channel.logo || '/placeholder.svg'}
          alt={`${channel.label} logo`}
          width={32}
          height={32}
          className="size-full object-contain"
        />
      </span>
      <span className="text-2xl font-black tracking-tight text-hero-card/70 transition-colors group-hover:text-hero-pink">
        {channel.label}
      </span>
      <span className="rounded-full bg-hero-card/10 px-4 py-1.5 font-mono text-sm text-hero-card/60 transition-colors group-hover:bg-hero-pink group-hover:text-hero-card">
        {channel.value}
      </span>
    </div>
  )

  if (channel.href) {
    return (
      <a href={channel.href} target="_blank" rel="noreferrer" className="inline-block">
        {inner}
      </a>
    )
  }
  return inner
}

function Field({
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
      <label className="mb-2 block text-sm font-bold text-hero-card">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hero-pink/30 bg-hero-pink/20 px-4 py-3 text-hero-card outline-none transition-colors placeholder:text-hero-card/50 focus:border-hero-card"
      />
    </div>
  )
}
