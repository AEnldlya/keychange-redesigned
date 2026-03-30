'use client'
import { useId } from 'react'

/**
 * PulseGlow — Continuous pulsing glow ring around content.
 *
 * Props:
 *  - color (string): glow color, default '#F5C518'
 *  - size (number): glow spread px, default 20
 *  - duration (number): pulse cycle seconds, default 2
 *  - rings (number): number of concentric pulse rings, default 1
 *  - children, className, style
 */
export default function PulseGlow({
  children,
  color = '#F5C518',
  size = 20,
  duration = 2,
  rings = 1,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')

  return (
    <div
      className={`kc-pulse-glow ${className}`}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
    >
      {/* Pulse rings */}
      {Array.from({ length: rings }, (_, i) => {
        const animName = `kc-pulse-${uid}-${i}`
        const delay = (i / rings) * duration
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                inset: -size / 2,
                borderRadius: 'inherit',
                border: `2px solid ${color}`,
                opacity: 0,
                animation: `${animName} ${duration}s ease-out ${delay}s infinite`,
                pointerEvents: 'none',
              }}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes ${animName} {
                    0% { transform: scale(0.85); opacity: 0.6; }
                    100% { transform: scale(1.3); opacity: 0; }
                  }
                `,
              }}
            />
          </div>
        )
      })}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          boxShadow: `0 0 ${size}px ${color}40`,
          borderRadius: 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  )
}
