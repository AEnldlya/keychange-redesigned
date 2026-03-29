'use client'
import { useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validateRequired, validateForm } from '../../lib/validate'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

const ROLES = [
  { icon: '📦', title: 'Collection & Outreach', desc: 'Help us collect instruments from donors in the community through drives and outreach events.' },
  { icon: '📱', title: 'Social Media & Marketing', desc: 'Grow our online presence by creating content and managing our social media channels.' },
  { icon: '🏫', title: 'School Outreach', desc: 'Connect with schools and organizations to identify students and programs that need instruments.' },
  { icon: 'Star', title: 'Event Support', desc: 'Help plan and run fundraising events, collection drives, and community gatherings.' },
  { icon: '🔧', title: 'Instrument Maintenance', desc: 'Inspect, clean, and perform basic repairs on donated instruments to get them ready for students.' },
  { icon: '🚚', title: 'Pickup & Delivery', desc: 'Help transport instruments between donors, our workspace, and recipient schools.' },
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
          <h1>Get Involved</h1>
          <p>
            Want to help make music accessible to more students? Whether you have an hour a week
            or a weekend a month, there&apos;s a role for you. Explore volunteer opportunities below
            and fill out the form to join our team.
          </p>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className={`kc-section kc-roles kc-reveal${rolesVisible ? ' visible' : ''}`} ref={rolesRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <h2 className="kc-roles__heading">Volunteer Roles</h2>
          <div className="kc-roles__grid kc-stagger">
            {ROLES.map((role, i) => (
              <div key={i} className="kc-glass kc-roles__card" style={{ '--i': i }}>
                <div className="kc-roles__icon">{role.icon}</div>
                <h3 className="kc-roles__title">{role.title}</h3>
                <p className="kc-roles__desc">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section className="kc-section">
        <div className="kc-container" style={{ maxWidth: '720px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>Volunteer Application</h2>
          {status === 'success' ? (
            <div className="kc-glass kc-glass--gold">
              <FormSuccess
                variant="quiet"
                title="Application received!"
                message="Thank you for wanting to help. We'll match you with a role and reach out within a week."
              />
            </div>
          ) : (
            <div className="kc-glass kc-glass--gold">
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
                  <label className="kc-form__label">Phone</label>
                  <input type="tel" name="phone" />
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Age, Grade, and School <span className="kc-form__req">(required)</span></label>
                  <input type="text" name="age_grade_school" placeholder='If you are an adult, write "Adult".' required className={errors.age_grade_school ? 'error' : ''} />
                  {errors.age_grade_school && <span className="kc-form__error">{errors.age_grade_school}</span>}
                </div>

                <div className="kc-form__row">
                  <div className="kc-form__field">
                    <label className="kc-form__label">State <span className="kc-form__req">(required)</span></label>
                    <AutocompleteInput name="state" required suggestions={STATE_SUGGESTIONS} placeholder="e.g. New Hampshire" className={errors.state ? 'error' : ''} />
                    {errors.state && <span className="kc-form__error">{errors.state}</span>}
                  </div>
                  <div className="kc-form__field">
                    <label className="kc-form__label">City <span className="kc-form__req">(required)</span></label>
                    <AutocompleteInput name="city" required suggestions={CITY_SUGGESTIONS} placeholder="e.g. Hanover" className={errors.city ? 'error' : ''} />
                    {errors.city && <span className="kc-form__error">{errors.city}</span>}
                  </div>
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Best Way to Contact You <span className="kc-form__req">(required)</span></label>
                  <select name="contact_method" required defaultValue="" className={errors.contact_method ? 'error' : ''}>
                    <option value="" disabled>Select an option</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                  </select>
                  {errors.contact_method && <span className="kc-form__error">{errors.contact_method}</span>}
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">What kind of help are you most interested in? <span className="kc-form__req">(required)</span></label>
                  <div className="kc-checkbox-group">
                    {[
                      ['collection', 'Instrument collection or donation outreach'],
                      ['social_media', 'Social media or marketing'],
                      ['outreach', 'School/organization outreach'],
                      ['events', 'Event support'],
                      ['cleaning', 'Instrument cleaning or quality checks'],
                      ['delivery', 'Pickup or delivery'],
                      ['general', 'General volunteer help'],
                    ].map(([val, label]) => (
                      <label key={val} className="kc-checkbox">
                        <input type="checkbox" name="help_type" value={val} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">What is your availability? <span className="kc-form__req">(required)</span></label>
                  <textarea
                    name="availability"
                    rows="3"
                    placeholder="Please share what days or times usually work for you and about how much time you could realistically help each week or month."
                    required
                    className={errors.availability ? 'error' : ''}
                  />
                  {errors.availability && <span className="kc-form__error">{errors.availability}</span>}
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Why do you want to volunteer with Key Change? <span className="kc-form__req">(required)</span></label>
                  <textarea name="why_volunteer" rows="4" required className={errors.why_volunteer ? 'error' : ''} />
                  {errors.why_volunteer && <span className="kc-form__error">{errors.why_volunteer}</span>}
                </div>

                <div className="kc-form__field">
                  <label className="kc-form__label">Anything else we should know?</label>
                  <textarea name="anything_else" rows="3" />
                </div>

                {status === 'error' && (
                  <div className="kc-form__status kc-form__status--error" role="alert">
                    Something went wrong. Please try again.
                  </div>
                )}
                <button type="submit" className="kc-btn kc-btn--gold kc-btn--full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
