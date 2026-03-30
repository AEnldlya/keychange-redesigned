'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

/**
 * FlipCounter — Animated counting number that triggers on scroll.
 *
 * Props:
 *  - target (number): the number to count up to, default 0
 *  - duration (number): animation duration in seconds, default 2
 *  - prefix (string): text before the number, e.g. '$'
 *  - suffix (string): text after the number, e.g. '+'
 *  - separator (boolean): add thousands separators, default true
 *  - className, style
 */
export default function FlipCounter({
  target = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  separator = true,
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
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, {
    duration: duration * 1000,
    bounce: 0,
  })
  const display = useTransform(springVal, (v) => {
    const num = Math.round(v)
    return separator ? num.toLocaleString() : String(num)
  })

  useEffect(() => {
    if (visible) {
      motionVal.set(target)
    }
  }, [visible, target, motionVal])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}
