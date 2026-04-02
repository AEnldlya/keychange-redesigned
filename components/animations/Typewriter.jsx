'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Typewriter — Typing animation that cycles through phrases.
 * Inspired by 21st.dev / Aceternity typewriter components.
 *
 * Features:
 *  - Types, pauses, then deletes and moves to next phrase
 *  - Configurable speeds for typing, deleting, pause
 *  - Blinking cursor
 *  - IntersectionObserver to start only when visible
 *  - Accessible aria-label with all phrases
 *
 * Props:
 *  - phrases (string[]): phrases to cycle through
 *  - typeSpeed (number): typing speed ms per char, default 80
 *  - deleteSpeed (number): delete speed ms per char, default 40
 *  - pauseDuration (number): pause at full phrase ms, default 2000
 *  - loop (boolean): loop through phrases, default true
 *  - cursor (boolean): show blinking cursor, default true
 *  - cursorChar (string): cursor character, default '|'
 *  - cursorColor (string): cursor color, default '#F5C518'
 *  - as (string): wrapper tag, default 'span'
 *  - className, style
 */
export default function Typewriter({
  phrases = ['Music for All', 'Key Change Project'],
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  loop = true,
  cursor = true,
  cursorChar = '|',
  cursorColor = '#F5C518',
  as: Tag = 'span',
  className = '',
  style = {},
}) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  // Intersection observer
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); io.disconnect() } },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex]
    if (!currentPhrase) return

    if (isDeleting) {
      setDisplayText(currentPhrase.substring(0, displayText.length - 1))
      if (displayText.length <= 1) {
        setIsDeleting(false)
        setPhraseIndex((prev) => {
          const next = prev + 1
          if (next >= phrases.length) return loop ? 0 : prev
          return next
        })
      }
    } else {
      setDisplayText(currentPhrase.substring(0, displayText.length + 1))
      if (displayText.length + 1 === currentPhrase.length) {
        // Pause then start deleting
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
        return
      }
    }
  }, [displayText, phraseIndex, isDeleting, phrases, loop, pauseDuration])

  useEffect(() => {
    if (!isVisible) return
    const speed = isDeleting ? deleteSpeed : typeSpeed
    timeoutRef.current = setTimeout(tick, speed)
    return () => clearTimeout(timeoutRef.current)
  }, [tick, isDeleting, deleteSpeed, typeSpeed, isVisible])

  return (
    <Tag
      ref={ref}
      className={`kc-typewriter ${className}`}
      style={{ display: 'inline', ...style }}
      aria-label={phrases.join(', ')}
    >
      <span aria-hidden="true">{displayText}</span>
      {cursor && (
        <span
          aria-hidden="true"
          style={{
            color: cursorColor,
            fontWeight: 100,
            animation: 'kc-typewriter-blink 0.7s step-end infinite',
            marginLeft: 2,
          }}
        >
          {cursorChar}
        </span>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes kc-typewriter-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `,
        }}
      />
    </Tag>
  )
}
