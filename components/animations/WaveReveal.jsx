'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * WaveReveal — Text reveals with a wave-like motion (characters animate with sine-wave timing).
 *
 * Props:
 *  - text (string): text to reveal
 *  - as (string): wrapper tag, default 'h2'
 *  - amplitude (number): wave height multiplier, default 20
 *  - frequency (number): wave tightness, default 0.15
 *  - duration (number): per-char animation duration, default 0.5
 *  - stagger (number): delay between chars, default 0.03
 *  - threshold (number): IO threshold, default 0.2
 *  - className, style
 */
export default function WaveReveal({
  text = '',
  as: Tag = 'h2',
  amplitude = 20,
  frequency = 0.15,
  duration = 0.5,
  stagger = 0.03,
  threshold = 0.2,
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
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  const chars = useMemo(
    () =>
      text.split('').map((c, i) => ({
        key: `${c}-${i}`,
        char: c === ' ' ? '\u00A0' : c,
        waveY: Math.sin(i * frequency) * amplitude,
      })),
    [text, frequency, amplitude]
  )

  return (
    <Tag
      ref={ref}
      className={`kc-wave-reveal ${className}`}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
      }}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <motion.span
          key={c.key}
          aria-hidden="true"
          initial={{ opacity: 0, y: c.waveY }}
          animate={
            visible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: c.waveY }
          }
          transition={{
            duration,
            delay: i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {c.char}
        </motion.span>
      ))}
    </Tag>
  )
}
