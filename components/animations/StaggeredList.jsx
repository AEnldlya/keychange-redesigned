'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * StaggeredList — Children items reveal one-by-one with staggered delay on scroll.
 *
 * Props:
 *  - stagger (number): delay between items in seconds, default 0.08
 *  - duration (number): per-item animation duration, default 0.5
 *  - direction ('up'|'down'|'left'|'right'): slide direction, default 'up'
 *  - distance (number): slide distance px, default 30
 *  - threshold (number): IntersectionObserver threshold, default 0.1
 *  - once (boolean): animate only once, default true
 *  - as (string): list wrapper tag, default 'div'
 *  - children, className, style
 */
const dirs = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
}

export default function StaggeredList({
  children,
  stagger = 0.08,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  threshold = 0.1,
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

  const d = dirs[direction] || dirs.up
  const scaledDir = { x: (d.x / 30) * distance, y: (d.y / 30) * distance }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: scaledDir.x, y: scaledDir.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  // Wrap each child in a motion.div
  const items = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      ref={ref}
      className={`kc-staggered-list ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
