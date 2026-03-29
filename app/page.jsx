'use client'
import { useEffect, useRef, useMemo, useState } from 'react'
import Link from 'next/link'
import { useReveal } from '../hooks/useReveal'
import FormSuccess from '../components/FormSuccess'
import ScrollChevron from '../components/ScrollChevron'
import { validateEmail, validateRequired, validateForm } from '../lib/validate'

/* ── Floating notes ── */
function HeroNotes() {
  const chars = ['♩', '♪', '♫', '♬']
  const notes = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 95 + 2,
      size: 0.9 + Math.random() * 1.8,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 8,
    })), [])

  return (
    <div className="kc-hero__notes" aria-hidden="true">
      {notes.map(n => (
        <span
          key={n.id}
          className="kc-hero__note"
          style={{
            '--note-x': `${n.x}%`,
            '--note-size': `${n.size}rem`,
            '--note-dur': `${n.dur}s`,
            '--note-delay': `${n.delay}s`,
          }}
        >
          {n.char}
        </span>
      ))}
    </div>
  )
}

/* ── Hero Section ── */
function HeroSection() {
  const bgRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      if (bgRef.current && window.scrollY < window.innerHeight * 1.5) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="kc-hero">
      <div className="kc-hero__parallax" ref={bgRef}>
        <img src="/assets/hero.webp" alt="" aria-hidden="true" className="kc-hero__img" />
      </div>
      <div className="kc-hero__overlay" />
      <HeroNotes />
      <div className="kc-hero__content">
        <h1 className="kc-hero__headline">
          <span className="kc-hero__line">
            <span className="kc-hero__thin">Making</span>
            <span className="kc-hero__serif">&nbsp;Music</span>
          </span>
          <span className="kc-hero__line">
            <span className="kc-hero__serif">Accessible</span>
          </span>
          <span className="kc-hero__line">
            <span className="kc-hero__thin">to All</span>
            <span className="kc-hero__serif">&nbsp;Students</span>
          </span>
        </h1>
        <div className="kc-hero__ctas">
          <Link href="/get-involved" className="kc-btn kc-btn--gold">Get Involved</Link>
          <Link href="/donate" className="kc-btn kc-btn--outline">Donate</Link>
        </div>
      </div>
      <ScrollChevron className="kc-chevron--hero" />
    </section>
  )
}

/* ── Impact Stat ── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

function StatSection() {
  const [ref, visible] = useReveal({ threshold: 0.25 })
  const countRef = useRef(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!visible || triggered.current || !countRef.current) return
    triggered.current = true
    const target = 3609698
    const duration = 2500
    const start = performance.now()
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      countRef.current.textContent = Math.floor(easeOutCubic(progress) * target).toLocaleString()
      if (progress < 1) requestAnimationFrame(tick)
      else countRef.current.textContent = target.toLocaleString()
    }
    requestAnimationFrame(tick)
  }, [visible])

  return (
    <section className={`kc-section kc-stat kc-reveal${visible ? ' visible' : ''}`} ref={ref}>
      <div className="kc-container">
        <p className="kc-stat__source">According to the 2019 Current newsletter</p>
        <span className="kc-stat__number" ref={countRef}>0</span>
        <p className="kc-stat__label">
          students across the United States do not have access to music education in public schools
        </p>
        <div className="kc-stat__divider" />
        <p className="kc-stat__body">
          Due to the high costs of music equipment, schools&apos; music programs suffer from budget cuts and outdated supplies.
        </p>
      </div>
      <ScrollChevron />
    </section>
  )
}

/* ── How It Works ── */
const STEPS = [
  { icon: '🎸', title: 'Collect', desc: 'Donors submit instruments they no longer use through our simple form.' },
  { icon: '🔧', title: 'Inspect & Repair', desc: 'We inspect every instrument and make repairs so it\'s ready to play.' },
  { icon: '🤝', title: 'Match', desc: 'We connect instruments with students and programs that need them most.' },
  { icon: '🎵', title: 'Play', desc: 'Students receive instruments and begin their musical journey.' },
]

