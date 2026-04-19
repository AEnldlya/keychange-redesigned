'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  /* Transparent mode: only on home, before scroll */
  const transparent = isHome && !scrolled && !mobileOpen

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/donate', label: 'Donate' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className="nav"
      style={{
        position: isHome ? 'fixed' : 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        background: transparent
          ? 'transparent'
          : 'rgba(237,242,251,0.96)',
        borderBottom: transparent ? 'none' : '1px solid var(--color-cream-dark)',
        backdropFilter: transparent ? 'none' : 'blur(10px)',
        transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
      }}
    >
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ color: transparent ? '#fff' : 'var(--color-ink)' }}>
          <img
            src="/assets/logo.svg"
            alt=""
            style={{ filter: transparent ? 'invert(1) brightness(2)' : 'none', transition: 'filter 0.35s ease' }}
          />
          <span>Key Change</span>
        </Link>

        <div className="nav-links" style={{ '--link-color': transparent ? 'rgba(255,255,255,0.85)' : 'var(--color-ink-light)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href
                  ? (transparent ? '#fff' : 'var(--color-terracotta)')
                  : (transparent ? 'rgba(255,255,255,0.82)' : 'var(--color-ink-light)'),
                fontWeight: pathname === link.href ? 700 : 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{ color: transparent ? '#fff' : 'var(--color-ink)' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="nav-mobile nav-mobile-open">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontWeight: pathname === link.href ? 700 : 500, color: pathname === link.href ? 'var(--color-terracotta)' : 'var(--color-ink)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
