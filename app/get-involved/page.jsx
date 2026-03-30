'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import AutocompleteInput from '../../components/AutocompleteInput'
import FormSuccess from '../../components/FormSuccess'
import ScrollChevron from '../../components/ScrollChevron'
import MagneticButton from '../../components/MagneticButton'
import RevealCard from '../../components/RevealCard'
import { validateEmail, validateRequired, validateForm } from '../../lib/validate'
import {
  TiltImage,
  BorderGlow,
  ParallaxImage,
  ZoomOnScroll,
} from '../../components/animations/ImageAnimations'
import {
  FloatingParticles,
  MorphingGradient,
  BreathingPulse,
} from '../../components/animations/PassiveAnimations'
import {
  FlipCard3D,
  FlipCounter,
  NeonGlow,
  TextReveal,
  RevealOnScroll,
  SpotlightCard,
} from '../../components/animations/PremiumAnimations'
import { LazyInstrumentIcon, LazyMusicNote3D } from '../../components/3d/Lazy3D'

const CITY_SUGGESTIONS = ['Hanover', 'Norwich']
const STATE_SUGGESTIONS = ['New Hampshire', 'Vermont']

const ROLES = [
  { num: '01', svgType: 'note', instrument: 'violin', title: 'Collection & Outreach', desc: 'Help us collect instruments from donors in the community through drives and outreach events.' },
  { num: '02', svgType: 'wave', instrument: 'guitar', title: 'Social Media & Marketing', desc: 'Grow our online presence by creating content and managing our social media channels.' },
  { num: '03', svgType: 'treble', instrument: 'piano', title: 'School Outreach', desc: 'Connect with schools and organizations to identify students and programs that need instruments.' },
  { num: '04', svgType: 'note', instrument: 'trumpet', title: 'Event Support', desc: 'Help plan and run fundraising events, collection drives, and community gatherings.' },
  { num: '05', svgType: 'wave', instrument: 'violin', title: 'Instrument Maintenance', desc: 'Inspect, clean, and perform basic repairs on donated instruments to get them ready for students.' },
  { num: '06', svgType: 'treble', instrument: 'guitar', title: 'Pickup & Delivery', desc: 'Help transport instruments between donors, our workspace, and recipient schools.' },
]

export default function GetInvolved() {
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

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
      <section className="kc-page-hero" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
          <LazyMusicNote3D noteCount={6} showGlow={false} style={{ position: 'relative', width: '100%', height: '100%' }} />
        </div>
          <ScrollChevron />
          <div className="kc-container" style={{ position: 'relative', zIndex: 1 }}>
            <TextReveal
              text="Get Involved"
              as="h1"
              mode="char"
              stagger={0.04}
              duration={0.5}
              style={{ fontSize: 'var(--text-5xl)', fontFamily: 'var(--font-display)', fontWeight: 900 }}
            />
            <RevealOnScroll direction="up" stagger={0.1}>
              <p>
                Want to help make music accessible to more students? Whether you have an hour a week
                or a weekend a month, there&apos;s a role for you. Explore volunteer opportunities below
                and fill out the form to join our team.
              </p>
            </RevealOnScroll>
          </div>
        </section>

      {/* Impact Stats with FlipCounter */}
      <section className="kc-section" style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <TextReveal
            text="Our Impact"
            as="h2"
            mode="word"
            stagger={0.08}
            style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)', textAlign: 'center' }}>
            <RevealOnScroll direction="up" stagger={0}>
              <div>
                <FlipCounter target={50} duration={2} suffix="+" className="kc-stat__number" />
                <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Instruments Donated</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="up" stagger={0.1}>
              <div>
                <FlipCounter target={25} duration={2} suffix="+" className="kc-stat__number" />
                <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Active Volunteers</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="up" stagger={0.2}>
              <div>
                <FlipCounter target={10} duration={2} suffix="+" className="kc-stat__number" />
                <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Schools Reached</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Community image band */}
      <section className="kc-section kc-community-band" style={{ background: 'var(--color-surface)', paddingTop: 0, paddingBottom: 0 }}>
        <div className="kc-community-band__grid">
          <RevealCard index={0} className="kc-community-band__item">
            <TiltImage maxTilt={5}>
              <BorderGlow>
                <Image
                  src="/images/volunteer-community.jpg"
                  alt="Community volunteers working together"
                  width={600}
                  height={400}
                  quality={80}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </BorderGlow>
            </TiltImage>
          </RevealCard>
          <RevealCard index={1} className="kc-community-band__item">
            <TiltImage maxTilt={5}>
              <BorderGlow>
                <Image
                  src="/images/volunteer-youth-group.jpg"
                  alt="Youth group activity"
                  width={600}
                  height={400}
                  quality={80}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </BorderGlow>
            </TiltImage>
          </RevealCard>
        </div>
      </section>

      {/* Volunteer Roles */}
      <MorphingGradient
        colors={['rgba(245,197,24,0.04)', 'rgba(37,96,232,0.03)', 'rgba(22,32,50,0.05)']}
        duration={22}
        style={{ background: 'var(--color-surface)' }}
      >
        <section className="kc-section kc-roles">
          <div className="kc-container">
            <TextReveal
              text="Volunteer Roles"
              as="h2"
              className="kc-roles__heading"
              mode="word"
              stagger={0.08}
            />
            <div className="kc-roles__grid">
              {ROLES.map((role, i) => (
                <RevealOnScroll key={i} direction="up" stagger={i * 0.08}>
                  <FlipCard3D
                    height={280}
                    flipOnHover
                    front={
                      <div className="kc-roles__card-inner">
                        <div className="kc-roles__icon" style={{ display: 'flex', justifyContent: 'center' }}>
                          <LazyInstrumentIcon type={role.instrument} size={72} />
                        </div>
                        <h3 className="kc-roles__title">{role.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Hover to learn more</p>
                      </div>
                    }
                    back={
                      <div className="kc-roles__card-inner">
                        <h3 className="kc-roles__title" style={{ marginBottom: 'var(--space-4)' }}>{role.title}</h3>
                        <p className="kc-roles__desc">{role.desc}</p>
                      </div>
                    }
                  />
                </RevealOnScroll>
              ))}
            </div>
          <RevealOnScroll direction="up" stagger={0.3}>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
              <NeonGlow color="#F5C518" intensity="subtle" pulse>
                <MagneticButton href="#volunteer-form" variant="gold">
                  Join Our Team
                </MagneticButton>
              </NeonGlow>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      </MorphingGradient>

      {/* Volunteer Form */}
      <section className="kc-section" id="volunteer-form">
        <div className="kc-container" style={{ maxWidth: '720px' }}>
          <TextReveal
            text="Volunteer Application"
            as="h2"
            mode="word"
            stagger={0.06}
            style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}
          />
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
