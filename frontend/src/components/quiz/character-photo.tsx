"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface CharacterPhotoProps {
  src: string;
  name: string;
  size?: number;
}

export function CharacterPhoto({ src, name, size = 80 }: CharacterPhotoProps) {
  return (
    <div
      className="overflow-hidden rounded-full border-2 border-primary/20"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement!.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-muted"><svg xmlns="http://www.w3.org/2000/svg" width="${size / 3}" height="${size / 3}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;
        }}
      />
    </div>
  );
}
