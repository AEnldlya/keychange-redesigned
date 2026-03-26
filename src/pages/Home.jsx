import { useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

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
    <div className="m-hero__notes" aria-hidden="true">
      {notes.map(n => (
        <span
          key={n.id}
          className="m-hero__note"
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

/* ── Hero ── */
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
    <section className="m-hero">
      <div className="m-hero__parallax" ref={bgRef}>
        <img src="/assets/hero.webp" alt="" aria-hidden="true" className="m-hero__img" />
      </div>
      <div className="m-hero__overlay" />
      <HeroNotes />
      <div className="m-hero__content">
        <h1 className="m-hero__headline">
          <span className="m-hero__line m-hero__line--1">
            <span className="m-hl-thin">Making</span>
            <span className="m-hl-serif">&nbsp;Music</span>
          </span>
          <span className="m-hero__line m-hero__line--2">
            <span className="m-hl-big">Accessible</span>
          </span>
          <span className="m-hero__line m-hero__line--3">
            <span className="m-hl-thin">to All</span>
            <span className="m-hl-serif">&nbsp;Students</span>
          </span>
        </h1>
        <div className="m-hero__ctas">
          <Link to="/get-involved" className="m-btn m-btn--gold">Get Involved</Link>
          <Link to="/donate" className="m-btn m-btn--outline">Donate</Link>
        </div>
      </div>
      <div className="m-hero__scroll-hint" aria-hidden="true">
        <div className="m-hero__scroll-line" />
      </div>
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
      const p = Math.min((now - start) / duration, 1)
      countRef.current.textContent = Math.floor(easeOutCubic(p) * target).toLocaleString()
      if (p < 1) requestAnimationFrame(tick)
      else countRef.current.textContent = target.toLocaleString()
    }
    requestAnimationFrame(tick)
  }, [visible])

  return (
    <section className={`m-stat${visible ? ' visible' : ''}`} ref={ref}>
      <div className="m-stat__inner">
        <p className="m-stat__source">According to the 2019 Brcurrent newsletter</p>
        <div className="m-stat__number-wrap">
          <span className="m-stat__number" ref={countRef}>0</span>
        </div>
        <p className="m-stat__label">
          students across the United States do not have access to music education in public schools
        </p>
        <div className="m-stat__divider" />
        <p className="m-stat__body">
          Due to the high costs of music equipment, schools&apos; music programs suffer from budget cuts and outdated supplies.
        </p>
      </div>
    </section>
  )
}

/* ── Our Story ── */
function StorySection() {
  const [imgRef, imgVisible] = useReveal({ threshold: 0.15 })
  const [textRef, textVisible] = useReveal({ threshold: 0.15 })

  return (
    <section className="m-story">
      <div className={`m-story__image-wrap${imgVisible ? ' visible' : ''}`} ref={imgRef}>
        <img src="/assets/microphone.webp" alt="Microphone" className="m-story__img" />
      </div>
      <div className={`m-story__text-wrap${textVisible ? ' visible' : ''}`} ref={textRef}>
        <h2 className="m-story__heading">Our Story</h2>
        <p className="m-story__intro">
          Ansh and Jason noticed a growing gap between students who could access music education
          and those who could not, and they decided to do something about it. They founded Key
          Change, a student-led initiative that collects instruments, music supplies, and donations,
          then connects them with schools and students who need them most.
        </p>
        <p className="m-story__body">
          Their mission is simple and powerful: to create a world where every student can experience
          the joy of making music. Key Change provides instruments, funds lessons, and supports
          programs that inspire young musicians. The organization also welcomes volunteers and donors,
          inviting communities to join in bringing instruments, instruction, and musical opportunities
          to students.
        </p>
        <p className="m-story__body">
          Since its founding, Key Change has focused on practical, sustainable impact—repairing and
          refurbishing donated instruments, matching resources to school needs, and building
          partnerships with educators to ensure students get both tools and guidance. By harnessing
          the energy and empathy of students, Key Change aims not only to fill a resource gap but to
          spark lasting musical journeys for kids who might otherwise be left out.
        </p>
        <Link to="/about" className="m-btn m-btn--light">LEARN MORE</Link>
      </div>
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
      className="m-social__item"
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      <img src={item.src} alt={item.alt} />
      <div className="m-social__overlay">
        <span className="m-social__overlay-icon">{item.note}</span>
      </div>
    </a>
  )
}

function SocialSection() {
  const [headRef, headVisible] = useReveal()

  return (
    <section className="m-social">
      <div className="m-social__header">
        <h2 className={`m-social__heading m-reveal${headVisible ? ' visible' : ''}`} ref={headRef}>
          Follow us on social
        </h2>
      </div>
      <div className="m-social__grid">
        {GALLERY.map((item, i) => (
          <GalleryItem key={i} item={item} index={i} />
        ))}
      </div>
      <div className="m-social__cta">
        <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" className="m-btn m-btn--light">
          SOCIAL
        </a>
      </div>
    </section>
  )
}

/* ── Contact ── */
function ContactSection() {
  const [leftRef, leftVisible] = useReveal()
  const [rightRef, rightVisible] = useReveal()

  return (
    <section className="m-contact">
      <div className="m-contact__inner">
        <div className={`m-contact__left${leftVisible ? ' visible' : ''}`} ref={leftRef}>
          <h2 className="m-contact__heading">Contact Us</h2>
          <p className="m-contact__sub">
            Interested in working together or having a burning question? Tell us a bit about yourself
            and we&apos;ll get back to you soon. We can&apos;t wait to hear from you!
          </p>
        </div>
        <div className={`m-contact__right${rightVisible ? ' visible' : ''}`} ref={rightRef}>
          <div className="m-contact__card">
            <form
              action="https://formspree.io/f/REPLACE_WITH_CONTACT_FORM_ID"
              method="POST"
              className="m-form"
            >
              <input type="hidden" name="_subject" value="New message — Key Change" />
              <div className="m-form__row">
                <div className="m-form__field">
                  <label className="m-form__label">First Name <span className="m-form__req">(required)</span></label>
                  <input type="text" name="first_name" required placeholder="First" />
                </div>
                <div className="m-form__field">
                  <label className="m-form__label">Last Name <span className="m-form__req">(required)</span></label>
                  <input type="text" name="last_name" required placeholder="Last" />
                </div>
              </div>
              <div className="m-form__field">
                <label className="m-form__label">Email <span className="m-form__req">(required)</span></label>
                <input type="email" name="email" required placeholder="your@email.com" />
              </div>
              <div className="m-form__field">
                <label className="m-form__label">Message <span className="m-form__req">(required)</span></label>
                <textarea name="message" rows="5" required placeholder="Tell us about yourself..." />
              </div>
              <button type="submit" className="m-btn m-btn--gold m-btn--full">SEND</button>
            </form>
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
      <StorySection />
      <SocialSection />
      <ContactSection />
    </>
  )
}
