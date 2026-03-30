'use client'
import Link from 'next/link'
import { useReveal } from '../../hooks/useReveal'
import ScrollChevron from '../../components/ScrollChevron'
import MorphingShapes from '../../components/animations/MorphingShapes'
import TextReveal from '../../components/animations/TextReveal'

export default function About() {
  const [imgRef, imgVisible] = useReveal({ threshold: 0.15 })
  const [textRef, textVisible] = useReveal({ threshold: 0.15 })
  const [valuesRef, valuesVisible] = useReveal({ threshold: 0.1 })
  const [timelineRef, timelineVisible] = useReveal({ threshold: 0.1 })

  return (
    <>
      <section className="kc-page-hero">
        <ScrollChevron />
        <div className="kc-container">
          <TextReveal text="About Key Change" as="h1" mode="char" stagger={0.04} duration={0.5} />
          <p>
            <strong>The Key Change Project</strong> is a student-led music access
            initiative that collects funds and instruments and returns them to our community. Our
            mission is to remove barriers to music-making by recycling, repairing, and redistributing
            instruments to students and local programs that lack resources. We run collection drives,
            fundraise for repairs and music lessons, and partner with schools, community centers, and
            local mentors to ensure instruments are playable and reach learners who need them most. By
            connecting donors, volunteers, and music educators, we create opportunities for creative
            growth, build musical skills, and strengthen community through shared access to music.
          </p>
          <p style={{ marginTop: 'var(--space-6)' }}>
            <strong>Mission:</strong> To expand the accessibility of music
            education and build a team of people committed to sustaining this effort.
            We aim to build community where all ambitious students get a chance with music, and a team
            that is inspired to give unused instruments and resources for students to use.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className={`kc-section kc-values kc-reveal${valuesVisible ? ' visible' : ''}`} ref={valuesRef} style={{ position: 'relative' }}>
        <MorphingShapes
          color="rgba(245,197,24,0.04)"
          size={500}
          duration={24}
          style={{ position: 'absolute', top: '-80px', right: '-120px', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
        />
        <MorphingShapes
          color="rgba(37,96,232,0.03)"
          size={400}
          duration={28}
          style={{ position: 'absolute', bottom: '-60px', left: '-100px', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}
        />
        <div className="kc-container" style={{ position: 'relative', zIndex: 1 }}>
          <TextReveal text="Our Values" as="h2" className="kc-values__heading" mode="word" stagger={0.08} />
          <div className="kc-values__grid kc-stagger">
            {[
              { icon: '🎵', title: 'Access for All', desc: 'Every student deserves the chance to discover music, regardless of their financial situation.' },
              { icon: '♻️', title: 'Sustainability', desc: 'We give instruments a second life instead of letting them collect dust in closets and attics.' },
              { icon: '🤝', title: 'Community', desc: 'We bring together donors, volunteers, educators, and students to create lasting musical impact.' },
            ].map((val, i) => (
              <div key={i} className="kc-glass kc-values__card" style={{ '--i': i }}>
                <div className="kc-values__icon">{val.icon}</div>
                <h3 className="kc-values__title">{val.title}</h3>
                <p className="kc-values__desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="kc-story">
        <div className={`kc-story__image-wrap${imgVisible ? ' visible' : ''}`} ref={imgRef}>
          <img src="/assets/guitarra.webp" alt="Guitar" className="kc-story__img" />
        </div>
        <div className={`kc-story__text-wrap${textVisible ? ' visible' : ''}`} ref={textRef}>
          <TextReveal
            text="We support schools to positively change the music availability for students."
            as="h2"
            className="kc-story__heading"
            mode="word"
            stagger={0.04}
          />
          <p className="kc-story__body">
            Many students all around the world who wish to participate are unable to play an
            instrument and gain music education, due to schools being unable to afford the musical
            resources needed to support their students.{' '}
            <strong>Barriers like these prevent too many students from pursuing their love for music.</strong>
          </p>
          <p className="kc-story__body">
            Participating in musical activities offers countless benefits. Musical
            education not only improves a kid&apos;s mental health but also develops their own creativity
            and self-expression. Music also develops key skills, such as teamwork, communication,
            confidence, and more. Students who participate in music actively build needed traits.
          </p>
          <p className="kc-story__body">
            In many cases, students who lack musical opportunities just give up and act as if music
            wasn&apos;t for them. However, we should challenge these views, as we encourage the growing
            youth to fight back and reach their maximum potential.
          </p>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className={`kc-section kc-reveal${timelineVisible ? ' visible' : ''}`} ref={timelineRef} style={{ background: 'var(--color-surface)' }}>
        <div className="kc-container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>How It Works</h2>
          <div className="kc-timeline kc-stagger">
            {[
              { title: 'Donate', desc: 'Fill out our donation form with details about your instrument. We accept all instruments in any condition.' },
              { title: 'Inspect & Repair', desc: 'Our team inspects every donation and makes necessary repairs to ensure instruments are ready to play.' },
              { title: 'Match', desc: 'We connect instruments with schools and students in the Upper Valley who need them most.' },
              { title: 'Deliver', desc: 'Instruments are delivered to their new homes, and students begin their musical journey.' },
            ].map((step, i) => (
              <div key={i} className="kc-timeline__item" style={{ '--i': i }}>
                <div className="kc-timeline__dot" />
                <h3 className="kc-timeline__title">{step.title}</h3>
                <p className="kc-timeline__desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <Link href="/donate" className="kc-btn kc-btn--gold">Donate an Instrument</Link>
          </div>
        </div>
      </section>
    </>
  )
}
