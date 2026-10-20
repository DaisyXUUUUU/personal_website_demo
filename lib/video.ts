export type VideoSource =
  | { kind: 'embed'; src: string }
  | { kind: 'file'; src: string }

/** Turns a pasted YouTube, Vimeo, Bilibili or direct video link into something the site can play. */
export function resolveVideo(url: string | undefined, autoplay = false): VideoSource | null {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\.|^m\./, '')
  const play = autoplay ? '1' : '0'

  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id = host === 'youtu.be'
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v') ?? parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1]
    if (id && /^[\w-]{6,}$/.test(id)) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=${play}&rel=0&modestbranding=1` }
  }

  if (host.endsWith('vimeo.com')) {
    const id = parsed.pathname.match(/(\d{6,})/)?.[1]
    if (id) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}?autoplay=${play}&title=0&byline=0` }
  }

  if (host.endsWith('bilibili.com')) {
    const id = parsed.pathname.match(/\/video\/(BV[\w]+)/)?.[1]
    if (id) return { kind: 'embed', src: `https://player.bilibili.com/player.html?bvid=${id}&autoplay=${play}&high_quality=1` }
  }

  if (host === 'loom.com') {
    const id = parsed.pathname.match(/\/(?:share|embed)\/([\w]+)/)?.[1]
    if (id) return { kind: 'embed', src: `https://www.loom.com/embed/${id}?autoplay=${autoplay}` }
  }

  if (/\.(mp4|webm|mov)$/i.test(parsed.pathname)) return { kind: 'file', src: url }
  return null
}
