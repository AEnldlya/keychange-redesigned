export default function Donate() {
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
            <form
              action="https://formspree.io/f/REPLACE_WITH_DONATE_FORM_ID"
              method="POST"
              encType="multipart/form-data"
            >
              <input type="hidden" name="_subject" value="New Donation to Key Change" />

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
                  <input type="text" name="city" required />
                </div>
                <div className="form-field">
                  <label>State <span className="req">(required)</span></label>
                  <input type="text" name="state" required />
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
                <div className="file-upload-area" onClick={e => e.currentTarget.querySelector('input').click()}>
                  <div className="plus-icon">+</div>
                  <p>Add a File</p>
                  <input type="file" name="image" accept="image/*" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
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
                <input type="text" name="dropoff_time" required />
              </div>

              <div className="form-field">
                <label>Thank you for your donation. Do you have any other information for us?</label>
                <input type="text" name="other_info" />
              </div>

              <button type="submit" className="m-btn m-btn--light" style={{ width: '100%', marginTop: 8 }}>
                SEND
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
