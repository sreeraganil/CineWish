import { useEffect, useState } from "react";

const PageLoader = () => {
  const [visible, setVisible] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShrink(true), 2000);
    const t3 = setTimeout(() => setExit(true), 2900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <>
      <style>{`
        @keyframes cwLogoIn {
          0%   { transform: scale(0.7); opacity: 0; filter: blur(14px); }
          70%  { filter: blur(0); }
          100% { transform: scale(1);   opacity: 1; filter: blur(0); }
        }
        @keyframes cwGlow {
          0%,100% { filter: drop-shadow(0 0 12px rgba(45,212,191,0.5)); }
          50%      { filter: drop-shadow(0 0 36px rgba(45,212,191,1)) drop-shadow(0 0 70px rgba(45,212,191,0.2)); }
        }
        @keyframes cwShrink {
          0%   { transform: scale(1);    opacity: 1; }
          35%  { transform: scale(0.88); }
          100% { transform: scale(18);   opacity: 0; }
        }
        @keyframes cwScreenOut {
          to { opacity: 0; pointer-events: none; }
        }

        .cw-logo-in    { animation: cwLogoIn  0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .cw-glow       { animation: cwGlow    2.2s ease-in-out 0.8s infinite; }
        .cw-shrink     { animation: cwShrink  0.9s cubic-bezier(0.55,0,1,0.45) forwards; }
        .cw-screen-out { animation: cwScreenOut 0.12s ease 0.82s forwards; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; }
        }
      `}</style>

      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black ${exit ? "cw-screen-out" : ""}`}>
        <div className={shrink ? "cw-shrink" : ""}>
          <div className={visible ? `cw-logo-in${!shrink ? " cw-glow" : ""}` : "opacity-0"}>
            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cwOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#2dd4bf" />
                  <stop offset="50%"  stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d6e65" />
                </linearGradient>
                <linearGradient id="cwPlay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <mask id="cwMask">
                  <circle cx="50" cy="50" r="47" fill="white" />
                  <circle cx="62" cy="50" r="36" fill="black" />
                </mask>
              </defs>
              <circle cx="50" cy="50" r="47" fill="url(#cwOuter)" mask="url(#cwMask)" />
              <circle cx="62" cy="50" r="36" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" mask="url(#cwMask)" />
              <path d="M 41 33 L 41 67 L 71 50 Z" fill="url(#cwPlay)" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLoader;