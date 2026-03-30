'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

/**
 * FlipCounter — Animated number counter that springs to a target on scroll.
 *
 * Features:
 *  - Framer Motion useSpring for physically-based animation
 *  - IntersectionObserver triggers count-up on scroll
 *  - Configurable prefix/suffix (e.g., "$", "+", "%")
 *  - Thousands separator via toLocaleString
 *  - No SSR issues ('use client')
 *  - React 18 compatible
 *
 * Props:
 *  - target (number): end value, default 0
 *  - duration (number): animation time in seconds, default 2
 *  - prefix (string): text before the number, e.g. '$'
 *  - suffix (string): text after the number, e.g. '+'
 *  - separator (boolean): thousands separators, default true
 *  - decimals (number): decimal places, default 0
 *  - className, style
 */
export default function FlipCounter({
  target = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  separator = true,
  decimals = 0,
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
    const num = decimals > 0
      ? parseFloat(v.toFixed(decimals))
      : Math.round(v)
    if (separator) {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    }
    return decimals > 0 ? num.toFixed(decimals) : String(num)
  })

  useEffect(() => {
    if (visible) {
      motionVal.set(target)
    }
  }, [visible, target, motionVal])

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', alignItems: 'baseline', ...style }}
    >
      {prefix && <span>{prefix}</span>}
      <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {display}
      </motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
