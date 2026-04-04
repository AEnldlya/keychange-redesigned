'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  Music,
  Search,
  HandHeart,
  Play,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span
            className={`hero-eyebrow ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            Student-Led Nonprofit
          </span>
          <h1
            className={`hero-headline ${mounted ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
          >
            Music belongs to everyone
          </h1>
          <p
            className={`hero-subhead ${mounted ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
          >
            3.6 million students in the US lack access to music education. We
            collect unused instruments and put them in the hands of students who
            need them most.
          </p>
          <div
            className={`hero-cta ${mounted ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}
          >
            <Link href="/get-involved" className="btn btn-primary">
              Get Involved
              <ArrowRight size={18} />
            </Link>
            <Link href="/donate" className="btn btn-secondary">
              Donate an Instrument
            </Link>
          </div>
        </div>
        <div
          className={`hero-image ${mounted ? 'animate-fade-in delay-200' : 'opacity-0'}`}
        >
          <img src="/assets/hero.webp" alt="Collection of musical instruments" />
        </div>
      </div>
    </section>
  )
}

function ImpactSection() {
  const [ref, isVisible] = useScrollReveal(0.2)

  return (
    <section ref={ref} className="section section-alt">
      <div className="container">
        <div className="impact-grid">
          <div className={`impact-stat ${isVisible ? 'animate-fade-in-up' : 'reveal'}`}>
            <span className="impact-number">3.6M</span>
            <p className="impact-label">Students without access to music education</p>
            <span className="impact-source">Source: 2019 NAEP Arts Assessment</span>
          </div>
          <div className={`impact-content ${isVisible ? 'animate-fade-in-up delay-200' : 'reveal'}`}>
            <h2>The gap is real</h2>
            <p>
              Budget cuts and rising instrument costs have left millions of
              students on the sidelines. Schools cannot afford equipment.
              Families cannot afford rentals. Meanwhile, thousands of
              instruments sit unused in closets and attics.
            </p>
            <p>
              We bridge that gap. Collecting, inspecting, and redistributing
              instruments to students and programs that need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const [ref, isVisible] = useScrollReveal(0.1)

  const steps = [
    {
      number: '01',
      title: 'Collect',
      description:
        'We receive instrument donations from community members, schools, and music stores.',
      icon: Music,
    },
    {
      number: '02',
      title: 'Inspect',
      description:
        'Each instrument is evaluated, cleaned, and prepared for its next musician.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Match',
      description:
        'We partner with schools to identify students who need instruments.',
      icon: HandHeart,
    },
    {
      number: '04',
      title: 'Play',
      description:
        'Instruments go directly into students hands, ready to make music.',
      icon: Play,
    },
  ]

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className={`how-header ${isVisible ? 'animate-fade-in-up' : 'reveal'}`}>
          <h2>How it works</h2>
          <p>Four steps from donation to first notes</p>
        </div>

        <div className="how-grid">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`how-step ${isVisible ? 'animate-fade-in-up' : 'reveal'}`}
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <span className="how-number">{step.number}</span>
              <step.icon
                size={24}
                style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}
              />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StorySection() {
  const [ref, isVisible] = useScrollReveal(0.2)

  return (
    <section ref={ref} className="section section-alt">
      <div className="container">
        <div className="story-grid">
          <div className={`story-image ${isVisible ? 'animate-slide-left' : 'reveal'}`}>
            <img src="/assets/guitarra.webp" alt="Guitar" />
          </div>
          <div className={`story-content ${isVisible ? 'animate-slide-right' : 'reveal'}`}>
            <span className="story-eyebrow">Our Story</span>
            <h2>Started by students, for students</h2>
            <p>
              Key Change began when two high schoolers noticed something wrong.
              Their school had a thriving music program. Other schools just
              miles away had nothing. The instruments existed. The students
              existed. Only the connection was missing.
            </p>
            <p>
              What started as a single instrument drive has grown into a
              sustained effort to democratize music access across the Upper
              Valley.
            </p>
            <Link href="/about" className="btn btn-secondary">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className={`gallery-header ${isVisible ? 'animate-fade-in-up' : 'reveal'}`}>
          <h2>Every instrument tells a story</h2>
          <p>From donated guitars to refurbished keyboards, each piece carries potential.</p>
        </div>

        <div className="gallery-grid">
          <div
            className={`gallery-item gallery-item-large ${isVisible ? 'animate-fade-in-up' : 'reveal'}`}
          >
            <img src="/assets/microphone.webp" alt="Microphone" />
          </div>
          <div
            className={`gallery-item ${isVisible ? 'animate-fade-in-up delay-100' : 'reveal'}`}
          >
            <img src="/assets/guitarra.webp" alt="Guitar" />
          </div>
          <div
            className={`gallery-item ${isVisible ? 'animate-fade-in-up delay-200' : 'reveal'}`}
          >
            <img src="/assets/drums.webp" alt="Drums" />
          </div>
          <div
            className={`gallery-item gallery-item-wide ${isVisible ? 'animate-fade-in-up delay-300' : 'reveal'}`}
          >
            <img src="/assets/music-stand.webp" alt="Music stand" />
          </div>
        </div>

        <div className={`gallery-cta ${isVisible ? 'animate-fade-in-up delay-400' : 'reveal'}`}>
          <a
            href="https://instagram.com/keychangeproject/"
            target="_blank"
            rel="noopener"
            className="btn btn-secondary"
          >
            Follow our journey
          </a>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [ref, isVisible] = useScrollReveal(0.1)
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
      newsletter: fd.get('newsletter') === 'yes',
    }

    const newErrors = {}
    if (!data.first_name) newErrors.first_name = 'First name is required'
    if (!data.last_name) newErrors.last_name = 'Last name is required'
    if (!data.email) newErrors.email = 'Email is required'
    if (!data.message) newErrors.message = 'Message is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Home Page' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={ref} className="section section-alt">
      <div className="container">
        <div className="contact-grid">
          <div className={`contact-info ${isVisible ? 'animate-slide-left' : 'reveal'}`}>
            <span className="story-eyebrow">Get in touch</span>
            <h2>Lets make music together</h2>
            <p>
              Have an instrument to donate? Want to volunteer? Just curious?
              We would love to hear from you.
            </p>
            <div className="contact-details">
              <div>
                <strong>Email</strong>
                <a href="mailto:keychange.team@gmail.com">
                  keychange.team@gmail.com
                </a>
              </div>
              <div>
                <strong>Instagram</strong>
                <a
                  href="https://instagram.com/keychangeproject/"
                  target="_blank"
                  rel="noopener"
                >
                  @keychangeproject
                </a>
              </div>
            </div>
          </div>

          <div className={`contact-form-wrapper ${isVisible ? 'animate-slide-right' : 'reveal'}`}>
            {status === 'success' ? (
              <div className="form-success">
                <CheckCircle
                  size={64}
                  style={{ color: 'var(--color-terracotta)', marginBottom: '1.5rem' }}
                />
                <h3>Message sent</h3>
                <p>Thanks for reaching out. We will get back to you within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      First Name <span>(required)</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      className={`form-input ${errors.first_name ? 'error' : ''}`}
                      placeholder="Jane"
                    />
                    {errors.first_name && (
                      <span className="form-error">{errors.first_name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Last Name <span>(required)</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      className={`form-input ${errors.last_name ? 'error' : ''}`}
                      placeholder="Smith"
                    />
                    {errors.last_name && (
                      <span className="form-error">{errors.last_name}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span>(required)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <label className="form-checkbox">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Keep me updated on Key Change news</span>
                </label>

                <div className="form-group">
                  <label className="form-label">
                    Message <span>(required)</span>
                  </label>
                  <textarea
                    name="message"
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder="Tell us how you would like to help..."
                    rows={5}
                  />
                  {errors.message && (
                    <span className="form-error">{errors.message}</span>
                  )}
                </div>

                {status === 'error' && (
                  <div className="form-error" style={{ marginBottom: '1rem' }}>
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactSection />
      <HowItWorks />
      <StorySection />
      <GallerySection />
      <ContactSection />
    </>
  )
}
