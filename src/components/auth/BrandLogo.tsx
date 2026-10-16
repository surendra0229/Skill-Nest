import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
}

/**
 * BrandLogo
 * Renders the official Skill Nest 3D blue geometric logo inside a sleek dark
 * rounded container matching the reference Resend icon aesthetic.
 */
export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <div
      className={`w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center shadow-inner shadow-black/40 backdrop-blur-sm mx-auto transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <div className="relative w-7 h-7 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Skill Nest Logo"
          width={28}
          height={28}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
          priority
        />
      </div>
    </div>
  );
}
