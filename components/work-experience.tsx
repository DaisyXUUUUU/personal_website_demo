'use client'

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useState } from 'react'

type WorkItem = {
  id: string
  period: string
  role: string
  org: string
  location: string
  summary: string
  details: string[]
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'tail-risk-ra',
    period: '2025 — Present',
    role: 'Research Assistant',
    org: 'NUBS China · Dr. Liu Lei',
    location: 'Ningbo, China',
    summary: 'Queueing tail-risk modeling, PH approximation, and risk-averse optimization research.',
    details: [
      'Built CTMC and PH-based models for heavy-tailed queueing systems and stress-tested with simulations.',
      'Analyzed VaR and CVaR behavior under congestion scenarios to support robust operational decisions.',
      'Translated research insights into reproducible computational workflows for manuscript preparation.',
    ],
  },
  {
    id: 'ipsos-intern',
    period: '2021 — 2022',
    role: 'Data Analysis & Social Intelligence Intern',
    org: 'IPSOS China',
    location: 'Shanghai, China',
    summary: 'Healthcare social-intelligence analytics with NLP clustering and dashboard delivery.',
    details: [
      'Processed large-scale social content and mapped KOL/HCP dynamics with NLP and clustering pipelines.',
      'Built sentiment monitoring with forecasting signals for early anomaly detection.',
      'Delivered Tableau dashboards used by teams for communication and engagement planning.',
    ],
  },
  {
    id: 'pinpianyi-intern',
    period: '2024',
    role: 'Business Analysis Intern',
    org: 'Hangzhou Pinpianyi Tech',
    location: 'Hangzhou, China',
    summary: 'Recycling logistics analytics and data-backed decision support prototyping.',
    details: [
      'Integrated multi-region operational datasets and structured routing-related decision variables.',
      'Built forecasting and scenario analysis routines for demand and throughput planning.',
      'Shipped a Streamlit prototype supporting pilot-level decision workflows.',
    ],
  },
]

const LOCATION_MARKERS = [
  { label: 'Ningbo', top: '32%', left: '66%', tone: 'bg-[#f1609a]' },
  { label: 'Shanghai', top: '38%', left: '69%', tone: 'bg-[#f48f63]' },
  { label: 'Hangzhou', top: '42%', left: '64%', tone: 'bg-[#9f63f4]' },
]

export function WorkExperience() {
  const rotateX = useMotionValue(-12)
  const rotateY = useMotionValue(12)
  const [dragging, setDragging] = useState(false)

  useAnimationFrame((_, delta) => {
    if (dragging) return
    rotateY.set(rotateY.get() + delta * 0.007)
  })

  return (
    <section id="experience" className="scroll-mt-24 border-t-2 border-hero-pink/30 bg-[#120b12] py-20 text-hero-card md:py-28">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-10 lg:grid-cols-[1.3fr_0.9fr] lg:gap-8">
        <div>
          <div className="mb-10 flex items-center gap-6">
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">
              Work Experience
            </span>
            <span className="h-px flex-1 bg-hero-pink/55" aria-hidden />
          </div>

          <h2 className="text-pretty text-5xl font-black tracking-tighter text-hero-pink md:text-7xl">
            What I&apos;ve worked.
          </h2>

          <div className="mt-10 space-y-4">
            {WORK_ITEMS.map((item) => (
              <article
                key={item.id}
                tabIndex={0}
                className="group rounded-2xl border border-hero-pink/30 bg-white/5 p-5 transition-colors duration-300 hover:border-hero-pink/65 hover:bg-white/8 focus-visible:border-hero-pink/65 focus-visible:outline-none"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-hero-pink/90">{item.period}</p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-hero-card md:text-2xl">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm text-hero-card/75 md:text-base">{item.org}</p>
                  </div>
                  <span className="rounded-full border border-hero-pink/45 px-3 py-1 font-mono text-xs text-hero-pink/95">
                    {item.location}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-hero-card/80 md:text-base">{item.summary}</p>

                <ul className="mt-4 max-h-96 space-y-2 overflow-hidden text-sm text-hero-card/85 opacity-100 transition-all duration-500 md:max-h-0 md:opacity-0 md:group-hover:max-h-44 md:group-hover:opacity-100 md:group-focus-visible:max-h-44 md:group-focus-visible:opacity-100">
                  {item.details.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-hero-pink" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="flex min-h-[520px] items-center justify-center">
          <div className="relative w-full max-w-[460px]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-hero-pink/20 blur-3xl" aria-hidden />

            <motion.div
              drag
              dragMomentum={false}
              onDragStart={() => setDragging(true)}
              onDragEnd={() => setDragging(false)}
              onDrag={(_, info) => {
                rotateY.set(rotateY.get() + info.delta.x * 0.35)
                rotateX.set(Math.max(-32, Math.min(22, rotateX.get() - info.delta.y * 0.28)))
              }}
              className="relative mx-auto aspect-square w-[84%] cursor-grab active:cursor-grabbing"
              style={{ perspective: 1200 }}
              aria-label="Draggable globe with work locations"
            >
              <motion.div
                className="relative h-full w-full"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 rounded-full border border-white/12 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_45%,rgba(0,0,0,0.12)_100%)] shadow-[inset_-18px_-24px_40px_rgba(0,0,0,0.35),0_30px_60px_rgba(0,0,0,0.4)]" />

                <div
                  className="absolute left-[16%] top-[16%] h-[34%] w-[33%] rounded-[44%_52%_46%_58%/42%_58%_45%_55%]"
                  style={{
                    transform: 'translateZ(2px)',
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,184,219,0.8) 0 1px, transparent 1.8px)',
                    backgroundSize: '6px 6px',
                    opacity: 0.65,
                  }}
                />
                <div
                  className="absolute left-[57%] top-[33%] h-[39%] w-[24%] rounded-[46%_58%_48%_52%/49%_44%_56%_51%]"
                  style={{
                    transform: 'translateZ(2px)',
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,184,219,0.8) 0 1px, transparent 1.8px)',
                    backgroundSize: '6px 6px',
                    opacity: 0.65,
                  }}
                />

                {LOCATION_MARKERS.map((marker) => (
                  <div
                    key={marker.label}
                    className="absolute"
                    style={{
                      top: marker.top,
                      left: marker.left,
                      transform: 'translate(-50%, -50%) translateZ(28px)',
                    }}
                  >
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-lg ${marker.tone}`}>
                      <span className="size-1.5 rounded-full bg-white/90" aria-hidden />
                      {marker.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-hero-pink/75">
              Drag to rotate globe
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
