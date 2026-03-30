'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * TextReveal — Characters or words reveal one-by-one when scrolled into view.
 *
 * Features:
 *  - IntersectionObserver triggers animation on scroll
 *  - Character-by-character or word-by-word mode
 *  - Smooth cubic-bezier easing (expo out)
 *  - Accessible: preserves aria-label with full text
 *  - No SSR issues ('use client')
 *  - React 18 compatible
 *
 * Props:
 *  - text (string): the text to reveal
 *  - as (string): HTML tag, default 'h2'
 *  - mode ('char' | 'word'): split mode, default 'char'
 *  - stagger (number): delay between each unit, default 0.03
 *  - duration (number): per-unit animation duration, default 0.5
 *  - threshold (number): IntersectionObserver threshold, default 0.2
 *  - once (boolean): animate only once, default true
 *  - className, style
 */
export default function TextReveal({
  text = '',
  as: Tag = 'h2',
  mode = 'char',
  stagger = 0.03,
  duration = 0.5,
  threshold = 0.2,
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

  const units = useMemo(() => {
    if (mode === 'word') {
      return text.split(' ').map((w, i, arr) => ({
        key: `w-${i}-${w}`,
        text: i < arr.length - 1 ? w + '\u00A0' : w,
      }))
    }
    return text.split('').map((c, i) => ({
      key: `c-${i}-${c}`,
      text: c === ' ' ? '\u00A0' : c,
    }))
  }, [text, mode])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
      }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={unit.key}
          aria-hidden="true"
          initial={{ opacity: 0, y: '110%' }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: '110%' }}
          transition={{
            duration,
            delay: i * stagger,
            ease: [0.16, 1, 0.3, 1], // expo-out
          }}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {unit.text}
        </motion.span>
      ))}
    </Tag>
  )
}
