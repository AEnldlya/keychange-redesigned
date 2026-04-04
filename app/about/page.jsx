'use client'

import { useEffect, useState, useRef } from 'react'
import { Heart, Users, Music, Target } from 'lucide-react'

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

export default function AboutPage() {
  const [introRef, introVisible] = useScrollReveal(0.2)
  const [foundersRef, foundersVisible] = useScrollReveal(0.2)
  const [valuesRef, valuesVisible] = useScrollReveal(0.1)

  const values = [
    {
      icon: Heart,
      title: 'Accessibility',
      description:
        'Every student deserves the chance to make music, regardless of financial circumstances.',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'We build bridges between those with instruments to give and those with passion to play.',
    },
    {
      icon: Music,
      title: 'Education',
      description:
        'Music education develops creativity, discipline, and confidence that lasts a lifetime.',
    },
    {
      icon: Target,
      title: 'Impact',
      description:
        'We measure success by the number of students who pick up an instrument for the first time.',
    },
  ]

  return (
    <>
      <div className="page-header">
        <h1>About Key Change</h1>
        <p>Making music education accessible across the Upper Valley</p>
      </div>

      <section ref={introRef} className="section">
        <div className="container">
          <p
            className={`about-intro ${introVisible ? 'animate-fade-in-up' : 'reveal'}`}
          >
            Key Change is a student-led nonprofit based in Hanover, New
            Hampshire. We collect unused musical instruments from community
            members and redistribute them to students and school music programs
            that lack the resources to purchase their own.
          </p>
        </div>
      </section>

      <section ref={foundersRef} className="section section-alt">
        <div className="container">
          <div
            className={`how-header ${foundersVisible ? 'animate-fade-in-up' : 'reveal'}`}
          >
            <h2>Meet the founders</h2>
            <p>Two students with a shared vision</p>
          </div>

          <div className="founders-grid">
            <div
              className={`founder-card ${foundersVisible ? 'animate-fade-in-up' : 'reveal'}`}
            >
              <h3>Ansh</h3>
              <p>Co-Founder</p>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-light)' }}>
                High school student passionate about equal access to arts education.
              </span>
            </div>
            <div
              className={`founder-card ${foundersVisible ? 'animate-fade-in-up delay-100' : 'reveal'}`}
            >
              <h3>Jason</h3>
              <p>Co-Founder</p>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-light)' }}>
                Musician and advocate for student opportunity in the Upper Valley.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section ref={valuesRef} className="section">
        <div className="container">
          <div
            className={`how-header ${valuesVisible ? 'animate-fade-in-up' : 'reveal'}`}
          >
            <h2>Our values</h2>
            <p>The principles that guide our work</p>
          </div>

          <div className="values-grid">
            {values.map((value, i) => (
              <div
                key={value.title}
                className={`value-card ${valuesVisible ? 'animate-fade-in-up' : 'reveal'}`}
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <value.icon
                  size={28}
                  style={{ color: 'var(--color-terracotta)', marginBottom: '1rem' }}
                />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="story-grid">
            <div className="story-content" style={{ maxWidth: '600px' }}>
              <span className="story-eyebrow">Our History</span>
              <h2>From a simple observation to lasting impact</h2>
              <p>
                It started with a question: Why do some students have access to
                instruments while others do not? Ansh and Jason noticed the
                disparity between schools in their area. Some had thriving music
                programs. Others had nothing.
              </p>
              <p>
                They realized the problem was not a lack of instruments or a
                lack of interest. It was a lack of connection. Instruments sat
                unused in attics while students sat in classrooms without them.
              </p>
              <p>
                Key Change was born to bridge that gap. What began as a single
                instrument drive has evolved into an ongoing effort to ensure
                every student who wants to play music has the opportunity.
              </p>
            </div>
            <div className="story-image">
              <img src="/assets/drums.webp" alt="Drums" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
