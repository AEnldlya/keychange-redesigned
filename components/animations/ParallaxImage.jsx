'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * ParallaxImage — Image that scrolls at a different rate than the page.
 *
 * Props:
 *  - src (string): image source URL
 *  - alt (string): alt text
 *  - speed (number): parallax intensity, default 0.3 (0 = fixed, 1 = normal scroll)
 *  - height (string|number): container height, default 400
 *  - overlay (boolean): show dark overlay, default false
 *  - overlayOpacity (number): overlay opacity 0-1, default 0.3
 *  - children: content layered on top
 *  - className, style
 */
export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.3,
  height = 400,
  overlay = false,
  overlayOpacity = 0.3,
  children,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null)
  const [offset, setOffset] = useState(0)

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewH = window.innerHeight
    // Only calculate when in viewport (+ buffer)
    if (rect.bottom < -100 || rect.top > viewH + 100) return
    const progress = (viewH - rect.top) / (viewH + rect.height)
    setOffset((progress - 0.5) * speed * 200)
  }, [speed])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      className={`kc-parallax-image ${className}`}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '110%',
          height: '130%',
          objectFit: 'cover',
          transform: `translate(-50%, calc(-50% + ${offset}px))`,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0,0,0,${overlayOpacity})`,
            pointerEvents: 'none',
          }}
        />
      )}
      {children && (
        <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
          {children}
        </div>
      )}
    </div>
  )
}
