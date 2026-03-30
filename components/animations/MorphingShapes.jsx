'use client'

/**
 * MorphingShapes — Decorative SVG blob that morphs between organic shapes.
 *
 * Features:
 *  - SVG SMIL <animate> for silky morph transitions
 *  - Four distinct organic blob keyframes
 *  - Spline-based easing for natural feel
 *  - Zero external dependencies (pure SVG animation)
 *  - aria-hidden for accessibility
 *  - No SSR issues ('use client')
 *  - React 18 compatible
 *
 * Props:
 *  - color (string): fill color, default 'rgba(245,197,24,0.06)'
 *  - size (number): width/height px, default 400
 *  - duration (number): full morph cycle seconds, default 20
 *  - rotate (boolean): add slow rotation, default false
 *  - className, style
 */
export default function MorphingShapes({
  color = 'rgba(245,197,24,0.06)',
  size = 400,
  duration = 20,
  rotate = false,
  className = '',
  style = {},
}) {
  // Four organic blob paths for smooth morphing
  const paths = [
    'M45,0 C60,5 80,15 90,35 C100,55 95,80 80,90 C65,100 40,100 25,90 C10,80 0,60 5,40 C10,20 30,-5 45,0Z',
    'M50,2 C70,0 95,20 95,45 C95,70 85,95 60,98 C35,101 5,85 2,60 C-1,35 30,4 50,2Z',
    'M40,5 C55,-2 85,10 95,30 C105,50 90,85 70,95 C50,105 15,95 5,75 C-5,55 25,12 40,5Z',
    'M48,3 C65,0 90,18 92,42 C94,66 78,92 55,97 C32,102 8,82 3,58 C-2,34 31,6 48,3Z',
  ]

  const animationValues = paths.map((p) => p).concat(paths[0]).join(';')
  const keyTimes = '0;0.25;0.5;0.75;1'
  const keySplines = '0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1'

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
        style={{
          overflow: 'visible',
          animation: rotate ? `kc-morph-rotate ${duration * 2}s linear infinite` : undefined,
        }}
      >
        <path fill={color}>
          <animate
            attributeName="d"
            dur={`${duration}s`}
            repeatCount="indefinite"
            values={animationValues}
            keyTimes={keyTimes}
            calcMode="spline"
            keySplines={keySplines}
          />
        </path>
      </svg>
      {rotate && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes kc-morph-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `,
          }}
        />
      )}
    </div>
  )
}
