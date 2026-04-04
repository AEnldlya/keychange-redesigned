'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validatePhone, validateRequired, validateFileSize, validateDate, validateForm } from '../../lib/validate'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

const DONATE_FAQ = [
  { q: 'What instruments do you accept?', a: 'We accept all types of musical instruments in any condition — guitars, violins, drums, wind instruments, keyboards, and more. Even if it needs repair, we can often fix it.' },
  { q: 'What condition should the instrument be in?', a: 'Any condition is welcome! We have volunteers who inspect and repair instruments. Even instruments with cosmetic damage or missing parts can often be restored.' },
  { q: 'How do I get my donation to you?', a: 'You can drop off instruments in the Hanover/Norwich area. If you\'re unable to drop off, let us know in the form and we\'ll work out an alternative arrangement.' },
  { q: 'Is my donation tax-deductible?', a: 'We are a student-led initiative working toward official nonprofit status. Please contact us for the most up-to-date information about tax deductions.' },
  { q: 'How long does the process take?', a: 'After you submit the form, we\'ll review your donation and reach out within 3 business days to arrange pickup or dropoff details.' },
]

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="kc-faq__item">
      <button 
        className="kc-faq__question"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={`kc-faq__icon ${isOpen ? 'kc-faq__icon--open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className={`kc-faq__answer ${isOpen ? 'kc-faq__answer--open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, visible] = useReveal({ threshold: 0.1 })
  
  return (
    <section ref={ref} className={`kc-section kc-section--alt ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
      <div className="kc-container kc-container--narrow">
        <h2 className="kc-faq__title">Frequently Asked Questions</h2>
        <div className="kc-faq__list">
          {DONATE_FAQ.map((item, index) => (
            <FAQItem
              key={index}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Donate() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)
  const [processRef, processVisible] = useReveal({ threshold: 0.1 })

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, image: null }))
    }
  }

  function removeFile() {
    setFileName('')
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const file = fileRef.current?.files?.[0]

    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      city: fd.get('city'),
      state: fd.get('state'),
      donation_description: fd.get('donation_description'),
      condition: fd.get('condition'),
      can_dropoff: fd.get('can_dropoff'),
      dropoff_time: fd.get('dropoff_time'),
    }

    const validationErrors = validateForm(data, {
      first_name: [v => validateRequired(v, 'First name')],
      last_name: [v => validateRequired(v, 'Last name')],
      email: [v => validateRequired(v, 'Email'), validateEmail],
      phone: [v => validateRequired(v, 'Phone'), validatePhone],
      city: [v => validateRequired(v, 'City')],
      state: [v => validateRequired(v, 'State')],
      donation_description: [v => validateRequired(v, 'Donation description')],
      condition: [v => validateRequired(v, 'Condition')],
      can_dropoff: [v => validateRequired(v, 'Dropoff availability')],
      dropoff_time: [v => validateRequired(v, 'Dropoff date'), validateDate],
    })

    const fileError = validateFileSize(file, 5)
    const allErrors = { ...(validationErrors || {}), ...(fileError ? { image: fileError } : {}) }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      const firstErrorEl = document.querySelector('.error')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      let image_base64 = null
      let image_filename = null

      if (file) {
        image_base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        image_filename = file.name
      }

      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fd.get('first_name'),
          last_name: fd.get('last_name'),
          organization: fd.get('organization'),
          email: fd.get('email'),
          newsletter: fd.get('newsletter') === 'yes',
          phone: fd.get('phone'),
          city: fd.get('city'),
          state: fd.get('state'),
          donation_description: fd.get('donation_description'),
          condition: fd.get('condition'),
          can_dropoff: fd.get('can_dropoff'),
          alt_location: fd.get('alt_location'),
          dropoff_time: fd.get('dropoff_time'),
          other_info: fd.get('other_info'),
          image_base64,
          image_filename,
        }),
      })
      if (res.ok) { 
        setStatus('success')
        e.target.reset()
        setFileName('')
        setPreview(null)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      {/* Hero */}
      <section className="kc-page-header">
        <div className="kc-container">
          <h1>Donate an Instrument</h1>
          <p>
            Your unused instrument could be the start of someone&apos;s musical journey. 
            We accept all types of instruments in any condition—guitars, violins, drums, 
            keyboards, and more.
          </p>
        </div>
      </section>

      {/* Process */}
      <section 
        ref={processRef} 
        className={`kc-section kc-section--alt ${processVisible ? 'kc-reveal visible' : 'kc-reveal'}`}
      >
        <div className="kc-container">
          <div className="kc-how__header">
            <h2>How it works</h2>
            <p>Four simple steps to donate</p>
          </div>
          
          <div className={`kc-how__grid ${processVisible ? 'kc-stagger visible' : 'kc-stagger'}`}>
            <div className="kc-how__step">
              <span className="kc-how__number">01</span>
              <h3>Submit</h3>
              <p>Fill out the form with details about your instrument.</p>
            </div>
            <div className="kc-how__step">
              <span className="kc-how__number">02</span>
              <h3>Review</h3>
              <p>We review your submission within 3 business days.</p>
            </div>
            <div className="kc-how__step">
              <span className="kc-how__number">03</span>
              <h3>Schedule</h3>
              <p>We coordinate pickup or dropoff at your convenience.</p>
            </div>
            <div className="kc-how__step">
              <span className="kc-how__number">04</span>
              <h3>Transform</h3>
              <p>Your instrument gets repaired and matched with a student.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Form */}
      <section className="kc-section" id="donate-form">
        <div className="kc-container" style={{ maxWidth: '720px' }}>
          <div className="kc-contact-page__form">
            <h2>Donation Form</h2>
            
            {status === 'success' ? (
              <div className="kc-contact__form-wrapper">
                <FormSuccess
                  title="Thank you for donating!"
                  message="We'll review your submission and reach out within 3 business days to arrange pickup or dropoff."
                />
              </div>
            ) : (
              <div className="kc-contact__form-wrapper">
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
                    <label className="kc-form__label">Organization (if applicable)</label>
                    <input type="text" name="organization" placeholder="School, business, or group name" />
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
                      Phone <span>(required)</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="(603) 555-0123"
                      className={errors.phone ? 'error' : ''} 
                    />
                    {errors.phone && <span className="kc-form__error">{errors.phone}</span>}
                  </div>

                  <div className="kc-form__row">
                    <div className="kc-form__field">
                      <label className="kc-form__label">
                        City <span>(required)</span>
                      </label>
                      <AutocompleteInput 
                        name="city" 
                        suggestions={CITY_SUGGESTIONS} 
                        placeholder="e.g. Hanover"
                        className={errors.city ? 'error' : ''} 
                      />
                      {errors.city && <span className="kc-form__error">{errors.city}</span>}
                    </div>
                    <div className="kc-form__field">
                      <label className="kc-form__label">
                        State <span>(required)</span>
                      </label>
                      <AutocompleteInput 
                        name="state" 
                        suggestions={STATE_SUGGESTIONS} 
                        placeholder="e.g. New Hampshire"
                        className={errors.state ? 'error' : ''} 
                      />
                      {errors.state && <span className="kc-form__error">{errors.state}</span>}
                    </div>
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      What would you like to donate? <span>(required)</span>
                    </label>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Include the instrument type, condition, and any accessories.
                    </p>
                    <input 
                      type="text" 
                      name="donation_description" 
                      placeholder="e.g. Yamaha acoustic guitar, good condition, with case"
                      className={errors.donation_description ? 'error' : ''} 
                    />
                    {errors.donation_description && <span className="kc-form__error">{errors.donation_description}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Condition <span>(required)</span>
                    </label>
                    <select 
                      name="condition" 
                      defaultValue=""
                      className={errors.condition ? 'error' : ''}
                    >
                      <option value="" disabled>Select condition</option>
                      <option>Excellent — like new</option>
                      <option>Good — minor wear</option>
                      <option>Fair — needs some work</option>
                      <option>Needs Repair — but fixable</option>
                    </select>
                    {errors.condition && <span className="kc-form__error">{errors.condition}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Photo <span>(required)</span>
                    </label>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Max 5MB. Clear photos help us assess the instrument.
                    </p>
                    <div
                      className="kc-file-upload"
                      onClick={() => fileRef.current?.click()}
                      style={{ borderColor: errors.image ? 'var(--color-error)' : undefined }}
                    >
                      {preview ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                          <img src={preview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                          <div>
                            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{fileName}</p>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeFile() }}
                              style={{ 
                                fontSize: 'var(--text-sm)', 
                                color: 'var(--color-error)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                marginTop: 'var(--space-1)'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                          <span style={{ fontSize: '2rem', color: 'var(--color-text-muted)' }}>+</span>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                            Click to upload photo
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                    {errors.image && <span className="kc-form__error">{errors.image}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Can you drop off in Hanover/Norwich? <span>(required)</span>
                    </label>
                    <select 
                      name="can_dropoff" 
                      defaultValue=""
                      className={errors.can_dropoff ? 'error' : ''}
                    >
                      <option value="" disabled>Select option</option>
                      <option>Yes, I can drop off</option>
                      <option>No, I need pickup</option>
                      <option>Not sure yet</option>
                    </select>
                    {errors.can_dropoff && <span className="kc-form__error">{errors.can_dropoff}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      If pickup needed, what&apos;s your location?
                    </label>
                    <input 
                      type="text" 
                      name="alt_location" 
                      placeholder="Town or general area"
                    />
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Preferred dropoff date <span>(required)</span>
                    </label>
                    <input 
                      type="date" 
                      name="dropoff_time" 
                      min={today}
                      className={errors.dropoff_time ? 'error' : ''} 
                    />
                    {errors.dropoff_time && <span className="kc-form__error">{errors.dropoff_time}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">Anything else we should know?</label>
                    <textarea name="other_info" rows={3} placeholder="Additional details..." />
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
                    {status === 'submitting' ? 'Submitting...' : 'Submit Donation'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  )
}
