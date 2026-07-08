export function ExperienceGlobeFallback() {
  return (
    <div className="relative mx-auto w-[92%] max-w-[620px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_52%_at_50%_48%,rgba(241,96,154,0.34),rgba(241,96,154,0)_72%)] blur-2xl" />

      <div className="globe-float relative mx-auto aspect-square w-full max-w-[560px]">
        <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_36%_26%,rgba(255,227,243,0.26),rgba(77,28,72,0.34)_44%,rgba(17,9,18,0.7)_100%)]" />
        <div className="absolute inset-[6%] rounded-full border border-[#ff94c9]/45 shadow-[0_0_26px_rgba(255,113,186,0.62)]" />
        <div className="absolute inset-[8%] rounded-full border border-white/12" />
        <div className="absolute inset-[6%] rounded-full shadow-[inset_-42px_-56px_70px_rgba(7,3,9,0.62),inset_26px_18px_52px_rgba(255,181,221,0.13)]" />

        <div className="map-drift absolute inset-[8%] rounded-full">
          <div className="absolute inset-0 rounded-full opacity-95 [background:radial-gradient(circle,rgba(255,133,194,0.92)_0_1.4px,transparent_1.8px)] [background-size:8px_8px] [clip-path:polygon(18%_20%,32%_10%,46%_14%,57%_24%,63%_35%,62%_45%,55%_53%,49%_57%,43%_63%,38%_68%,35%_76%,31%_84%,24%_79%,21%_70%,19%_60%,17%_52%,16%_42%)]" />
          <div className="absolute inset-0 rounded-full opacity-95 [background:radial-gradient(circle,rgba(255,116,180,0.9)_0_1.35px,transparent_1.8px)] [background-size:8px_8px] [clip-path:polygon(52%_72%,57%_68%,64%_68%,69%_74%,71%_81%,70%_88%,64%_94%,58%_92%,53%_86%)]" />
        </div>

        <div className="absolute left-[66%] top-[42%] z-20 flex items-center gap-2">
          <span className="pin-pulse size-2 rounded-full bg-[#f1609a] shadow-[0_0_10px_rgba(241,96,154,0.95)]" />
          <span className="h-px w-8 bg-white/35" />
          <span className="rounded-full bg-[#f1609a] px-4 py-2 text-lg font-black leading-none text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] md:text-xl">
            Ningbo
          </span>
        </div>

        <div className="absolute left-[68%] top-[50%] z-20 flex items-center gap-2">
          <span className="pin-pulse size-2 rounded-full bg-[#f48f63] shadow-[0_0_10px_rgba(244,143,99,0.95)]" />
          <span className="h-px w-8 bg-white/35" />
          <span className="rounded-full bg-[#f48f63] px-4 py-2 text-lg font-black leading-none text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] md:text-xl">
            Shanghai
          </span>
        </div>

        <div className="absolute left-[67%] top-[58%] z-20 flex items-center gap-2">
          <span className="pin-pulse size-2 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.95)]" />
          <span className="h-px w-8 bg-white/35" />
          <span className="rounded-full bg-[#8b5cf6] px-4 py-2 text-lg font-black leading-none text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] md:text-xl">
            Hangzhou
          </span>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.34em] text-hero-pink/80">
        DRAG TO ROTATE GLOBE
      </p>

      <style jsx>{`
        .globe-float {
          animation: globe-float 8s ease-in-out infinite;
        }

        .map-drift {
          animation: map-drift 22s linear infinite;
          transform-origin: 50% 50%;
        }

        .pin-pulse {
          animation: pin-pulse 2.2s ease-in-out infinite;
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
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(2deg) scale(1.01);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes pin-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.92;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
