'use client'
import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

/**
 * SpotlightCard — Interactive card with cursor-following spotlight and gold glow border.
 *
 * Features:
 *  - Framer Motion spring-based cursor tracking (60fps)
 *  - Gold border that intensifies on hover
 *  - Radial gradient spotlight follows the mouse via useMotionTemplate
 *  - No SSR issues ('use client')
 *  - React 18 compatible
 *
 * Props:
 *  - radius (number): spotlight radius in px, default 250
 *  - color (string): spotlight color, default 'rgba(245,197,24,0.12)'
 *  - borderColor (string): glow border color, default '#F5C518'
 *  - children, className, style
 */
export default function SpotlightCard({
  children,
  radius = 250,
  color = 'rgba(245,197,24,0.12)',
  borderColor = '#F5C518',
  className = '',
  style = {},
}) {
  const cardRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  // Raw motion values for instant cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-smoothed for buttery 60fps feel
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 })

  // Build the radial gradient as a motion template string
  const spotlightBg = useMotionTemplate`radial-gradient(${radius}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent 70%)`
  const shimmerBg = useMotionTemplate`radial-gradient(${radius * 1.2}px circle at ${smoothX}px ${smoothY}px, rgba(245,197,24,0.08), transparent 60%)`

  const handleMove = useCallback(
    (e) => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  return (
    <motion.div
      ref={cardRef}
      className={`kc-spotlight-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        border: `1.5px solid ${hovering ? borderColor : 'rgba(245,197,24,0.15)'}`,
        boxShadow: hovering
          ? '0 0 20px rgba(245,197,24,0.15), 0 0 60px rgba(245,197,24,0.05), inset 0 0 30px rgba(245,197,24,0.03)'
          : '0 0 0px rgba(245,197,24,0), inset 0 0 0px rgba(245,197,24,0)',
        transition: 'border-color 0.3s ease, box-shadow 0.4s ease',
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Cursor-following spotlight overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.35s ease',
          background: spotlightBg,
        }}
      />

      {/* Gold edge shimmer on hover */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: shimmerBg,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  )
}
