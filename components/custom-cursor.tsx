'use client'

import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor="interactive"], [tabindex]:not([tabindex="-1"])'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const burstRef = useRef<HTMLDivElement | null>(null)

  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hoveringInteractive, setHoveringInteractive] = useState(false)

  const pointer = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateCapability = () => {
      const canUseCustomCursor = media.matches
      setEnabled(canUseCustomCursor)
      if (!canUseCustomCursor) {
        setVisible(false)
      }
    }

    const updateMotion = () => {
      reduceMotion.current = motionMedia.matches
    }

    updateCapability()
    updateMotion()

    media.addEventListener('change', updateCapability)
    motionMedia.addEventListener('change', updateMotion)

    return () => {
      media.removeEventListener('change', updateCapability)
      motionMedia.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const setDotPosition = (x: number, y: number) => {
      if (!dotRef.current) return
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const setRingPosition = (x: number, y: number) => {
      if (!ringRef.current) return
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(var(--cursor-ring-scale, 1))`
    }

    const loop = () => {
      const target = pointer.current
      const ringPoint = ring.current
      ringPoint.x += (target.x - ringPoint.x) * 0.18
      ringPoint.y += (target.y - ringPoint.y) * 0.18
      setRingPosition(ringPoint.x, ringPoint.y)
      rafId.current = window.requestAnimationFrame(loop)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY }
      if (!visible) {
        ring.current = { x: event.clientX, y: event.clientY }
        setVisible(true)
      }
      setDotPosition(event.clientX, event.clientY)

      const target = event.target as Element | null
      const interactive = !!target?.closest(INTERACTIVE_SELECTOR)
      setHoveringInteractive(interactive)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!burstRef.current || reduceMotion.current) return
      const particles = 5
      for (let i = 0; i < particles; i += 1) {
        const burst = document.createElement('span')
        const angle = (Math.PI * 2 * i) / particles + Math.random() * 0.35
        const distance = 7 + Math.random() * 7
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance

        burst.className = 'custom-cursor-spark'
        burst.style.left = `${event.clientX}px`
        burst.style.top = `${event.clientY}px`
        burst.style.setProperty('--spark-x', `${dx}px`)
        burst.style.setProperty('--spark-y', `${dy}px`)
        burst.style.animationDelay = `${i * 18}ms`
        burstRef.current.appendChild(burst)
        burst.addEventListener('animationend', () => {
          burst.remove()
        })
      }
    }

    const handlePointerLeave = () => setVisible(false)
    const handlePointerEnter = () => setVisible(true)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)
    document.addEventListener('mouseenter', handlePointerEnter)

    rafId.current = window.requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('mouseleave', handlePointerLeave)
      document.removeEventListener('mouseenter', handlePointerEnter)
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current)
      }
    }
  }, [enabled, visible])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`custom-cursor custom-cursor-ring ${visible ? 'is-visible' : ''} ${
          hoveringInteractive ? 'is-hovering' : ''
        }`}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`custom-cursor custom-cursor-dot ${visible ? 'is-visible' : ''}`}
      />
      <div ref={burstRef} aria-hidden="true" className="custom-cursor-burst-layer" />
    </>
  )
}