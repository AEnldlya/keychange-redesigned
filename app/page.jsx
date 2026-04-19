'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import {
  Music,
  Search,
  HandHeart,
  Play,
  ArrowRight,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react'

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '', y = 40 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── HERO — scroll-activated video ─── */
function HeroSection() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.52, 0.88])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const unsub = scrollYProgress.on('change', (v) => {
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = v * video.duration
      }
    })
    return () => unsub()
  }, [scrollYProgress])

  return (
    <section ref={containerRef} className="hero2">
      {/* Parallax media layer */}
      <motion.div className="hero2-media" style={{ scale }}>
        {/* Place generated video at /public/assets/hero-video.mp4 */}
        <video
          ref={videoRef}
          className="hero2-video"
          src="/assets/hero-video.mp4"
          muted
          playsInline
          preload="auto"
        />
        <img src="/assets/hero.webp" alt="" className="hero2-img" aria-hidden="true" />
        <motion.div className="hero2-overlay" style={{ opacity: overlayOpacity }} />
      </motion.div>

      {/* Text layer */}
      <motion.div className="hero2-body" style={{ y: textY, opacity: textOpacity }}>
        <motion.span
          className="hero2-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Student-Led Nonprofit
        </motion.span>

        <motion.h1
          className="hero2-headline"
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Music belongs<br />to everyone
        </motion.h1>

        <motion.p
          className="hero2-sub"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          3.6 million students in the US lack access to music education.
          We collect unused instruments and put them in the hands of
          students who need them most.
        </motion.p>

        <motion.div
          className="hero2-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/get-involved" className="btn2-primary">
            Get Involved <ArrowUpRight size={17} />
          </Link>
          <Link href="/donate" className="btn2-ghost">
            Donate an Instrument
          </Link>
        </motion.div>
      </motion.div>

      <div className="hero2-hint" aria-hidden="true">
        <motion.span
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </div>
    </section>
  )
}

/* ─── TICKER ─── */
function TickerBar() {
  const items = [
    '3.6M students without music education',
    'Student-led · Upper Valley',
    'Collect · Inspect · Match · Play',
    'Donate your unused instrument',
    'Every instrument tells a story',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-hidden="true">
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-sep">♪</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── IMPACT ─── */
function ImpactSection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="impact2-grid">
          <Reveal className="impact2-stat" delay={0}>
            <span className="impact2-num">3.6M</span>
            <p className="impact2-label">Students without access to music education</p>
            <span className="impact2-source">Source: 2019 NAEP Arts Assessment</span>
          </Reveal>

          <div className="impact2-copy">
            <Reveal delay={0.1}><h2>The gap is real</h2></Reveal>
            <Reveal delay={0.18}>
              <p>
                Budget cuts and rising instrument costs have left millions of
                students on the sidelines. Schools cannot afford equipment.
                Families cannot afford rentals. Meanwhile, thousands of
                instruments sit unused in closets and attics.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p>
                We bridge that gap — collecting, inspecting, and redistributing
                instruments to students and programs that need them.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const steps = [
    { number: '01', title: 'Collect', description: 'We receive instrument donations from community members, schools, and music stores.', icon: Music },
    { number: '02', title: 'Inspect', description: 'Each instrument is evaluated, cleaned, and prepared for its next musician.', icon: Search },
    { number: '03', title: 'Match', description: 'We partner with schools to identify students who need instruments.', icon: HandHeart },
    { number: '04', title: 'Play', description: 'Instruments go directly into students hands, ready to make music.', icon: Play },
  ]

  return (
    <section className="section">
      <div className="container">
        <Reveal className="how2-header">
          <h2>How it works</h2>
          <p>Four steps from donation to first notes</p>
        </Reveal>
        <div className="how2-grid">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.09}>
              <motion.div
                className="how2-card"
                whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.25 }}
              >
                <span className="how2-num">{step.number}</span>
                <step.icon size={26} className="how2-icon" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── STORY ─── */
