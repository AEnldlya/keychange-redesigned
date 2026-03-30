'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * MorphingShapes — Decorative SVG blob that morphs between organic shapes.
 * Uses CSS @keyframes for zero-dependency smooth animation.
 *
 * Props:
 *  - color (string): fill color, default 'rgba(245,197,24,0.06)'
 *  - size (number): width/height in px, default 400
 *  - duration (number): morph cycle in seconds, default 20
 *  - className, style
 */
export default function MorphingShapes({
  color = 'rgba(245,197,24,0.06)',
  size = 400,
  duration = 20,
  className = '',
  style = {},
}) {
  const id = useRef(`morph-${Math.random().toString(36).slice(2, 8)}`).current

  // Three organic blob paths to morph between
  const paths = [
    'M45,0 C60,5 80,15 90,35 C100,55 95,80 80,90 C65,100 40,100 25,90 C10,80 0,60 5,40 C10,20 30,-5 45,0Z',
    'M50,2 C70,0 95,20 95,45 C95,70 85,95 60,98 C35,101 5,85 2,60 C-1,35 30,4 50,2Z',
    'M40,5 C55,-2 85,10 95,30 C105,50 90,85 70,95 C50,105 15,95 5,75 C-5,55 25,12 40,5Z',
  ]

  return (
    <div
      className={`kc-morphing-shapes ${className}`}
      style={{
        width: size,
        height: size,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <path fill={color}>
          <animate
            attributeName="d"
            dur={`${duration}s`}
            repeatCount="indefinite"
            values={`${paths[0]};${paths[1]};${paths[2]};${paths[0]}`}
            keyTimes="0;0.33;0.66;1"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
          />
        </path>
      </svg>
    </div>
  )
}
