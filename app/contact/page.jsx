'use client'
import { useState } from 'react'
import Link from 'next/link'
import FormSuccess from '../../components/FormSuccess'
import { useReveal } from '../../hooks/useReveal'
import { validateEmail, validateRequired, validateForm } from '../../lib/validate'

const FAQ_ITEMS = [
  {
    question: 'How long does it take to get a response?',
    answer: 'We typically respond to all messages within 48 hours. For urgent matters, please indicate that in your message subject.'
  },
  {
    question: 'How can I donate instruments?',
    answer: 'Head to our Donate page to fill out a simple form with details about your instrument. We accept all types in any condition—even if they need repair.'
  },
  {
    question: 'Can I volunteer with Key Change?',
    answer: 'Absolutely. We need help with instrument collection, cleaning, minor repairs, and outreach. Visit our Get Involved page to learn more.'
  },
  {
    question: 'Where is Key Change based?',
    answer: 'We are based in the Upper Valley area of New Hampshire and Vermont, primarily serving the Hanover and Norwich communities and surrounding towns.'
  },
  {
    question: 'Do you accept monetary donations?',
    answer: 'Yes. Financial contributions help us cover repair costs, purchase accessories like cases and strings, and fund lesson scholarships for students.'
  }
]

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="kc-faq__item">
      <button 
        className="kc-faq__question"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={`kc-faq__icon ${isOpen ? 'kc-faq__icon--open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className={`kc-faq__answer ${isOpen ? 'kc-faq__answer--open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, visible] = useReveal({ threshold: 0.1 })
  
  return (
    <section ref={ref} className="kc-section">
      <div className="kc-container kc-container--narrow">
        <div className={`kc-faq ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
          <h2 className="kc-faq__title">Frequently Asked Questions</h2>
          <div className="kc-faq__list">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [ref, visible] = useReveal({ threshold: 0.1 })

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      message: fd.get('message'),
    }

    const validationErrors = validateForm(data, {
      first_name: [v => validateRequired(v, 'First name')],
      last_name: [v => validateRequired(v, 'Last name')],
      email: [v => validateRequired(v, 'Email'), validateEmail],
      message: [v => validateRequired(v, 'Message')],
    })
    
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }
    
    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          newsletter: fd.get('newsletter') === 'yes',
          source: 'Contact Page',
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
      {/* Header */}
      <section className="kc-page-header">
        <div className="kc-container">
          <h1>Contact Us</h1>
          <p>
            Have a question about donating? Want to volunteer? Just want to say hello? 
            Drop us a line and we&apos;ll get back to you within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="kc-section kc-section--alt">
        <div className="kc-container">
          <div className="kc-contact-page__info">
            <div className="kc-contact-page__card">
              <span className="kc-contact-page__label">Email</span>
              <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
            </div>
            <div className="kc-contact-page__card">
              <span className="kc-contact-page__label">Instagram</span>
              <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">
                @keychangeproject
              </a>
            </div>
            <div className="kc-contact-page__card">
              <span className="kc-contact-page__label">Location</span>
              <span>Upper Valley, NH & VT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section ref={ref} className="kc-section">
        <div className="kc-container kc-container--narrow">
          <div className={`kc-contact-page__form ${visible ? 'kc-reveal visible' : 'kc-reveal'}`}>
            <h2>Send us a message</h2>
            
            {status === 'success' ? (
              <FormSuccess
                title="Message sent"
                message="Thanks for reaching out. We'll get back to you within 48 hours."
              />
            ) : (
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
                  <label className="kc-form__label">
                    Message <span>(required)</span>
                  </label>
                  <textarea 
                    name="message" 
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={errors.message ? 'error' : ''} 
                  />
                  {errors.message && <span className="kc-form__error">{errors.message}</span>}
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
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />
    </>
  )
}
