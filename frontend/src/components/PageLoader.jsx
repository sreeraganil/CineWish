import { useEffect, useState } from "react";

const PageLoader = () => {
  const [phase, setPhase] = useState("idle"); // idle → draw → fill → glow → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("draw"), 80);
    const t2 = setTimeout(() => setPhase("fill"), 1000);
    const t3 = setTimeout(() => setPhase("glow"), 1600);
    const t4 = setTimeout(() => setPhase("done"), 2800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const drawing = phase !== "idle";
  const filled  = phase === "fill" || phase === "glow" || phase === "done";
  const glowing = phase === "glow" || phase === "done";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400&display=swap');

        @keyframes barFill {
          0%   { width: 0%;   opacity: 1; }
          80%  { width: 92%;  opacity: 1; }
          96%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .cw-bar { animation: barFill 3.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards; }

        .cw-path {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke-dashoffset 1.05s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes filmScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cw-film { animation: filmScroll 6s linear infinite; }
        .cw-film-rev { animation: filmScroll 6s linear infinite reverse; }

        @keyframes scanDrift {
          0%   { top: -4px; opacity: 0; }
          8%   { opacity: 0.07; }
          92%  { opacity: 0.07; }
          100% { top: 100%; opacity: 0; }
        }
        .cw-scan { animation: scanDrift 3.5s linear infinite; }

        @keyframes twinkle {
          0%,100% { opacity: 0; transform: scale(0.3); }
          50%      { opacity: 1; transform: scale(1); }
        }
        .cw-star { animation: twinkle var(--tw-dur) ease-in-out var(--tw-delay) infinite; }

        @keyframes logoPulse {
          0%,100% { filter: drop-shadow(0 0 8px rgba(45,212,191,0.4)); }
          50%      { filter: drop-shadow(0 0 32px rgba(45,212,191,1))
                              drop-shadow(0 0 72px rgba(45,212,191,0.3))
                              drop-shadow(0 0 3px #fff8); }
        }
        .cw-logo-glow { animation: logoPulse 2s ease-in-out infinite; }

        @keyframes sweep {
          0%   { transform: translateX(-180%) skewX(-18deg); opacity: 0; }
          25%  { opacity: 1; }
          100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
        }
        .cw-sweep { animation: sweep 1.1s ease 1.55s both; }

        @keyframes wordIn {
          0%   { opacity: 0; transform: translateY(12px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        .cw-word    { animation: wordIn 0.85s cubic-bezier(0.16,1,0.3,1) 1.45s both; }
        .cw-sub     { animation: wordIn 0.85s cubic-bezier(0.16,1,0.3,1) 1.75s both; }
        .cw-dots    { animation: wordIn 0.85s cubic-bezier(0.16,1,0.3,1) 2.05s both; }

        @keyframes dotBlink {
          0%,100% { opacity: 0.2; transform: scaleY(0.6); }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        .cw-dot { animation: dotBlink 1.1s ease-in-out var(--d-delay) infinite; }

        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          15%  { opacity: 0.85; }
          100% { transform: translateY(-110px) scale(0.15); opacity: 0; }
        }
        .cw-particle { animation: floatUp var(--p-dur) ease var(--p-delay) infinite; }

        @keyframes ringBreathe {
          0%,100% { transform: scale(1);    opacity: var(--r-lo); }
          50%      { transform: scale(1.05); opacity: var(--r-hi); }
        }
        .cw-ring { animation: ringBreathe var(--r-dur) ease-in-out var(--r-delay) infinite; }

        @keyframes loaderExit {
          0%   { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        .cw-exit { animation: loaderExit 0.65s ease 3.35s forwards; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
          .cw-path { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <div className="cw-exit fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07070a] overflow-hidden">

        {/* ── Progress bar ── */}
        <div className="absolute top-0 left-0 w-full h-[2px] z-50">
          <div
            className="cw-bar h-full"
            style={{
              background: "linear-gradient(90deg, #0d9488, #2dd4bf, #99f6e4, #2dd4bf)",
              boxShadow: "0 0 14px #2dd4bf, 0 0 32px rgba(45,212,191,0.45)",
            }}
          />
        </div>

        {/* ── Film strip top ── */}
        <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ height: 32 }}>
          <div className="cw-film flex items-center h-full" style={{ width: "200%" }}>
            {[...Array(48)].map((_, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center" style={{ width: 44 }}>
                <div
                  className="rounded-sm"
                  style={{
                    width: 28, height: 20,
                    border: "1px solid rgba(45,212,191,0.25)",
                    background: i % 5 === 0 ? "rgba(45,212,191,0.05)" : "transparent",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Film strip bottom ── */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: 32 }}>
          <div className="cw-film-rev flex items-center h-full" style={{ width: "200%" }}>
            {[...Array(48)].map((_, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center" style={{ width: 44 }}>
                <div
                  className="rounded-sm"
                  style={{
                    width: 28, height: 20,
                    border: "1px solid rgba(45,212,191,0.25)",
                    background: i % 7 === 0 ? "rgba(45,212,191,0.05)" : "transparent",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Scanline ── */}
        <div
          className="cw-scan absolute left-0 w-full pointer-events-none"
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.12) 40%, rgba(45,212,191,0.18) 50%, rgba(45,212,191,0.12) 60%, transparent 100%)",
          }}
        />

        {/* ── Ambient rings ── */}
        {[180, 300, 430, 580].map((size, i) => (
          <div
            key={i}
            className="cw-ring absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(45,212,191,${0.1 - i * 0.015})`,
              "--r-dur": `${3.4 + i * 0.8}s`,
              "--r-delay": `${i * 0.45}s`,
              "--r-lo": 0.04,
              "--r-hi": 0.12 - i * 0.02,
            }}
          />
        ))}

        {/* ── Stars ── */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="cw-star absolute pointer-events-none"
            style={{
              left: `${6 + (i * 41 + i * i * 5) % 88}%`,
              top:  `${8 + (i * 31 + i * 11) % 84}%`,
              "--tw-dur":   `${1.3 + (i % 5) * 0.35}s`,
              "--tw-delay": `${i * 0.15 + 0.7}s`,
              opacity: 0,
            }}
          >
            {i % 4 === 0 ? (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5Z"
                  fill={i % 2 === 0 ? "rgba(45,212,191,0.55)" : "rgba(255,255,255,0.35)"}
                />
              </svg>
            ) : (
              <div style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                borderRadius: "50%",
                background: i % 2 === 0 ? "rgba(45,212,191,0.5)" : "rgba(255,255,255,0.3)",
              }} />
            )}
          </div>
        ))}

        {/* ── Particles ── */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="cw-particle absolute rounded-full pointer-events-none"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${28 + (i % 7) * 7}%`,
              bottom: "44%",
              background: i % 2 === 0 ? "#2dd4bf" : "rgba(255,255,255,0.4)",
              "--p-dur":   `${2 + (i % 4) * 0.45}s`,
              "--p-delay": `${i * 0.18 + 1.1}s`,
              opacity: 0,
            }}
          />
        ))}

        {/* ── Logo ── */}
        <div className={`relative z-10 flex flex-col items-center gap-8 ${glowing ? "cw-logo-glow" : ""}`}>

          <div className="relative" style={{ width: 148, height: 148 }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">

              {/* Outer ring */}
              <circle cx="50" cy="50" r="46"
                className="cw-path" stroke="#2dd4bf" strokeWidth="1"
                strokeDasharray="289" strokeDashoffset={drawing ? 0 : 289}
              />

              {/* Inner ring (glow phase) */}
              <circle cx="50" cy="50" r="41"
                fill="none" stroke="rgba(45,212,191,0.1)" strokeWidth="0.5"
                style={{ opacity: filled ? 1 : 0, transition: "opacity 0.5s ease" }}
              />

              {/* Clapperboard body */}
              <rect x="20" y="40" width="60" height="34" rx="3"
                className="cw-path" stroke="#2dd4bf" strokeWidth="2.2"
                strokeDasharray="196" strokeDashoffset={drawing ? 0 : 196}
                style={{ transitionDelay: "0.1s" }}
              />

              {/* Top bar */}
              <rect x="20" y="30" width="60" height="12" rx="2"
                className="cw-path" stroke="#2dd4bf" strokeWidth="2.2"
                strokeDasharray="148" strokeDashoffset={drawing ? 0 : 148}
                style={{ transitionDelay: "0.22s" }}
              />

              {/* Clapper diagonal stripes */}
              {[0,1,2,3,4].map((n) => (
                <line key={n}
                  x1={25 + n * 11} y1="30"
                  x2={20 + n * 11} y2="42"
                  className="cw-path" stroke="#2dd4bf" strokeWidth="1.8"
                  strokeDasharray="14" strokeDashoffset={drawing ? 0 : 14}
                  style={{ transitionDelay: `${0.34 + n * 0.05}s` }}
                />
              ))}

              {/* Play button outline */}
              <path d="M 42 50 L 42 66 L 62 58 Z"
                className="cw-path" stroke="#2dd4bf" strokeWidth="2"
                strokeDasharray="64" strokeDashoffset={drawing ? 0 : 64}
                style={{ transitionDelay: "0.6s" }}
              />

              {/* Play button fill */}
              <path d="M 42 50 L 42 66 L 62 58 Z"
                fill="#2dd4bf"
                style={{ opacity: filled ? 1 : 0, transition: "opacity 0.35s ease 0.15s" }}
              />

              {/* Centre glow dot */}
              <circle cx="50" cy="50" r="2.5" fill="#2dd4bf"
                style={{ opacity: glowing ? 0.55 : 0, transition: "opacity 0.4s ease 0.2s" }}
              />
            </svg>

            {/* Sweep */}
            <div
              className="cw-sweep absolute inset-0 pointer-events-none overflow-hidden rounded-full"
              style={{ background: "linear-gradient(115deg, transparent 15%, rgba(255,255,255,0.26) 50%, transparent 85%)" }}
            />
          </div>

          {/* Wordmark */}
          <div className="text-center select-none">
            <div
              className="cw-word leading-none tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.8rem",
                background: "linear-gradient(140deg, #99f6e4 0%, #2dd4bf 50%, #0d9488 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cine
              <span style={{ WebkitTextFillColor: "#fff", color: "#fff" }}>Wish</span>
            </div>

            <div
              className="cw-sub mt-1.5 tracking-[0.6em] uppercase"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 300,
                fontSize: "0.55rem",
                color: "rgba(45,212,191,0.35)",
                letterSpacing: "0.6em",
              }}
            >
              Your cinema universe
            </div>

            {/* Loading dots */}
            <div className="cw-dots flex items-center justify-center gap-2 mt-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="cw-dot rounded-full bg-teal-400"
                  style={{
                    width: 5, height: 5,
                    "--d-delay": `${i * 0.22}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 15%, rgba(0,0,0,0.94) 100%)" }}
        />

        {/* ── Corner brackets ── */}
        {[
          { cls: "top-10 left-10",           rotate: "rotate(0)" },
          { cls: "top-10 right-10",          rotate: "rotate(90deg)" },
          { cls: "bottom-10 left-10",        rotate: "rotate(-90deg)" },
          { cls: "bottom-10 right-10",       rotate: "rotate(180deg)" },
        ].map(({ cls, rotate }, i) => (
          <svg
            key={i}
            className={`absolute ${cls} opacity-[0.18]`}
            style={{ transform: rotate }}
            width="28" height="28" viewBox="0 0 28 28"
          >
            <path d="M2 16 L2 2 L16 2" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
    </>
  );
};

export default PageLoader;