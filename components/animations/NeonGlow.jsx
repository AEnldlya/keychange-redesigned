'use client'
import { useId } from 'react'

/**
 * NeonGlow — Glowing text or border with animated neon pulse.
 *
 * Props:
 *  - color (string): glow color, default '#F5C518'
 *  - intensity (number): glow spread multiplier, default 1
 *  - mode ('text' | 'border' | 'both'): where to apply glow, default 'text'
 *  - pulse (boolean): animate the glow, default true
 *  - duration (number): pulse cycle seconds, default 2
 *  - as (string): HTML tag, default 'span'
 *  - children, className, style
 */
export default function NeonGlow({
  children,
  color = '#F5C518',
  intensity = 1,
  mode = 'text',
  pulse = true,
  duration = 2,
  as: Tag = 'span',
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-neon-${uid}`

  const spread1 = Math.round(4 * intensity)
  const spread2 = Math.round(12 * intensity)
  const spread3 = Math.round(24 * intensity)

  const textShadow = mode !== 'border'
    ? `0 0 ${spread1}px ${color}, 0 0 ${spread2}px ${color}, 0 0 ${spread3}px ${color}`
    : 'none'

  const boxShadow = mode !== 'text'
    ? `0 0 ${spread1}px ${color}, 0 0 ${spread2}px ${color}, inset 0 0 ${spread1}px ${color}40`
    : 'none'

  return (
    <>
      <Tag
        className={`kc-neon-glow ${className}`}
        style={{
          color,
          textShadow,
          boxShadow,
          borderColor: mode !== 'text' ? color : undefined,
          borderWidth: mode !== 'text' ? '1px' : undefined,
          borderStyle: mode !== 'text' ? 'solid' : undefined,
          animation: pulse ? `${animName} ${duration}s ease-in-out infinite` : undefined,
          display: 'inline-block',
          ...style,
        }}
      >
        {children}
      </Tag>
      {pulse && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes ${animName} {
                0%, 100% { opacity: 1; filter: brightness(1); }
                50% { opacity: 0.85; filter: brightness(1.2); }
              }
            `,
          }}
        />
      )}
    </>
  )
}
