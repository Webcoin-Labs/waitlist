"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionStyle } from "framer-motion";

/** 3D mouse-tilt wrapper. Falls back to static on reduced-motion / touch. */
export function TiltCard({
  children,
  className,
  style,
  max = 10,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: MotionStyle;
  max?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });

  const glareBg = useTransform([px, py], (latest) => {
    const [x, y] = latest as [number, number];
    return `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.5), transparent 45%)`;
  });

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        ...style,
      }}
      className={className}
    >
      {children}
      {glare && !reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: glareBg, mixBlendMode: "overlay" }}
        />
      ) : null}
    </motion.div>
  );
}
