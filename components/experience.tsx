'use client'

import { useState } from 'react'
import { ArrowUpRight, Plus, Minus } from 'lucide-react'
import { SectionHeader } from './about'

type Item = {
  id: string
  year: string
  role: string
  org: string
  featured?: boolean
  body: string
  tags: string[]
  link?: { label: string; href: string }
}

const ITEMS: Item[] = [
  {
    id: 'tail-risk',
    year: '2025 — Now',
    role: 'Research Assistant · Dr. Liu Lei, NUBS China',
    org: 'Tail-Risk in Queueing Systems',
    featured: true,
    body:
      'Modeled multi-stage flow-shop systems as continuous-time Markov chains, using phase-type (PH) distributions to approximate heavy-tailed processing times with <3% fitting error. Quantified tail-risk exposure through 1,000+ Monte Carlo simulations with risk-averse measures (VaR, CVaR), revealing how rare but severe delays propagate downstream — then developed buffer-allocation and scheduling guidelines that minimize tail-risk rather than expected makespan.',
    tags: ['CTMC', 'PH Distributions', 'VaR / CVaR', 'Monte Carlo'],
  },
  {
    id: 'ipsos',
    year: '2025 — Now',
    role: 'Data Analysis & Social Intelligence Intern · Healthcare',
    org: 'IPSOS China',
    body:
      'Processed 50,000+ TikTok/WeChat posts with SnowNLP and K-means clustering to map interaction patterns among KOLs, HCPs and patient communities, improving topic-classification accuracy by 22%. Built continuous state monitoring with Prophet and ARIMA to detect a 15% competitor-driven negative-sentiment cascade early, and designed Tableau decision dashboards that guided interventions and lifted engagement +12% MoM.',
    tags: ['SnowNLP', 'K-means', 'Prophet / ARIMA', 'Tableau'],
  },
  {
    id: 'vrp',
    year: '2025',
    role: 'Undergraduate Researcher · Dr. Liu Lei, NUBS China',
    org: 'Cross-Border Routing Optimization',
    body:
      'Modeled a multi-node cross-border logistics network spanning 100+ factories, 8 ports and 3 distribution centers, formulating VRP/CVRP coordination strategies that cut transportation cost by 12% while improving delivery reliability. Built a Python data-quality framework to preprocess 10k+ shipment records and proposed feedback-driven reallocation policies for fleet and route scheduling.',
    tags: ['VRP / CVRP', 'Python', 'Logistics', 'Optimization'],
  },
  {
    id: 'pinpianyi',
    year: '2024',
    role: 'Business Analysis Intern',
    org: 'Hangzhou Pinpianyi Tech',
    body:
      'Modeled a multi-region recycling logistics system by integrating 30+ municipal waste-management entities (Python + MySQL) and segmenting nodes with K-means. Built order-volume forecasting models over 500k+ monthly records, and shipped a Streamlit decision-support prototype that raised recycling throughput 8% and cut logistics cycle time 12% in a two-region pilot.',
    tags: ['Python', 'MySQL', 'Forecasting', 'Streamlit'],
  },
  {
    id: 'turing',
    year: '2024',
    role: 'Undergraduate Researcher · Prof. Mainul Haque, UNNC',
    org: 'Turing Patterns in Epidemics',
    body:
      'Developed nonlinear reaction–diffusion models with Allee effects and infection dynamics, demonstrating stable Turing pattern formation across >95% of parameter variations. Ran 1,000+ parameter-set simulations via Latin Hypercube Sampling to identify the critical diffusion–reaction ratios where the system transitions from homogeneous equilibrium to patterned instability.',
    tags: ['Reaction–Diffusion', 'LHS', 'Bifurcation', 'Stability'],
  },
  {
    id: 'publication',
    year: '2023',
    role: 'First Author · FTBM 2023',
    org: 'Publication — DTW & Trade',
    body:
      'Investigated the correlation between fluctuations in the U.S. stock industry index and U.S. import–export volume using the Dynamic Time Warping (DTW) method. Presented at the 2023 International Conference on Finance, Trade and Business Management.',
    tags: ['DTW', 'Time Series', 'Econometrics'],
    link: { label: 'View publication (DOI)', href: 'https://doi.org/10.2991/978-94-6463-298-9_42' },
  },
]

export function Experience() {
  const [open, setOpen] = useState<string | null>('tail-risk')

  return (
    <section id="experience" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader index="02" title="Experience" />

        <ul className="border-t border-border">
          {ITEMS.map((item) => {
            const isOpen = open === item.id
            return (
              <li key={item.id} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
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
                        {item.link ? (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary"
                          >
                            {item.link.label}
                            <ArrowUpRight className="size-4" />
                          </a>
                        ) : item.featured ? (
                          <a
                            href="#contact"
                            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-primary"
                          >
                            Discuss this research
                            <ArrowUpRight className="size-4" />
                          </a>
                        ) : null}
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
