'use client'

import { useEffect, useState } from 'react'
import { ScratchSplash } from '@/components/scratch-splash'

const ENTERED_KEY = 'ziyue-entered'

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)

  // Visitors returning from a case study page skip the splash for the rest of the session.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ENTERED_KEY)) setEntered(true)
    } catch {}
  }, [])

  // Content mounts only after the splash, so jump to a requested anchor (e.g. /#lab) once it exists.
  useEffect(() => {
    if (!entered || !window.location.hash) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [entered])

  const enter = () => {
    try {
      window.sessionStorage.setItem(ENTERED_KEY, '1')
    } catch {}
    setEntered(true)
  }

  return (
    <>
      {!entered && <ScratchSplash onEnter={enter} />}
      {entered ? children : null}
    </>
  )
}
