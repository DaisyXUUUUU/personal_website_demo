'use client'

import Image from 'next/image'
import { SectionHeader } from './about'

const HOBBIES = [
  {
    title: 'Squash',
    tag: 'National Runner-up',
    body: "Runner-up, Women's Team — National College Squash Championships, and a Level-3 Squash Instructor certified by the General Administration of Sport of China. Competitive by nature.",
    image: undefined,
    span: 'md:col-span-2',
  },
  {
    title: 'Cocktails',
    tag: 'Mixology',
    body: 'Chasing the perfect balance of bitter, sweet and sour — the same obsession with balance I bring to a well-specified model.',
    image: '/hobby-cocktails.png',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Skiing',
    tag: 'On the slopes',
    body: 'Fast lines, sharp turns, and a healthy respect for tail risk.',
    image: undefined,
    span: '',
  },
  {
    title: 'Photography',
    tag: 'Composition',
    body: 'Framing the world one shot at a time — an eye for structure and light.',
    image: undefined,
    span: '',
  },
  {
    title: 'Cooking',
    tag: 'In the kitchen',
    body: 'Recipes are just reproducible pipelines with better rewards. I love the experimenting.',
    image: undefined,
    span: 'md:col-span-2',
  },
]

export function Human() {
  return (
    <section id="human" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="03" title="The Human behind the CV" />

        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {HOBBIES.map((hobby) => (
            <article
              key={hobby.title}
              className={`group relative flex flex-col justify-between overflow-hidden border border-border bg-card p-6 transition-colors hover:border-primary ${hobby.span}`}
            >
              {hobby.image && (
                <Image
                  src={hobby.image}
                  alt={hobby.title}
                  fill
                  className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-60"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  [ {hobby.tag} ]
                </span>
              </div>
              <div className="relative">
                <h3 className="mb-2 text-3xl font-black uppercase leading-none tracking-tighter md:text-4xl">
                  {hobby.title}
                </h3>
                <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                  {hobby.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
