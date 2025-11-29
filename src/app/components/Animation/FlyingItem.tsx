"use client";
import { useEffect, useState } from "react";

interface FlyingItemProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  image: string;
  onComplete: () => void;
}

export default function FlyingItem({
  startPosition,
  endPosition,
  image,
  onComplete,
}: FlyingItemProps) {
  const [position, setPosition] = useState(startPosition);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const duration = 800; // Animation duration in ms
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic easing out for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Calculate current position
      const currentX =
        startPosition.x + (endPosition.x - startPosition.x) * easeOut;
      const currentY =
        startPosition.y + (endPosition.y - startPosition.y) * easeOut;

      // Scale down as it flies
      const currentScale = 1 - progress * 0.5;

      // Fade out at the end
      const currentOpacity = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

      setPosition({ x: currentX, y: currentY });
      setScale(currentScale);
      setOpacity(currentOpacity);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [startPosition, endPosition, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity,
        transition: "none", // Disable CSS transitions for manual animation
      }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden">
        <img
          src={image}
          alt="Flying item"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
