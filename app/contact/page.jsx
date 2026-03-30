'use client'
import { useState } from 'react'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'
import FAQ from '../../components/FAQ'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validateRequired, validateForm } from '../../lib/validate'
import WaveEffect from '../../components/animations/WaveEffect'
import GlassCard from '../../components/animations/GlassCard'
import MagneticButton from '../../components/animations/MagneticButton'
import NeonGlow from '../../components/animations/NeonGlow'

const CONTACT_FAQ = [
  { q: 'How long does it take to get a response?', a: 'We typically respond to all messages within 48 hours. If your matter is urgent, please mention that in your message.' },
  { q: 'How can I donate instruments?', a: 'Head over to our Donate page to fill out a donation form. We accept all types of instruments in any condition.' },
  { q: 'Can I volunteer with Key Change?', a: 'Absolutely! Visit our Get Involved page to learn about volunteer roles and fill out an application.' },
  { q: 'Where is Key Change based?', a: 'We are based in the Upper Valley area of New Hampshire and Vermont, primarily serving the Hanover and Norwich communities.' },
  { q: 'Is Key Change a registered nonprofit?', a: 'We are a student-led initiative working toward official nonprofit status. Contact us for the latest information.' },
]

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [infoRef, infoVisible] = useReveal({ threshold: 0.1 })
  const [faqRef, faqVisible] = useReveal({ threshold: 0.1 })

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
          source: 'Contact Page',
        }),
      })
      if (res.ok) { setStatus('success'); e.target.reset() }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="kc-page-hero">
        <ScrollChevron />
        <div className="kc-container">
          <h1><NeonGlow color="#F5C518" intensity={0.4} mode="text" duration={3}>Contact Us</NeonGlow></h1>
          <p>
            Have a question, want to get involved, or just want to say hello? Fill out the form below
            and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={`kc-section kc-reveal${infoVisible ? ' visible' : ''}`} ref={infoRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container" style={{ maxWidth: '800px' }}>
          <div className="kc-contact-info kc-stagger">
            <GlassCard blur={14} opacity={0.06} hover className="kc-contact-info__card" style={{ '--i': 0 }}>
              <div className="kc-contact-info__icon">✉️</div>
              <div className="kc-contact-info__title">Email</div>
              <div className="kc-contact-info__value">
                <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
              </div>
            </GlassCard>
            <GlassCard blur={14} opacity={0.06} hover className="kc-contact-info__card" style={{ '--i': 1 }}>
              <div className="kc-contact-info__icon">📍</div>
              <div className="kc-contact-info__title">Location</div>
              <div className="kc-contact-info__value">Upper Valley, NH &amp; VT</div>
            </GlassCard>
            <GlassCard blur={14} opacity={0.06} hover className="kc-contact-info__card" style={{ '--i': 2 }}>
              <div className="kc-contact-info__icon">📷</div>
              <div className="kc-contact-info__title">Instagram</div>
              <div className="kc-contact-info__value">
                <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">@keychangeproject</a>
              </div>
            </GlassCard>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            We typically respond within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="kc-section">
        <div className="kc-container" style={{ maxWidth: '640px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>Send Us a Message</h2>
          <div className="kc-glass kc-glass--gold">
            {status === 'success' ? (
              <FormSuccess
                variant="quiet"
                title="Message sent!"
                message="Thanks for reaching out. We'll get back to you within 48 hours."
              />
            ) : (
              <form onSubmit={handleSubmit} className="kc-form">
                <div className="kc-form__row">
                  <div className="kc-form__field">
                    <label className="kc-form__label">First Name <span className="kc-form__req">(required)</span></label>
                    <input type="text" name="first_name" required className={errors.first_name ? 'error' : ''} />
                    {errors.first_name && <span className="kc-form__error">{errors.first_name}</span>}
                  </div>
                  <div className="kc-form__field">
                    <label className="kc-form__label">Last Name <span className="kc-form__req">(required)</span></label>
                    <input type="text" name="last_name" required className={errors.last_name ? 'error' : ''} />
                    {errors.last_name && <span className="kc-form__error">{errors.last_name}</span>}
                  </div>
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Email <span className="kc-form__req">(required)</span></label>
                  <input type="email" name="email" required className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="kc-form__error">{errors.email}</span>}
                </div>

                <label className="kc-checkbox">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Sign up for news and updates</span>
                </label>

                <div className="kc-form__field">
                  <label className="kc-form__label">Message <span className="kc-form__req">(required)</span></label>
                  <textarea name="message" rows="5" required className={errors.message ? 'error' : ''} />
                  {errors.message && <span className="kc-form__error">{errors.message}</span>}
                </div>

                {status === 'error' && (
                  <div className="kc-form__status kc-form__status--error" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
                <MagneticButton as="div" strength={0.25}>
                  <button type="submit" className="kc-btn kc-btn--gold kc-btn--full" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Send Message'}
                  </button>
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveEffect color="rgba(245,197,24,0.04)" layers={3} height={140} />

      {/* FAQ */}
      <section className={`kc-section kc-reveal${faqVisible ? ' visible' : ''}`} ref={faqRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <FAQ title="Frequently Asked Questions" items={CONTACT_FAQ} />
        </div>
      </section>
    </>
  )
}
