import React from "react";

/**
 * AuthBackground
 * Replicates the ultra-clean, pitch-black aesthetic with subtle 3D metallic/glassy
 * diagonal abstract light sweeps in the top-right and bottom-left corners from Resend's UI.
 */
export function AuthBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Base Pitch Black Canvas */}
      <div className="absolute inset-0 bg-black" />

      {/* Top-Right Ambient Metallic Diagonal Waves */}
      <div className="absolute top-0 right-0 w-[55vw] max-w-[850px] h-[75vh] max-h-[750px] opacity-75 sm:opacity-85 pointer-events-none">
        <svg
          viewBox="0 0 850 750"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover object-top-right filter blur-[1px]"
        >
          <defs>
            {/* Primary soft metallic gradient */}
            <radialGradient
              id="topRightGlow"
              cx="80%"
              cy="20%"
              r="70%"
              fx="70%"
              fy="10%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="25%" stopColor="#cbd5e1" stopOpacity="0.10" />
              <stop offset="55%" stopColor="#64748b" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Diagonal Silk Wave 1 */}
            <linearGradient
              id="silkWave1"
              x1="850"
              y1="0"
              x2="250"
              y2="700"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.18" />
              <stop offset="35%" stopColor="#94a3b8" stopOpacity="0.09" />
              <stop offset="70%" stopColor="#334155" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Diagonal Silk Wave 2 */}
            <linearGradient
              id="silkWave2"
              x1="850"
              y1="150"
              x2="350"
              y2="750"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.22" />
              <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.08" />
              <stop offset="80%" stopColor="#1e293b" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Soft edge blur */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="38" />
            </filter>
            <filter id="waveBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>

          {/* Broad atmospheric radial sheen */}
          <rect
            width="850"
            height="750"
            fill="url(#topRightGlow)"
            filter="url(#softGlow)"
          />

          {/* Silky diagonal ribbon curve 1 */}
          <path
            d="M850 0C680 90 480 260 380 480C320 610 260 690 180 750L850 750V0Z"
            fill="url(#silkWave1)"
            filter="url(#waveBlur)"
          />

          {/* Dynamic silky diagonal ridge 2 */}
          <path
            d="M850 120C720 220 540 380 460 560C410 670 360 720 300 750L850 750V120Z"
            fill="url(#silkWave2)"
            filter="url(#waveBlur)"
          />
        </svg>
      </div>

      {/* Bottom-Left Ambient Diagonal Light Beam */}
      <div className="absolute bottom-0 left-0 w-[50vw] max-w-[700px] h-[60vh] max-h-[600px] opacity-70 sm:opacity-80 pointer-events-none">
        <svg
          viewBox="0 0 700 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover object-bottom-left"
        >
          <defs>
            <linearGradient
              id="bottomLeftSweep"
              x1="0"
              y1="600"
              x2="550"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="25%" stopColor="#94a3b8" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#334155" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <radialGradient
              id="bottomLeftCornerGlow"
              cx="0%"
              cy="100%"
              r="60%"
              fx="0%"
              fy="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="40%" stopColor="#64748b" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <filter id="bottomBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          {/* Corner radial aura */}
          <rect
            width="700"
            height="600"
            fill="url(#bottomLeftCornerGlow)"
            filter="url(#bottomBlur)"
          />

          {/* Diagonal light blade slicing upward */}
          <path
            d="M-50 650L450 200C520 130 580 90 650 50L550 0L0 500V650H-50Z"
            fill="url(#bottomLeftSweep)"
            filter="url(#bottomBlur)"
          />
        </svg>
      </div>

      {/* Very faint center vignette ensuring pure pitch black around the central form */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}
