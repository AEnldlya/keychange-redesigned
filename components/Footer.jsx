import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/assets/logo.svg" alt="" />
              Key Change
            </div>
            <p className="footer-tagline">
              A student-led nonprofit making music education accessible to all
              students, regardless of background or financial means.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/get-involved">Get Involved</Link></li>
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:keychange.team@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> Email us
                </a>
              </li>
              <li>
                <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Location</h4>
            <ul className="footer-links">
              <li style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Upper Valley</li>
              <li style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>New Hampshire & Vermont</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Key Change. All rights reserved.</p>
          <p>A 501(c)(3) nonprofit organization</p>
        </div>
      </div>
    </footer>
  )
}
