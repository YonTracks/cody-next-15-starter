'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Update offset when the mouse moves
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;
    // Calculate the difference from the center of the window
    const x = clientX - window.innerWidth / 2;
    const y = clientY - window.innerHeight / 2;
    setOffset({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden p-4"
    >
      <AnimatedSvg offset={offset} />
      <Link
        href="/home"
        className="mt-8 px-6 py-3 bg-white text-blue-500 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
      >
        Enter
      </Link>
    </div>
  );
}

type AnimatedSvgProps = {
  offset: { x: number; y: number };
};

function AnimatedSvg({ offset }: AnimatedSvgProps) {
  const parallaxFactor = 0.05;
  const translateX = offset.x * parallaxFactor;
  const translateY = offset.y * parallaxFactor;

  return (
    <svg
      width="250"
      height="250"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-100"
      style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
    >

      <text
        x="100"
        y="95"
        fill="white"
        fontSize="10"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Web Dev Cody WDC Template
      </text>
      <text
        x="100"
        y="115"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Next.js 15 Starter
      </text>

      {/* Animated Circle */}
      <circle
        cx="100"
        cy="130"
        r="100"
        stroke="white"
        strokeWidth="4"
        className="animate-pulse"
      />
    </svg>
  );
}

