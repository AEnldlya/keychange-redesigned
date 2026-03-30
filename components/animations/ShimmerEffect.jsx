'use client'
import { useId } from 'react'

/**
 * ShimmerEffect — Animated shimmer/skeleton loading placeholder.
 *
 * Props:
 *  - width (string|number): width, default '100%'
 *  - height (string|number): height, default 20
 *  - borderRadius (string|number): radius, default 8
 *  - baseColor (string): base bg color, default '#1a1a2e'
 *  - shimmerColor (string): shimmer highlight, default 'rgba(245,197,24,0.08)'
 *  - duration (number): animation duration seconds, default 1.5
 *  - className, style
 */
export default function ShimmerEffect({
  width = '100%',
  height = 20,
  borderRadius = 8,
  baseColor = '#1a1a2e',
  shimmerColor = 'rgba(245,197,24,0.08)',
  duration = 1.5,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-shimmer-${uid}`

  return (
    <>
      <div
        className={`kc-shimmer ${className}`}
        style={{
          width,
          height,
          borderRadius,
          background: `linear-gradient(90deg, ${baseColor} 25%, ${shimmerColor} 50%, ${baseColor} 75%)`,
          backgroundSize: '200% 100%',
          animation: `${animName} ${duration}s ease-in-out infinite`,
          ...style,
        }}
        aria-hidden="true"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${animName} {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `,
        }}
      />
    </>
  )
}
