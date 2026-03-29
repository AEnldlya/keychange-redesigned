'use client'
import { useReveal } from '../../hooks/useReveal'

export default function About() {
  const [imgRef, imgVisible] = useReveal({ threshold: 0.15 })
  const [textRef, textVisible] = useReveal({ threshold: 0.15 })

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>About Key Change</h1>
          <p>
            <span className="mission-label">The Key Change Project</span> a student-led music access
            initiative that collects funds and instruments and returns them to our community. Our
            mission is to remove barriers to music-making by recycling, repairing, and redistributing
            instruments to students and local programs that lack resources. We run collection drives,
            fundraise for repairs and music lessons, and partner with schools, community centers, and
            local mentors to ensure instruments are playable and reach learners who need them most. By
            connecting donors, volunteers, and music educators, we create opportunities for creative
            growth, build musical skills, and strengthen community through shared access to music.
          </p>
          <p>
            <span className="mission-label">Mission:</span> To expand the accessibility of music
            education and build a team of people committed to sustaining this effort.<br />
            We aim to build community where all ambitious students get a chance with music, and a team
            that is inspired to give unused instruments/resources for students to use.
          </p>
        </div>
      </section>

      <section className="m-story about-story-section" id="about-story">
        <div className={`m-story__image-wrap${imgVisible ? ' visible' : ''}`} ref={imgRef}>
          <img src="/assets/microphone.webp" alt="Microphone" className="m-story__img" />
        </div>
        <div className={`m-story__text-wrap${textVisible ? ' visible' : ''}`} ref={textRef}>
          <h2 className="m-story__heading">
            We support schools to positively change the music availability in schools.
          </h2>
          <p className="m-story__body">
            Many of students all around the world who wish to participate are unable to play an
            instrument and gain music education, due to schools being unable to afford the musical
            resources needed to support their students.{' '}
            <strong>Barriers like these prevent too many students from pursuing their love for music.</strong>
          </p>
          <p className="m-story__body">
            Participating in musical activities offers a countless number of benefits. Musical
            education not only improves a kid&apos;s mental health but also develops their own creativity
            and self-expression. Music also develops key skills, such as teamwork, communication,
            confidence etc. Students who participate in music actively build needed traits.
          </p>
          <p className="m-story__body">
            In many cases, students who lack musical opportunities just give up and act as if music
            wasn&apos;t for them. However, we should challenge these views, as we encourage the growing
            youth to fight back and reach their maximum potential.
          </p>
        </div>
      </section>
    </>
  )
}
