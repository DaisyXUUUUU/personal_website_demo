'use client'

import { useEffect, useRef } from 'react'

/**
 * Pink "angel monster" mascot that peeks from the bottom-center of the screen.
 * Uses the provided artwork (with hollow white eyes) and overlays two black
 * pupils that smoothly track the user's mouse across the page.
 *
 * Eye centers are expressed as a percentage of the artwork box so the pupils
 * stay aligned at any size.
 */
const EYES = {
  left: { x: 37, y: 65 }, // % of the artwork box
  right: { x: 62.6, y: 65.5 },
}

export function AngelMascot({ active }: { active: boolean }) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const leftPupilRef = useRef<HTMLDivElement | null>(null)
  const rightPupilRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active) return

    let raf = 0
    const target = { lx: 0, ly: 0, rx: 0, ry: 0 }
    const current = { lx: 0, ly: 0, rx: 0, ry: 0 }
    // How far (screen px) the mouse must be for full pupil deflection.
    const REACH = 560

    const computeFor = (eye: { x: number; y: number }, mx: number, my: number) => {
      const box = boxRef.current
      if (!box) return { x: 0, y: 0 }
      const rect = box.getBoundingClientRect()
      const cx = rect.left + (rect.width * eye.x) / 100
      const cy = rect.top + (rect.height * eye.y) / 100
      // Pupil travel scales with artwork size (radius of the white eye ~7%).
      const maxTravel = rect.width * 0.03
      const dx = mx - cx
      const dy = my - cy
      const dist = Math.hypot(dx, dy) || 1
      const strength = Math.min(dist / REACH, 1)
      const angle = Math.atan2(dy, dx)
      return {
        x: Math.cos(angle) * maxTravel * strength,
        y: Math.sin(angle) * maxTravel * strength,
      }
    }

    const onMove = (e: MouseEvent) => {
      const l = computeFor(EYES.left, e.clientX, e.clientY)
      const r = computeFor(EYES.right, e.clientX, e.clientY)
      target.lx = l.x
      target.ly = l.y
      target.rx = r.x
      target.ry = r.y
    }

    const tick = () => {
      const ease = 0.16
      current.lx += (target.lx - current.lx) * ease
      current.ly += (target.ly - current.ly) * ease
      current.rx += (target.rx - current.rx) * ease
      current.ry += (target.ry - current.ry) * ease
      if (leftPupilRef.current) {
        leftPupilRef.current.style.transform = `translate(calc(-50% + ${current.lx.toFixed(1)}px), calc(-50% + ${current.ly.toFixed(1)}px))`
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.style.transform = `translate(calc(-50% + ${current.rx.toFixed(1)}px), calc(-50% + ${current.ry.toFixed(1)}px))`
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
        active ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
      }`}
    >
      <div
        ref={boxRef}
        className="relative drop-shadow-[0_0_60px_rgba(233,75,125,0.4)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/angel-mascot.png"
          alt=""
          className="block h-[30vh] w-auto max-w-[96vw] select-none"
          draggable={false}
        />

        {/* Left pupil */}
        <div
          ref={leftPupilRef}
          className="absolute rounded-full bg-[#160d11]"
          style={{
            left: `${EYES.left.x}%`,
            top: `${EYES.left.y}%`,
            width: '6.2%',
            aspectRatio: '1',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="absolute left-[22%] top-[18%] h-[28%] w-[28%] rounded-full bg-white" />
        </div>

        {/* Right pupil */}
        <div
          ref={rightPupilRef}
          className="absolute rounded-full bg-[#160d11]"
          style={{
            left: `${EYES.right.x}%`,
            top: `${EYES.right.y}%`,
            width: '6.2%',
            aspectRatio: '1',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="absolute left-[22%] top-[18%] h-[28%] w-[28%] rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}
