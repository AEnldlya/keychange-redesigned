'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * RevealOnScroll — Fade + slide elements into view when scrolled into viewport.
 *
 * Props:
 *  - direction ('up'|'down'|'left'|'right'): slide direction, default 'up'
 *  - distance (number): slide distance px, default 40
 *  - duration (number): animation duration seconds, default 0.6
 *  - delay (number): delay before animation seconds, default 0
 *  - threshold (number): IntersectionObserver threshold, default 0.15
 *  - once (boolean): animate only once, default true
 *  - as (string): wrapper tag, default 'div'
 *  - children, className, style
 */
const directionMap = {
  up:    { y: 1, x: 0 },
  down:  { y: -1, x: 0 },
  left:  { y: 0, x: 1 },
  right: { y: 0, x: -1 },
}

export default function RevealOnScroll({
  children,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  const dir = directionMap[direction] || directionMap.up

  return (
    <motion.div
      ref={ref}
      className={`kc-reveal-scroll ${className}`}
      style={style}
      initial={{
        opacity: 0,
        x: dir.x * distance,
        y: dir.y * distance,
      }}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: dir.x * distance, y: dir.y * distance }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
