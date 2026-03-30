'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * SlideInText — Text slides in from a chosen direction on scroll.
 *
 * Props:
 *  - direction ('left'|'right'|'top'|'bottom'): slide origin, default 'left'
 *  - distance (number): slide distance px, default 80
 *  - duration (number): animation duration seconds, default 0.7
 *  - delay (number): delay before animation, default 0
 *  - blur (boolean): add blur on enter, default true
 *  - threshold (number): IntersectionObserver threshold, default 0.15
 *  - once (boolean): animate only once, default true
 *  - as (string): wrapper tag, default 'div'
 *  - children, className, style
 */
const slideOffsets = {
  left:   (d) => ({ x: -d, y: 0 }),
  right:  (d) => ({ x: d, y: 0 }),
  top:    (d) => ({ x: 0, y: -d }),
  bottom: (d) => ({ x: 0, y: d }),
}

export default function SlideInText({
  children,
  direction = 'left',
  distance = 80,
  duration = 0.7,
  delay = 0,
  blur = true,
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

  const getOffset = slideOffsets[direction] || slideOffsets.left
  const offset = getOffset(distance)

  return (
    <motion.div
      ref={ref}
      className={`kc-slide-in-text ${className}`}
      style={style}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        filter: blur ? 'blur(8px)' : 'none',
      }}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, x: offset.x, y: offset.y, filter: blur ? 'blur(8px)' : 'none' }
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
