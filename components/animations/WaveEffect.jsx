'use client'
import { useMemo, useId } from 'react'

/**
 * WaveEffect — Animated SVG wave divider with parallax-layered waves.
 *
 * Features:
 *  - Multiple wave layers with staggered timing
 *  - Pure CSS @keyframes animation (no JS RAF)
 *  - Unique IDs via useId to avoid SSR hydration mismatches
 *  - Configurable color, layers, height, speed
 *  - aria-hidden for accessibility
 *  - No SSR issues ('use client')
 *  - React 18 compatible
 *
 * Props:
 *  - color (string): base wave color, default 'rgba(245,197,24,0.06)'
 *  - layers (number): wave count, default 3
 *  - height (number): container height px, default 120
 *  - speed (number): animation speed multiplier, default 1
 *  - className, style
 */
export default function WaveEffect({
  color = 'rgba(245,197,24,0.06)',
  layers = 3,
  height = 120,
  speed = 1,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')

  const waves = useMemo(() => {
    return Array.from({ length: layers }, (_, i) => {
      const opacity = 1 - i * 0.2
      const dur = (6 + i * 2.5) / speed
      const yOffset = i * 10
      const amplitude = 14 + i * 5
      const animName = `wave-${uid}-${i}`
      return { opacity, dur, yOffset, amplitude, animName, key: i }
    })
  }, [layers, speed, uid])

  return (
    <div
      className={`kc-wave-effect ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden="true"
    >
      {waves.map((wave) => (
        <svg
          key={wave.key}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            bottom: wave.yOffset,
            left: 0,
            width: '200%',
            height: height - wave.yOffset,
            opacity: wave.opacity,
            animation: `${wave.animName} ${wave.dur}s ease-in-out infinite`,
          }}
        >
          <path
            d={`M0,${60 - wave.amplitude} C360,${60 + wave.amplitude} 720,${60 - wave.amplitude} 1080,${60 + wave.amplitude} C1260,${60 - wave.amplitude} 1440,${60 + wave.amplitude} 1440,${60 + wave.amplitude} L1440,120 L0,120Z`}
            fill={color}
          />
        </svg>
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: waves
            .map(
              (w) => `
          @keyframes ${w.animName} {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-25%); }
          }`
            )
            .join('\n'),
        }}
      />
    </div>
  )
}
