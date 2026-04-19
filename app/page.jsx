'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion'
import { Music, Search, HandHeart, Play, ArrowRight, CheckCircle, ArrowUpRight } from 'lucide-react'

/* ─── Spring config (UX Pro Max: spring physics) ─── */
const spring = { type: 'spring', stiffness: 400, damping: 30 }
const springSmooth = { type: 'spring', stiffness: 200, damping: 28 }

/* ─── Staggered reveal variants (21st.dev pattern) ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = '', y = 36 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ════════════════════════════════════════════════
   HERO — Pinned 300vh scroll, multi-phase
════════════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /* Scrub video with scroll */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const vid = videoRef.current
    if (vid?.duration && isFinite(vid.duration)) {
      vid.currentTime = v * vid.duration
    }
  })

  /* Background parallax */
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])

  /* Phase 1 — Eyebrow + Headline (0 → 0.3) */
  const p1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.22, 0.32], [0, 1, 1, 0])
  const p1Y      = useTransform(scrollYProgress, [0, 0.06, 0.22, 0.32], [50, 0, 0, -40])

  /* Phase 2 — Subtext (0.1 → 0.42) */
  const p2Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.32, 0.42], [0, 1, 1, 0])
  const p2Y       = useTransform(scrollYProgress, [0.08, 0.16], [30, 0])

  /* Phase 3 — Stats (0.35 → 0.65) */
  const p3Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.58, 0.68], [0, 1, 1, 0])
  const p3Y       = useTransform(scrollYProgress, [0.32, 0.42], [40, 0])

  /* Phase 4 — CTA (0.55 → 0.88) */
  const p4Opacity = useTransform(scrollYProgress, [0.52, 0.62, 0.8, 0.9], [0, 1, 1, 0])

  /* Scroll hint fades out early */
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        {/* BG */}
        <motion.div className="hero-bg" style={{ scale: bgScale }}>
          <video
            ref={videoRef}
            className="hero-bg-video"
            src="/assets/hero-video.mp4"
            muted playsInline preload="auto"
          />
          <img src="/assets/hero.webp" alt="" className="hero-bg-img" aria-hidden />
          <div className="hero-bg-overlay" />
        </motion.div>

        {/* Phase 1 — Headline */}
        <motion.div className="hero-phase" style={{ opacity: p1Opacity, y: p1Y }}>
          <span className="hero-eyebrow">Student-Led Nonprofit</span>
          <h1 className="hero-headline">
            Music belongs<br />to everyone
          </h1>
        </motion.div>

        {/* Phase 2 — Subtext */}
        <motion.div className="hero-phase" style={{ opacity: p2Opacity, y: p2Y }}>
          <p className="hero-sub" style={{ maxWidth: 520 }}>
            3.6 million students in the US lack access to music education.
            We collect unused instruments and put them in the hands of students who need them most.
          </p>
        </motion.div>

        {/* Phase 3 — Stats */}
        <motion.div className="hero-phase" style={{ opacity: p3Opacity, y: p3Y }}>
          <div className="hero-stat-row">
            {[
              { num: '3.6M', label: 'Students without music' },
              { num: '100+', label: 'Instruments donated' },
              { num: '5+',   label: 'Partner schools' },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phase 4 — CTA */}
        <motion.div className="hero-phase hero-phase-cta" style={{ opacity: p4Opacity }}>
          <div className="hero-actions">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/get-involved" className="btn btn-primary">
                Get Involved <ArrowUpRight size={17} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/donate" className="btn btn-ghost">
                Donate an Instrument
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="hero-scroll-hint" style={{ opacity: hintOpacity }}>
          <div className="hero-scroll-line" />
          <span>scroll</span>
        </motion.div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   TICKER
════════════════════════════════════════════════ */
function TickerBar() {
  const items = [
    'Music belongs to everyone',
    'Student-led · Upper Valley, NH',
    'Collect · Inspect · Match · Play',
    'Donate your unused instrument',
    '3.6M students need access',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-hidden>
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="ticker-item">
            {t}<span className="ticker-dot">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   IMPACT
════════════════════════════════════════════════ */
function ImpactSection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="impact-grid">
          <Reveal delay={0}>
            <div className="impact-card">
              <span className="impact-num">3.6M</span>
              <p className="impact-label">Students without access to music education</p>
              <span className="impact-source">Source: 2019 NAEP Arts Assessment</span>
            </div>
          </Reveal>
          <div className="impact-copy">
            <Reveal delay={0.08}><h2>The gap is real</h2></Reveal>
            <Reveal delay={0.16}>
              <p>Budget cuts and rising instrument costs have left millions of students on the sidelines. Schools cannot afford equipment. Families cannot afford rentals. Meanwhile, thousands of instruments sit unused.</p>
            </Reveal>
            <Reveal delay={0.24}>
              <p>We bridge that gap — collecting, inspecting, and redistributing instruments to students and programs that need them.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════
   HOW IT WORKS
════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { number: '01', title: 'Collect',  description: 'We receive instrument donations from community members, schools, and music stores.', icon: Music },
    { number: '02', title: 'Inspect',  description: 'Each instrument is evaluated, cleaned, and prepared for its next musician.', icon: Search },
    { number: '03', title: 'Match',    description: 'We partner with schools to identify students who need instruments.', icon: HandHeart },
    { number: '04', title: 'Play',     description: 'Instruments go directly into students hands, ready to make music.', icon: Play },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section">
      <div className="container">
        <Reveal className="how-header">
          <span className="eyebrow">The Process</span>
          <h2>How it works</h2>
          <p>Four steps from donation to first notes</p>
        </Reveal>

        <motion.div
          ref={ref}
          className="how-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {steps.map((step) => (
            <motion.div key={step.number} className="how-card" variants={itemVariants}>
              <span className="how-num">{step.number}</span>
              <step.icon size={26} className="how-icon" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════
   STORY
════════════════════════════════════════════════ */
function StorySection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="story-grid">
          <Reveal className="story-media" y={60}>
            <div className="story-img-wrap">
              <img src="/assets/guitarra.webp" alt="Guitar" />
              <div className="story-badge">Est. 2022</div>
            </div>
          </Reveal>
          <div className="story-copy">
            <Reveal><span className="eyebrow">Our Story</span></Reveal>
            <Reveal delay={0.08}><h2>Started by students,<br />for students</h2></Reveal>
            <Reveal delay={0.16}><p>Key Change began when two high schoolers noticed something wrong. Their school had a thriving music program. Other schools just miles away had nothing. The instruments existed. The students existed. Only the connection was missing.</p></Reveal>
            <Reveal delay={0.24}><p>What started as a single instrument drive has grown into a sustained effort to democratize music access across the Upper Valley.</p></Reveal>
            <Reveal delay={0.3}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} style={{ display: 'inline-block', marginTop: 'var(--sp-6)' }}>
                <Link href="/about" className="btn btn-outline-dark">
                  Read Our Story <ArrowRight size={16} />
                </Link>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════
   GALLERY — Interactive Bento (21st.dev pattern)
════════════════════════════════════════════════ */
function GallerySection() {
  const photos = [
    { src: '/assets/microphone.webp', alt: 'Microphone',   label: 'Voice',         cls: 'gallery-large' },
    { src: '/assets/guitarra.webp',   alt: 'Guitar',       label: 'Guitar',        cls: '' },
    { src: '/assets/drums.webp',      alt: 'Drums',        label: 'Percussion',    cls: '' },
    { src: '/assets/music-stand.webp',alt: 'Music stand',  label: 'Sheet Music',   cls: 'gallery-wide' },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section">
      <div className="container">
        <Reveal className="gallery-header">
          <span className="eyebrow">Gallery</span>
          <h2>Every instrument tells a story</h2>
          <p>From donated guitars to refurbished keyboards, each piece carries potential.</p>
        </Reveal>

        <motion.div
          ref={ref}
          className="gallery-bento"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {photos.map((p) => (
            <motion.div key={p.src} className={`gallery-item ${p.cls}`} variants={itemVariants}>
              <motion.div
                className="gallery-inner"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={p.src} alt={p.alt} />
                <div className="gallery-inner-overlay">
                  <span>{p.label}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.2} className="gallery-cta">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring} style={{ display: 'inline-block' }}>
            <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" className="btn btn-outline-dark">
              Follow our journey <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════ */
function ContactSection() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      first_name: fd.get('first_name'), last_name: fd.get('last_name'),
      email: fd.get('email'), message: fd.get('message'),
      newsletter: fd.get('newsletter') === 'yes',
    }
    const errs = {}
    if (!data.first_name) errs.first_name = 'Required'
    if (!data.last_name)  errs.last_name  = 'Required'
    if (!data.email)      errs.email      = 'Required'
    if (!data.message)    errs.message    = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({}); setSubmitError(''); setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Home Page' }),
      })
      const body = await res.json().catch(() => ({}))
      res.ok ? setStatus('success') : (setStatus('error'), setSubmitError(body.error || 'Something went wrong.'))
    } catch { setStatus('error'); setSubmitError('Something went wrong.') }
  }

  return (
    <section className="section section-dark">
      <div className="container">
        <div className="contact-grid">
          <div>
            <Reveal><span className="eyebrow eyebrow-light">Get in touch</span></Reveal>
            <Reveal delay={0.08}><h2 className="contact-heading">Let's make music<br />together</h2></Reveal>
            <Reveal delay={0.16}><p className="contact-desc">Have an instrument to donate? Want to volunteer? Just curious? We'd love to hear from you.</p></Reveal>
            <Reveal delay={0.22}>
              <div className="contact-links">
                {[
                  { label: 'Email', value: 'keychange.team@gmail.com', href: 'mailto:keychange.team@gmail.com' },
                  { label: 'Instagram', value: '@keychangeproject', href: 'https://instagram.com/keychangeproject/' },
                ].map((l) => (
                  <div key={l.label} className="contact-link-item">
                    <span className="contact-link-label">{l.label}</span>
                    <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{l.value}</a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="contact-form-box">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="ok" className="form-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <CheckCircle size={52} style={{ color: 'var(--blue)', margin: '0 auto var(--sp-6)' }} />
                    <h3>Message sent</h3>
                    <p>We'll get back to you within 48 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit}>
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
                      <textarea name="message" className={`form-textarea ${errors.message ? 'error' : ''}`} placeholder="Tell us how you'd like to help..." rows={5} />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>
                    {status === 'error' && <div className="form-error" style={{ marginBottom: 'var(--sp-4)' }}>{submitError}</div>}
                    <button type="submit" className="form-submit" disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Sending…' : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
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