function HowItWorks() {
  const [ref, visible] = useReveal({ threshold: 0.15 })
  return (
    <section className={`kc-section kc-how kc-reveal${visible ? ' visible' : ''}`} ref={ref}>
      <div className="kc-container">
        <h2 className="kc-how__heading">How It Works</h2>
        <div className="kc-how__grid kc-stagger">
          {STEPS.map((step, i) => (
            <div key={i} className="kc-how__step" style={{ '--i': i }}>
              <div className="kc-how__icon">{step.icon}</div>
              <h3 className="kc-how__step-title">{step.title}</h3>
              <p className="kc-how__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Our Story ── */
function StorySection() {
  const [imgRef, imgVisible] = useReveal({ threshold: 0.15 })
  const [textRef, textVisible] = useReveal({ threshold: 0.15 })

  return (
    <section className="kc-story">
      <div className={`kc-story__image-wrap${imgVisible ? ' visible' : ''}`} ref={imgRef}>
        <img src="/assets/microphone.webp" alt="Microphone close-up" className="kc-story__img" />
      </div>
      <div className={`kc-story__text-wrap${textVisible ? ' visible' : ''}`} ref={textRef}>
        <h2 className="kc-story__heading">Our Story</h2>
        <p className="kc-story__intro">
          Ansh and Jason noticed a growing gap between students who could access music education
          and those who could not, and they decided to do something about it. They founded Key
          Change, a student-led initiative that collects instruments, music supplies, and donations,
          then connects them with schools and students who need them most.
        </p>
        <p className="kc-story__body">
          Their mission is simple and powerful: to create a world where every student can experience
          the joy of making music. Key Change provides instruments, funds lessons, and supports
          programs that inspire young musicians. The organization also welcomes volunteers and donors,
          inviting communities to join in bringing instruments, instruction, and musical opportunities
          to students.
        </p>
        <p className="kc-story__body">
          Since its founding, Key Change has focused on practical, sustainable impact—repairing and
          refurbishing donated instruments, matching resources to school needs, and building
          partnerships with educators to ensure students get both tools and guidance. By harnessing
          the energy and empathy of students, Key Change aims not only to fill a resource gap but to
          spark lasting musical journeys for kids who might otherwise be left out.
        </p>
        <Link href="/about" className="kc-btn kc-btn--outline">Learn More</Link>
      </div>
      <ScrollChevron />
    </section>
  )
}

/* ── Social Gallery ── */
const GALLERY = [
  { src: '/assets/microphone.webp', alt: 'Microphone',  note: '♩' },
  { src: '/assets/guitarra.webp',   alt: 'Guitar',      note: '♪' },
  { src: '/assets/music-stand.webp', alt: 'Music stand', note: '♫' },
  { src: '/assets/drums.webp',       alt: 'Drum kit',    note: '♬' },
]

function GalleryItem({ item, index }) {
  const [ref, visible] = useReveal({ threshold: 0.1 })
  return (
    <a
      href="https://instagram.com/keychangeproject/"
      target="_blank"
      rel="noopener"
      className="kc-social__item"
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      <img src={item.src} alt={item.alt} />
      <div className="kc-social__overlay">
        <span className="kc-social__overlay-icon">{item.note}</span>
      </div>
    </a>
  )
}

function SocialSection() {
  const [headRef, headVisible] = useReveal()

  return (
    <section className="kc-section kc-social">
      <h2 className={`kc-social__heading kc-reveal${headVisible ? ' visible' : ''}`} ref={headRef}>
        Follow Us on Social
      </h2>
      <div className="kc-social__grid">
        {GALLERY.map((item, i) => (
          <GalleryItem key={i} item={item} index={i} />
        ))}
      </div>
      <div className="kc-social__cta">
        <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" className="kc-btn kc-btn--outline">
          Follow on Instagram
        </a>
      </div>
      <ScrollChevron />
    </section>
  )
}

/* ── Contact Section ── */
function ContactSection() {
  const [leftRef, leftVisible] = useReveal()
  const [rightRef, rightVisible] = useReveal()
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      message: fd.get('message'),
    }

    const validationErrors = validateForm(data, {
      first_name: [v => validateRequired(v, 'First name')],
      last_name: [v => validateRequired(v, 'Last name')],
      email: [v => validateRequired(v, 'Email'), validateEmail],
      message: [v => validateRequired(v, 'Message')],
    })
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          newsletter: fd.get('newsletter') === 'yes',
          source: 'Home Page',
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="kc-section kc-contact">
      <div className="kc-contact__inner">
        <div className={`kc-contact__left${leftVisible ? ' visible' : ''}`} ref={leftRef}>
          <h2 className="kc-contact__heading">Contact Us</h2>
          <p className="kc-contact__sub">
            Interested in working together or having a burning question? Tell us a bit about yourself
            and we&apos;ll get back to you soon. We can&apos;t wait to hear from you!
          </p>
        </div>
        <div className={`kc-contact__right${rightVisible ? ' visible' : ''}`} ref={rightRef}>
          <div className="kc-glass kc-glass--gold">
            {status === 'success' ? (
              <FormSuccess
                variant="quiet"
                title="Message sent!"
                message="We'll be in touch soon."
              />
            ) : (
              <form onSubmit={handleSubmit} className="kc-form">
                <div className="kc-form__row">
                  <div className="kc-form__field">
                    <label className="kc-form__label">First Name <span className="kc-form__req">(required)</span></label>
                    <input type="text" name="first_name" required placeholder="First" className={errors.first_name ? 'error' : ''} />
                    {errors.first_name && <span className="kc-form__error">{errors.first_name}</span>}
                  </div>
                  <div className="kc-form__field">
                    <label className="kc-form__label">Last Name <span className="kc-form__req">(required)</span></label>
                    <input type="text" name="last_name" required placeholder="Last" className={errors.last_name ? 'error' : ''} />
                    {errors.last_name && <span className="kc-form__error">{errors.last_name}</span>}
                  </div>
                </div>
                <div className="kc-form__field">
                  <label className="kc-form__label">Email <span className="kc-form__req">(required)</span></label>
                  <input type="email" name="email" required placeholder="your@email.com" className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="kc-form__error">{errors.email}</span>}
                </div>
                <label className="kc-checkbox">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Sign up for news and updates</span>
                </label>
                <div className="kc-form__field">
                  <label className="kc-form__label">Message <span className="kc-form__req">(required)</span></label>
                  <textarea name="message" rows="5" required placeholder="Tell us about yourself..." className={errors.message ? 'error' : ''} />
                  {errors.message && <span className="kc-form__error">{errors.message}</span>}
                </div>
                {status === 'error' && (
                  <div className="kc-form__status kc-form__status--error" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
                <button type="submit" className="kc-btn kc-btn--gold kc-btn--full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Home page ── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <StatSection />
      <HowItWorks />
      <StorySection />
      <SocialSection />
      <ContactSection />
    </>
  )
}
