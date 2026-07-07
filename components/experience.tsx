'use client'

import { useState } from 'react'
import { ArrowUpRight, Plus, Minus } from 'lucide-react'
import { SectionHeader } from './about'

type Item = {
  year: string
  role: string
  org: string
  featured?: boolean
  body: string
  tags: string[]
}

const ITEMS: Item[] = [
  {
    year: '2025',
    role: 'AI Designer',
    org: 'CCTV × WIRED',
    featured: true,
    body:
      'Led the design of an AI-driven storytelling experience bridging broadcast media and editorial. Built generative visual systems, real-time interfaces and a design language that scaled across screens. This entry is fully written from the design — the others are placeholders for your real work.',
    tags: ['AI Systems', 'Art Direction', 'Prototyping', 'Broadcast'],
  },
  {
    year: '2024',
    role: 'Your Role',
    org: 'Company / Project',
    body: 'Coming soon — send me the details of this project and I will write it up here.',
    tags: ['Placeholder'],
  },
  {
    year: '2023',
    role: 'Your Role',
    org: 'Company / Project',
    body: 'Coming soon — send me the details of this project and I will write it up here.',
    tags: ['Placeholder'],
  },
  {
    year: '2022',
    role: 'Your Role',
    org: 'Company / Project',
    body: 'Coming soon — send me the details of this project and I will write it up here.',
    tags: ['Placeholder'],
  },
  {
    year: '2021',
    role: 'Where it started',
    org: 'Company / Project',
    body: 'Coming soon — send me the details of this project and I will write it up here.',
    tags: ['Placeholder'],
  },
]

export function Experience() {
  const [open, setOpen] = useState<string | null>('2025')

  return (
    <section id="experience" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="02" title="Experience" />

        <ul className="border-t border-border">
          {ITEMS.map((item) => {
            const isOpen = open === item.year
            return (
              <li key={item.year} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.year)}
                  aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                >
                  <span
                    className={`font-mono text-sm tabular-nums tracking-widest md:text-base ${
                      item.featured ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.year}
                  </span>
                  <span className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                    <span className="text-2xl font-black uppercase leading-none tracking-tighter transition-colors group-hover:text-primary md:text-4xl">
                      {item.org}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {item.role}
                    </span>
                    {item.featured && (
                      <span className="w-fit bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                        Featured
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                    {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] pb-8 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-8">
                      <div className="hidden md:block" />
                      <div>
                        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {item.featured && (
                          <a
                            href="#contact"
                            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary"
                          >
                            View case study
                            <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
