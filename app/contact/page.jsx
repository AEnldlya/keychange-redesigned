'use client'

import { useState } from 'react'
import { Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

export default function ContactPage() {
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
        body: JSON.stringify({ ...data, source: 'Contact Page' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have a question? We would love to hear from you.</p>
      </div>

      {/* Contact Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info" style={{ textAlign: 'left' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                Get in touch
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-ink-light)',
                  marginBottom: '2rem',
                }}
              >
                Whether you have an instrument to donate, want to volunteer, or
                just have a question, we are here to help.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <Mail
                    size={24}
                    style={{ color: 'var(--color-terracotta)', marginTop: '4px' }}
                  />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--color-ink-muted)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Email
                    </strong>
                    <a
                      href="mailto:keychange.team@gmail.com"
                      style={{
                        fontSize: '1.125rem',
                        color: 'var(--color-terracotta)',
                      }}
                    >
                      keychange.team@gmail.com
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-terracotta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '4px' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--color-ink-muted)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Instagram
                    </strong>
                    <a
                      href="https://instagram.com/keychangeproject/"
                      target="_blank"
                      rel="noopener"
                      style={{
                        fontSize: '1.125rem',
                        color: 'var(--color-terracotta)',
                      }}
                    >
                      @keychangeproject
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <MapPin
                    size={24}
                    style={{ color: 'var(--color-terracotta)', marginTop: '4px' }}
                  />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--color-ink-muted)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Location
                    </strong>
                    <span style={{ fontSize: '1.125rem' }}>
                      Upper Valley, NH & VT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              {status === 'success' ? (
                <div className="form-success">
                  <CheckCircle
                    size={64}
                    style={{
                      color: 'var(--color-terracotta)',
                      marginBottom: '1.5rem',
                    }}
                  />
                  <h3>Message sent</h3>
                  <p>
                    Thanks for reaching out. We will get back to you within 48
                    hours.
                  </p>
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
                    {errors.email && (
                      <span className="form-error">{errors.email}</span>
                    )}
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
                      placeholder="How can we help you?"
                      rows={5}
                    />
                    {errors.message && (
                      <span className="form-error">{errors.message}</span>
                    )}
                  </div>

                  {status === 'error' && (
                    <div
                      className="form-error"
                      style={{ marginBottom: '1rem' }}
                    >
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
