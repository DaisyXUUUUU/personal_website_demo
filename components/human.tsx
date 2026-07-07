'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Martini, Snowflake, Camera, Utensils, Trophy } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

type Hobby = {
  title: string
  quote: string
  image: string
  Icon: typeof Martini
}

const HOBBIES: Hobby[] = [
  {
    title: 'Squash',
    quote: '“Chasing every ball — and a healthy respect for tail risk.”',
    image: '/hobby-squash.png',
    Icon: Trophy,
  },
  {
    title: 'Skiing',
    quote: '“Fast lines, sharp turns, calculated risk.”',
    image: '/hobby-skiing.png',
    Icon: Snowflake,
  },
  {
    title: 'Cocktails',
    quote: '“Shaking up good vibes, one cocktail at a time.”',
    image: '/hobby-cocktails.png',
    Icon: Martini,
  },
  {
    title: 'Photography',
    quote: '“Framing the world one shot at a time.”',
    image: '/hobby-photography.png',
    Icon: Camera,
  },
  {
    title: 'Cooking',
    quote: '“Recipes are reproducible pipelines with better rewards.”',
    image: '/hobby-cooking.png',
    Icon: Utensils,
  },
]

export function Human() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(2)
  const [collapseProgress, setCollapseProgress] = useState(0)
  const count = HOBBIES.length
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const collapse = Math.min(1, Math.max(0, (latest - 0.72) / 0.26))
    setCollapseProgress(collapse)
  })

  const sectionBg = useTransform(
    scrollYProgress,
    [0, 0.62, 1],
    ['rgb(255 248 240)', 'rgb(255 248 240)', 'rgb(18 10 16)'],
  )
  const titleReveal = useTransform(scrollYProgress, [0.1, 0.28], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const subtitleOpacity = useTransform(scrollYProgress, [0.2, 0.33], [0, 1])
  const stageScale = useTransform(scrollYProgress, [0.72, 0.97], [1, 0.84])
  const stageOpacity = useTransform(scrollYProgress, [0.72, 0.98], [1, 0.18])
  const stageY = useTransform(scrollYProgress, [0.72, 0.98], [0, -26])
  const darkOverlayOpacity = useTransform(scrollYProgress, [0.72, 1], [0, 0.92])
  const spotlight = useTransform(scrollYProgress, [0.72, 1], [72, 12])
  const titleFadeOut = useTransform(scrollYProgress, [0.72, 0.96], [1, 0])
  const titleY = useTransform(scrollYProgress, [0.72, 0.96], [0, -34])

  const go = (dir: number) => {
    setActive((prev) => (prev + dir + count) % count)
  }

  // Move the mouse left/right across the stage to scrub through the fan.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const idx = Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))))
    setActive(idx)
  }

  return (
    <motion.section
      id="human"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-t-2 border-hero-pink/30 bg-hero-bg-3 py-20 text-hero-ink md:py-28"
      style={{ backgroundColor: sectionBg }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: darkOverlayOpacity,
          background: useTransform(
            spotlight,
            (v) => `radial-gradient(circle at 50% 45%, rgba(18,10,16,0) ${v}px, rgba(18,10,16,0.88) ${v + 170}px)`,
          ),
        }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <motion.div className="mb-10 flex items-center gap-6" style={{ opacity: titleFadeOut, y: titleY }}>
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">
            The Human behind the CV
          </span>
          <span className="h-px flex-1 bg-hero-pink/60" aria-hidden />
        </motion.div>

        <motion.div className="mb-4 max-w-2xl" style={{ opacity: titleFadeOut, y: titleY }}>
          <motion.h3
            className="text-pretty text-5xl font-black tracking-tighter text-hero-pink md:text-7xl"
            style={{ clipPath: titleReveal }}
          >
            Work is what I Do
          </motion.h3>
          <motion.p
            className="mt-2 text-2xl font-semibold text-hero-pink/80 md:text-3xl"
            style={{ opacity: subtitleOpacity }}
          >
            This is who I am.
          </motion.p>
        </motion.div>

        {/* Fan / coverflow stage */}
        <motion.div
          className="relative mx-auto flex h-[520px] w-full items-center justify-center [perspective:1400px]"
          style={{ scale: stageScale, opacity: stageOpacity, y: stageY }}
          onMouseMove={onMove}
          role="group"
          aria-label="Hobbies carousel"
        >
          {HOBBIES.map((hobby, i) => {
            const offset = i - active
            const abs = Math.abs(offset)
            const isCenter = offset === 0
            const hidden = abs > 2
            return (
              <button
                key={hobby.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${hobby.title}`}
                aria-current={isCenter}
                className="group absolute left-1/2 top-1/2 h-[420px] w-[340px] origin-center transition-all duration-500 ease-out focus:outline-none"
                style={{
                  transform: `translate(-50%, -50%) translateX(${offset * (210 * (1 - collapseProgress * 0.32))}px) translateY(${abs * (24 * (1 - collapseProgress * 0.4))}px) rotate(${offset * (7 * (1 - collapseProgress * 0.45))}deg) scale(${isCenter ? 1.06 : 0.86})`,
                  zIndex: 20 - abs,
                  opacity: hidden ? 0 : 1,
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
              >
                <HobbyCard hobby={hobby} active={isCenter} />
              </button>
            )
          })}
        </motion.div>

        {/* Controls */}
        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous hobby"
            className="flex size-11 items-center justify-center rounded-full border border-hero-ink/40 bg-hero-card text-hero-ink transition-colors hover:bg-hero-ink hover:text-hero-card"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Select hobby">
            {HOBBIES.map((h, i) => (
              <button
                key={h.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={h.title}
                onClick={() => setActive(i)}
                className={`size-2.5 rounded-full transition-all ${
                  i === active ? 'w-6 bg-hero-ink' : 'bg-hero-ink/30 hover:bg-hero-ink/50'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next hobby"
            className="flex size-11 items-center justify-center rounded-full border border-hero-ink/40 bg-hero-card text-hero-ink transition-colors hover:bg-hero-ink hover:text-hero-card"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </motion.section>
  )
}

function HobbyCard({ hobby, active }: { hobby: Hobby; active: boolean }) {
  const { Icon } = hobby
  // Center card is dark by default; any card also darkens on hover.
  return (
    <div
      className={`flex h-full w-full flex-col gap-4 rounded-sm border p-6 shadow-xl transition-colors duration-300 ${
        active
          ? 'border-hero-ink bg-hero-ink text-hero-card'
          : 'border-hero-pink/50 bg-hero-pink text-hero-ink group-hover:border-hero-ink group-hover:bg-hero-ink group-hover:text-hero-card'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <Icon
          className={`size-8 shrink-0 ${active ? 'text-hero-pink' : 'text-hero-ink group-hover:text-hero-pink'}`}
        />
        <h4 className="font-serif text-2xl font-bold italic underline decoration-2 underline-offset-4">
          {hobby.title}
        </h4>
      </div>

      <p className="text-pretty text-lg font-medium leading-snug">{hobby.quote}</p>

      <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden rounded-sm">
        <Image
          src={hobby.image || '/placeholder.svg'}
          alt={hobby.title}
          fill
          className="object-cover"
          sizes="340px"
        />
      </div>
    </div>
  )
}
