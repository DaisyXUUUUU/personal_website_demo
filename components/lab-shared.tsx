'use client'

import { useEffect } from 'react'
import { ArrowUpRight, CodeXml, Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { LabItem } from '@/lib/site-content'
import { resolveVideo } from '@/lib/video'

export function labHost(url?: string) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

/** A fake browser window around the project cover; falls back to a generated poster when no image exists. */
export function BrowserFrame({ item, className = '' }: { item: LabItem; className?: string }) {
  const host = labHost(item.demoUrl) ?? `${item.slug}.prototype`
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/15 bg-[#1d121b] shadow-[0_30px_80px_-20px_rgba(222,89,143,0.35)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white/8 px-3 py-1 font-mono text-[11px] text-hero-card/60">
          https://{host}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.cover ? (
          <img src={item.cover} alt={`${item.title} preview`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <GeneratedPoster item={item} />
        )}
      </div>
    </div>
  )
}

function GeneratedPoster({ item }: { item: LabItem }) {
  return (
    <div className="lab-poster flex h-full w-full flex-col justify-between p-5 sm:p-7">
      <span className="w-fit rounded-full border border-hero-card/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-hero-card/80">
        {item.tags[0] ?? 'Prototype'}
      </span>
      <p className="max-w-[90%] text-balance text-2xl font-black leading-[0.95] tracking-tighter text-hero-card sm:text-4xl">
        {item.title}
      </p>
    </div>
  )
}

export function LabLinks({ item, onWatch, compact = false }: { item: LabItem; onWatch?: () => void; compact?: boolean }) {
  const hasVideo = Boolean(resolveVideo(item.videoUrl))
  const size = compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
  return (
    <div className="flex flex-wrap gap-2">
      {hasVideo && onWatch && (
        <button type="button" onClick={onWatch} className={`inline-flex items-center gap-2 rounded-full bg-hero-pink font-black text-hero-ink transition-transform hover:-translate-y-0.5 ${size}`}>
          <Play className="size-4 fill-current" /> Watch walkthrough
        </button>
      )}
      {item.demoUrl && (
        <a href={item.demoUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full border border-hero-pink font-black text-hero-pink transition-colors hover:bg-hero-pink hover:text-hero-ink ${size}`}>
          Live demo <ArrowUpRight className="size-4" />
        </a>
      )}
      {item.repoUrl && (
        <a href={item.repoUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full border border-hero-card/30 font-black text-hero-card/85 transition-colors hover:border-hero-card hover:text-hero-card ${size}`}>
          <CodeXml className="size-4" /> GitHub
        </a>
      )}
    </div>
  )
}

export function VideoPlayer({ url, autoplay = false, title }: { url?: string; autoplay?: boolean; title: string }) {
  const video = resolveVideo(url, autoplay)
  if (!video) return null
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      {video.kind === 'embed' ? (
        <iframe
          src={video.src}
          title={`${title} walkthrough`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <video src={video.src} controls autoPlay={autoplay} playsInline className="absolute inset-0 h-full w-full" />
      )}
    </div>
  )
}

export function VideoModal({ item, onClose }: { item: LabItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} walkthrough`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-5xl"
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-hero-card">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-widest text-hero-pink">2-min walkthrough</p>
                <p className="truncate text-lg font-black">{item.title}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close video" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-hero-card/40 transition-colors hover:bg-hero-card hover:text-hero-ink">
                <X className="size-5" />
              </button>
            </div>
            <VideoPlayer url={item.videoUrl} autoplay title={item.title} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
