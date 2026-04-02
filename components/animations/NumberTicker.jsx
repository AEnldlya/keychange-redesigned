'use client'
import { useRef, useEffect, useState, useMemo } from 'react'

/**
 * NumberTicker — Animated digit ticker that flips/rolls individual digits.
 * Inspired by 21st.dev / Magic UI number ticker.
 *
 * Unlike FlipCounter (which smoothly interpolates), this creates a
 * "mechanical odometer" feel with individual digit columns.
 *
 * Features:
 *  - Individual digit column animation
 *  - Cascading stagger from right to left
 *  - CSS transform-based (no layout thrashing)
 *  - IntersectionObserver trigger
 *  - Configurable prefix, suffix, separator
 *
 * Props:
 *  - target (number): end value
 *  - duration (number): animation duration seconds, default 2
 *  - delay (number): start delay seconds, default 0
 *  - prefix (string): text before number
 *  - suffix (string): text after number
 *  - separator (boolean): thousands separators, default true
 *  - className, style
 */
export default function NumberTicker({
  target = 0,
  duration = 2,
  delay = 0,
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
        if (entry.isIntersecting) { setVisible(true); io.disconnect() }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Format target into individual digits with separators
  const parts = useMemo(() => {
    const str = separator ? target.toLocaleString() : String(target)
    return str.split('').map((ch, i) => ({
      char: ch,
      isDigit: /\d/.test(ch),
      digit: parseInt(ch, 10),
      key: i,
    }))
  }, [target, separator])

  const digitCount = parts.filter((p) => p.isDigit).length
  let digitIndex = 0

  return (
    <span
      ref={ref}
      className={`kc-number-ticker ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        overflow: 'hidden',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
      aria-label={`${prefix}${separator ? target.toLocaleString() : target}${suffix}`}
    >
      {prefix && <span>{prefix}</span>}
      {parts.map((part) => {
        if (!part.isDigit) {
          return (
            <span key={part.key} aria-hidden="true">
              {part.char}
            </span>
          )
        }

        const idx = digitIndex++
        // Stagger from right (last digit) to left
        const staggerDelay = delay + ((digitCount - 1 - idx) / digitCount) * (duration * 0.3)

        return (
          <span
            key={part.key}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              height: '1.1em',
              overflow: 'hidden',
              lineHeight: '1.1em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: visible
                  ? `translateY(-${part.digit * 1.1}em)`
                  : 'translateY(0)',
                transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
                willChange: 'transform',
              }}
            >
              {/* Render 0-9 stacked vertically */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <span
                  key={d}
                  style={{
                    display: 'block',
                    height: '1.1em',
                    lineHeight: '1.1em',
                  }}
                >
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
