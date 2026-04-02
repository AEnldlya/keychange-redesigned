'use client'
import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

/**
 * Spotlight — Full-section cursor-following spotlight effect.
 * Inspired by Aceternity UI spotlight component.
 *
 * Features:
 *  - Large radial gradient follows cursor across entire section
 *  - Spring-smoothed for buttery tracking
 *  - Configurable radius, color, opacity
 *  - Only renders spotlight on hover
 *
 * Props:
 *  - children (ReactNode): section content
 *  - radius (number): spotlight radius px, default 400
 *  - color (string): spotlight color, default 'rgba(245,197,24,0.06)'
 *  - fill (string): default background, default 'transparent'
 *  - className, style
 */
export default function Spotlight({
  children,
  radius = 400,
  color = 'rgba(245,197,24,0.06)',
  fill = 'transparent',
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.5 })
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.5 })

  const spotlightBg = useMotionTemplate`radial-gradient(${radius}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent 80%)`

  const handleMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  return (
    <div
      ref={ref}
      className={`kc-spotlight ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: fill,
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: spotlightBg,
        }}
        aria-hidden="true"
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
