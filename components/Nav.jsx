'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Track scroll for border
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/donate', label: 'Donate' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <img src="/assets/logo.svg" alt="" />
          <span>Key Change</span>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`nav-mobile ${mobileOpen ? 'nav-mobile-open' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
