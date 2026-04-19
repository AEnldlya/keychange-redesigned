'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  animate,
} from 'framer-motion'
import {
  Music, Search, HandHeart, Play,
  ArrowRight, CheckCircle, ArrowUpRight,
} from 'lucide-react'

const spring = { type: 'spring', stiffness: 400, damping: 30 }
const HERO_SCROLL = 1500

/* ══════════════════════════════════════════════
   21st.dev — TextRevealByWord
   Scroll-driven word-by-word reveal
══════════════════════════════════════════════ */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginRight: '0.35em' }}>
      <span style={{ position: 'absolute', color: 'rgba(15,25,35,0.12)' }}>{children}</span>
      <motion.span style={{ opacity, color: 'var(--ink)' }}>{children}</motion.span>
    </span>
  )
}

function TextRevealByWord({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.1'],
  })
  const words = text.split(' ')
  return (
    <div ref={ref} style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <p style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
        lineHeight: 1.2, maxWidth: 900,
      }}>
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>
        })}
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════
   21st.dev — AnimatedCounter
   Spring-physics digit counting on scroll
══════════════════════════════════════════════ */
function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, end, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, end])

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  )
}

/* ══════════════════════════════════════════════
   21st.dev — ParallaxImg
   Individual image with scroll-driven y + scale
══════════════════════════════════════════════ */
function ParallaxImg({ src, alt, start, end, style = {} }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${Math.abs(end)}px`],
  })
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0])
  const scale  = useTransform(scrollYProgress, [0.7, 1], [1, 0.88])
  const y      = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      style={{ transform, opacity, objectFit: 'cover', borderRadius: 14, display: 'block', ...style }}
    />
  )
}

/* ══════════════════════════════════════════════
   21st.dev — CenterImage clip-path hero expand
   + ParallaxImages with instrument photos
   Adapted from "Modern Hero" pattern
══════════════════════════════════════════════ */
function HeroSection() {
  const videoRef = useRef(null)
  const { scrollY } = useScroll()

  /* Clip-path: starts as centre square, expands to full screen */
  const clip1   = useTransform(scrollY, [0, HERO_SCROLL], [20, 0])
  const clip2   = useTransform(scrollY, [0, HERO_SCROLL], [80, 100])
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`
  const bgSize   = useTransform(scrollY, [0, HERO_SCROLL + 500], ['180%', '100%'])
  const bgOpacity = useTransform(scrollY, [HERO_SCROLL, HERO_SCROLL + 500], [1, 0])

  /* Headline parallax */
  const textY       = useTransform(scrollY, [0, HERO_SCROLL], ['0%', '-25%'])
  const textOpacity = useTransform(scrollY, [0, HERO_SCROLL * 0.6], [1, 0])

  /* Scrub video */
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    return scrollY.on('change', (v) => {
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = (Math.min(v, HERO_SCROLL) / HERO_SCROLL) * vid.duration
      }
    })
  }, [scrollY])

  return (
    <div style={{ height: `calc(${HERO_SCROLL}px + 100vh)`, position: 'relative' }}>

      {/* ── Expanding clip-path background ── */}
      <motion.div
        style={{
          clipPath,
          position: 'sticky', top: 0,
          height: '100vh', width: '100%',
          opacity: bgOpacity,
          overflow: 'hidden',
        }}
      >
        <motion.div style={{ backgroundSize: bgSize, position: 'absolute', inset: '-5% -2%', backgroundImage: 'url(/assets/hero.webp)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          muted playsInline preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(160deg, rgba(15,25,35,0.78) 0%, rgba(15,25,35,0.48) 55%, rgba(15,25,35,0.72) 100%)' }} />
      </motion.div>

      {/* ── Centered headline (fades on scroll) ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <motion.div style={{ y: textY, opacity: textOpacity, textAlign: 'center', padding: '0 var(--sp-6)', pointerEvents: 'auto' }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)', marginBottom: 'var(--sp-6)' }}
          >
            Student-Led Nonprofit
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 9vw, 7rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.01em', color: '#fff', marginBottom: 'var(--sp-8)' }}
          >
            Music belongs<br />to everyone
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/get-involved" className="btn btn-primary">Get Involved <ArrowUpRight size={17} /></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/donate" className="btn btn-ghost">Donate an Instrument</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── 21st.dev ParallaxImages — instrument photos at different speeds ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6, maxWidth: 1100, margin: '0 auto', padding: '0 var(--sp-6)', pointerEvents: 'none' }}>
        <div style={{ paddingTop: 200, display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
          <ParallaxImg src="/assets/guitarra.webp"    alt="Guitar"      start={-180} end={200}  style={{ width: '32%', height: 220 }} />
          <ParallaxImg src="/assets/microphone.webp"  alt="Microphone"  start={220}  end={-260} style={{ width: '52%', height: 280, alignSelf: 'center' }} />
          <ParallaxImg src="/assets/drums.webp"       alt="Drums"       start={-180} end={200}  style={{ width: '36%', height: 220, alignSelf: 'flex-end' }} />
        </div>
      </div>

      {/* Fade to page background */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35vh', background: 'linear-gradient(to bottom, transparent, var(--bg))', zIndex: 8 }} />

      {/* Scroll hint */}
      <motion.div
        style={{ position: 'absolute', bottom: 'var(--sp-8)', left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)', opacity: useTransform(scrollY, [0, 200], [1, 0]) }}
      >
        <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>scroll</span>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   TICKER
══════════════════════════════════════════════ */
function TickerBar() {
  const items = ['Music belongs to everyone', 'Student-led · Upper Valley, NH', 'Collect · Inspect · Match · Play', 'Donate your unused instrument', '3.6M students need access']
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-hidden>
      <motion.div
        className="ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="ticker-item">{t}<span className="ticker-dot">◆</span></span>
        ))}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   21st.dev — TextRevealByWord: Mission section
══════════════════════════════════════════════ */
function MissionReveal() {
  return (
    <section className="section">
      <div className="container">
        <TextRevealByWord text="3.6 million students in the US lack access to music education. We collect unused instruments and put them in the hands of students who need them most." />
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   21st.dev AnimatedCounter — Stats section
══════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    { value: 36, suffix: 'M', label: 'Students without music access', note: 'Source: 2019 NAEP' },
    { value: 100, suffix: '+', label: 'Instruments donated', note: 'And counting' },
    { value: 5, suffix: '+', label: 'Partner schools', note: 'Upper Valley, NH & VT' },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section section-alt">
      <div className="container">
        <motion.div
          ref={ref}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              className="impact-card"
              variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } }}
              whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.12)' }}
              transition={spring}
            >
              <span className="impact-num">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </span>
              <p className="impact-label">{s.label}</p>
              <span className="impact-source">{s.note}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Context copy */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 640, margin: 'var(--sp-16) auto 0', textAlign: 'center' }}
        >
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--ink-2)' }}>
            Budget cuts and rising costs have left millions on the sidelines.
            We bridge that gap — collecting, inspecting, and redistributing
            instruments to students and programs that need them.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   21st.dev — Process Timeline (horizontal scroll)
   Adapted from ContainerScroll + ProcessCard
