'use client'
import { useId } from 'react'

/**
 * Marquee — Infinite scrolling content ticker.
 * Inspired by Magic UI / 21st.dev marquee components.
 *
 * Features:
 *  - CSS-only infinite scroll (no JS)
 *  - Duplicated content for seamless loop
 *  - Configurable direction, speed, pause on hover
 *  - Gradient fade edges
 *  - Accessible: aria-hidden on duplicate
 *
 * Props:
 *  - children (ReactNode): items to scroll
 *  - speed (number): scroll duration seconds, default 30
 *  - direction ('left'|'right'|'up'|'down'): scroll direction, default 'left'
 *  - pauseOnHover (boolean): pause on mouse hover, default true
 *  - gap (number): gap between items px, default 24
 *  - fade (boolean): gradient fade at edges, default true
 *  - fadeWidth (number): fade zone width px, default 80
 *  - className, style
 */
export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  gap = 24,
  fade = true,
  fadeWidth = 80,
  className = '',
  style = {},
}) {
  const uid = useId().replace(/:/g, '')
  const animName = `kc-marquee-${uid}`
  const isVertical = direction === 'up' || direction === 'down'
  const isReverse = direction === 'right' || direction === 'down'

  const scrollStyle = isVertical
    ? {
        flexDirection: 'column',
        animation: `${animName} ${speed}s linear infinite`,
        animationDirection: isReverse ? 'reverse' : 'normal',
      }
    : {
        flexDirection: 'row',
        animation: `${animName} ${speed}s linear infinite`,
        animationDirection: isReverse ? 'reverse' : 'normal',
      }

  const fadeGradient = isVertical
    ? `linear-gradient(to bottom, transparent, white ${fadeWidth}px, white calc(100% - ${fadeWidth}px), transparent)`
    : `linear-gradient(to right, transparent, white ${fadeWidth}px, white calc(100% - ${fadeWidth}px), transparent)`

  return (
    <>
      <div
        className={`kc-marquee ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          ...(fade ? { WebkitMaskImage: fadeGradient, maskImage: fadeGradient } : {}),
          ...style,
        }}
      >
        <div
          className="kc-marquee__track"
          style={{
            display: 'flex',
            gap,
            width: 'max-content',
            ...scrollStyle,
            ...(pauseOnHover ? {} : {}),
          }}
          onMouseEnter={pauseOnHover ? (e) => { e.currentTarget.style.animationPlayState = 'paused' } : undefined}
          onMouseLeave={pauseOnHover ? (e) => { e.currentTarget.style.animationPlayState = 'running' } : undefined}
        >
          <div style={{ display: 'flex', gap, flexShrink: 0, ...(isVertical ? { flexDirection: 'column' } : {}) }}>
            {children}
          </div>
          <div style={{ display: 'flex', gap, flexShrink: 0, ...(isVertical ? { flexDirection: 'column' } : {}) }} aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: isVertical
            ? `@keyframes ${animName} { from { transform: translateY(0); } to { transform: translateY(-50%); } }`
            : `@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
        }}
      />
    </>
  )
}
