'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './language-provider'

const LINKS = [
  { label: 'About', href: '#top', id: 'top' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Human behind CV', href: '#human', id: 'human' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export function SiteNav() {
  const { lang, toggle } = useLanguage()
  const [active, setActive] = useState('top')

  useEffect(() => {
    const ids = LINKS.map((l) => l.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary text-primary-foreground">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 md:px-10">
        <a
          href="#top"
          className="text-lg font-black uppercase tracking-tight text-primary-foreground md:text-xl"
        >
          Ziyue Xu
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-primary-foreground/95 text-primary'
                      : 'text-primary-foreground/90 hover:text-primary-foreground'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1 rounded-full border border-primary-foreground/70 p-0.5 text-sm font-bold">
          <button
            type="button"
            onClick={() => lang !== 'en' && toggle()}
            aria-label="Switch to English"
            aria-pressed={lang === 'en'}
            className={`rounded-full px-3 py-0.5 transition-colors ${
              lang === 'en'
                ? 'bg-primary-foreground text-primary'
                : 'text-primary-foreground/60 hover:text-primary-foreground'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => lang !== 'zh' && toggle()}
            aria-label="Switch to Chinese"
            aria-pressed={lang === 'zh'}
            className={`rounded-full px-3 py-0.5 transition-colors ${
              lang === 'zh'
                ? 'bg-primary-foreground text-primary'
                : 'text-primary-foreground/60 hover:text-primary-foreground'
            }`}
          >
            中
          </button>
        </div>
      </nav>
    </header>
  )
}
