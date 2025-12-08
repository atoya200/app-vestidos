"use client";

import { useState, MouseEvent } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-crosshair"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={images[0]}
        alt={alt}
        className="absolute inset-0 w-full h-full object-contain rounded-2xl transition-transform duration-200 ease-out"
        style={{
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          transform: isZoomed ? "scale(2)" : "scale(1)",
        }}
      />
    </div>
  );
}
