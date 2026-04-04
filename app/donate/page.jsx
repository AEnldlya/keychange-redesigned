'use client'

import { useState } from 'react'
import { Upload, CheckCircle, ArrowRight, Info } from 'lucide-react'

export default function DonatePage() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)

    let imageBase64 = null
    const imageFile = fd.get('image')
    if (imageFile && imageFile.size > 0) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(imageFile)
      })
    }

    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      organization: fd.get('organization'),
      phone: fd.get('phone'),
      city: fd.get('city'),
      state: fd.get('state'),
      donation_description: fd.get('donation_description'),
      condition: fd.get('condition'),
      can_dropoff: fd.get('can_dropoff'),
      alt_location: fd.get('alt_location'),
      dropoff_time: fd.get('dropoff_time'),
      other_info: fd.get('other_info'),
      newsletter: fd.get('newsletter') === 'yes',
      image_base64: imageBase64,
      image_filename: imageFile?.name,
    }

    const newErrors = {}
    if (!data.first_name) newErrors.first_name = 'Required'
    if (!data.last_name) newErrors.last_name = 'Required'
    if (!data.email) newErrors.email = 'Required'
    if (!data.donation_description)
      newErrors.donation_description = 'Please describe your donation'
    if (!data.condition) newErrors.condition = 'Please select condition'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
        <h1>Donate an Instrument</h1>
        <p>Give your unused instrument a new life in the hands of a student.</p>
      </div>

      {/* Donate Form */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="form-page">
            <p className="form-page-intro">
              Fill out the form below with details about your instrument
              donation. We will review your submission and reach out within 48
              hours to coordinate pickup or drop-off.
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
                  <h3>Donation submitted</h3>
                  <p>
                    Thank you for your generosity. We will review your
                    submission and contact you soon.
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
                    <label className="form-label">Organization (if any)</label>
                    <input type="text" name="organization" className="form-input" />
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

                  {/* Instrument Details */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      marginTop: '2rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Instrument Details
                  </h3>

                  <div className="form-group">
                    <label className="form-label">
                      What are you donating? <span>(required)</span>
                    </label>
                    <input
                      type="text"
                      name="donation_description"
                      className={`form-input ${errors.donation_description ? 'error' : ''}`}
                      placeholder="e.g., Yamaha acoustic guitar, 3/4 size violin"
                    />
                    {errors.donation_description && (
                      <span className="form-error">
                        {errors.donation_description}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Condition <span>(required)</span>
                    </label>
                    <select
                      name="condition"
                      className={`form-select ${errors.condition ? 'error' : ''}`}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent - Like new</option>
                      <option value="good">Good - Minor wear, fully playable</option>
                      <option value="fair">Fair - Needs some repair</option>
                      <option value="poor">Poor - Significant repair needed</option>
                      <option value="unknown">Unknown - Not sure</option>
                    </select>
                    {errors.condition && (
                      <span className="form-error">{errors.condition}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Can you drop off in Hanover, NH?
                    </label>
                    <select name="can_dropoff" className="form-select">
                      <option value="">Select an option</option>
                      <option value="yes">Yes, I can drop off</option>
                      <option value="no">No, I need pickup</option>
                      <option value="maybe">Not sure yet</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Alternative drop-off location (if applicable)
                    </label>
                    <input
                      type="text"
                      name="alt_location"
                      className="form-input"
                      placeholder="e.g., Lebanon, NH or Norwich, VT"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred drop-off time</label>
                    <input
                      type="text"
                      name="dropoff_time"
                      className="form-input"
                      placeholder="e.g., Weekends, weekday evenings"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Upload a photo (optional but helpful)
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem',
                        border: '2px dashed var(--color-cream-dark)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--color-ink-muted)',
                      }}
                    >
                      <Upload size={20} />
                      {imagePreview ? 'Change photo' : 'Click to upload photo'}
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          marginTop: '1rem',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Anything else we should know?
                    </label>
                    <textarea
                      name="other_info"
                      className="form-textarea"
                      rows={3}
                      placeholder="History of the instrument, special notes, etc."
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
                        Submit Donation
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-ink-muted)',
                    }}
                  >
                    <Info size={16} />
                    Your donation may be tax deductible. We are a registered
                    501(c)(3) nonprofit.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
