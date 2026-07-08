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

        <div className="map-drift absolute inset-[8%] rounded-full" aria-hidden>
          <div className="map-layer map-layer-main absolute inset-0 rounded-full" />
          <div className="map-layer map-layer-secondary absolute inset-0 rounded-full" />
          <div className="map-layer map-layer-depth absolute inset-0 rounded-full" />
        </div>

        <div className="absolute inset-[8%] rounded-full border border-white/10 shadow-[inset_24px_18px_48px_rgba(255,190,225,0.08),inset_-42px_-56px_80px_rgba(7,3,9,0.58)]" aria-hidden />

        <div className="location-label location-ningbo">
          <span className="location-pin location-pin-ningbo" />
          <span className="location-line" />
          <span className="location-pill location-pill-ningbo">Ningbo</span>
        </div>

        <div className="location-label location-shanghai">
          <span className="location-pin location-pin-shanghai" />
          <span className="location-line" />
          <span className="location-pill location-pill-shanghai">Shanghai</span>
        </div>

        <div className="location-label location-hangzhou">
          <span className="location-pin location-pin-hangzhou" />
          <span className="location-line" />
          <span className="location-pill location-pill-hangzhou">Hangzhou</span>
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

        .map-drift {
          animation: map-drift 24s ease-in-out infinite;
          transform-origin: 50% 50%;
        }

        .map-layer {
          opacity: 0.95;
          background-repeat: repeat;
          background-size: 10px 10px;
          filter: drop-shadow(0 0 2px rgba(255, 115, 180, 0.14));
        }

        .map-layer-main {
          background-image: radial-gradient(circle, rgba(255, 138, 198, 0.86) 0 1.35px, transparent 1.85px);
          -webkit-clip-path: polygon(17% 19%, 25% 15%, 31% 11%, 39% 13%, 47% 16%, 54% 21%, 59% 28%, 63% 36%, 63% 44%, 60% 49%, 56% 54%, 50% 58%, 44% 63%, 39% 68%, 34% 76%, 31% 84%, 25% 81%, 21% 73%, 19% 64%, 17% 56%, 16% 46%, 15% 35%);
          clip-path: polygon(17% 19%, 25% 15%, 31% 11%, 39% 13%, 47% 16%, 54% 21%, 59% 28%, 63% 36%, 63% 44%, 60% 49%, 56% 54%, 50% 58%, 44% 63%, 39% 68%, 34% 76%, 31% 84%, 25% 81%, 21% 73%, 19% 64%, 17% 56%, 16% 46%, 15% 35%);
        }

        .map-layer-secondary {
          background-image: radial-gradient(circle, rgba(255, 117, 182, 0.82) 0 1.25px, transparent 1.8px);
          background-size: 11px 11px;
          opacity: 0.82;
          -webkit-clip-path: polygon(55% 71%, 61% 68%, 66% 69%, 70% 73%, 72% 79%, 71% 85%, 68% 90%, 63% 93%, 57% 92%, 53% 87%, 51% 81%);
          clip-path: polygon(55% 71%, 61% 68%, 66% 69%, 70% 73%, 72% 79%, 71% 85%, 68% 90%, 63% 93%, 57% 92%, 53% 87%, 51% 81%);
        }

        .map-layer-depth {
          background-image: radial-gradient(circle, rgba(255, 164, 216, 0.26) 0 1.2px, transparent 1.8px);
          background-size: 14px 14px;
          opacity: 0.55;
          -webkit-clip-path: polygon(24% 24%, 34% 20%, 44% 19%, 52% 24%, 58% 32%, 59% 42%, 56% 51%, 49% 58%, 40% 63%, 32% 65%, 26% 60%, 22% 51%, 21% 41%, 22% 31%);
          clip-path: polygon(24% 24%, 34% 20%, 44% 19%, 52% 24%, 58% 32%, 59% 42%, 56% 51%, 49% 58%, 40% 63%, 32% 65%, 26% 60%, 22% 51%, 21% 41%, 22% 31%);
        }

        .location-label {
          position: absolute;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transform: translate(-50%, -50%);
        }

        .location-label::before {
          content: '';
          position: absolute;
          inset: -0.8rem -1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.02);
          filter: blur(10px);
          z-index: -1;
        }

        .location-label::after {
          content: '';
          position: absolute;
          width: 0.35rem;
          height: 0.35rem;
          border-radius: 9999px;
          background: currentColor;
          box-shadow: 0 0 12px currentColor;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
        }

        .location-line {
          width: clamp(1.5rem, 4vw, 2.75rem);
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.02));
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.18);
        }

        .location-pill {
          border-radius: 9999px;
          padding: 0.55rem 1.05rem;
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(0.9rem, 1.7vw, 1.05rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.01em;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .location-pin {
          width: 0.58rem;
          height: 0.58rem;
          border-radius: 9999px;
          flex: 0 0 auto;
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.05), 0 0 18px currentColor;
          animation: pin-pulse 2.5s ease-in-out infinite;
        }

        .location-pin-ningbo,
        .location-pill-ningbo {
          color: #f1609a;
          background: linear-gradient(180deg, rgba(241, 96, 154, 0.98), rgba(190, 56, 118, 0.94));
        }

        .location-pin-shanghai,
        .location-pill-shanghai {
          color: #f48f63;
          background: linear-gradient(180deg, rgba(244, 143, 99, 0.98), rgba(189, 94, 56, 0.94));
        }

        .location-pin-hangzhou,
        .location-pill-hangzhou {
          color: #8b5cf6;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.98), rgba(100, 65, 198, 0.94));
        }

        .location-ningbo {
          left: 68%;
          top: 42%;
          color: #f1609a;
        }

        .location-shanghai {
          left: 69%;
          top: 50%;
          color: #f48f63;
        }

        .location-hangzhou {
          left: 68%;
          top: 58%;
          color: #8b5cf6;
        }

        .location-ningbo .location-pill,
        .location-shanghai .location-pill,
        .location-hangzhou .location-pill {
          backdrop-filter: blur(10px);
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

        @keyframes map-drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(0.5%, -0.4%, 0) rotate(1.8deg) scale(1.012);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
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
          .map-drift,
          .location-pin,
          .globe-rim {
            animation: none !important;
          }
        }

        @media (max-width: 768px) {
          .location-ningbo {
            left: 64%;
            top: 40%;
          }

          .location-shanghai {
            left: 66%;
            top: 50%;
          }

          .location-hangzhou {
            left: 65%;
            top: 60%;
          }
        }
      `}</style>
    </div>
  )
}
