'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => { 
    setMobileOpen(false) 
  }, [pathname])

  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 50)
        if (y > 100) {
          if (y > lastScrollY.current + 10) setHidden(true)
          else if (y < lastScrollY.current - 10) setHidden(false)
        } else {
          setHidden(false)
        }
        lastScrollY.current = y
        ticking = false
      })
    }
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
    <nav className={`kc-nav ${scrolled ? 'kc-nav--scrolled' : ''} ${hidden ? 'kc-nav--hidden' : ''}`}>
      <div className="kc-nav__inner">
        <Link href="/" className="kc-nav__logo">
          Key Change
        </Link>
        
        <ul className="kc-nav__links">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        
        <button
          className="kc-nav__mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span style={{ transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>
      
      <div className={`kc-nav__mobile ${mobileOpen ? 'kc-nav__mobile--open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href}>{link.label}</Link>
        ))}
      </div>
    </nav>
  )
}
