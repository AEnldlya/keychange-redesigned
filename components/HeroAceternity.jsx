'use client'
import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform, AnimatePresence } from 'framer-motion'

/**
 * HeroAceternity — Aceternity-style animated hero section
 * 
 * Features:
 * - Mouse spotlight effect (amber glow follows cursor)
 * - 3D tilt on headline
 * - Text reveal animation with blur
 * - Magnetic buttons
 * - Floating particles/orbs
 * - Scroll progress bar
 */

/* ── Mouse Spotlight Effect ── */
function MouseSpotlight({ children, className = '' }) {
  const ref = useRef(null)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 })

  const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(245,197,24,0.12), transparent 50%)`
  const glowBg = useMotionTemplate`radial-gradient(300px circle at ${smoothX}px ${smoothY}px, rgba(245,197,24,0.25), transparent 40%)`

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Large subtle spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.5s ease',
          background: spotlightBg,
        }}
        aria-hidden="true"
      />
      {/* Intense glow at cursor */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: hovering ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: glowBg,
        }}
        aria-hidden="true"
      />
      <div style={{ position: 'relative', zIndex: 3 }}>{children}</div>
    </div>
  )
}

/* ── 3D Tilt Headline ── */
function TiltHeadline({ children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 30 })

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }, [x, y])

  const handleLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ── Text Reveal with Blur ── */
function TextRevealBlur({ text, as: Tag = 'span', className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-flex', marginRight: '0.3em' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={visible ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * 0.1) + (charIndex * 0.02),
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/* ── Magnetic Button ── */
function MagneticButton({ children, strength = 0.4, className = '', href, onClick }) {
  const ref = useRef(null)
  const xRaw = useMotionValue(0)
  const yRaw = useMotionValue(0)
  const x = useSpring(xRaw, { stiffness: 200, damping: 20, mass: 0.5 })
  const y = useSpring(yRaw, { stiffness: 200, damping: 20, mass: 0.5 })

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    xRaw.set(dx * strength)
    yRaw.set(dy * strength)
  }, [xRaw, yRaw, strength])

  const handleLeave = useCallback(() => {
    xRaw.set(0)
    yRaw.set(0)
  }, [xRaw, yRaw])

  const Component = href ? motion.a : motion.button
  const linkProps = href ? { href } : {}

  return (
    <Component
      ref={ref}
      className={`kc-btn ${className}`}
      style={{ x, y, display: 'inline-flex', position: 'relative' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      {...linkProps}
    >
      {children}
    </Component>
  )
}

/* ── Floating Orbs ── */
function FloatingOrbs({ count = 6 }) {
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 100 + Math.random() * 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 5,
      blur: 60 + Math.random() * 40,
      opacity: 0.15 + Math.random() * 0.15,
    }))
  }, [count])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: 'radial-gradient(circle, rgba(245,197,24,0.4) 0%, rgba(245,197,24,0.1) 50%, transparent 70%)',
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ── Scroll Progress Bar ── */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #F5C518 0%, #FFD54F 50%, #F5C518 100%)',
        zIndex: 9999,
        transformOrigin: 'left',
        boxShadow: '0 0 10px rgba(245, 197, 24, 0.5)',
      }}
      animate={{ scaleX: progress }}
      transition={{ duration: 0.1, ease: 'linear' }}
    />
  )
}

/* ── Typewriter Effect ── */
function TypewriterEffect({ phrases, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const phrase = phrases[currentIndex]
    
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 40)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentText === phrase) {
        setIsPaused(true)
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(phrase.slice(0, currentText.length + 1))
        }, 60)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentText, isDeleting, isPaused, currentIndex, phrases])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ color: '#F5C518' }}
      >
        |
      </motion.span>
    </span>
  )
}

/* ── Main Hero Component ── */
export default function HeroAceternity() {
  const headlineWords = ['Making', 'Music', 'Accessible', 'to', 'All', 'Students']

  return (
    <>
      <ScrollProgressBar />
      <MouseSpotlight className="kc-hero-aceternity">
        <FloatingOrbs count={8} />
        
        {/* Background gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 80%, rgba(37, 96, 232, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(245, 197, 24, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, rgba(15, 25, 35, 0.7) 0%, rgba(15, 25, 35, 0.95) 100%)
            `,
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '900px' }}>
            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ marginBottom: '32px' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(245, 197, 24, 0.1)',
                  border: '1px solid rgba(245, 197, 24, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#F5C518',
                  letterSpacing: '0.05em',
                }}
              >
                <span style={{ fontSize: '1rem' }}>🎵</span>
                Student-led nonprofit
              </span>
            </motion.div>

            {/* Main Headline with 3D Tilt */}
            <TiltHeadline>
              <h1
                style={{
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: '32px',
                  color: '#F0F4F8',
                }}
              >
                <span style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.3em' }}>
                  {headlineWords.map((word, index) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, filter: 'blur(20px)', y: 40 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.3 + index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        display: 'inline-block',
                        background: word === 'Music' || word === 'Accessible'
                          ? 'linear-gradient(135deg, #F5C518 0%, #FFD54F 100%)'
                          : 'inherit',
                        WebkitBackgroundClip: word === 'Music' || word === 'Accessible' ? 'text' : 'inherit',
                        WebkitTextFillColor: word === 'Music' || word === 'Accessible' ? 'transparent' : '#F0F4F8',
                        backgroundClip: word === 'Music' || word === 'Accessible' ? 'text' : 'inherit',
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
            </TiltHeadline>

            {/* Tagline with typewriter */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: 'rgba(240, 244, 248, 0.7)',
                marginBottom: '48px',
                lineHeight: 1.6,
                minHeight: '2.5em',
              }}
            >
              <TypewriterEffect
                phrases={[
                  'Recycling instruments for students in need',
                  'Building community through music',
                  'Every student deserves a chance to play',
                ]}
              />
            </motion.p>

            {/* CTA Buttons with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <MagneticButton
                href="/get-involved"
                className="kc-btn--gold"
                style={{
                  padding: '16px 32px',
                  background: '#F5C518',
                  color: '#0F1923',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(245, 197, 24, 0.4)',
                }}
              >
                Get Involved
              </MagneticButton>
              <MagneticButton
                href="/donate"
                className="kc-btn--outline"
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#F0F4F8',
                  border: '1.5px solid rgba(240, 244, 248, 0.3)',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Donate
              </MagneticButton>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '48px',
                marginTop: '64px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: '3M+', label: 'Students reached' },
                { value: '500+', label: 'Instruments donated' },
                { value: '50+', label: 'Schools partnered' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display), Georgia, serif',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#F5C518',
                      marginBottom: '4px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(240, 244, 248, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '24px',
              height: '40px',
              border: '2px solid rgba(245, 197, 24, 0.4)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px',
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '4px',
                height: '8px',
                background: '#F5C518',
                borderRadius: '2px',
              }}
            />
          </motion.div>
        </motion.div>
      </MouseSpotlight>

      {/* CSS for responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          .kc-hero-aceternity {
            padding: 0 16px;
          }
        }
      `}</style>
    </>
  )
}
