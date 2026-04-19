'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, CheckCircle } from 'lucide-react'

function Reveal({ children, delay = 0, className = '', y = 32 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
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

export default function ContactPage() {
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
    if (!data.first_name) errs.first_name = 'First name is required'
    if (!data.last_name)  errs.last_name  = 'Last name is required'
    if (!data.email)      errs.email      = 'Email is required'
    if (!data.message)    errs.message    = 'Message is required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({}); setSubmitError(''); setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'Contact Page' }),
      })
      const body = await res.json().catch(() => ({}))
      res.ok ? setStatus('success') : (setStatus('error'), setSubmitError(body.error || 'Something went wrong.'))
    } catch { setStatus('error'); setSubmitError('Something went wrong.') }
  }

  return (
    <>
      <div className="page-header">
        <Reveal><span className="eyebrow">Say Hello</span></Reveal>
        <Reveal delay={0.08}><h1>Contact Us</h1></Reveal>
        <Reveal delay={0.16}><p>Have a question? We would love to hear from you.</p></Reveal>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-light-grid">
            <div className="contact-light-info">
              <Reveal><h2>Get in touch</h2></Reveal>
              <Reveal delay={0.08}>
                <p>Whether you have an instrument to donate, want to volunteer, or just have a question, we are here to help.</p>
              </Reveal>
              <Reveal delay={0.16} className="contact-detail-list">
                <div className="contact-detail-item">
                  <Mail size={20} className="contact-detail-icon" />
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-detail-icon"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <div>
                    <strong>Instagram</strong>
                    <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">@keychangeproject</a>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <MapPin size={20} className="contact-detail-icon" />
                  <div>
                    <strong>Location</strong>
                    <span>Upper Valley, NH & VT</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="contact-light-form-box">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="ok" className="form-success" style={{ padding: 'var(--sp-12)' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <CheckCircle size={52} style={{ color: 'var(--blue)', margin: '0 auto var(--sp-6)' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>Message sent</h3>
                    <p style={{ color: 'var(--ink-2)' }}>Thanks for reaching out. We will get back to you within 48 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>First Name <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(required)</span></label>
                        <input type="text" name="first_name" className={`form-input ${errors.first_name ? 'error' : ''}`} placeholder="Jane" style={{ color: 'var(--ink)', borderBottomColor: errors.first_name ? 'var(--error)' : 'var(--border)' }} />
                        {errors.first_name && <span className="form-error" style={{ color: 'var(--error)' }}>{errors.first_name}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>Last Name <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(required)</span></label>
                        <input type="text" name="last_name" className={`form-input ${errors.last_name ? 'error' : ''}`} placeholder="Smith" style={{ color: 'var(--ink)', borderBottomColor: errors.last_name ? 'var(--error)' : 'var(--border)' }} />
                        {errors.last_name && <span className="form-error" style={{ color: 'var(--error)' }}>{errors.last_name}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>Email <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(required)</span></label>
                      <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="jane@example.com" style={{ color: 'var(--ink)', borderBottomColor: errors.email ? 'var(--error)' : 'var(--border)' }} />
                      {errors.email && <span className="form-error" style={{ color: 'var(--error)' }}>{errors.email}</span>}
                    </div>
                    <label className="form-checkbox">
                      <input type="checkbox" name="newsletter" value="yes" />
                      <span style={{ color: 'var(--ink-2)' }}>Keep me updated on Key Change news</span>
                    </label>
                    <div className="form-group">
                      <label className="form-label" style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>Message <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>(required)</span></label>
                      <textarea name="message" className={`form-textarea ${errors.message ? 'error' : ''}`} placeholder="How can we help?" rows={5} style={{ color: 'var(--ink)', borderBottomColor: errors.message ? 'var(--error)' : 'var(--border)' }} />
                      {errors.message && <span className="form-error" style={{ color: 'var(--error)' }}>{errors.message}</span>}
                    </div>
                    {status === 'error' && <div className="form-error" style={{ color: 'var(--error)', marginBottom: 'var(--sp-4)' }}>{submitError}</div>}
                    <button type="submit" className="form-submit" style={{ background: 'var(--blue)', color: '#fff' }} disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Sending…' : 'Send Message'}
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
