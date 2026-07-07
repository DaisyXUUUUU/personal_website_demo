'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Martini, Snowflake, Camera, Utensils, Trophy } from 'lucide-react'
import { SectionHeader } from './about'

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
  const [active, setActive] = useState(2)
  const count = HOBBIES.length

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
    <section
      id="human"
      className="scroll-mt-24 bg-gradient-to-b from-hero-bg-3 to-hero-ink py-20 text-hero-ink md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="03" title="The Human behind the CV" />

        <div className="mb-4 max-w-2xl">
          <h3 className="text-pretty text-4xl font-black tracking-tight text-hero-pink md:text-5xl">
            Work is what I Do
          </h3>
          <p className="mt-2 text-2xl font-semibold text-hero-pink/80 md:text-3xl">
            This is who I am.
          </p>
        </div>

        {/* Fan / coverflow stage */}
        <div
          className="relative mx-auto flex h-[520px] w-full items-center justify-center [perspective:1400px]"
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
                  transform: `translate(-50%, -50%) translateX(${offset * 210}px) translateY(${abs * 24}px) rotate(${offset * 7}deg) scale(${isCenter ? 1.06 : 0.86})`,
                  zIndex: 20 - abs,
                  opacity: hidden ? 0 : 1,
                  pointerEvents: hidden ? 'none' : 'auto',
                }}
              >
                <HobbyCard hobby={hobby} active={isCenter} />
              </button>
            )
          })}
        </div>

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
    </section>
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
