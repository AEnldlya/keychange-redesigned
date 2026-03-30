'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * TextReveal — Characters or words animate in when scrolled into view.
 *
 * Props:
 *  - text (string): the text to reveal
 *  - as (string): HTML tag, default 'h2'
 *  - mode ('char' | 'word'): split by character or word, default 'char'
 *  - stagger (number): delay between each unit, default 0.03
 *  - duration (number): animation duration per unit, default 0.4
 *  - className, style
 */
export default function TextReveal({
  text = '',
  as: Tag = 'h2',
  mode = 'char',
  stagger = 0.03,
  duration = 0.4,
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
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const units = useMemo(() => {
    if (mode === 'word') {
      return text.split(' ').map((w, i, arr) => ({
        key: `${w}-${i}`,
        text: i < arr.length - 1 ? w + '\u00A0' : w,
      }))
    }
    // char mode
    return text.split('').map((c, i) => ({
      key: `${c}-${i}`,
      text: c === ' ' ? '\u00A0' : c,
    }))
  }, [text, mode])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={unit.key}
          aria-hidden="true"
          initial={{ opacity: 0, y: '100%' }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: '100%' }}
          transition={{
            duration,
            delay: i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {unit.text}
        </motion.span>
      ))}
    </Tag>
  )
}
