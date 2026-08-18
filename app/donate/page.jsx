'use client'

import { useState } from 'react'
import { Upload, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'

const ATLAS_DONATE_URL = 'https://fundraising.fracturedatlas.org/key-change'

const DONATION_TYPES = [
  {
    id: 'drive',
    label: 'Drive Donation',
    description: 'For organizations hosting a donation drive',
  },
  {
    id: 'money',
    label: 'Money Donation',
    description: 'Give directly through our secure donation page',
  },
  {
    id: 'instrument',
    label: 'Instrument Donation',
    description: 'Donate an instrument you no longer use',
  },
]

export default function DonatePage() {
  const [donationType, setDonationType] = useState('drive')
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
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
      donation_type: donationType,
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      date: fd.get('date'),
      ok_to_contact: fd.get('ok_to_contact') === 'yes',
      newsletter: fd.get('newsletter') === 'yes',
      // Drive donation
      drive_organization: fd.get('drive_organization'),
      drive_date: fd.get('drive_date'),
      drive_offer: fd.get('drive_offer'),
      // Instrument donation
      instrument_type: fd.get('instrument_type'),
      condition: fd.get('condition'),
      image_base64: imageBase64,
      image_filename: imageFile?.name,
    }

    const newErrors = {}
    if (!data.first_name) newErrors.first_name = 'Required'
    if (!data.last_name) newErrors.last_name = 'Required'
    if (!data.email) newErrors.email = 'Required'
    if (!data.phone) newErrors.phone = 'Required'
    if (!data.date) newErrors.date = 'Required'
    if (!data.ok_to_contact) newErrors.ok_to_contact = 'Required'

    if (donationType === 'drive') {
      if (!data.drive_organization) newErrors.drive_organization = 'Required'
      if (!data.drive_date) newErrors.drive_date = 'Required'
      if (!data.drive_offer) newErrors.drive_offer = 'Required'
    }

    if (donationType === 'instrument') {
      if (!data.instrument_type) newErrors.instrument_type = 'Required'
      if (!data.condition) newErrors.condition = 'Please select condition'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitError('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setSubmitError(
          body.error || 'Something went wrong. Please try again.'
        )
      }
    } catch {
      setStatus('error')
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <div className="page-header-v2">
        <h1>Donate</h1>
        <p>Organize a drive, give directly, or donate an instrument.</p>
      </div>

      {/* Donate Form */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="form-page">
            <p className="form-page-intro">
              Choose how you would like to give below. We will review your
              submission and reach out within 48 hours.
            </p>

            <div className="form-card">
              {status === 'success' ? (
                <div className="form-success">
                  <CheckCircle size={56} className="form-success-icon" />
                  <h3>Donation submitted</h3>
                  <p>
                    Thank you for your generosity. We will review your
                    submission and contact you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Donation Type */}
                  <h3 className="form-section-heading">Type of donation</h3>
                  <div className="donation-type-group">
                    {DONATION_TYPES.map((type) => (
                      <label
                        key={type.id}
                        className={`donation-type-option ${donationType === type.id ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="donation_type_radio"
                          value={type.id}
                          checked={donationType === type.id}
                          onChange={() => setDonationType(type.id)}
                        />
                        <strong>{type.label}</strong>
                        <span>{type.description}</span>
                      </label>
                    ))}
                  </div>

                  {/* Drive Donation fields */}
                  {donationType === 'drive' && (
                    <>
                      <h3 className="form-section-heading">Drive Details</h3>

                      <div className="form-group">
                        <label className="form-label">
                          Organization Name <span>(required)</span>
                        </label>
                        <input
                          type="text"
                          name="drive_organization"
                          className={`form-input ${errors.drive_organization ? 'error' : ''}`}
                        />
                        {errors.drive_organization && (
                          <span className="form-error">
                            {errors.drive_organization}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Date of the Drive <span>(required)</span>
                        </label>
                        <input
                          type="date"
                          name="drive_date"
                          className={`form-input ${errors.drive_date ? 'error' : ''}`}
                        />
                        {errors.drive_date && (
                          <span className="form-error">{errors.drive_date}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          What are you willing to give us? <span>(required)</span>
                        </label>
                        <textarea
                          name="drive_offer"
                          className={`form-textarea ${errors.drive_offer ? 'error' : ''}`}
                          rows={3}
                          placeholder="e.g., Instruments collected at the drive, a matching donation, volunteer support"
                        />
                        {errors.drive_offer && (
                          <span className="form-error">{errors.drive_offer}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Money Donation */}
                  {donationType === 'money' && (
                    <>
                      <h3 className="form-section-heading">Give Directly</h3>
                      <div className="form-callout">
                        <p>
                          Monetary donations are collected securely through
                          our Fractured Atlas fundraising page. Click below to
                          give, then fill out your information so we can
                          follow up and say thank you.
                        </p>
                        <a
                          href={ATLAS_DONATE_URL}
                          target="_blank"
                          rel="noopener"
                          className="btn btn-blue"
                        >
                          Donate on Fractured Atlas
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </>
                  )}

                  {/* Instrument Donation fields */}
                  {donationType === 'instrument' && (
                    <>
                      <h3 className="form-section-heading">
                        Instrument Details
                      </h3>

                      <img
                        src="/assets/donated-instruments.jpg"
                        alt="Instruments and cases collected from a past Key Change donation drive"
                        style={{
                          width: '100%',
                          borderRadius: 'var(--radius-lg)',
                          marginBottom: 'var(--sp-5)',
                        }}
                      />

                      <div className="form-group">
                        <label className="form-label">
                          Type of Instrument <span>(required)</span>
                        </label>
                        <input
                          type="text"
                          name="instrument_type"
                          className={`form-input ${errors.instrument_type ? 'error' : ''}`}
                          placeholder="e.g., Yamaha acoustic guitar, 3/4 size violin"
                        />
                        {errors.instrument_type && (
                          <span className="form-error">
                            {errors.instrument_type}
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
                          <option value="good">
                            Good - Minor wear, fully playable
                          </option>
                          <option value="fair">Fair - Needs some repair</option>
                          <option value="poor">
                            Poor - Significant repair needed
                          </option>
                          <option value="unknown">Unknown - Not sure</option>
                        </select>
                        {errors.condition && (
                          <span className="form-error">{errors.condition}</span>
                        )}
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
                    </>
                  )}

                  {/* Contact Info */}
                  <h3 className="form-section-heading">Your Information</h3>

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

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Phone Number <span>(required)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                      />
                      {errors.phone && (
                        <span className="form-error">{errors.phone}</span>
                      )}
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Date <span>(required)</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      className={`form-input ${errors.date ? 'error' : ''}`}
                    />
                    {errors.date && (
                      <span className="form-error">{errors.date}</span>
                    )}
                  </div>

                  <label className="form-checkbox">
                    <input type="checkbox" name="ok_to_contact" value="yes" />
                    <span>
                      Yes, Key Change can contact me about this donation{' '}
                      <span style={{ color: 'var(--error)' }}>(required)</span>
                    </span>
                  </label>
                  {errors.ok_to_contact && (
                    <span className="form-error" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>
                      {errors.ok_to_contact}
                    </span>
                  )}

                  <label className="form-checkbox">
                    <input type="checkbox" name="newsletter" value="yes" />
                    <span>Keep me updated on Key Change news</span>
                  </label>

                  {status === 'error' && (
                    <div
                      className="form-error"
                      style={{ marginBottom: '1rem' }}
                    >
                      {submitError || 'Something went wrong. Please try again.'}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-blue"
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

                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
