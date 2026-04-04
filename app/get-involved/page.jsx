'use client'

import { useState } from 'react'
import { CheckCircle, ArrowRight, Users, Calendar, Heart } from 'lucide-react'

export default function GetInvolvedPage() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [helpTypes, setHelpTypes] = useState([])

  function toggleHelpType(type) {
    setHelpTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)

    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      age_grade_school: fd.get('age_grade_school'),
      city: fd.get('city'),
      state: fd.get('state'),
      contact_method: fd.get('contact_method'),
      help_types: helpTypes,
      availability: fd.get('availability'),
      why_volunteer: fd.get('why_volunteer'),
      anything_else: fd.get('anything_else'),
      newsletter: fd.get('newsletter') === 'yes',
    }

    const newErrors = {}
    if (!data.first_name) newErrors.first_name = 'Required'
    if (!data.last_name) newErrors.last_name = 'Required'
    if (!data.email) newErrors.email = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const volunteerRoles = [
    {
      id: 'collection',
      label: 'Instrument collection or donation outreach',
    },
    { id: 'social_media', label: 'Social media or marketing' },
    { id: 'outreach', label: 'School/organization outreach' },
    { id: 'events', label: 'Event support' },
    {
      id: 'cleaning',
      label: 'Instrument cleaning or quality checks',
    },
    { id: 'delivery', label: 'Pickup or delivery' },
    { id: 'general', label: 'General volunteer help' },
  ]

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <h1>Get Involved</h1>
        <p>Join our team of volunteers making music accessible.</p>
      </div>

      {/* Volunteer Info */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="values-grid" style={{ marginBottom: '4rem' }}>
            <div
              className="value-card"
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <Users
                size={32}
                style={{
                  color: 'var(--color-terracotta)',
                  margin: '0 auto 1rem',
                }}
              />
              <h3>Join the Team</h3>
              <p>
                Work alongside other passionate students and community members.
              </p>
            </div>
            <div
              className="value-card"
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <Calendar
                size={32}
                style={{
                  color: 'var(--color-terracotta)',
                  margin: '0 auto 1rem',
                }}
              />
              <h3>Flexible Time</h3>
              <p>
                Volunteer when it works for you. No minimum time commitment.
              </p>
            </div>
            <div
              className="value-card"
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <Heart
                size={32}
                style={{
                  color: 'var(--color-terracotta)',
                  margin: '0 auto 1rem',
                }}
              />
              <h3>Make an Impact</h3>
              <p>Directly help students access music education.</p>
            </div>
          </div>

          {/* Volunteer Form */}
          <div className="form-page">
            <p className="form-page-intro">
              Fill out the form below to join our volunteer team. We will reach
              out within a few days to discuss how you can help.
            </p>

            <div className="form-card">
              {status === 'success' ? (
                <div className="form-success">
                  <CheckCircle
                    size={64}
                    style={{
                      color: 'var(--color-terracotta)',
                      marginBottom: '1.5rem',
                    }}
                  />
                  <h3>Application received</h3>
                  <p>
                    Thank you for your interest in volunteering. We will be in
                    touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Contact Info */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Your Information
                  </h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        First Name <span>(required)</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        className={`form-input ${errors.first_name ? 'error' : ''}`}
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
                    />
                    {errors.email && (
                      <span className="form-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" name="phone" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Age, Grade, or School
                    </label>
                    <input
                      type="text"
                      name="age_grade_school"
                      className="form-input"
                      placeholder="e.g., 11th grade at Hanover High"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" name="city" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" name="state" className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Best way to reach you</label>
                    <select name="contact_method" className="form-select">
                      <option value="">Select an option</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text</option>
                    </select>
                  </div>

                  {/* Volunteer Roles */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      marginTop: '2rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    How would you like to help?
                  </h3>

                  <div className="checkbox-group">
                    {volunteerRoles.map((role) => (
                      <label
                        key={role.id}
                        className="form-checkbox"
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <input
                          type="checkbox"
                          checked={helpTypes.includes(role.id)}
                          onChange={() => toggleHelpType(role.id)}
                        />
                        <span>{role.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">
                      When are you generally available?
                    </label>
                    <input
                      type="text"
                      name="availability"
                      className="form-input"
                      placeholder="e.g., Weekends, after school, summer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Why do you want to volunteer with Key Change?
                    </label>
                    <textarea
                      name="why_volunteer"
                      className="form-textarea"
                      rows={4}
                      placeholder="Tell us what draws you to this work..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Anything else we should know?</label>
                    <textarea
                      name="anything_else"
                      className="form-textarea"
                      rows={3}
                      placeholder="Skills, experience, special interests..."
                    />
                  </div>

                  <label className="form-checkbox">
                    <input type="checkbox" name="newsletter" value="yes" />
                    <span>Keep me updated on Key Change news</span>
                  </label>

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
                      'Submitting...'
                    ) : (
                      <>
                        Submit Application
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
