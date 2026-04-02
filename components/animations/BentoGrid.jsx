'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * BentoGrid — Modern bento-box grid layout with staggered reveal.
 * Inspired by Apple / 21st.dev bento-style layouts.
 *
 * Features:
 *  - Responsive CSS grid with span controls
 *  - Staggered fade+slide entrance
 *  - IntersectionObserver trigger
 *  - Optional hover lift effect
 *
 * Props:
 *  - items (array): grid items with { span, content, className }
 *  - columns (number): grid columns, default 3
 *  - gap (number): grid gap px, default 20
 *  - stagger (number): entrance stagger seconds, default 0.08
 *  - className, style
 *
 * Item Props:
 *  - colSpan (number): columns to span, default 1
 *  - rowSpan (number): rows to span, default 1
 *  - children (ReactNode): item content
 *  - className (string): additional classes
 *  - style (object): additional styles
 */
export function BentoGrid({
  children,
  columns = 3,
  gap = 20,
  stagger = 0.08,
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
        if (entry.isIntersecting) { setVisible(true); io.disconnect() }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Count children for stagger
  const items = Array.isArray(children) ? children : [children]

  return (
    <div
      ref={ref}
      className={`kc-bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style,
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
          transition={{
            duration: 0.5,
            delay: i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  hover = true,
  className = '',
  style = {},
}) {
  return (
    <motion.div
      className={`kc-bento-item ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        borderRadius: 16,
        border: '1px solid rgba(245,197,24,0.1)',
        background: 'rgba(255,255,255,0.02)',
        padding: 24,
        overflow: 'hidden',
        ...style,
      }}
      whileHover={hover ? { y: -4, boxShadow: '0 8px 30px rgba(245,197,24,0.08)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
