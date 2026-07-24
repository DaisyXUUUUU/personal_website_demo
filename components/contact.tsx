'use client'

import { useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

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
    value: 'Daisy_Xu0526',
    href: null,
    logo: '/brand/wechat.svg',
  },
  {
    label: 'LinkedIn',
    value: 'Ziyue Xu',
    href: 'https://www.linkedin.com/in/ziyue-xu-29b444379',
    logo: '/brand/linkedin.svg',
  },
]

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const titleReveal = useTransform(scrollYProgress, [0.08, 0.28], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.26], [0, 1])
  const titleY = useTransform(scrollYProgress, [0.08, 0.26], [28, 0])
  const terminalX = useTransform(scrollYProgress, [0.16, 0.42], [120, 0])
  const terminalOpacity = useTransform(scrollYProgress, [0.16, 0.42], [0, 1])
  const terminalScale = useTransform(scrollYProgress, [0.16, 0.42], [0.95, 1])
  const bootLine1 = useTransform(scrollYProgress, [0.2, 0.34], [0, 1])
  const bootLine2 = useTransform(scrollYProgress, [0.26, 0.4], [0, 1])
  const bootLine3 = useTransform(scrollYProgress, [0.32, 0.46], [0, 1])
  const bootLine1Y = useTransform(bootLine1, [0, 1], [10, 0])
  const bootLine2Y = useTransform(bootLine2, [0, 1], [10, 0])
  const bootLine3Y = useTransform(bootLine3, [0, 1], [10, 0])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('idle')
      setErrorMessage('Email service is not configured. Please set EmailJS environment variables.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: form.name,
            email: form.email,
            message: form.message,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      setStatus('done')
    } catch {
      setStatus('idle')
      setErrorMessage('Send failed. Please try again in a moment.')
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '' })
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      className="scroll-mt-24 border-t-4 border-hero-pink bg-hero-ink py-20 text-hero-card md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Section label + pink rule */}
        <div className="mb-10 flex items-center gap-6">
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">
            Contact
          </span>
          <span className="h-px flex-1 bg-hero-pink/60" aria-hidden />
        </div>

        <motion.h2
          className="section-title-fluid text-pretty font-black tracking-tighter text-hero-pink"
          style={{ clipPath: titleReveal, opacity: titleOpacity, y: titleY }}
        >
          Let&apos;s build something.
          <span className="ml-1 inline-block w-[0.08em] animate-pulse text-hero-pink">|</span>
        </motion.h2>

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
              {CHANNELS.map((c, idx) => (
                <motion.li
                  key={c.label}
                  initial={{ opacity: 0, x: -38 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.38, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChannelRow channel={c} />
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right — terminal-style form → thank-you reply */}
          <motion.div
            className="overflow-hidden rounded-3xl border border-hero-pink/30 bg-hero-pink/25 shadow-2xl backdrop-blur"
            style={{ x: terminalX, opacity: terminalOpacity, scale: terminalScale }}
          >
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
                <motion.p style={{ opacity: bootLine1, y: bootLine1Y }}>
                  <span className="text-hero-card">$</span> ./contact-system init
                </motion.p>
                <motion.p style={{ opacity: bootLine2, y: bootLine2Y }}>
                  [INFO] Contact system initialized...
                </motion.p>
                <motion.p style={{ opacity: bootLine3, y: bootLine3Y }}>
                  [INFO] Awaiting user input...
                </motion.p>
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
                      className="w-full resize-none rounded-xl border border-hero-pink/30 bg-hero-pink/20 px-4 py-3 text-hero-card outline-none transition-colors placeholder:text-hero-card/50 focus:border-hero-card focus:shadow-[0_0_0_2px_rgba(222,89,143,0.35),0_0_24px_rgba(222,89,143,0.26)]"
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

                  {errorMessage && (
                    <p className="text-sm font-medium text-rose-300">[ERROR] {errorMessage}</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function ChannelRow({ channel }: { channel: Channel }) {
  const inner = (
    <div className="group grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 sm:flex sm:gap-5">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-hero-card p-3 transition-transform group-hover:scale-105">
        <Image
          src={channel.logo || '/placeholder.svg'}
          alt={`${channel.label} logo`}
          width={32}
          height={32}
          className="size-full object-contain"
        />
      </span>
      <span className="min-w-0 break-words text-[clamp(1.15rem,5vw,1.5rem)] font-black tracking-tight text-hero-card/70 transition-colors group-hover:text-hero-pink">
        {channel.label}
      </span>
      <span className="col-start-2 min-w-0 break-all rounded-xl bg-hero-card/10 px-3 py-1.5 font-mono text-xs text-hero-card/60 transition-colors group-hover:bg-hero-pink group-hover:text-hero-card sm:rounded-full sm:px-4 sm:text-sm">
        {channel.value}
      </span>
    </div>
  )

  if (channel.href) {
    return (
      <a href={channel.href} target="_blank" rel="noreferrer" className="block w-full">
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
        className="w-full rounded-xl border border-hero-pink/30 bg-hero-pink/20 px-4 py-3 text-hero-card outline-none transition-colors placeholder:text-hero-card/50 focus:border-hero-card focus:shadow-[0_0_0_2px_rgba(222,89,143,0.35),0_0_24px_rgba(222,89,143,0.26)]"
      />
    </div>
  )
}
