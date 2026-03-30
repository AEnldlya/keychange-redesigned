'use client'
import { motion } from 'framer-motion'

/**
 * GlassCard — Glassmorphism card with frosted blur backdrop and subtle border.
 *
 * Props:
 *  - blur (number): backdrop blur px, default 16
 *  - opacity (number): background opacity 0-1, default 0.08
 *  - borderOpacity (number): border opacity 0-1, default 0.15
 *  - tint (string): background tint color, default '255,255,255'
 *  - hover (boolean): enable hover lift, default true
 *  - children, className, style
 */
export default function GlassCard({
  children,
  blur = 16,
  opacity = 0.08,
  borderOpacity = 0.15,
  tint = '255,255,255',
  hover = true,
  className = '',
  style = {},
}) {
  const baseStyle = {
    background: `rgba(${tint}, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(${tint}, ${borderOpacity})`,
    borderRadius: '16px',
    overflow: 'hidden',
    ...style,
  }

  if (!hover) {
    return (
      <div className={`kc-glass-card ${className}`} style={baseStyle}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={`kc-glass-card ${className}`}
      style={baseStyle}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        borderColor: `rgba(${tint}, ${borderOpacity + 0.1})`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}
