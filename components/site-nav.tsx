'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './language-provider'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Human', href: '#human' },
  { label: 'Contact', href: '#contact' },
]

export function SiteNav() {
  const { lang, toggle } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-border bg-background/85 backdrop-blur' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="group flex items-baseline gap-2 font-mono text-sm tracking-tight">
          <span className="font-sans text-lg font-black tracking-tighter text-foreground">ziyue</span>
          <span className="text-primary">®</span>
        </a>

        <ul className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                [ {link.label} ]
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle language"
          className="flex items-center gap-1 border border-border px-2 py-1 font-mono text-xs uppercase tracking-widest transition-colors hover:border-primary"
        >
          <span className={lang === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
          <span className="text-muted-foreground">/</span>
          <span className={lang === 'zh' ? 'text-primary' : 'text-muted-foreground'}>中</span>
        </button>
      </nav>
    </header>
  )
}
