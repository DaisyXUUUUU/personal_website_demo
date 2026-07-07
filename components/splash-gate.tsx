'use client'

import { useState } from 'react'
import { ScratchSplash } from '@/components/scratch-splash'

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)

  return (
    <>
      {!entered && <ScratchSplash onEnter={() => setEntered(true)} />}
      {children}
    </>
  )
}
