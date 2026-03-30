'use client'
import { useMemo, useId } from 'react'

/**
 * FloatingParticles — Ambient floating dots/circles with CSS keyframe animation.
 *
 * Props:
 *  - count (number): particle count, default 20
 *  - color (string): particle color, default 'rgba(245,197,24,0.12)'
 *  - minSize (number): min particle size px, default 3
 *  - maxSize (number): max particle size px, default 8
 *  - speed (number): animation speed multiplier, default 1
 *  - className, style
 */
export default function FloatingParticles({
  count = 20,
  color = 'rgba(245,197,24,0.12)',
  minSize = 3,
  maxSize = 8,
  speed = 1,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')

  const particles = useMemo(() => {
    // Seeded pseudo-random for SSR consistency
    let seed = 42
    function rand() {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    return Array.from({ length: count }, (_, i) => {
      const size = minSize + rand() * (maxSize - minSize)
      const x = rand() * 100
      const startY = rand() * 100
      const dur = (8 + rand() * 12) / speed
      const delay = rand() * dur
      const drift = (rand() - 0.5) * 60
      const opacity = 0.3 + rand() * 0.7
      return { size, x, startY, dur, delay, drift, opacity, key: i }
    })
  }, [count, minSize, maxSize, speed])

  return (
    <div
      className={`kc-floating-particles ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      {particles.map((p) => {
        const animName = `kc-float-${uid}-${p.key}`
        return (
          <div key={p.key}>
            <div
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.startY}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: color,
                opacity: p.opacity,
                animation: `${animName} ${p.dur}s ease-in-out ${p.delay}s infinite`,
                willChange: 'transform, opacity',
              }}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes ${animName} {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: ${p.opacity}; }
                    25% { transform: translateY(-${30 + p.dur}px) translateX(${p.drift * 0.3}px); }
                    50% { transform: translateY(-${60 + p.dur * 2}px) translateX(${p.drift}px); opacity: ${p.opacity * 0.5}; }
                    75% { transform: translateY(-${30 + p.dur}px) translateX(${p.drift * 0.6}px); }
                  }
                `,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
