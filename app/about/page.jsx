'use client'
import Link from 'next/link'
import { useReveal } from '../../hooks/useReveal'

export default function About() {
  const [missionRef, missionVisible] = useReveal({ threshold: 0.15 })
  const [valuesRef, valuesVisible] = useReveal({ threshold: 0.15 })
  const [teamRef, teamVisible] = useReveal({ threshold: 0.1 })

  return (
    <>
      {/* Hero */}
      <section className="kc-page-header">
        <div className="kc-container">
          <h1>About Key Change</h1>
          <p>
            We are a student-led nonprofit based in the Upper Valley of New Hampshire 
            and Vermont. Our mission is simple: remove financial barriers to music education 
            by collecting, repairing, and redistributing instruments to students who need them.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section 
        ref={missionRef} 
        className={`kc-section kc-section--alt ${missionVisible ? 'kc-reveal visible' : 'kc-reveal'}`}
      >
        <div className="kc-container">
          <div className="kc-about__mission">
            <div className="kc-about__mission-content">
              <span className="kc-story__eyebrow">Our Mission</span>
              <h2>Every student deserves<br />a chance to play</h2>
              <div className="kc-divider" />
              <p>
                Music education shouldn&apos;t be a luxury. Yet in the United States, 
                millions of students attend schools without music programs. Instrument 
                rentals can cost $30–$100 per month—prohibitive for many families. 
                Meanwhile, thousands of perfectly good instruments gather dust in 
                attics and closets.
              </p>
              <p>
                Key Change exists to bridge this gap. We believe that talent is 
                everywhere, but opportunity is not. Our work is about changing that.
              </p>
            </div>
            <div className="kc-about__mission-image">
              <img src="/assets/music-stand.webp" alt="Sheet music on stand" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="kc-section">
        <div className="kc-container">
          <div className="kc-how__header">
            <h2>What we believe</h2>
            <p>Three principles guide everything we do</p>
          </div>
          
          <div className={`kc-about__values ${valuesVisible ? 'kc-stagger visible' : 'kc-stagger'}`}>
            <div className="kc-about__value">
              <span className="kc-about__value-number">01</span>
              <h3>Access for All</h3>
              <p>
                Financial circumstances should never determine whether a student can 
                participate in music. We work to ensure that every interested student 
                has the tools they need to learn, practice, and grow.
              </p>
            </div>
            
            <div className="kc-about__value">
              <span className="kc-about__value-number">02</span>
              <h3>Sustainability</h3>
              <p>
                We give instruments a second life. Instead of buying new, we repair, 
                refurbish, and rehome existing instruments—reducing waste while 
                expanding access. It&apos;s better for students and better for the planet.
              </p>
            </div>
            
            <div className="kc-about__value">
              <span className="kc-about__value-number">03</span>
              <h3>Community</h3>
              <p>
                Music builds connections. We bring together donors, volunteers, 
                educators, and students to create a network of support around young 
                musicians. No one makes music alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="kc-section kc-section--dark">
        <div className="kc-container">
          <div className="kc-about__process">
            <div className="kc-about__process-content">
              <span className="kc-story__eyebrow" style={{ color: 'rgba(253,248,243,0.6)' }}>How It Works</span>
              <h2>From donation to first notes</h2>
              <div className="kc-divider" />
            </div>
            
            <div className="kc-about__steps">
              <div className="kc-about__step">
                <span className="kc-about__step-number">1</span>
                <div>
                  <h3>Donate</h3>
                  <p>
                    Community members submit instruments they no longer use through our 
                    simple online form. We accept everything from violins to drum kits, 
                    in any condition.
                  </p>
                </div>
              </div>
              
              <div className="kc-about__step">
                <span className="kc-about__step-number">2</span>
                <div>
                  <h3>Inspect & Repair</h3>
                  <p>
                    Our team of volunteers and partner technicians assess each instrument, 
                    making necessary repairs to ensure it&apos;s playable and safe.
                  </p>
                </div>
              </div>
              
              <div className="kc-about__step">
                <span className="kc-about__step-number">3</span>
                <div>
                  <h3>Match</h3>
                  <p>
                    We partner with schools and community programs to identify students 
                    and match them with instruments that fit their needs and interests.
                  </p>
                </div>
              </div>
              
              <div className="kc-about__step">
                <span className="kc-about__step-number">4</span>
                <div>
                  <h3>Deliver & Support</h3>
                  <p>
                    Instruments go directly to students, often with cases, accessories, 
                    and connections to local teachers or programs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="kc-about__process-cta">
              <Link href="/donate" className="kc-btn kc-btn--primary">
                Donate an Instrument
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section ref={teamRef} className="kc-section">
        <div className="kc-container">
          <div className={`kc-about__impact ${teamVisible ? 'kc-reveal visible' : 'kc-reveal'}`}>
            <div className="kc-about__impact-content">
              <span className="kc-story__eyebrow">Our Impact</span>
              <h2>Making a difference<br />in the Upper Valley</h2>
              <div className="kc-divider" />
              <p>
                Since our founding, Key Change has collected and redistributed dozens 
                of instruments to students across the Hanover, Norwich, and surrounding 
                communities. We&apos;ve partnered with local schools, music stores, and 
                community organizations to build a sustainable pipeline of support.
              </p>
              <p>
                But we&apos;re just getting started. Our goal is to ensure that no student 
                in our region is turned away from music because they can&apos;t afford an 
                instrument.
              </p>
            </div>
            <div className="kc-about__impact-image">
              <img src="/assets/drums.webp" alt="Drum kit" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="kc-section kc-section--alt">
        <div className="kc-container">
          <div className="kc-about__cta">
            <h2>Join us</h2>
            <p>
              Whether you have an instrument to donate, time to volunteer, or just 
              want to learn more, we&apos;d love to connect.
            </p>
            <div className="kc-about__cta-buttons">
              <Link href="/donate" className="kc-btn kc-btn--primary">
                Donate
              </Link>
              <Link href="/get-involved" className="kc-btn kc-btn--outline">
                Get Involved
              </Link>
              <Link href="/contact" className="kc-btn kc-btn--outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
