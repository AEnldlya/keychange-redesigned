'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'
import FAQ from '../../components/FAQ'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validatePhone, validateRequired, validateFileSize, validateDate, validateForm } from '../../lib/validate'
import SpotlightCard from '../../components/animations/SpotlightCard'
import ShimmerEffect from '../../components/animations/ShimmerEffect'
import RevealOnScroll from '../../components/animations/RevealOnScroll'
import HoverLift from '../../components/animations/HoverLift'
import GradientShift from '../../components/animations/GradientShift'
import RotatingBorder from '../../components/animations/RotatingBorder'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

const DONATE_FAQ = [
  { q: 'What instruments do you accept?', a: 'We accept all types of musical instruments in any condition — guitars, violins, drums, wind instruments, keyboards, and more. Even if it needs repair, we can often fix it.' },
  { q: 'What condition should the instrument be in?', a: 'Any condition is welcome! We have volunteers who inspect and repair instruments. Even instruments with cosmetic damage or missing parts can often be restored.' },
  { q: 'How do I get my donation to you?', a: 'You can drop off instruments in the Hanover/Norwich area. If you\'re unable to drop off, let us know in the form and we\'ll work out an alternative arrangement.' },
  { q: 'Is my donation tax-deductible?', a: 'We are a student-led initiative working toward official nonprofit status. Please contact us for the most up-to-date information about tax deductions.' },
  { q: 'How long does the process take?', a: 'After you submit the form, we\'ll review your donation and reach out within 3 business days to arrange pickup or dropoff details.' },
]

