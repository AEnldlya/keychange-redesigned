'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useReveal } from '../hooks/useReveal'
import FormSuccess from '../components/FormSuccess'
import { validateEmail, validateRequired, validateForm } from '../lib/validate'

/* ── Hero Section ──
   Strong minimal headline, single CTA, subtle signature animation
*/
function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section className="kc-hero">
      <div className="kc-hero__content">
        <div className={`kc-hero__text ${loaded ? 'kc-hero__text--visible' : ''}`}>
          <h1 className="kc-hero__headline">
            <span className="kc-hero__line">Music belongs</span>
            <span className="kc-hero__line kc-hero__line--accent">to everyone.</span>
          </h1>
          <p className="kc-hero__subhead">
            3.6 million students in the US lack access to music education. 
            We collect unused instruments and put them in the hands of students 
            who need them most.
          </p>
          <div className="kc-hero__cta">
            <Link href="/get-involved" className="kc-btn kc-btn--primary">
              Get Involved
            </Link>
          </div>
        </div>
        
        <div className={`kc-hero__image ${loaded ? 'kc-hero__image--visible' : ''}`}>
          <img 
            src="/assets/hero.webp" 
            alt="Musical instruments" 
          />
        </div>
      </div>
      
      <div className="kc-hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="kc-hero__scroll-line" />
      </div>
    </section>
  )
}

