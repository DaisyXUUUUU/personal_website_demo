export function ExperienceGlobeFallback() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] px-2 sm:px-0">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(241,96,154,0.34),rgba(241,96,154,0)_70%)] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_42%_28%,rgba(255,255,255,0.14),rgba(255,255,255,0)_35%)]" aria-hidden />

      <div className="globe-float relative mx-auto aspect-square w-full max-w-[560px]">
        <div className="globe-shell absolute inset-[6%] rounded-full" />
        <div className="globe-rim absolute inset-[6%] rounded-full" />
        <div className="globe-glow absolute inset-[6%] rounded-full" />
        <div className="globe-shadow absolute inset-[6%] rounded-full" />
        <div className="globe-highlight absolute inset-[6%] rounded-full" />

        <div className="map-frame absolute inset-[8%] rounded-full" aria-hidden>
          <svg className="map-svg absolute inset-0 h-full w-full" viewBox="0 0 100 100" role="img" aria-label="Simplified East Asia dotted map">
            <defs>
              <radialGradient id="eastAsiaDotGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#ffb1da" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#f1609a" stopOpacity="0.28" />
              </radialGradient>
              <radialGradient id="eastAsiaDepth" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#ffbfe3" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#f1609a" stopOpacity="0.04" />
              </radialGradient>

              <pattern id="dotPatternMain" width="4.2" height="4.2" patternUnits="userSpaceOnUse">
                <circle cx="1.4" cy="1.3" r="0.8" fill="url(#eastAsiaDotGlow)" />
              </pattern>
              <pattern id="dotPatternSecondary" width="5.2" height="5.2" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.1" r="0.72" fill="#f48f63" fillOpacity="0.78" />
              </pattern>
              <pattern id="dotPatternAccent" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="1.7" cy="1.3" r="0.66" fill="#8b5cf6" fillOpacity="0.78" />
              </pattern>

              <clipPath id="chinaMainClip" clipPathUnits="userSpaceOnUse">
                <path d="M32 30 L39 25 L47 23 L55 24 L60 28 L64 34 L65 40 L64 46 L62 51 L58 55 L53 59 L47 62 L42 64 L37 65 L33 62 L30 57 L29 51 L28 45 L29 38 L30 33 Z" />
              </clipPath>
              <clipPath id="eastCoastClip" clipPathUnits="userSpaceOnUse">
                <path d="M56 28 L62 30 L65 35 L66 40 L65 45 L63 49 L61 53 L58 56 L55 58 L53 56 L54 50 L55 44 L55 38 L55 33 Z" />
              </clipPath>
              <clipPath id="koreaJapanClip" clipPathUnits="userSpaceOnUse">
                <path d="M67 29 L71 28 L74 31 L75 35 L73 38 L71 40 L69 42 L67 40 L66 36 L66 32 Z M76 36 L80 37 L82 40 L81 43 L78 45 L76 43 L75 40 Z" />
              </clipPath>
              <clipPath id="seaClip" clipPathUnits="userSpaceOnUse">
                <path d="M46 61 L51 60 L56 61 L60 64 L62 69 L61 73 L58 76 L53 77 L48 75 L45 71 L44 66 Z" />
              </clipPath>
            </defs>

            <circle cx="50" cy="50" r="44" fill="url(#eastAsiaDepth)" opacity="0.5" />

            <g opacity="0.95">
              <rect x="0" y="0" width="100" height="100" fill="url(#dotPatternMain)" clipPath="url(#chinaMainClip)" />
              <rect x="0" y="0" width="100" height="100" fill="url(#dotPatternSecondary)" opacity="0.78" clipPath="url(#eastCoastClip)" />
              <rect x="0" y="0" width="100" height="100" fill="url(#dotPatternAccent)" opacity="0.78" clipPath="url(#koreaJapanClip)" />
              <rect x="0" y="0" width="100" height="100" fill="url(#dotPatternSecondary)" opacity="0.38" clipPath="url(#seaClip)" />
            </g>

            <path
              d="M32 30 L39 25 L47 23 L55 24 L60 28 L64 34 L65 40 L64 46 L62 51 L58 55 L53 59 L47 62 L42 64 L37 65 L33 62 L30 57 L29 51 L28 45 L29 38 L30 33 Z"
              fill="none"
              stroke="rgba(255,170,214,0.18)"
              strokeWidth="0.8"
            />
            <path
              d="M67 29 L71 28 L74 31 L75 35 L73 38 L71 40 L69 42 L67 40 L66 36 L66 32 Z M76 36 L80 37 L82 40 L81 43 L78 45 L76 43 L75 40 Z"
              fill="none"
              stroke="rgba(255,170,214,0.14)"
              strokeWidth="0.8"
            />
            <path
              d="M46 61 L51 60 L56 61 L60 64 L62 69 L61 73 L58 76 L53 77 L48 75 L45 71 L44 66 Z"
              fill="none"
              stroke="rgba(255,170,214,0.1)"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        <div className="absolute inset-[8%] rounded-full border border-white/10 shadow-[inset_24px_18px_48px_rgba(255,190,225,0.08),inset_-42px_-56px_80px_rgba(7,3,9,0.58)]" aria-hidden />

        <div className="city-label city-shanghai" style={{ ['--city-color' as string]: '#f48f63' }}>
          <span className="city-pin" />
          <span className="city-line" />
          <span className="city-pill">Shanghai</span>
        </div>

        <div className="city-label city-ningbo" style={{ ['--city-color' as string]: '#f1609a' }}>
          <span className="city-pin" />
          <span className="city-line" />
          <span className="city-pill">Ningbo</span>
        </div>

        <div className="city-label city-hangzhou" style={{ ['--city-color' as string]: '#8b5cf6' }}>
          <span className="city-pin" />
          <span className="city-line" />
          <span className="city-pill">Hangzhou</span>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.34em] text-hero-pink/80">
        DRAG TO ROTATE GLOBE
      </p>

      <style jsx>{`
        .globe-float {
          animation: globe-float 8s ease-in-out infinite;
        }

        .globe-shell {
          background:
            radial-gradient(circle at 34% 26%, rgba(255, 236, 247, 0.28), rgba(255, 236, 247, 0) 22%),
            radial-gradient(circle at 50% 48%, rgba(77, 28, 72, 0.42), rgba(20, 10, 21, 0.8) 58%, rgba(10, 6, 11, 0.95) 100%);
          box-shadow:
            inset 0 0 0 1px rgba(255, 166, 210, 0.18),
            inset 0 24px 46px rgba(255, 210, 233, 0.08),
            inset -38px -54px 74px rgba(0, 0, 0, 0.6);
        }

        .globe-rim {
          border: 1px solid rgba(255, 145, 200, 0.42);
          box-shadow:
            0 0 20px rgba(255, 113, 186, 0.42),
            0 0 46px rgba(255, 96, 154, 0.18),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          -webkit-mask-image: radial-gradient(circle at center, transparent 0 72%, black 74%);
          mask-image: radial-gradient(circle at center, transparent 0 72%, black 74%);
          animation: rim-shimmer 8s ease-in-out infinite;
        }

        .globe-glow {
          background: radial-gradient(circle at 50% 50%, rgba(241, 96, 154, 0.12), rgba(241, 96, 154, 0) 60%);
          filter: blur(10px);
          opacity: 0.8;
        }

        .globe-shadow {
          background: radial-gradient(circle at 72% 78%, rgba(8, 4, 11, 0) 46%, rgba(6, 3, 8, 0.48) 78%, rgba(6, 3, 8, 0.74) 100%);
        }

        .globe-highlight {
          background: radial-gradient(circle at 36% 26%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 26%);
          mix-blend-mode: screen;
        }

        .map-frame {
          overflow: hidden;
          border-radius: 9999px;
        }

        .map-svg {
          filter: drop-shadow(0 0 4px rgba(255, 115, 180, 0.16));
        }

        .city-label {
          position: absolute;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          transform: translate(-50%, -50%);
        }

        .city-label::before {
          content: '';
          position: absolute;
          inset: -0.8rem -1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.02);
          filter: blur(10px);
          z-index: -1;
        }

        .city-pin {
          width: 0.58rem;
          height: 0.58rem;
          border-radius: 9999px;
          flex: 0 0 auto;
          background: var(--city-color);
          box-shadow: 0 0 0 0.18rem rgba(255, 255, 255, 0.05), 0 0 18px var(--city-color);
          animation: pin-pulse 2.5s ease-in-out infinite;
          position: relative;
        }

        .city-pin::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0.24rem;
          height: 0.24rem;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.92);
        }

        .city-line {
          width: clamp(1.2rem, 2.6vw, 2rem);
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.04));
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.12);
        }

        .city-pill {
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          color: rgba(255, 255, 255, 0.97);
          font-size: clamp(0.88rem, 1.5vw, 1.03rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.01em;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(180deg, color-mix(in srgb, var(--city-color) 95%, white 5%), color-mix(in srgb, var(--city-color) 78%, black 22%));
        }

        .city-shanghai {
          left: 72%;
          top: 41.5%;
          --city-color: #f48f63;
        }

        .city-ningbo {
          left: 73%;
          top: 46%;
          --city-color: #f1609a;
        }

        .city-hangzhou {
          left: 71%;
          top: 50.8%;
          --city-color: #8b5cf6;
        }

        @keyframes globe-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes rim-shimmer {
          0%,
          100% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pin-pulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.22);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .globe-float,
          .city-pin,
          .globe-rim {
            animation: none !important;
          }
        }

        @media (max-width: 768px) {
          .city-shanghai {
            left: 70.5%;
          }

          .city-ningbo {
            left: 71.5%;
          }

          .city-hangzhou {
            left: 69.5%;
          }
        }
      `}</style>
    </div>
  )
}