function StorySection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="story2-grid">
          <Reveal className="story2-media" y={60}>
            <div className="story2-img-wrap">
              <img src="/assets/guitarra.webp" alt="Guitar" />
              <div className="story2-badge">Est. 2022</div>
            </div>
          </Reveal>
          <div className="story2-copy">
            <Reveal delay={0.05}><span className="eyebrow">Our Story</span></Reveal>
            <Reveal delay={0.12}><h2>Started by students,<br />for students</h2></Reveal>
            <Reveal delay={0.2}>
              <p>
                Key Change began when two high schoolers noticed something wrong.
                Their school had a thriving music program. Other schools just
                miles away had nothing. The instruments existed. The students
                existed. Only the connection was missing.
              </p>
            </Reveal>
            <Reveal delay={0.27}>
              <p>
                What started as a single instrument drive has grown into a
                sustained effort to democratize music access across the Upper Valley.
              </p>
            </Reveal>
            <Reveal delay={0.34}>
              <Link href="/about" className="btn2-outline">
                Read Our Story <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── GALLERY ─── */
function GallerySection() {
  const photos = [
    { src: '/assets/microphone.webp', alt: 'Microphone', cls: 'large' },
    { src: '/assets/guitarra.webp', alt: 'Guitar', cls: 'normal' },
    { src: '/assets/drums.webp', alt: 'Drums', cls: 'normal' },
    { src: '/assets/music-stand.webp', alt: 'Music stand', cls: 'wide' },
  ]
  return (
    <section className="section">
      <div className="container">
        <Reveal className="gallery2-header">
          <h2>Every instrument tells a story</h2>
          <p>From donated guitars to refurbished keyboards, each piece carries potential.</p>
        </Reveal>
        <div className="gallery2-grid">
          {photos.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 0.08}
              className={`gallery2-item gallery2-${photo.cls}`}
            >
              <motion.div
                className="gallery2-inner"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={photo.src} alt={photo.alt} />
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="gallery2-cta">
          <a
            href="https://instagram.com/keychangeproject/"
            target="_blank"
            rel="noopener"
            className="btn2-outline"
          >
            Follow our journey <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── CONTACT ─── */
function ContactSection() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      message: fd.get('message'),
      newsletter: fd.get('newsletter') === 'yes',
    }

    const newErrors = {}
    if (!data.first_name) newErrors.first_name = 'First name is required'
    if (!data.last_name) newErrors.last_name = 'Last name is required'
    if (!data.email) newErrors.email = 'Email is required'
    if (!data.message) newErrors.message = 'Message is required'

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setErrors({})
    setSubmitError('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Home Page' }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setSubmitError(body.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="contact2-grid">
          <div className="contact2-info">
            <Reveal><span className="eyebrow eyebrow-light">Get in touch</span></Reveal>
            <Reveal delay={0.08}><h2 className="contact2-heading">Let's make music<br />together</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="contact2-desc">
                Have an instrument to donate? Want to volunteer?
                Just curious? We would love to hear from you.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="contact2-details">
                <div>
                  <strong>Email</strong>
                  <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
                </div>
                <div>
                  <strong>Instagram</strong>
                  <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">
                    @keychangeproject
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="contact2-form-wrap">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle size={56} className="form-success-icon" />
                  <h3>Message sent</h3>
                  <p>Thanks for reaching out. We will get back to you within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="contact2-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name <span>(required)</span></label>
                      <input type="text" name="first_name" className={`form-input ${errors.first_name ? 'error' : ''}`} placeholder="Jane" />
                      {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name <span>(required)</span></label>
                      <input type="text" name="last_name" className={`form-input ${errors.last_name ? 'error' : ''}`} placeholder="Smith" />
                      {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email <span>(required)</span></label>
                    <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="jane@example.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <label className="form-checkbox">
                    <input type="checkbox" name="newsletter" value="yes" />
                    <span>Keep me updated on Key Change news</span>
                  </label>

                  <div className="form-group">
                    <label className="form-label">Message <span>(required)</span></label>
                    <textarea name="message" className={`form-textarea ${errors.message ? 'error' : ''}`} placeholder="Tell us how you would like to help..." rows={5} />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  {status === 'error' && (
                    <div className="form-error" style={{ marginBottom: '1rem' }}>
                      {submitError || 'Something went wrong. Please try again.'}
                    </div>
                  )}

                  <button type="submit" className="btn2-submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending…' : 'Send Message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── PAGE ROOT ─── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TickerBar />
      <ImpactSection />
      <HowItWorks />
      <StorySection />
      <GallerySection />
      <ContactSection />
    </>
  )
}
