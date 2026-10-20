'use client'

import { ArrowUpRight, CodeXml } from 'lucide-react'
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

/**
 * A fake browser window around the project. It plays the walkthrough video when one is set,
 * otherwise shows the cover image, falling back to a generated poster.
 */
export function BrowserFrame({ item, className = '', playVideo = true }: { item: LabItem; className?: string; playVideo?: boolean }) {
  const video = playVideo ? resolveVideo(item.videoUrl) : null
  const host = labHost(item.demoUrl) ?? `${item.slug}.prototype`
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/15 bg-[#1d121b] shadow-[0_30px_80px_-20px_rgba(222,89,143,0.35)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white/8 px-3 py-1 font-mono text-[11px] text-hero-card/60">
          https://{host}
        </span>
      </div>
      {video ? (
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {video.kind === 'embed' ? (
            <iframe
              src={video.src}
              title={`${item.title} walkthrough`}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <video src={video.src} poster={item.cover || undefined} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full" />
          )}
        </div>
      ) : (
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.cover ? (
          <img src={item.cover} alt={`${item.title} preview`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <GeneratedPoster item={item} />
        )}
      </div>
      )}
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

export function LabLinks({ item, compact = false }: { item: LabItem; compact?: boolean }) {
  const size = compact ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
  return (
    <div className="flex flex-wrap gap-2">
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
