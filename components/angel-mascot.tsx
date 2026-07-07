'use client'

import { useEffect, useRef } from 'react'

/**
 * A cute pink "angel blob" mascot that peeks from the bottom-center of the
 * screen. Its pupils smoothly track the user's mouse across the page.
 * Colors are tuned to the dark splash background + pink brand color.
 */
export function AngelMascot({ active }: { active: boolean }) {
  const leftPupilRef = useRef<SVGGElement | null>(null)
  const rightPupilRef = useRef<SVGGElement | null>(null)
  const leftEyeRef = useRef<SVGCircleElement | null>(null)
  const rightEyeRef = useRef<SVGCircleElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Max distance (in screen px) at which the pupils reach full deflection.
    const REACH = 520
    // Max pupil travel inside the eye, in SVG user units.
    const MAX_TRAVEL = 9

    let raf = 0
    const target = { lx: 0, ly: 0, rx: 0, ry: 0 }
    const current = { lx: 0, ly: 0, rx: 0, ry: 0 }

    const computeFor = (eye: SVGCircleElement | null, mx: number, my: number) => {
      if (!eye) return { x: 0, y: 0 }
      const rect = eye.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mx - cx
      const dy = my - cy
      const dist = Math.hypot(dx, dy) || 1
      const strength = Math.min(dist / REACH, 1)
      const angle = Math.atan2(dy, dx)
      return {
        x: Math.cos(angle) * MAX_TRAVEL * strength,
        y: Math.sin(angle) * MAX_TRAVEL * strength,
      }
    }

    const onMove = (e: MouseEvent) => {
      const l = computeFor(leftEyeRef.current, e.clientX, e.clientY)
      const r = computeFor(rightEyeRef.current, e.clientX, e.clientY)
      target.lx = l.x
      target.ly = l.y
      target.rx = r.x
      target.ry = r.y
    }

    const tick = () => {
      // Ease toward the target for smooth, springy tracking.
      const ease = 0.18
      current.lx += (target.lx - current.lx) * ease
      current.ly += (target.ly - current.ly) * ease
      current.rx += (target.rx - current.rx) * ease
      current.ry += (target.ry - current.ry) * ease
      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute(
          'transform',
          `translate(${current.lx.toFixed(2)} ${current.ly.toFixed(2)})`,
        )
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute(
          'transform',
          `translate(${current.rx.toFixed(2)} ${current.ry.toFixed(2)})`,
        )
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [active])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[60] flex justify-center transition-all duration-700 ease-out ${
        active ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <svg
        width="360"
        height="240"
        viewBox="0 0 360 240"
        className="drop-shadow-[0_0_28px_rgba(233,75,125,0.45)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="blobFill" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ff7db0" />
            <stop offset="60%" stopColor="#f0518a" />
            <stop offset="100%" stopColor="#d63b74" />
          </radialGradient>
          <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9e8" />
            <stop offset="100%" stopColor="#ff9ec4" />
          </radialGradient>
        </defs>

        {/* Halo */}
        <ellipse
          cx="180"
          cy="30"
          rx="62"
          ry="15"
          fill="none"
          stroke="url(#haloGlow)"
          strokeWidth="7"
          className="animate-pulse"
        />

        {/* Sparkles */}
        <path d="M262 44 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#ffb3d1" opacity="0.9" />
        <path d="M96 58 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#ffb3d1" opacity="0.8" />

        {/* Left wing */}
        <g>
          <path
            d="M96 150 C60 120 26 128 20 158 C44 150 58 156 66 172 C48 172 40 182 38 196 C64 186 84 190 104 178 Z"
            fill="#fff0f6"
            stroke="#ffc3dc"
            strokeWidth="2.5"
          />
        </g>
        {/* Right wing */}
        <g>
          <path
            d="M264 150 C300 120 334 128 340 158 C316 150 302 156 294 172 C312 172 320 182 322 196 C296 186 276 190 256 178 Z"
            fill="#fff0f6"
            stroke="#ffc3dc"
            strokeWidth="2.5"
          />
        </g>

        {/* Horns */}
        <path d="M132 96 C124 70 128 58 140 52 C138 70 146 82 156 92 Z" fill="url(#blobFill)" />
        <path d="M228 96 C236 70 232 58 220 52 C222 70 214 82 204 92 Z" fill="url(#blobFill)" />

        {/* Blob head/body — bottom-anchored so only the top peeks in */}
        <path
          d="M40 240 C40 150 96 96 180 96 C264 96 320 150 320 240 Z"
          fill="url(#blobFill)"
        />

        {/* Eyes (whites) */}
        <circle ref={leftEyeRef} cx="146" cy="168" r="30" fill="#ffffff" />
        <circle ref={rightEyeRef} cx="214" cy="168" r="30" fill="#ffffff" />

        {/* Left pupil group (tracks mouse) */}
        <g ref={leftPupilRef}>
          <circle cx="146" cy="170" r="17" fill="#1a1014" />
          <circle cx="140" cy="163" r="5.5" fill="#ffffff" />
        </g>
        {/* Right pupil group (tracks mouse) */}
        <g ref={rightPupilRef}>
          <circle cx="214" cy="170" r="17" fill="#1a1014" />
          <circle cx="208" cy="163" r="5.5" fill="#ffffff" />
        </g>

        {/* Blush */}
        <ellipse cx="108" cy="200" rx="12" ry="7" fill="#ff5c97" opacity="0.55" />
        <ellipse cx="252" cy="200" rx="12" ry="7" fill="#ff5c97" opacity="0.55" />

        {/* Smile */}
        <path
          d="M168 206 C176 216 184 216 192 206"
          fill="none"
          stroke="#1a1014"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Fangs */}
        <path d="M172 208 l3 8 3 -8 z" fill="#ffffff" />
        <path d="M185 208 l3 8 3 -8 z" fill="#ffffff" />
      </svg>
    </div>
  )
}
