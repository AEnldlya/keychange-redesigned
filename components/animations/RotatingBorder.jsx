'use client'
import { useId } from 'react'

/**
 * RotatingBorder — Animated rotating gradient border around content.
 *
 * Uses a conic-gradient that spins continuously, clipped to a border shape
 * using a pseudo-element + mask technique for clean rendering.
 *
 * Props:
 *  - colors (string[]): border gradient colors, default gold/blue
 *  - borderWidth (number): border thickness px, default 2
 *  - borderRadius (number): corner radius px, default 16
 *  - duration (number): rotation cycle seconds, default 3
 *  - background (string): inner background color, default '#0a0a15'
 *  - children, className, style
 */
export default function RotatingBorder({
  children,
  colors = ['#F5C518', '#2560E8', '#9B59B6', '#F5C518'],
  borderWidth = 2,
  borderRadius = 16,
  duration = 3,
  background = '#0a0a15',
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-rot-border-${uid}`
  const conicGradient = `conic-gradient(from 0deg, ${colors.join(', ')})`

  return (
    <>
      <div
        className={`kc-rotating-border ${className}`}
        style={{
          position: 'relative',
          borderRadius,
          padding: borderWidth,
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Rotating gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            background: conicGradient,
            animation: `${animName} ${duration}s linear infinite`,
            // Enlarge and center so rotation doesn't clip corners
            width: '150%',
            height: '150%',
            top: '-25%',
            left: '-25%',
          }}
          aria-hidden="true"
        />
        {/* Inner content area with solid background */}
        <div
          style={{
            position: 'relative',
            background,
            borderRadius: borderRadius - borderWidth,
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${animName} {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `,
        }}
      />
    </>
  )
}
