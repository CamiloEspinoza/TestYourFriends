"use client";

import { useState } from "react";

interface CharacterPhotoProps {
  src: string;
  name: string;
  size?: number;
}

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#06b6d4",
];

function getInitialsAvatar(name: string, size: number): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bg = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const fontSize = Math.round(size * 0.36);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/><text x="${size / 2}" y="${size / 2}" dominant-baseline="central" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="${fontSize}" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

/** Returns alternative paths to try when the original src fails to load.
 *  Seed data always uses .jpg, but we have .svg for archetypes. */
function getFallbackSrcs(src: string): string[] {
  const base = src.replace(/\.[^.]+$/, "");
  const fallbacks: string[] = [];
  if (!src.endsWith(".svg")) fallbacks.push(`${base}.svg`);
  if (!src.endsWith(".png")) fallbacks.push(`${base}.png`);
  return fallbacks;
}

export function CharacterPhoto({ src, name, size = 80 }: CharacterPhotoProps) {
  const fallbacks = getFallbackSrcs(src);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [useInitials, setUseInitials] = useState(false);

  const handleError = () => {
    if (fallbackIdx < fallbacks.length) {
      setCurrentSrc(fallbacks[fallbackIdx]);
      setFallbackIdx((i) => i + 1);
    } else {
      setUseInitials(true);
    }
  };

  if (useInitials) {
    return (
      <div
        className="overflow-hidden rounded-full border-2 border-primary/20"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <img
          src={getInitialsAvatar(name, size)}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-full border-2 border-primary/20"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <img
        src={currentSrc}
        alt={name}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={handleError}
      />
    </div>
  );
}
