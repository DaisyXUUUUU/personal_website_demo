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

        <div className="image-plate absolute inset-[8%] overflow-hidden rounded-full" aria-hidden>
          <img
            src="/images/earth.png"
            alt="Rendered globe"
            className="globe-image h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-[8%] rounded-full border border-white/10 shadow-[inset_24px_18px_48px_rgba(255,190,225,0.08),inset_-42px_-56px_80px_rgba(7,3,9,0.58)]" aria-hidden />
      </div>

      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.34em] text-hero-pink/80">
        DRAG TO ROTATE GLOBE
      </p>

      <style jsx>{`
        .globe-float {
          animation: globe-float 8s ease-in-out infinite;
        }

        .globe-float {
          animation: globe-float 7.5s ease-in-out infinite;
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

        .image-plate {
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 26px 50px rgba(255, 210, 233, 0.06);
        }

        .globe-image {
          animation: globe-bob 4.8s ease-in-out infinite;
          transform-origin: center;
          filter: drop-shadow(0 0 18px rgba(255, 123, 185, 0.26));
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

        @keyframes globe-bob {
          0%,
          100% {
            transform: translateY(0px) scale(1.01);
          }
          50% {
            transform: translateY(-4px) scale(1.01);
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
          .globe-image,
          .globe-rim {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
