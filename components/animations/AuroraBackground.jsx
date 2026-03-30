'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const orbBase = {
  position: 'absolute',
  width: '24rem',
  height: '24rem',
  borderRadius: '9999px',
  mixBlendMode: 'screen',
  filter: 'blur(48px)',
}

export default function AuroraBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Gold orb - top left */}
      <motion.div
        style={{
          ...orbBase,
          top: 0,
          left: 0,
          background: 'radial-gradient(circle, rgba(245,197,24,0.35) 0%, transparent 70%)',
        }}
        animate={{
          x: [-100, 100, -100],
          y: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blue orb - top right */}
      <motion.div
        style={{
          ...orbBase,
          top: '5rem',
          right: 0,
          background: 'radial-gradient(circle, rgba(37,96,232,0.3) 0%, transparent 70%)',
        }}
        animate={{
          x: [100, -100, 100],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      {/* Dark accent orb - bottom center */}
      <motion.div
        style={{
          ...orbBase,
          bottom: 0,
          left: '50%',
          background: 'radial-gradient(circle, rgba(15,25,35,0.5) 0%, transparent 70%)',
        }}
        animate={{
          y: [100, -100, 100],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </motion.div>
  )
}
