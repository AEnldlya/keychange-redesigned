'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    /* Threshold: past the 380vh hero the nav should solidify */
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* On home + before scroll: fully invisible, just text floating */
  const ghost = isHome && !scrolled && !mobileOpen

  const links = [
    { href: '/about',        label: 'About' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/donate',       label: 'Donate' },
    { href: '/contact',      label: 'Contact' },
  ]

  return (
    <nav
      className="nav"
      style={{
        position: isHome ? 'fixed' : 'sticky',
        top: 0,
        /* Ghost: no bg, no border, no blur — just floating text */
        background:     ghost ? 'transparent' : 'rgba(244,241,236,0.95)',
        borderBottom:   ghost ? 'none'        : '1px solid rgba(15,25,35,0.07)',
        backdropFilter: ghost ? 'none'        : 'blur(14px)',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <div className="nav-inner">
        <Link
          href="/"
          className="nav-logo"
          style={{
            color: ghost ? 'rgba(255,255,255,0.82)' : 'var(--ink)',
            fontWeight: 400,
            transition: 'color 0.3s ease',
          }}
        >
          <img
            src="/assets/logo.svg" alt=""
            style={{
              filter: ghost ? 'invert(1) brightness(2)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
          Key Change
        </Link>

        <div className="nav-links">
          {links.filter((l) => l.href !== '/donate').map((l) => (
            <motion.div key={l.href} whileHover={{ y: -1 }} transition={{ duration: 0.12 }}>
              <Link
                href={l.href}
                style={{
                  color: pathname === l.href
                    ? (ghost ? 'rgba(255,255,255,0.95)' : 'var(--blue)')
                    : (ghost ? 'rgba(255,255,255,0.55)' : 'var(--ink-2)'),
                  fontWeight: pathname === l.href ? 600 : 400,
                  fontSize: '0.8375rem',
                  letterSpacing: '0.04em',
                  transition: 'color 0.25s ease',
                }}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}

          {/* Donate button — always visible, even on the ghost hero */}
          <Link href="/donate" className="btn btn-blue"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.8375rem' }}>
            Donate
          </Link>
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{ color: ghost ? 'rgba(255,255,255,0.7)' : 'var(--ink)' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile nav-mobile-open"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                style={{ color: pathname === l.href ? 'var(--blue)' : 'var(--ink)', fontWeight: pathname === l.href ? 600 : 400 }}>
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
