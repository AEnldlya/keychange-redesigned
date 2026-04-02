'use client'
import { useId } from 'react'

/**
 * BorderBeam — A beam of light that travels along the border of a container.
 * Inspired by Magic UI's border beam effect.
 *
 * Features:
 *  - CSS-only animated beam traveling along border
 *  - Conic gradient technique for smooth border traversal
 *  - Configurable speed, size, colors
 *  - Works on any border-radius
 *  - No JS animation loop needed
 *
 * Props:
 *  - size (number): beam width px, default 200
 *  - duration (number): full circuit seconds, default 6
 *  - delay (number): animation delay seconds, default 0
 *  - borderWidth (number): border thickness, default 2
 *  - colorFrom (string): beam start color, default '#F5C518'
 *  - colorTo (string): beam end color, default '#2560E8'
 *  - borderRadius (number): container border radius, default 16
 *  - background (string): inner background, default 'transparent'
 *  - children, className, style
 */
export default function BorderBeam({
  children,
  size = 200,
  duration = 6,
  delay = 0,
  borderWidth = 2,
  colorFrom = '#F5C518',
  colorTo = '#2560E8',
  borderRadius = 16,
  background = 'transparent',
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-border-beam-${uid}`
  const beamAngle = Math.round((size / (4 * 200)) * 360)

  return (
    <>
      <div
        className={`kc-border-beam ${className}`}
        style={{
          position: 'relative',
          borderRadius,
          padding: borderWidth,
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Animated beam border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              inset: `-${size}px`,
              background: `conic-gradient(from 0deg at 50% 50%, transparent ${360 - beamAngle}deg, ${colorFrom} ${360 - beamAngle / 2}deg, ${colorTo} 360deg)`,
              animation: `${animName} ${duration}s linear ${delay}s infinite`,
            }}
          />
        </div>

        {/* Static base border (subtle) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            border: `${borderWidth}px solid rgba(245,197,24,0.1)`,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Inner content */}
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
