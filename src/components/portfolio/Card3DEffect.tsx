'use client';

import { useState, useRef, ReactNode } from 'react';

interface Card3DEffectProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function Card3DEffect({
  children,
  className = '',
  intensity = 15,
}: Card3DEffectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl transition-all duration-200 ${className}`}
    >
      {children}

      {/* Dynamic 3D Glare Light Reflection Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-30"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, rgba(0,212,255,0.15) 30%, rgba(0,0,0,0) 80%)`,
        }}
      />
    </div>
  );
}
