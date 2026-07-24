'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLanguage } from './language-provider'

const LINKS = [
  { label: 'About', href: '#top', id: 'top' },
  { label: 'Work', href: '#experience', id: 'experience' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Human behind CV', href: '#human', id: 'human' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export function SiteNav() {
  const { lang, toggle } = useLanguage()
  const [active, setActive] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    if (!menuOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 bg-primary pt-[env(safe-area-inset-top)] text-primary-foreground"
    >
      <nav className="mx-auto flex min-h-[3.75rem] max-w-[1600px] items-center justify-between gap-3 px-5 md:px-10">
        <a
          href="#top"
          className="text-lg font-black uppercase tracking-tight text-primary-foreground md:text-xl"
        >
          Ziyue Xu
        </a>

        <ul className="hidden items-center gap-1 min-[1100px]:flex xl:gap-2">
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle language"
            className="rounded-full border border-primary-foreground/70 px-3.5 py-1 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
          >
            {lang === 'en' ? 'EN' : '中'}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/70 text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary min-[1100px]:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`absolute inset-x-0 top-full border-t border-primary-foreground/20 bg-primary px-5 pb-5 shadow-xl transition-all duration-200 min-[1100px]:hidden ${
          menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <ul className="mx-auto grid max-w-[1600px] gap-1 pt-3">
          {LINKS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors ${
                    isActive
                      ? 'bg-primary-foreground/95 text-primary'
                      : 'text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
