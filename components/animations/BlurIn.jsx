'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * BlurIn — Text that fades in from a blurred state.
 * Inspired by Magic UI / Aceternity blur-in text animation.
 *
 * Features:
 *  - Smooth blur-to-clear + opacity transition
 *  - IntersectionObserver trigger
 *  - Configurable blur amount, duration, delay
 *  - Word-by-word stagger option
 *
 * Props:
 *  - text (string): text to animate
 *  - as (string): wrapper tag, default 'h2'
 *  - blurAmount (number): starting blur px, default 12
 *  - duration (number): animation duration seconds, default 0.8
 *  - delay (number): delay before animation starts, default 0
 *  - stagger (number): per-word delay, default 0.05 (0 = animate all at once)
 *  - yOffset (number): vertical slide distance, default 20
 *  - threshold (number): IO threshold, default 0.2
 *  - className, style
 */
export default function BlurIn({
  text = '',
  as: Tag = 'h2',
  blurAmount = 12,
  duration = 0.8,
  delay = 0,
  stagger = 0.05,
  yOffset = 20,
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

  if (stagger > 0) {
    const words = text.split(' ')
    return (
      <Tag
        ref={ref}
        className={`kc-blur-in ${className}`}
        style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '0.3em', overflow: 'hidden' }}
        aria-label={text}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            aria-hidden="true"
            initial={{
              filter: `blur(${blurAmount}px)`,
              opacity: 0,
              y: yOffset,
            }}
            animate={
              visible
                ? { filter: 'blur(0px)', opacity: 1, y: 0 }
                : { filter: `blur(${blurAmount}px)`, opacity: 0, y: yOffset }
            }
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: 'inline-block', willChange: 'filter, opacity, transform' }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`kc-blur-in ${className}`}
      style={style}
      initial={{
        filter: `blur(${blurAmount}px)`,
        opacity: 0,
        y: yOffset,
      }}
      animate={
        visible
          ? { filter: 'blur(0px)', opacity: 1, y: 0 }
          : { filter: `blur(${blurAmount}px)`, opacity: 0, y: yOffset }
      }
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Tag aria-label={text}>{text}</Tag>
    </motion.div>
  )
}
