'use client'
import { useId } from 'react'

/**
 * AnimatedGradientText — Text with an animated flowing gradient fill.
 * Inspired by Magic UI / 21st.dev gradient text components.
 *
 * Features:
 *  - CSS background-clip text technique
 *  - Smooth looping gradient animation
 *  - Configurable colors, speed, angle
 *  - Accessible: renders real text (not images)
 *  - No SSR issues
 *
 * Props:
 *  - children (ReactNode): text content
 *  - colors (string[]): gradient colors, default gold/blue/purple
 *  - duration (number): animation cycle seconds, default 4
 *  - angle (number): gradient angle degrees, default 90
 *  - as (string): HTML tag, default 'span'
 *  - className, style
 */
export default function AnimatedGradientText({
  children,
  colors = ['#F5C518', '#2560E8', '#9B59B6', '#E74C3C', '#F5C518'],
  duration = 4,
  angle = 90,
  as: Tag = 'span',
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-grad-text-${uid}`
  const gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`

  return (
    <>
      <Tag
        className={`kc-animated-gradient-text ${className}`}
        style={{
          background: gradient,
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          animation: `${animName} ${duration}s ease infinite`,
          display: 'inline-block',
          ...style,
        }}
      >
        {children}
      </Tag>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ${animName} {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `,
        }}
      />
    </>
  )
}
