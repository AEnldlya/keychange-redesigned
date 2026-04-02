'use client'
import { useState, useCallback } from 'react'

/**
 * RippleButton — Button with Material-style ripple click effect.
 * Inspired by premium button interactions.
 *
 * Features:
 *  - Click spawns expanding ripple at cursor position
 *  - Multiple simultaneous ripples supported
 *  - Auto-cleanup after animation
 *  - Configurable ripple color, duration
 *
 * Props:
 *  - children (ReactNode): button content
 *  - rippleColor (string): ripple fill, default 'rgba(245,197,24,0.3)'
 *  - rippleDuration (number): ripple animation ms, default 600
 *  - as (string): wrapper tag, default 'button'
 *  - className, style, onClick, ...rest
 */
export default function RippleButton({
  children,
  rippleColor = 'rgba(245,197,24,0.3)',
  rippleDuration = 600,
  as: Tag = 'button',
  className = '',
  style = {},
  onClick,
  ...rest
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      const id = Date.now()

      setRipples((prev) => [...prev, { id, x, y, size }])

      // Auto-cleanup
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, rippleDuration)

      onClick?.(e)
    },
    [onClick, rippleDuration]
  )

  return (
    <>
      <Tag
        className={`kc-ripple-btn ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          ...style,
        }}
        onClick={handleClick}
        {...rest}
      >
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: r.y,
              left: r.x,
              width: r.size,
              height: r.size,
              borderRadius: '50%',
              background: rippleColor,
              transform: 'scale(0)',
              animation: `kc-ripple-expand ${rippleDuration}ms ease-out forwards`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </Tag>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes kc-ripple-expand {
              0% { transform: scale(0); opacity: 1; }
              100% { transform: scale(1); opacity: 0; }
            }
          `,
        }}
      />
    </>
  )
}
