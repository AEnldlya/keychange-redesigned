export default function GetInvolved() {
  return (
    <>
      <section className="get-involved-hero">
        <h1>Volunteer With Key Change!</h1>
        <p>
          Students and community members interested in supporting Key Change are invited to get involved
          in a variety of meaningful and impactful roles. Volunteers help make our mission possible by
          supporting the accessibility of music across many schools.
        </p>
        <p>
          If you are interested in volunteering with Key Change, please complete the form below.
          We will follow up with more details based on your responses.
        </p>
        <a href="#volunteer-form" className="m-btn m-btn--light" style={{ marginTop: '32px' }}>
          VOLUNTEER FORM
        </a>
      </section>

      <section className="donate-form-section" id="volunteer-form">
        <div className="container">
          <form
            action="https://formspree.io/f/REPLACE_WITH_VOLUNTEER_FORM_ID"
            method="POST"
            className="donate-form-wrap"
          >
            <input type="hidden" name="_subject" value="New Volunteer Application — Key Change" />

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
                  <input type="text" name="state" required />
                </div>
                <div>
                  <label>City <span className="req">(required)</span></label>
                  <input type="text" name="city" required />
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

            <button type="submit" className="btn btn--gold" style={{ width: '100%' }}>
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
