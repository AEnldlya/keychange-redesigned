'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Users, Music, Target } from 'lucide-react'

const spring = { type: 'spring', stiffness: 400, damping: 30 }

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

function Reveal({ children, delay = 0, className = '', y = 32 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  const valuesRef = useRef(null)
  const foundersRef = useRef(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' })
  const foundersInView = useInView(foundersRef, { once: true, margin: '-80px' })

  const values = [
    { icon: Heart,  title: 'Accessibility', description: 'Every student deserves the chance to make music, regardless of financial circumstances.' },
    { icon: Users,  title: 'Community',     description: 'We build bridges between those with instruments to give and those with passion to play.' },
    { icon: Music,  title: 'Education',     description: 'Music education develops creativity, discipline, and confidence that lasts a lifetime.' },
    { icon: Target, title: 'Impact',        description: 'We measure success by the number of students who pick up an instrument for the first time.' },
  ]

  return (
    <>
      <div className="page-header">
        <Reveal><span className="eyebrow">Who We Are</span></Reveal>
        <Reveal delay={0.08}><h1>About Key Change</h1></Reveal>
        <Reveal delay={0.16}><p>Making music education accessible across the Upper Valley</p></Reveal>
      </div>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <Reveal className="about-intro">
            Key Change is a student-led nonprofit based in Hanover, New Hampshire.
            We collect unused musical instruments from community members and redistribute
            them to students and school music programs that lack the resources to purchase their own.
          </Reveal>
        </div>
      </section>

      {/* Founders */}
      <section className="section section-alt">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <span className="eyebrow">The Team</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 400, marginBottom: 'var(--sp-4)' }}>Meet the founders</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink-2)' }}>Two students with a shared vision</p>
          </Reveal>

          <motion.div
            ref={foundersRef}
            className="founders-grid"
            variants={containerVariants}
            initial="hidden"
            animate={foundersInView ? 'visible' : 'hidden'}
          >
            {[
              { name: 'Ansh', role: 'Co-Founder', bio: 'High school student passionate about equal access to arts education.' },
              { name: 'Jason', role: 'Co-Founder', bio: 'Musician and advocate for student opportunity in the Upper Valley.' },
            ].map((f) => (
              <motion.div key={f.name} className="founder-card" variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} transition={spring}>
                <div className="founder-avatar">{f.name[0]}</div>
                <h3>{f.name}</h3>
                <p className="founder-role">{f.role}</p>
                <p className="founder-bio">{f.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <span className="eyebrow">What Drives Us</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 400, marginBottom: 'var(--sp-4)' }}>Our values</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink-2)' }}>The principles that guide our work</p>
          </Reveal>

          <motion.div
            ref={valuesRef}
            className="values-grid"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
          >
            {values.map((v) => (
              <motion.div key={v.title} className="value-card" variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} transition={spring}>
                <v.icon size={26} style={{ color: 'var(--blue)' }} />
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="section section-alt">
        <div className="container">
          <div className="story-grid">
            <div className="story-copy" style={{ maxWidth: 600 }}>
              <Reveal><span className="eyebrow">Our History</span></Reveal>
              <Reveal delay={0.08}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: 'var(--sp-6)' }}>
                  From a simple observation to lasting impact
                </h2>
              </Reveal>
              <Reveal delay={0.16}><p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>It started with a question: Why do some students have access to instruments while others do not? Ansh and Jason noticed the disparity between schools in their area. Some had thriving music programs. Others had nothing.</p></Reveal>
              <Reveal delay={0.22}><p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>They realized the problem was not a lack of instruments or a lack of interest. It was a lack of connection. Instruments sat unused in attics while students sat in classrooms without them.</p></Reveal>
              <Reveal delay={0.28}><p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--ink-2)' }}>Key Change was born to bridge that gap. What began as a single instrument drive has evolved into an ongoing effort to ensure every student who wants to play music has the opportunity.</p></Reveal>
            </div>
            <Reveal className="story-media" y={60} delay={0.1}>
              <div className="story-img-wrap">
                <img src="/assets/drums.webp" alt="Drums" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
