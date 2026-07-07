/**
 * A fixed, full-viewport grain/noise texture rendered from an inline SVG
 * feTurbulence filter. It sits above the page gradients but ignores pointer
 * events, adding a subtle tactile texture that removes the flat "solid block"
 * feel without changing the underlying colors.
 */
const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#n)"/>
  </svg>`,
)

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-soft-light"
      style={{
        backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
        backgroundSize: '160px 160px',
      }}
    />
  )
}
