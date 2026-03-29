'use client'
import { useState } from 'react'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'

export default function Contact() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.target)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fd.get('first_name'),
          last_name: fd.get('last_name'),
          email: fd.get('email'),
          newsletter: fd.get('newsletter') === 'yes',
          message: fd.get('message'),
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
      <section className="page-hero">
        <ScrollChevron />
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            Have a question, want to get involved, or just want to say hello? Fill out the form below
            and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      <section className="donate-form-section">
        <div className="container">
          <div className="donate-form-wrap">
            {status === 'success' ? (
              <FormSuccess
                variant="quiet"
                title="Message sent!"
                message="Thanks for reaching out. We'll get back to you soon."
              />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Name</label>
                  <div className="form-row">
                    <div>
                      <label>First Name <span className="req">(required)</span></label>
                      <input type="text" name="first_name" required />
                    </div>
                    <div>
                      <label>Last Name <span className="req">(required)</span></label>
                      <input type="text" name="last_name" required />
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <label>Email <span className="req">(required)</span></label>
                  <input type="email" name="email" required />
                </div>

                <label className="checkbox-field">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Sign up for news and updates</span>
                </label>

                <div className="form-field">
                  <label>Message <span className="req">(required)</span></label>
                  <textarea name="message" rows="5" required />
                </div>

                {status === 'error' && (
                  <p style={{ color: 'red', fontSize: '0.875rem' }}>Something went wrong. Please try again.</p>
                )}
                <button type="submit" className="m-btn m-btn--light-blue" style={{ width: '100%', color: 'var(--blue)' }} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting…' : 'SUBMIT'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
