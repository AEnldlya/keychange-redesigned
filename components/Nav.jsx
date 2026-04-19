'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !scrolled && !mobileOpen

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
        background: transparent ? 'transparent' : 'rgba(244,241,236,0.96)',
        borderBottom: transparent ? 'none' : '1px solid rgba(15,25,35,0.08)',
        backdropFilter: transparent ? 'none' : 'blur(12px)',
      }}
    >
      <div className="nav-inner">
        <Link
          href="/"
          className="nav-logo"
          style={{ color: transparent ? '#fff' : 'var(--ink)' }}
        >
          <img
            src="/assets/logo.svg"
            alt=""
            style={{ filter: transparent ? 'invert(1) brightness(2)' : 'none', transition: 'filter 0.3s ease' }}
          />
          Key Change
        </Link>

        <div className="nav-links">
          {links.map((l) => (
            <motion.div key={l.href} whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
              <Link
                href={l.href}
                style={{
                  color: pathname === l.href
                    ? (transparent ? '#fff' : 'var(--blue)')
                    : (transparent ? 'rgba(255,255,255,0.8)' : 'var(--ink-2)'),
                  fontWeight: pathname === l.href ? 600 : 500,
                }}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <Link href="/donate" className="btn btn-blue" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Donate
            </Link>
          </motion.div>
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{ color: transparent ? '#fff' : 'var(--ink)' }}
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
            transition={{ duration: 0.2 }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: pathname === l.href ? 'var(--blue)' : 'var(--ink)',
                  fontWeight: pathname === l.href ? 700 : 500,
                }}
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
