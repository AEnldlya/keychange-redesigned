'use client'

const BURST = [
  { char: '♪', angle: 15,  dist: 95,  size: 1.4, delay: 0.00 },
  { char: '♫', angle: 45,  dist: 115, size: 1.1, delay: 0.05 },
  { char: '♩', angle: 75,  dist: 80,  size: 1.6, delay: 0.10 },
  { char: '♬', angle: 105, dist: 105, size: 1.0, delay: 0.03 },
  { char: '♪', angle: 135, dist: 88,  size: 1.3, delay: 0.08 },
  { char: '♫', angle: 165, dist: 100, size: 1.2, delay: 0.01 },
  { char: '♩', angle: 195, dist: 82,  size: 1.5, delay: 0.06 },
  { char: '♬', angle: 225, dist: 108, size: 1.1, delay: 0.11 },
  { char: '♪', angle: 255, dist: 78,  size: 1.4, delay: 0.04 },
  { char: '♫', angle: 285, dist: 98,  size: 1.0, delay: 0.09 },
  { char: '♩', angle: 315, dist: 87,  size: 1.3, delay: 0.02 },
  { char: '♬', angle: 345, dist: 93,  size: 1.6, delay: 0.07 },
]

export default function FormSuccess({
  title = 'Submitted!',
  message = "We'll be in touch soon.",
  variant = 'celebrate',
}) {
  const isCelebrate = variant === 'celebrate'

  const notes = isCelebrate
    ? BURST.map(n => ({
        ...n,
        x: Math.cos((n.angle * Math.PI) / 180) * n.dist,
        y: Math.sin((n.angle * Math.PI) / 180) * n.dist,
      }))
    : []

  return (
    <div className={`kc-fs${isCelebrate ? '' : ' kc-fs--quiet'}`} role="status" aria-live="polite">
      <div className="kc-fs__emblem">
        {isCelebrate ? (
          <>
            <div className="kc-fs__ring kc-fs__ring--1" />
            <div className="kc-fs__ring kc-fs__ring--2" />
            <div className="kc-fs__ring kc-fs__ring--3" />
          </>
        ) : (
          <div className="kc-fs__ring kc-fs__ring--1" />
        )}
        <div className="kc-fs__icon">{isCelebrate ? '♪' : '✓'}</div>
        {notes.map((n, i) => (
          <span
            key={i}
            className="kc-fs__burst"
            style={{
              '--tx': `${n.x}px`,
              '--ty': `${n.y}px`,
              '--sz': n.size,
              animationDelay: `${n.delay}s`,
            }}
          >
            {n.char}
          </span>
        ))}
      </div>
      <h3 className="kc-fs__title">{title}</h3>
      <p className="kc-fs__msg">{message}</p>
    </div>
  )
}
