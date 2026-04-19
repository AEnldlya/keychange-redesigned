'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

function Reveal({ children, delay = 0, className = '', y = 36 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
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

export default function ContactPage() {
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
        body: JSON.stringify({ ...data, source: 'Contact Page' }),
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
    <>
      <div className="page-header-v2">
        <Reveal><span className="eyebrow">Say Hello</span></Reveal>
        <Reveal delay={0.08}><h1>Contact Us</h1></Reveal>
        <Reveal delay={0.16}><p>Have a question? We would love to hear from you.</p></Reveal>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact2-grid">
            <div className="contact2-info-light">
              <Reveal><h2>Get in touch</h2></Reveal>
              <Reveal delay={0.08}>
                <p>Whether you have an instrument to donate, want to volunteer,
                or just have a question, we are here to help.</p>
              </Reveal>

              <Reveal delay={0.16} className="contact-detail-list">
                <div className="contact-detail-item">
                  <Mail size={22} className="contact-detail-icon" />
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-detail-icon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <div>
                    <strong>Instagram</strong>
                    <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">@keychangeproject</a>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <MapPin size={22} className="contact-detail-icon" />
                  <div>
                    <strong>Location</strong>
                    <span>Upper Valley, NH & VT</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="contact2-form-wrap-light">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    className="form-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckCircle size={56} style={{ color: 'var(--color-terracotta)', marginBottom: '1.5rem' }} />
                    <h3>Message sent</h3>
                    <p>Thanks for reaching out. We will get back to you within 48 hours.</p>
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
                      <textarea name="message" className={`form-textarea ${errors.message ? 'error' : ''}`} placeholder="How can we help you?" rows={5} />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>

                    {status === 'error' && (
                      <div className="form-error" style={{ marginBottom: '1rem' }}>
                        {submitError || 'Something went wrong. Please try again.'}
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Sending…' : <><span>Send Message</span><ArrowRight size={18} /></>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
