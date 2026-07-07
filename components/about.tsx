'use client'

const EDUCATION = [
  {
    year: '20XX — 20XX',
    school: 'University Name',
    detail: 'M.A. in Interaction / HCI · Placeholder degree line',
  },
  {
    year: '20XX — 20XX',
    school: 'University Name',
    detail: 'B.A. in Design · Placeholder degree line',
  },
]

const SKILLS = [
  { name: 'Python', level: 92 },
  { name: 'Machine Learning', level: 78 },
  { name: 'Design Systems', level: 88 },
  { name: 'Prototyping', level: 95 },
  { name: 'Frontend / Next.js', level: 80 },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="01" title="About" />

        <div className="grid gap-16 md:grid-cols-2">
          {/* Bio + education */}
          <div>
            <p className="mb-10 text-pretty text-xl leading-relaxed md:text-2xl">
              A short paragraph about who you are, how you think, and what pulls you toward AI-driven
              design. This is placeholder text — send me your real bio and I&apos;ll drop it in.
            </p>

            <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-primary">
              [ Education ]
            </h3>
            <ul className="divide-y divide-border border-y border-border">
              {EDUCATION.map((edu) => (
                <li key={edu.school} className="grid gap-1 py-4 md:grid-cols-[160px_1fr]">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {edu.year}
                  </span>
                  <div>
                    <p className="text-lg font-bold uppercase tracking-tight">{edu.school}</p>
                    <p className="text-sm text-muted-foreground">{edu.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-primary">
              [ Skills / Python-first ]
            </h3>
            <div className="space-y-6">
              {SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest">
                    <span className="text-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary">
                    <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <pre className="mt-10 overflow-x-auto border border-border bg-card p-5 font-mono text-xs leading-relaxed text-muted-foreground">
              <code>{`>>> import ziyue as z
>>> z.role
'AI Designer'
>>> z.stack
['python', 'design', 'ml', 'next.js']
>>> z.status
'shipping'`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 flex items-end justify-between gap-4 border-b border-border pb-4">
      <h2 className="flex items-baseline gap-4 text-5xl font-black uppercase tracking-tighter md:text-7xl">
        <span className="font-mono text-base font-normal text-primary md:text-lg">{index}</span>
        {title}
      </h2>
      <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground md:block">
        [ scroll ↓ ]
      </span>
    </div>
  )
}