export default function Donate() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)
  const [processRef, processVisible] = useReveal({ threshold: 0.1 })
  const [faqRef, faqVisible] = useReveal({ threshold: 0.1 })

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Image preview
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(file)
      // Clear file error
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

    // Client-side validation
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

    // File validation
    const fileError = validateFileSize(file, 5)
    const allErrors = { ...(validationErrors || {}), ...(fileError ? { image: fileError } : {}) }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Scroll to first error
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
      if (res.ok) { setStatus('success'); e.target.reset(); setFileName(''); setPreview(null) }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <section className="kc-page-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <GradientShift
          colors={['rgba(245,197,24,0.06)', 'rgba(37,96,232,0.04)', 'rgba(155,89,182,0.05)', 'rgba(245,197,24,0.06)']}
          duration={12}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
        <ScrollChevron />
        <div className="kc-container" style={{ position: 'relative', zIndex: 1 }}>
          <h1>Donate to Key Change</h1>
          <p>
            Donate your working instruments and music supplies. All contributions help turn unused
            instruments into opportunities for students who would never get the chance to play.
            Without the support of donors like you, this project would not be possible.
          </p>
          <a href="#donate-form" className="kc-btn kc-btn--gold" style={{ marginTop: 'var(--space-4)' }}>
            Donation Form
          </a>
        </div>
      </section>

      {/* Donation Process */}
      <section className={`kc-section kc-reveal${processVisible ? ' visible' : ''}`} ref={processRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>Donation Process</h2>
          <div className="kc-how__grid kc-stagger">
            {[
              { icon: '📝', title: 'Submit Form', desc: 'Fill out the donation form with details about your instrument.' },
              { icon: '👀', title: 'We Review', desc: 'Our team reviews your submission within 3 business days.' },
              { icon: '📅', title: 'Schedule', desc: 'We coordinate a convenient time for pickup or dropoff.' },
              { icon: '🏠', title: 'New Home', desc: 'Your instrument finds a student who will love it.' },
            ].map((step, i) => (
              <RevealOnScroll key={i} direction="up" delay={i * 0.12}>
                <SpotlightCard radius={250}>
                  <HoverLift lift={5}>
                    <div className="kc-how__step" style={{ '--i': i }}>
                      <div className="kc-how__icon">{step.icon}</div>
                      <h3 className="kc-how__step-title">{step.title}</h3>
                      <p className="kc-how__step-desc">{step.desc}</p>
                    </div>
                  </HoverLift>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Form */}
      <section className="kc-section" id="donate-form">
        <div className="kc-container" style={{ maxWidth: '720px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>Donate Music Supplies to Key Change!</h2>
          {status === 'submitting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'var(--space-6)' }}>
              <ShimmerEffect width="100%" height={16} borderRadius={8} />
              <ShimmerEffect width="70%" height={16} borderRadius={8} />
              <ShimmerEffect width="85%" height={16} borderRadius={8} />
            </div>
          )}
          <RotatingBorder colors={['#F5C518', '#2560E8', '#9B59B6', '#F5C518']} borderWidth={1} borderRadius={20} duration={4} background="var(--color-surface, #0a0a15)">
          <div className="kc-glass kc-glass--gold" style={{ border: 'none' }}>
            {status === 'success' ? (
              <FormSuccess
                variant="celebrate"
                title="Thank you for donating!"
                message="We'll review your submission and reach out within 3 business days to arrange pickup or dropoff. You're helping make music accessible."
              />
            ) : (
              <form onSubmit={handleSubmit} className="kc-form">
                {/* Name */}
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

                {/* Organization */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Organization Name (if applicable)</label>
                  <p className="kc-form__helper">
                    If you are donating on behalf of a school, business, nonprofit, club, or other group, enter the organization name here.
                  </p>
                  <input type="text" name="organization" />
                </div>

                {/* Email */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Email <span className="kc-form__req">(required)</span></label>
                  <input type="email" name="email" required className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="kc-form__error">{errors.email}</span>}
                </div>

                {/* Newsletter */}
                <label className="kc-checkbox">
                  <input type="checkbox" name="newsletter" value="yes" />
                  <span>Sign up for news and updates</span>
                </label>

                {/* Phone */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Phone Number <span className="kc-form__req">(required)</span></label>
                  <input type="tel" name="phone" required className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="kc-form__error">{errors.phone}</span>}
                </div>

                {/* City / State */}
                <div className="kc-form__row">
                  <div className="kc-form__field">
                    <label className="kc-form__label">City <span className="kc-form__req">(required)</span></label>
                    <AutocompleteInput name="city" required suggestions={CITY_SUGGESTIONS} placeholder="e.g. Hanover" className={errors.city ? 'error' : ''} />
                    {errors.city && <span className="kc-form__error">{errors.city}</span>}
                  </div>
                  <div className="kc-form__field">
                    <label className="kc-form__label">State <span className="kc-form__req">(required)</span></label>
                    <AutocompleteInput name="state" required suggestions={STATE_SUGGESTIONS} placeholder="e.g. New Hampshire" className={errors.state ? 'error' : ''} />
                    {errors.state && <span className="kc-form__error">{errors.state}</span>}
                  </div>
                </div>

                {/* Donation description */}
                <div className="kc-form__field">
                  <label className="kc-form__label">What would you like to donate? <span className="kc-form__req">(required)</span></label>
                  <p className="kc-form__helper">
                    Please include the item type, condition, included accessories, and any damage or missing parts.
                  </p>
                  <input type="text" name="donation_description" required className={errors.donation_description ? 'error' : ''} />
                  {errors.donation_description && <span className="kc-form__error">{errors.donation_description}</span>}
                </div>

                {/* Condition */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Condition <span className="kc-form__req">(required)</span></label>
                  <select name="condition" required defaultValue="" className={errors.condition ? 'error' : ''}>
                    <option value="" disabled>Select an option</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Needs Repair</option>
                  </select>
                  {errors.condition && <span className="kc-form__error">{errors.condition}</span>}
                </div>

                {/* Image upload */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Image of Music Supply/Instrument <span className="kc-form__req">(required)</span></label>
                  <p className="kc-form__helper">
                    Please upload clear photos (max 5MB). Include the full instrument and any visible damage.
                  </p>
                  <div
                    className={`kc-file-upload${errors.image ? ' error' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload image"
                  >
                    {preview ? (
                      <div className="kc-file-upload__preview">
                        <img src={preview} alt="Preview" />
                        <div>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{fileName}</p>
                          <button
                            type="button"
                            className="kc-file-upload__remove"
                            onClick={e => { e.stopPropagation(); removeFile() }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="kc-file-upload__icon">+</div>
                        <p className="kc-file-upload__text">{fileName || 'Click to add a file'}</p>
                      </>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      onChange={handleFileChange}
                    />
                  </div>
                  {errors.image && <span className="kc-form__error">{errors.image}</span>}
                </div>

                {/* Dropoff */}
                <div className="kc-form__field">
                  <label className="kc-form__label">Would you be able to bring your donation to Hanover/Norwich? <span className="kc-form__req">(required)</span></label>
                  <select name="can_dropoff" required defaultValue="" className={errors.can_dropoff ? 'error' : ''}>
                    <option value="" disabled>Select an option</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Maybe</option>
                  </select>
                  {errors.can_dropoff && <span className="kc-form__error">{errors.can_dropoff}</span>}
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">If no, what is the best alternative donate spot near Hanover/Norwich?</label>
                  <input type="text" name="alt_location" />
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">When are you able to drop-off your donation? <span className="kc-form__req">(required)</span></label>
                  <input type="date" name="dropoff_time" required min={today} className={errors.dropoff_time ? 'error' : ''} />
                  {errors.dropoff_time && <span className="kc-form__error">{errors.dropoff_time}</span>}
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Thank you for your donation. Do you have any other information for us?</label>
                  <input type="text" name="other_info" />
                </div>

                {status === 'error' && (
                  <div className="kc-form__status kc-form__status--error" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
                <button type="submit" className="kc-btn kc-btn--gold kc-btn--full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Submit Donation'}
                </button>
              </form>
            )}
          </div>
          </RotatingBorder>
        </div>
      </section>

      {/* FAQ */}
      <section className={`kc-section kc-reveal${faqVisible ? ' visible' : ''}`} ref={faqRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <FAQ title="Donation FAQ" items={DONATE_FAQ} />
        </div>
      </section>
    </>
  )
}
