'use client'
import { useMemo, useId } from 'react'

/**
 * MeteorShower — Animated meteors streaking across the background.
 * Inspired by Aceternity UI's meteor effect.
 *
 * Features:
 *  - Pure CSS animations (no JS RAF)
 *  - Randomized trajectories, speeds, and sizes
 *  - Configurable count, colors, angle
 *  - Unique keyframes per instance via useId
 *  - aria-hidden for accessibility
 *  - No SSR hydration issues
 *
 * Props:
 *  - count (number): meteor count, default 20
 *  - color (string): meteor head color, default '#F5C518'
 *  - trailColor (string): trail gradient end, default 'transparent'
 *  - angle (number): streak angle degrees, default 215
 *  - minSpeed (number): min animation duration seconds, default 2
 *  - maxSpeed (number): max animation duration seconds, default 8
 *  - className, style
 */
export default function MeteorShower({
  count = 20,
  color = '#F5C518',
  trailColor = 'transparent',
  angle = 215,
  minSpeed = 2,
  maxSpeed = 8,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')

  const meteors = useMemo(() => {
    let seed = 137
    function rand() {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    return Array.from({ length: count }, (_, i) => {
      const top = rand() * 100 - 10
      const left = rand() * 100 + 10
      const dur = minSpeed + rand() * (maxSpeed - minSpeed)
      const delay = rand() * dur * 2
      const width = 80 + rand() * 180
      const height = 1 + rand() * 1.5
      return { top, left, dur, delay, width, height, key: i }
    })
  }, [count, minSpeed, maxSpeed])

  return (
    <div
      className={`kc-meteor-shower ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      {meteors.map((m) => {
        const animName = `kc-meteor-${uid}-${m.key}`
        return (
          <div key={m.key}>
            <div
              style={{
                position: 'absolute',
                top: `${m.top}%`,
                left: `${m.left}%`,
                width: m.width,
                height: m.height,
                borderRadius: '9999px',
                background: `linear-gradient(${angle}deg, ${color}, ${color}80 30%, ${trailColor})`,
                boxShadow: `0 0 6px 1px ${color}40`,
                transform: `rotate(${angle}deg)`,
                animation: `${animName} ${m.dur}s linear ${m.delay}s infinite`,
                willChange: 'transform, opacity',
              }}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes ${animName} {
                    0% { transform: rotate(${angle}deg) translateX(0); opacity: 0; }
                    5% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { transform: rotate(${angle}deg) translateX(-800px); opacity: 0; }
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
