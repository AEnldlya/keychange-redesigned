'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Hide/show nav on scroll direction
  useEffect(() => {
    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 80)
        if (y > 80) {
          if (y > lastScrollY.current + 5) setHidden(true)
          else if (y < lastScrollY.current - 5) setHidden(false)
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

  const bars = [
    menuOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {},
    menuOpen ? { opacity: 0 } : {},
    menuOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {},
  ]

  return (
    <nav className={`m-nav${hidden ? ' hidden' : ''}${scrolled ? ' scrolled' : ''}`}>
      <div className="m-nav__inner">
        <Link href="/" className="m-nav__logo">
          <img src="/assets/logo.svg" alt="Key Change" className="m-nav__logo-img" />
        </Link>
        <ul className="m-nav__links">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/get-involved">Get Involved</Link></li>
          <li><Link href="/donate">Donate</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li>
            <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" aria-label="Instagram" className="m-nav__icon-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="mailto:keychange.team@gmail.com" aria-label="Email" className="m-nav__icon-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
            </a>
          </li>
        </ul>
        <button
          className="m-nav__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span style={bars[0]} /><span style={bars[1]} /><span style={bars[2]} />
        </button>
      </div>
      <div className={`m-nav__mobile${menuOpen ? ' open' : ''}`}>
        <Link href="/about">About</Link>
        <Link href="/get-involved">Get Involved</Link>
        <Link href="/donate">Donate</Link>
        <Link href="/contact">Contact</Link>
        <a href="mailto:keychange.team@gmail.com">keychange.team@gmail.com</a>
      </div>
    </nav>
  )
}
