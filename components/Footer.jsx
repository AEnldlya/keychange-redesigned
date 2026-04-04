import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/assets/logo.svg" alt="" />
            <span>Key Change</span>
          </div>
          <p className="footer-tagline">
            A student-led nonprofit making music education accessible to all
            students, regardless of background or financial means.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/get-involved">Get Involved</Link>
            </li>
            <li>
              <Link href="/donate">Donate</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Connect</h4>
          <ul className="footer-links">
            <li>
              <a
                href="mailto:keychange.team@gmail.com"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Mail size={16} />
                Email
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/keychangeproject/"
                target="_blank"
                rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Location</h4>
          <ul className="footer-links">
            <li>Upper Valley</li>
            <li>New Hampshire & Vermont</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Key Change. All rights reserved.</p>
        <p>A 501(c)(3) nonprofit organization</p>
      </div>
    </footer>
  )
}
