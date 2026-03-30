'use client'
import { useId } from 'react'

/**
 * GradientShift — Animated background gradient that smoothly shifts between colors.
 *
 * Props:
 *  - colors (string[]): gradient color stops, default warm gold/blue palette
 *  - angle (number): gradient angle degrees, default 135
 *  - duration (number): full cycle seconds, default 8
 *  - size (number): background size multiplier (bigger = smoother), default 400
 *  - children, className, style
 */
export default function GradientShift({
  children,
  colors = ['#F5C518', '#2560E8', '#9B59B6', '#F5C518'],
  angle = 135,
  duration = 8,
  size = 400,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-gradient-shift-${uid}`

  const gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`

  return (
    <>
      <div
        className={`kc-gradient-shift ${className}`}
        style={{
          background: gradient,
          backgroundSize: `${size}% ${size}%`,
          animation: `${animName} ${duration}s ease infinite`,
          ...style,
        }}
      >
        {children}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${animName} {
              0% { background-position: 0% 50%; }
              25% { background-position: 100% 50%; }
              50% { background-position: 100% 100%; }
              75% { background-position: 0% 100%; }
              100% { background-position: 0% 50%; }
            }
          `,
        }}
      />
    </>
  )
}
