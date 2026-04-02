'use client'
import { useMemo, useId } from 'react'

/**
 * Sparkles — Animated sparkle/star particles around content.
 * Inspired by Aceternity UI / Josh Comeau's sparkle effect.
 *
 * Features:
 *  - SVG star shapes with randomized positions
 *  - CSS keyframe scale + rotate animation
 *  - Seeded pseudo-random for SSR consistency
 *  - Configurable count, colors, size range
 *  - Wraps children inline
 *
 * Props:
 *  - children (ReactNode): content to wrap
 *  - count (number): sparkle count, default 10
 *  - color (string): sparkle color, default '#F5C518'
 *  - minSize (number): min sparkle size px, default 8
 *  - maxSize (number): max sparkle size px, default 24
 *  - speed (number): animation speed multiplier, default 1
 *  - className, style
 */
function SparkleShape({ size, color, animName, dur, delay }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      style={{
        animation: `${animName} ${dur}s ease-in-out ${delay}s infinite`,
        willChange: 'transform, opacity',
      }}
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 97.496 62.504C110.707 83.7154 152 88 152 88C152 88 110.707 92.2846 97.496 113.496C84.2846 134.707 80 176 80 176C80 176 75.7154 134.707 62.504 113.496C49.2926 92.2846 8 88 8 88C8 88 49.2926 83.7154 62.504 62.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  )
}

export default function Sparkles({
  children,
  count = 10,
  color = '#F5C518',
  minSize = 8,
  maxSize = 24,
  speed = 1,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')

  const sparkles = useMemo(() => {
    let seed = 73
    function rand() {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    return Array.from({ length: count }, (_, i) => {
      const size = minSize + rand() * (maxSize - minSize)
      const top = rand() * 100
      const left = rand() * 100
      const dur = (1.5 + rand() * 2) / speed
      const delay = rand() * dur
      const animName = `kc-sparkle-${uid}-${i}`
      return { size, top, left, dur, delay, animName, key: i }
    })
  }, [count, minSize, maxSize, speed, uid])

  return (
    <>
      <span
        className={`kc-sparkles ${className}`}
        style={{
          position: 'relative',
          display: 'inline-block',
          ...style,
        }}
      >
        {sparkles.map((s) => (
          <span
            key={s.key}
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              zIndex: 2,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
            aria-hidden="true"
          >
            <SparkleShape
              size={s.size}
              color={color}
              animName={s.animName}
              dur={s.dur}
              delay={s.delay}
            />
          </span>
        ))}
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </span>
      <style
        dangerouslySetInnerHTML={{
          __html: sparkles
            .map(
              (s) => `
            @keyframes ${s.animName} {
              0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
              50% { transform: scale(1) rotate(180deg); opacity: 1; }
            }`
            )
            .join('\n'),
        }}
      />
    </>
  )
}
