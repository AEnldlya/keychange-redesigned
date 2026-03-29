'use client'
import { useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

export default function GetInvolved() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.target)
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
      <section className="page-hero">
        <ScrollChevron />
        <div className="container">
          <h1>Get Involved</h1>
          <p>
            Want to help make music accessible to more students? Fill out the form below and we&apos;ll
            reach out with ways you can contribute.
          </p>
        </div>
      </section>

      <section className="donate-form-section">
        <div className="container">
          {status === 'success' ? (
            <FormSuccess
              variant="quiet"
              title="Application received!"
              message="Thank you for wanting to help. We'll be in touch with next steps."
            />
          ) : (
            <form onSubmit={handleSubmit} className="donate-form-wrap">
              <div className="form-field">
                <label>Full Name</label>
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
                <label>Phone</label>
                <input type="tel" name="phone" />
              </div>

              <div className="form-field">
                <label>Age, Grade, and School <span className="req">(required)</span></label>
                <input type="text" name="age_grade_school" placeholder='If you are an adult, write "Adult".' required />
              </div>

              <div className="form-field">
                <div className="form-row">
                  <div>
                    <label>State <span className="req">(required)</span></label>
                    <AutocompleteInput name="state" required suggestions={STATE_SUGGESTIONS} placeholder="e.g. New Hampshire" />
                  </div>
                  <div>
                    <label>City <span className="req">(required)</span></label>
                    <AutocompleteInput name="city" required suggestions={CITY_SUGGESTIONS} placeholder="e.g. Hanover" />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>Best Way to Contact You <span className="req">(required)</span></label>
                <select name="contact_method" required>
                  <option value="">Select an option</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text</option>
                </select>
              </div>

              <div className="form-field">
                <label>What kind of help are you most interested in? <span className="req">(required)</span></label>
                <div className="checkbox-group">
                  {[
                    ['collection', 'Instrument collection or donation outreach'],
                    ['social_media', 'Social media or marketing'],
                    ['outreach', 'School/organization outreach'],
                    ['events', 'Event support'],
                    ['cleaning', 'Instrument cleaning or quality checks'],
                    ['delivery', 'Pickup or delivery'],
                    ['general', 'General volunteer help'],
                  ].map(([val, label]) => (
                    <label key={val} className="checkbox-field">
                      <input type="checkbox" name="help_type" value={val} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>What is your availability? <span className="req">(required)</span></label>
                <textarea
                  name="availability"
                  rows="3"
                  placeholder="Please share what days or times usually work for you and about how much time you could realistically help each week or month."
                  required
                />
              </div>

              <div className="form-field">
                <label>Why do you want to volunteer with Key Change? <span className="req">(required)</span></label>
                <textarea name="why_volunteer" rows="4" required />
              </div>

              <div className="form-field">
                <label>Anything else we should know?</label>
                <textarea name="anything_else" rows="3" />
              </div>

              {status === 'error' && (
                <p style={{ color: 'red', fontSize: '0.875rem' }}>Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="btn btn--gold" style={{ width: '100%' }} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
