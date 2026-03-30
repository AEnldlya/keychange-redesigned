'use client'
import { motion } from 'framer-motion'

/**
 * HoverLift — Element smoothly lifts on hover with growing shadow.
 *
 * Props:
 *  - lift (number): vertical lift in px, default 8
 *  - shadowColor (string): shadow base color, default 'rgba(0,0,0,0.12)'
 *  - duration (number): transition duration seconds, default 0.3
 *  - as (string): 'div' | 'article' | 'li' etc, default 'div'
 *  - children, className, style
 */
export default function HoverLift({
  children,
  lift = 8,
  shadowColor = 'rgba(0,0,0,0.12)',
  duration = 0.3,
  className = '',
  style = {},
}) {
  return (
    <motion.div
      className={`kc-hover-lift ${className}`}
      style={{
        borderRadius: '12px',
        cursor: 'default',
        ...style,
      }}
      initial={{
        y: 0,
        boxShadow: `0 2px 8px ${shadowColor}`,
      }}
      whileHover={{
        y: -lift,
        boxShadow: `0 ${lift + 8}px ${lift * 3}px ${shadowColor}`,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration,
      }}
    >
      {children}
    </motion.div>
  )
}
