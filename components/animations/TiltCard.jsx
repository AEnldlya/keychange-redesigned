'use client'
import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * TiltCard — 3D perspective tilt on mouse move with Framer Motion springs.
 *
 * Props:
 *  - tiltMax (number): max tilt degrees, default 12
 *  - glare (boolean): show glare overlay, default true
 *  - perspective (number): CSS perspective px, default 800
 *  - children, className, style
 */
export default function TiltCard({
  children,
  tiltMax = 12,
  glare = true,
  perspective = 800,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltMax, -tiltMax]), { stiffness: 250, damping: 25 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltMax, tiltMax]), { stiffness: 250, damping: 25 })
  const glareOpacity = useTransform(y, [0, 0.5, 1], [0.15, 0, 0.15])

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }, [x, y])

  const handleLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={`kc-tilt-card ${className}`}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
        {glare && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25), transparent 60%)',
              opacity: glareOpacity,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
