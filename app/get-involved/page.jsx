'use client'
import { useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validateRequired, validateForm } from '../../lib/validate'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

const ROLES = [
  { 
    title: 'Collection & Outreach', 
    desc: 'Help us collect instruments from donors through drives and community outreach events.' 
  },
  { 
    title: 'Social Media & Marketing', 
    desc: 'Grow our online presence by creating content and managing our social media channels.' 
  },
  { 
    title: 'School Outreach', 
    desc: 'Connect with schools and organizations to identify students and programs that need instruments.' 
  },
  { 
    title: 'Event Support', 
    desc: 'Help plan and run fundraising events, collection drives, and community gatherings.' 
  },
  { 
    title: 'Instrument Maintenance', 
    desc: 'Inspect, clean, and perform basic repairs on donated instruments.' 
  },
  { 
    title: 'Pickup & Delivery', 
    desc: 'Help transport instruments between donors, our workspace, and recipient schools.' 
  },
]

export default function GetInvolved() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [rolesRef, rolesVisible] = useReveal({ threshold: 0.1 })

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      age_grade_school: fd.get('age_grade_school'),
      state: fd.get('state'),
      city: fd.get('city'),
      contact_method: fd.get('contact_method'),
      availability: fd.get('availability'),
      why_volunteer: fd.get('why_volunteer'),
    }

    const validationErrors = validateForm(data, {
      first_name: [v => validateRequired(v, 'First name')],
      last_name: [v => validateRequired(v, 'Last name')],
      email: [v => validateRequired(v, 'Email'), validateEmail],
      age_grade_school: [v => validateRequired(v, 'Age, grade, and school')],
      state: [v => validateRequired(v, 'State')],
      city: [v => validateRequired(v, 'City')],
      contact_method: [v => validateRequired(v, 'Contact method')],
      availability: [v => validateRequired(v, 'Availability')],
      why_volunteer: [v => validateRequired(v, 'Why volunteer')],
    })

    if (validationErrors) {
      setErrors(validationErrors)
      const firstErrorEl = document.querySelector('.error')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fd.get('first_name'),
          last_name: fd.get('last_name'),
          email: fd.get('email'),
          newsletter: fd.get('newsletter') === 'yes',
          phone: fd.get('phone'),
          age_grade_school: fd.get('age_grade_school'),
          state: fd.get('state'),
          city: fd.get('city'),
          contact_method: fd.get('contact_method'),
          help_types: fd.getAll('help_type'),
          availability: fd.get('availability'),
          why_volunteer: fd.get('why_volunteer'),
          anything_else: fd.get('anything_else'),
        }),
      })
      if (res.ok) { 
        setStatus('success')
        e.target.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="kc-page-header">
        <div className="kc-container">
          <h1>Get Involved</h1>
          <p>
            Want to help make music accessible to more students? Whether you have 
            an hour a week or a weekend a month, there&apos;s a role for you.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="kc-section kc-section--dark">
        <div className="kc-container">
          <div className="kc-how__header" style={{ textAlign: 'center' }}>
            <h2>Our Impact</h2>
            <p style={{ color: 'rgba(253,248,243,0.7)' }}>Together, we&apos;re making a difference</p>
          </div>
          
          <div className="kc-impact__grid" style={{ marginTop: 'var(--space-10)' }}>
            <div className="kc-impact__stat">
              <span className="kc-impact__number">50+</span>
              <p className="kc-impact__label">Instruments donated</p>
            </div>
            <div className="kc-impact__stat">
              <span className="kc-impact__number">25+</span>
              <p className="kc-impact__label">Active volunteers</p>
            </div>
            <div className="kc-impact__stat">
              <span className="kc-impact__number">10+</span>
              <p className="kc-impact__label">Schools reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section ref={rolesRef} className="kc-section kc-section--alt">
        <div className="kc-container">
          <div className="kc-how__header">
            <h2>Volunteer Roles</h2>
            <p>Find a role that fits your skills and schedule</p>
          </div>
          
          <div className={`kc-about__values ${rolesVisible ? 'kc-stagger visible' : 'kc-stagger'}`}>
            {ROLES.map((role, i) => (
              <div key={i} className="kc-card" style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>
                  {role.title}
                </h3>
                <p style={{ fontSize: 'var(--text-base)' }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section className="kc-section">
        <div className="kc-container" style={{ maxWidth: '720px' }}>
          <div className="kc-contact-page__form">
            <h2>Volunteer Application</h2>
            
            {status === 'success' ? (
              <div className="kc-contact__form-wrapper">
                <FormSuccess
                  title="Application received!"
                  message="Thank you for wanting to help. We'll match you with a role and reach out within a week."
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
                    <label className="kc-form__label">Phone</label>
                    <input type="tel" name="phone" placeholder="(603) 555-0123" />
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Age, Grade, and School <span>(required)</span>
                    </label>
                    <input 
                      type="text" 
                      name="age_grade_school"
                      placeholder='If adult, write "Adult"'
                      className={errors.age_grade_school ? 'error' : ''} 
                    />
                    {errors.age_grade_school && <span className="kc-form__error">{errors.age_grade_school}</span>}
                  </div>

                  <div className="kc-form__row">
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
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Best way to contact you <span>(required)</span>
                    </label>
                    <select 
                      name="contact_method" 
                      defaultValue=""
                      className={errors.contact_method ? 'error' : ''}
                    >
                      <option value="" disabled>Select option</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone call</option>
                      <option value="text">Text message</option>
                    </select>
                    {errors.contact_method && <span className="kc-form__error">{errors.contact_method}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      What roles interest you?
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                      {[
                        ['collection', 'Instrument collection & outreach'],
                        ['social_media', 'Social media & marketing'],
                        ['outreach', 'School outreach'],
                        ['events', 'Event support'],
                        ['maintenance', 'Instrument maintenance'],
                        ['delivery', 'Pickup & delivery'],
                        ['general', 'General help'],
                      ].map(([val, label]) => (
                        <label key={val} className="kc-checkbox">
                          <input type="checkbox" name="help_type" value={val} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      What&apos;s your availability? <span>(required)</span>
                    </label>
                    <textarea 
                      name="availability" 
                      rows={3}
                      placeholder="e.g. Weekends, 2-3 hours per week"
                      className={errors.availability ? 'error' : ''} 
                    />
                    {errors.availability && <span className="kc-form__error">{errors.availability}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">
                      Why do you want to volunteer? <span>(required)</span>
                    </label>
                    <textarea 
                      name="why_volunteer" 
                      rows={4}
                      placeholder="Tell us what draws you to this work..."
                      className={errors.why_volunteer ? 'error' : ''} 
                    />
                    {errors.why_volunteer && <span className="kc-form__error">{errors.why_volunteer}</span>}
                  </div>

                  <div className="kc-form__field">
                    <label className="kc-form__label">Anything else we should know?</label>
                    <textarea name="anything_else" rows={3} placeholder="Additional information..." />
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
                    {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
