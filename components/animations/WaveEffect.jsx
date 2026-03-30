'use client'
import { useMemo } from 'react'

/**
 * WaveEffect — Animated SVG wave divider with multiple layers.
 *
 * Props:
 *  - color (string): base wave color, default 'rgba(245,197,24,0.06)'
 *  - layers (number): number of wave layers, default 3
 *  - height (number): height of the wave area in px, default 120
 *  - className, style
 */
export default function WaveEffect({
  color = 'rgba(245,197,24,0.06)',
  layers = 3,
  height = 120,
  className = '',
  style = {},
}) {
  const waves = useMemo(() => {
    return Array.from({ length: layers }, (_, i) => {
      const opacity = 1 - i * 0.25
      const dur = 6 + i * 2
      const yOffset = i * 8
      const amplitude = 12 + i * 4
      return { opacity, dur, yOffset, amplitude, key: i }
    })
  }, [layers])

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
            animation: `kc-wave-drift-${wave.key} ${wave.dur}s ease-in-out infinite`,
          }}
        >
          <path
            d={`M0,${60 - wave.amplitude} C360,${60 + wave.amplitude} 720,${60 - wave.amplitude} 1080,${60 + wave.amplitude} C1260,${60 - wave.amplitude} 1440,${60 + wave.amplitude} 1440,${60 + wave.amplitude} L1440,120 L0,120Z`}
            fill={color}
          />
        </svg>
      ))}
      <style>{`
        ${waves.map((w) => `
          @keyframes kc-wave-drift-${w.key} {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-25%); }
          }
        `).join('')}
      `}</style>
    </div>
  )
}