/* ── Impact Stats ──
   Authentic social proof, no fake ticker animations
*/
function ImpactSection() {
  const [ref, visible] = useReveal({ threshold: 0.2 })
  
  return (
    <section ref={ref} className={`kc-section kc-impact ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
      <div className="kc-container">
        <div className="kc-impact__grid">
          <div className="kc-impact__stat">
            <span className="kc-impact__number">3,609,698</span>
            <p className="kc-impact__label">
              Students in the US without access to music education
            </p>
            <span className="kc-impact__source">Source: 2019 NAEP Arts Assessment</span>
          </div>
          
          <div className="kc-impact__content">
            <h2>The gap is real</h2>
            <p>
              Budget cuts and rising instrument costs have left millions of students 
              on the sidelines. Schools can&apos;t afford equipment. Families can&apos;t afford 
              rentals. Meanwhile, thousands of instruments sit unused in closets and 
              attics across the country.
            </p>
            <p>
              We bridge that gap—collecting, repairing, and redistributing instruments 
              to students and programs that need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── How It Works ──
   Intentional asymmetric layout
*/
function HowItWorks() {
  const [ref, visible] = useReveal({ threshold: 0.15 })
  
  const steps = [
    {
      number: '01',
      title: 'Collect',
      description: 'We receive instrument donations from community members, schools, and music stores—everything from violins to drum kits.',
    },
    {
      number: '02',
      title: 'Restore',
      description: 'Each instrument is inspected, cleaned, and repaired by our team of volunteer technicians and local luthiers.',
    },
    {
      number: '03',
      title: 'Match',
      description: 'We partner with schools and community programs to identify students who need instruments and match them with what we have.',
    },
    {
      number: '04',
      title: 'Deliver',
      description: 'Instruments go directly into students&apos; hands, often with a case, accessories, and connections to local teachers.',
    },
  ]
  
  return (
    <section ref={ref} className="kc-section kc-section--alt kc-how">
      <div className="kc-container">
        <div className="kc-how__header">
          <h2>How it works</h2>
          <p>Four steps from donation to a student&apos;s first notes</p>
        </div>
        
        <div className={`kc-how__grid ${visible ? 'kc-stagger visible' : 'kc-stagger'}`}>
          {steps.map((step) => (
            <div key={step.number} className="kc-how__step">
              <span className="kc-how__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Story Section ──
   Asymmetric editorial layout
*/
function StorySection() {
  const [ref, visible] = useReveal({ threshold: 0.15 })
  
  return (
    <section ref={ref} className="kc-section kc-story">
      <div className="kc-container">
        <div className={`kc-story__grid ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
          <div className="kc-story__image">
            <img src="/assets/guitarra.webp" alt="Guitar being played" />
          </div>
          
          <div className="kc-story__content">
            <span className="kc-story__eyebrow">Our Story</span>
            <h2>Started by students,<br />for students</h2>
            <div className="kc-divider" />
            <p>
              Key Change began when two high schoolers—Ansh and Jason—noticed something 
              wrong. Their school had a thriving music program. Other schools just miles 
              away had nothing. The instruments existed. The students existed. Only the 
              connection was missing.
            </p>
            <p>
              What started as a single instrument drive has grown into a sustained effort 
              to democratize music access across the Upper Valley. We believe talent is 
              universal, but opportunity is not. Our job is to close that gap—one 
              instrument at a time.
            </p>
            <Link href="/about" className="kc-btn kc-btn--outline">
              Read Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Gallery Section ──
   Visual proof of impact
*/
function GallerySection() {
  const [ref, visible] = useReveal({ threshold: 0.1 })
  
  return (
    <section ref={ref} className="kc-section kc-section--dark kc-gallery">
      <div className="kc-container">
        <div className={`kc-gallery__header ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
          <h2>Every instrument<br />tells a story</h2>
          <p>From donated guitars to refurbished keyboards, each piece carries potential.</p>
        </div>
        
        <div className={`kc-gallery__grid ${visible ? 'kc-stagger visible' : 'kc-stagger'}`}>
          <div className="kc-gallery__item kc-gallery__item--large">
            <img src="/assets/microphone.webp" alt="Microphone" />
          </div>
          <div className="kc-gallery__item">
            <img src="/assets/guitarra.webp" alt="Guitar" />
          </div>
          <div className="kc-gallery__item">
            <img src="/assets/drums.webp" alt="Drums" />
          </div>
          <div className="kc-gallery__item kc-gallery__item--wide">
            <img src="/assets/music-stand.webp" alt="Music stand" />
          </div>
        </div>
        
        <div className={`kc-gallery__cta ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
          <a 
            href="https://instagram.com/keychangeproject/" 
            target="_blank" 
            rel="noopener"
            className="kc-btn kc-btn--outline"
          >
            Follow our journey
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Contact Section ──
   Clean human-designed form
*/
function ContactSection() {
  const [ref, visible] = useReveal({ threshold: 0.1 })
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
    <section ref={ref} className="kc-section kc-section--alt kc-contact">
      <div className="kc-container">
        <div className={`kc-contact__grid ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
          <div className="kc-contact__info">
            <span className="kc-contact__eyebrow">Get in touch</span>
            <h2>Let&apos;s make music<br />together</h2>
            <p>
              Have an instrument to donate? Want to volunteer? 
              Just curious? We&apos;d love to hear from you.
            </p>
            <div className="kc-contact__details">
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
          </div>
          
          <div className="kc-contact__form-wrapper">
            {status === 'success' ? (
              <FormSuccess
                title="Message sent"
                message="Thanks for reaching out. We'll get back to you within 48 hours."
              />
            ) : (
              <form onSubmit={handleSubmit} className="kc-form">
                <div className="kc-form__row">
                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      First Name <span>(required)</span>
                    </label>
                    <input 
                      type="text" 
                      name="first_name" 
                      placeholder="Jane"
                      className={errors.first_name ? 'error' : ''} 
                    />
                    {errors.first_name && <span className="kc-form__error">{errors.first_name}</span>}
                  </div>
                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Last Name <span>(required)</span>
                    </label>
                    <input 
                      type="text" 
                      name="last_name" 
                      placeholder="Smith"
                      className={errors.last_name ? 'error' : ''} 
                    />
                    {errors.last_name && <span className="kc-form__error">{errors.last_name}</span>}
                  </div>
                </div>
                
                <div className="kc-form__field">
                  <label className="kc-form__label">
                    Email <span>(required)</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="jane@example.com"
                    className={errors.email ? 'error' : ''} 
                  />
                  {errors.email && <span className="kc-form__error">{errors.email}</span>}
                </div>
                
                <label className="kc-checkbox">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Keep me updated on Key Change news</span>
                </label>
                
                <div className="kc-form__field">
                  <label className="kc-form__label">
                    Message <span>(required)</span>
                  </label>
                  <textarea 
                    name="message" 
                    rows={5} 
                    placeholder="Tell us how you'd like to help..."
                    className={errors.message ? 'error' : ''} 
                  />
                  {errors.message && <span className="kc-form__error">{errors.message}</span>}
                </div>
                
                {status === 'error' && (
                  <div className="kc-form__status kc-form__status--error" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="kc-btn kc-btn--primary kc-btn--full"
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

/* ── Home Page ── */
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
