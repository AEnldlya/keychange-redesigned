import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const [leftRef, leftVisible] = useReveal()
  const [rightRef, rightVisible] = useReveal()

  return (
    <section className="contact-page-section">
      <div className="container">
        <div className="contact-page-inner">
          <div className={`contact-page-left${leftVisible ? ' visible' : ''}`} ref={leftRef}>
            <h1>Contact us</h1>
            <p>
              Interested in working together? Fill out some info and we will be in touch shortly.
              We can&apos;t wait to hear from you!
            </p>
          </div>
          <div ref={rightRef} style={{ opacity: rightVisible ? 1 : 0, transform: rightVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s' }}>
            <form
              action="https://formspree.io/f/REPLACE_WITH_CONTACT_FORM_ID"
              method="POST"
            >
              <input type="hidden" name="_subject" value="New Contact Message — Key Change" />

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
                <label>Email <span className="req">(required)</span></label>
                <input type="email" name="email" required />
              </div>

              <label className="checkbox-field">
                <input type="checkbox" name="newsletter" value="yes" />
                <span>Sign up for news and updates</span>
              </label>

              <div className="form-field">
                <label>Message <span className="req">(required)</span></label>
                <textarea name="message" rows="5" required />
              </div>

              <button type="submit" className="m-btn m-btn--light-blue" style={{ width: '100%', color: 'var(--blue)' }}>
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
