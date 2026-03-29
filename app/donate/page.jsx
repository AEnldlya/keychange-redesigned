'use client'
import { useState, useRef } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

export default function Donate() {
  const [status, setStatus] = useState('idle')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.target)
    const file = fileRef.current?.files?.[0]

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
      if (res.ok) { setStatus('success'); e.target.reset(); setFileName('') }
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section className="donate-hero">
        <h1>Donate to Key Change!</h1>
        <p className="subtitle">Donate your working instruments and/or music supplies</p>
        <p>
          All contributions help turn unused instruments into opportunities for students who would
          never get the chance to play. Without the support of donors like you, this project would
          not be possible.
        </p>
        <a href="#donate-form" className="m-btn m-btn--light" style={{ marginTop: 16 }}>
          DONATE FORM
        </a>
      </section>

      <section className="donate-form-section" id="donate-form">
        <div className="container">
          <h2>Donate Music Supplies to Key Change!</h2>
          <div className="donate-form-wrap">
            {status === 'success' ? (
              <FormSuccess
                variant="celebrate"
                title="Thank you for donating!"
                message="We'll review your submission and reach out soon. You're helping make music accessible."
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
                  <label>Organization Name (if applicable)</label>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(13,26,58,0.6)', marginBottom: 8 }}>
                    If you are donating on behalf of a school, business, nonprofit, club, or other group, enter the organization name here.
                  </p>
                  <input type="text" name="organization" />
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
                  <label>Phone Number <span className="req">(required)</span></label>
                  <input type="tel" name="phone" required />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>City <span className="req">(required)</span></label>
                    <AutocompleteInput name="city" required suggestions={CITY_SUGGESTIONS} placeholder="e.g. Hanover" />
                  </div>
                  <div className="form-field">
                    <label>State <span className="req">(required)</span></label>
                    <AutocompleteInput name="state" required suggestions={STATE_SUGGESTIONS} placeholder="e.g. New Hampshire" />
                  </div>
                </div>

                <div className="form-field">
                  <label>What would you like to donate? <span className="req">(required)</span></label>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(13,26,58,0.6)', marginBottom: 8 }}>
                    Please include the item type, condition, included accessories, and any damage or missing parts.
                  </p>
                  <input type="text" name="donation_description" required />
                </div>

                <div className="form-field">
                  <label>Condition <span className="req">(required)</span></label>
                  <select name="condition" required>
                    <option value="" disabled>Select an option</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Needs Repair</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Image of Music Supply/Instrument <span className="req">(required)</span></label>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(13,26,58,0.6)', marginBottom: 8 }}>
                    Please upload clear photos. Include the full instrument and any visible damage, missing parts, or included accessories if possible.
                  </p>
                  <div className="file-upload-area" onClick={() => fileRef.current?.click()}>
                    <div className="plus-icon">+</div>
                    <p>{fileName || 'Add a File'}</p>
                    <input
                      ref={fileRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      onChange={e => setFileName(e.target.files?.[0]?.name || '')}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Would you be able to bring your donation to Hanover/Norwich? <span className="req">(required)</span></label>
                  <select name="can_dropoff" required>
                    <option value="" disabled>Select an option</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Maybe</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>If no, what is the best alternative donate spot near Hanover/Norwich?</label>
                  <input type="text" name="alt_location" />
                </div>

                <div className="form-field">
                  <label>When are you able to drop-off your donation? <span className="req">(required)</span></label>
                  <input type="date" name="dropoff_time" required />
                </div>

                <div className="form-field">
                  <label>Thank you for your donation. Do you have any other information for us?</label>
                  <input type="text" name="other_info" />
                </div>

                {status === 'error' && (
                  <p style={{ color: 'red', fontSize: '0.875rem' }}>Something went wrong. Please try again.</p>
                )}
                <button type="submit" className="m-btn m-btn--light" style={{ width: '100%', marginTop: 8 }} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'SEND'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
