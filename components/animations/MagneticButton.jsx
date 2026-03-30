'use client'
import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * MagneticButton — Button that magnetically pulls toward the cursor.
 *
 * Props:
 *  - strength (number): pull strength multiplier, default 0.35
 *  - radius (number): magnetic activation radius px, default 150
 *  - as (string): rendered element tag, default 'button'
 *  - children, className, style, onClick, ...rest
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  radius = 150,
  as: Tag = 'button',
  className = '',
  style = {},
  onClick,
  ...rest
}) {
  const ref = useRef(null)
  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)
  const x = useSpring(xRaw, { stiffness: 200, damping: 20, mass: 0.5 })
  const y = useSpring(yRaw, { stiffness: 200, damping: 20, mass: 0.5 })

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < radius) {
      xRaw.set(dx * strength)
      yRaw.set(dy * strength)
    }
  }, [xRaw, yRaw, strength, radius])

  const handleLeave = useCallback(() => {
    xRaw.set(0)
    yRaw.set(0)
  }, [xRaw, yRaw])

  const MotionTag = motion[Tag] || motion.button

  return (
    <MotionTag
      ref={ref}
      className={`kc-magnetic-btn ${className}`}
      style={{ x, y, position: 'relative', display: 'inline-flex', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
