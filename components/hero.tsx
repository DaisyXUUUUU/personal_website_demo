'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function Hero() {
  const [eggOpen, setEggOpen] = useState(false)

  useEffect(() => {
    if (!eggOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEggOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [eggOpen])

  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Status row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            Status [ open to 2026 grad & research roles ]
          </span>
          <span>Ningbo, China · GMT+8</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Giant headline */}
        <h1 className="text-balance font-black uppercase leading-[0.86] tracking-tighter">
          <span className="block text-[15vw] md:text-[11vw] lg:text-[9.5rem]">Hi, it&apos;s me</span>
          <span className="block text-[15vw] md:text-[11vw] lg:text-[9.5rem]">
            <span className="text-primary">ziyue</span>
            <button
              type="button"
              onClick={() => setEggOpen(true)}
              aria-label="A little secret"
              title="psst… click me"
              className="align-super text-[4vw] text-muted-foreground transition-colors hover:text-primary md:text-[2.5vw] lg:text-3xl"
            >
              ®
            </button>
          </span>
          <span className="block text-outline text-[13vw] md:text-[10vw] lg:text-[8.5rem]">
            Applied Math
          </span>
        </h1>

        {/* Sub row: image + blurb */}
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-card md:aspect-[3/4]">
            <Image
              src="/hero-portrait.png"
              alt="Editorial portrait of Ziyue Xu"
              fill
              priority
              className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-primary-foreground mix-blend-difference">
              [ fig.01 — the mathematician ]
            </span>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <p className="text-pretty text-2xl font-medium leading-tight md:text-3xl">
              First-Class Honours mathematician turning{' '}
              <span className="text-primary">uncertainty into decisions</span> — stochastic
              modeling, tail-risk analytics and optimization for real operational systems.
            </p>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <div>
                <p className="mb-1 text-foreground">Focus</p>
                <p>Stochastic Modeling</p>
                <p>Risk & Optimization</p>
              </div>
              <div>
                <p className="mb-1 text-foreground">Toolkit</p>
                <p>Python · SQL · R</p>
                <p>MATLAB · Tableau</p>
              </div>
            </div>
            <a
              href="#contact"
              className="group inline-flex w-fit items-center gap-3 bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s talk
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-14 overflow-hidden border-y border-border py-4">
        <div className="marquee-track flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center" aria-hidden={i === 1}>
              {['Stochastic Modeling', 'Tail-Risk Analytics', 'Optimization', 'Monte Carlo', 'Data Science'].map(
                (word) => (
                  <span key={word} className="flex items-center">
                    <span className="px-6 text-4xl font-black uppercase tracking-tighter text-outline md:text-6xl">
                      {word}
                    </span>
                    <span className="text-primary">✦</span>
                  </span>
                ),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Easter egg dialog */}
      {eggOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="egg-title"
          onClick={() => setEggOpen(false)}
        >
          <div
            className="relative w-full max-w-lg border-2 border-primary bg-card p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEggOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
              [ secret unlocked ]
            </p>
            <h2 id="egg-title" className="mb-4 text-3xl font-black uppercase leading-none tracking-tighter">
              Are you a <span className="text-primary">PhD advisor or recruiter?</span>
            </h2>
            <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
              You found the hidden button. If you work on stochastic systems, operations research
              or data-driven decision-making — and you&apos;re looking for a rigorous mathematician
              who ships — let&apos;s talk. GRE 333 · GPA 3.9/4.0 · First-Class Honours.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                onClick={() => setEggOpen(false)}
                className="bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground"
              >
                Get in touch →
              </a>
              <button
                type="button"
                onClick={() => setEggOpen(false)}
                className="border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                Just browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