══════════════════════════════════════════════ */
function HowItWorks() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const steps = [
    { number: '01', title: 'Collect',  desc: 'We receive instrument donations from community members, schools, and music stores.', icon: Music },
    { number: '02', title: 'Inspect',  desc: 'Each instrument is evaluated, cleaned, and prepared for its next musician.', icon: Search },
    { number: '03', title: 'Match',    desc: 'We partner with schools to identify students who need instruments most.', icon: HandHeart },
    { number: '04', title: 'Play',     desc: 'Instruments go directly into students hands, ready to make music.', icon: Play },
  ]

  /* Each card slides in from right sequentially */
  const x0 = useTransform(scrollYProgress, [0,    0.25], ['100vw', '0vw'])
  const x1 = useTransform(scrollYProgress, [0.15, 0.4 ], ['100vw', '0vw'])
  const x2 = useTransform(scrollYProgress, [0.35, 0.6 ], ['100vw', '0vw'])
  const x3 = useTransform(scrollYProgress, [0.55, 0.8 ], ['100vw', '0vw'])
  const xs  = [x0, x1, x2, x3]

  return (
    <div ref={containerRef} style={{ height: '300vh', background: 'var(--bg-dark)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 var(--sp-6)' }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}
        >
          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--blue)', marginBottom: 'var(--sp-3)' }}>The Process</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#fff' }}>How it works</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', maxWidth: 'var(--max)', margin: '0 auto', width: '100%' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              style={{
                x: xs[i],
                padding: 'var(--sp-8)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--blue)', opacity: 0.3, display: 'block', marginBottom: 'var(--sp-3)', lineHeight: 1 }}>{step.number}</span>
              <step.icon size={24} style={{ color: 'var(--blue)', marginBottom: 'var(--sp-4)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: '#fff', marginBottom: 'var(--sp-3)' }}>{step.title}</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   STORY
══════════════════════════════════════════════ */
function StorySection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="story-grid">
          <motion.div
            className="story-media"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="story-img-wrap">
              <img src="/assets/guitarra.webp" alt="Guitar" />
              <div className="story-badge">Est. 2022</div>
            </div>
          </motion.div>

          <div className="story-copy">
            {[
              { el: <span className="eyebrow">Our Story</span>, delay: 0 },
              { el: <h2>Started by students,<br />for students</h2>, delay: 0.08 },
              { el: <p>Key Change began when two high schoolers noticed something wrong. Their school had a thriving music program. Other schools just miles away had nothing. The instruments existed. The students existed. Only the connection was missing.</p>, delay: 0.16 },
              { el: <p>What started as a single instrument drive has grown into a sustained effort to democratize music access across the Upper Valley.</p>, delay: 0.24 },
              { el: <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} style={{ display: 'inline-block' }}><Link href="/about" className="btn btn-outline-dark">Read Our Story <ArrowRight size={16} /></Link></motion.div>, delay: 0.3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.65, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: i < 4 ? 'var(--sp-4)' : 0 }}
              >
                {item.el}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   GALLERY — Interactive Bento (21st.dev pattern)
══════════════════════════════════════════════ */
function GallerySection() {
  const photos = [
    { src: '/assets/microphone.webp', alt: 'Microphone',  label: 'Voice',       cls: 'gallery-large' },
    { src: '/assets/guitarra.webp',   alt: 'Guitar',      label: 'Guitar',      cls: '' },
    { src: '/assets/drums.webp',      alt: 'Drums',       label: 'Percussion',  cls: '' },
    { src: '/assets/music-stand.webp',alt: 'Music stand', label: 'Sheet Music', cls: 'gallery-wide' },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="gallery-header"
        >
          <span className="eyebrow">Gallery</span>
          <h2>Every instrument tells a story</h2>
          <p>From donated guitars to refurbished keyboards, each piece carries potential.</p>
        </motion.div>

        <motion.div
          ref={ref}
          className="gallery-bento"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {photos.map((p) => (
            <motion.div
              key={p.src}
              className={`gallery-item ${p.cls}`}
              variants={{ hidden: { opacity: 0, y: 32, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <motion.div
                className="gallery-inner"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={p.src} alt={p.alt} />
                <div className="gallery-inner-overlay"><span>{p.label}</span></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="gallery-cta"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={spring} style={{ display: 'inline-block' }}>
            <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" className="btn btn-outline-dark">
              Follow our journey <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════ */
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
            {[
              { el: <span className="eyebrow eyebrow-light">Get in touch</span>, delay: 0 },
              { el: <h2 className="contact-heading">Let's make music<br />together</h2>, delay: 0.08 },
              { el: <p className="contact-desc">Have an instrument to donate? Want to volunteer? Just curious? We'd love to hear from you.</p>, delay: 0.16 },
              { el: (
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
              ), delay: 0.22 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.65, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: 'var(--sp-4)' }}
              >
                {item.el}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="contact-form-box"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── PAGE ROOT ── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TickerBar />
      <MissionReveal />
      <StatsSection />
      <HowItWorks />
      <StorySection />
      <GallerySection />
      <ContactSection />
    </>
  )
}
