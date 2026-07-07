'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PartyPopper } from 'lucide-react'

const SPLASH_PINK = '#e94b7d'
const UNLOCK_THRESHOLD = 20 // percent scratched required to unlock
const BRUSH_RADIUS = 46

type Phase = 'typing' | 'scratch' | 'unlocked' | 'entering'

const TYPE_SEQUENCE = ['I\u2019m', 'ZIYUE XU', 'An Applied Mathematician'] as const

export function ScratchSplash({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>('typing')
  const [typed, setTyped] = useState<string[]>(['', '', ''])
  const [showSub, setShowSub] = useState(false)
  const [percent, setPercent] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)
  const scratchingRef = useRef(false)
  const lastSampleRef = useRef(0)
  const unlockedRef = useRef(false)

  // Lock body scroll while the splash is active
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Typewriter intro
  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    async function run() {
      for (let line = 0; line < TYPE_SEQUENCE.length; line++) {
        const text = TYPE_SEQUENCE[line]
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return
          await new Promise<void>((resolve) => {
            const t = setTimeout(() => {
              setTyped((prev) => {
                const next = [...prev]
                next[line] = text.slice(0, i)
                return next
              })
              resolve()
            }, 55)
            timers.push(t)
          })
        }
        await new Promise<void>((resolve) => {
          const t = setTimeout(resolve, 180)
          timers.push(t)
        })
      }
      if (cancelled) return
      setShowSub(true)
      const t = setTimeout(() => {
        if (!cancelled) setPhase('scratch')
      }, 700)
      timers.push(t)
    }

    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // Draw the pink scratch layer once we enter the scratch phase
  const paintLayer = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { innerWidth: w, innerHeight: h } = window
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Pink fill
    ctx.fillStyle = SPLASH_PINK
    ctx.fillRect(0, 0, w, h)

    // Text identical to the DOM intro so the transition is seamless
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    const cx = w / 2
    const cy = h / 2
    const scale = Math.min(w / 1440, 1)

    ctx.font = `700 ${72 * scale}px Geist, system-ui, sans-serif`
    ctx.fillText('I\u2019m', cx, cy - 150 * scale)

    ctx.font = `800 ${150 * scale}px Geist, system-ui, sans-serif`
    ctx.fillText('ZIYUE XU', cx, cy - 10 * scale)

    ctx.font = `700 ${58 * scale}px Geist, system-ui, sans-serif`
    ctx.fillText('An Applied Mathematician', cx, cy + 80 * scale)

    ctx.globalAlpha = 0.92
    ctx.font = `500 ${40 * scale}px Geist, system-ui, sans-serif`
    ctx.fillText('Welcome to my personal website', cx, cy + 170 * scale)
    ctx.globalAlpha = 1
  }, [])

  useEffect(() => {
    if (phase !== 'scratch') return
    paintLayer()
    const onResize = () => paintLayer()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phase, paintLayer])

  const sampleProgress = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const step = 16
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let cleared = 0
    let total = 0
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = data[(y * width + x) * 4 + 3]
        total++
        if (alpha < 40) cleared++
      }
    }
    const pct = Math.round((cleared / total) * 100)
    setPercent(pct)
    if (pct >= UNLOCK_THRESHOLD && !unlockedRef.current) {
      unlockedRef.current = true
      setPhase('unlocked')
    }
  }, [])

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current
      if (!canvas || unlockedRef.current) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(clientX, clientY, BRUSH_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'

      const now = performance.now()
      if (now - lastSampleRef.current > 120) {
        lastSampleRef.current = now
        sampleProgress()
      }
    },
    [sampleProgress],
  )

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      scratchAt(e.clientX, e.clientY)
    },
    [scratchAt],
  )

  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      scratchAt(t.clientX, t.clientY)
    },
    [scratchAt],
  )

  const handleEnter = useCallback(() => {
    setPhase('entering')
    window.setTimeout(onEnter, 650)
  }, [onEnter])

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-background transition-opacity duration-500 ${
        phase === 'entering' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-label="Intro scratch card"
    >
      {/* Bottom layer: the reveal (black) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          className={`flex flex-col items-center transition-all duration-700 ${
            phase === 'unlocked' || phase === 'entering'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          }`}
        >
          <PartyPopper className="mb-6 size-16 text-primary" aria-hidden="true" />
          <h2 className="text-balance text-4xl font-black tracking-tight text-primary md:text-6xl">
            恭喜成为我的天使投资人
          </h2>
          <p className="mt-3 text-pretty text-xl font-bold text-primary md:text-3xl">
            Congratulations on becoming my angel investor
          </p>
          <button
            type="button"
            onClick={handleEnter}
            className={`mt-12 bg-primary px-10 py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 ${
              phase === 'unlocked' ? 'animate-bounce' : ''
            }`}
          >
            {'\u2193'} Enter Website {'\u2193'}
          </button>
        </div>
      </div>

      {/* Typing intro (DOM) — visible before the scratch canvas is painted */}
      {phase === 'typing' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: SPLASH_PINK }}
        >
          <span className="text-5xl font-bold text-white md:text-7xl">{typed[0]}</span>
          <span className="mt-2 text-6xl font-extrabold leading-none tracking-tight text-white md:text-[9.5rem]">
            {typed[1]}
            <span className="ml-1 inline-block w-[3px] animate-pulse self-stretch bg-white align-middle">
              &nbsp;
            </span>
          </span>
          <span className="mt-4 text-3xl font-bold text-white md:text-5xl">{typed[2]}</span>
          <span
            className={`mt-6 text-xl font-medium text-white/90 transition-opacity duration-500 md:text-3xl ${
              showSub ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Welcome to my personal website
          </span>
        </div>
      )}

      {/* Scratch canvas layer */}
      {(phase === 'scratch' || phase === 'unlocked') && (
        <canvas
          ref={canvasRef}
          onMouseMove={handleMove}
          onTouchMove={handleTouch}
          className={`absolute inset-0 touch-none transition-opacity duration-700 ${
            phase === 'unlocked' ? 'pointer-events-none opacity-0' : 'cursor-none opacity-100'
          }`}
        />
      )}

      {/* Follow dot for the scratch cursor */}
      {phase === 'scratch' && (
        <div
          ref={dotRef}
          className="pointer-events-none absolute left-0 top-0 -ml-3 -mt-3 size-6 rounded-full border-2 border-white/80 bg-white/20"
          aria-hidden="true"
        />
      )}

      {/* Hint / progress */}
      {(phase === 'scratch' || phase === 'typing') && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-background">
            Move your mouse to scratch
          </p>
          <p className="font-mono text-xs text-background/70">Scratched: {percent}%</p>
        </div>
      )}
    </div>
  )
}
