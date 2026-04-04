import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="kc-footer">
      <div className="kc-footer__grid">
        <div>
          <div className="kc-footer__brand">Key Change</div>
          <p className="kc-footer__tagline">
            A student-led nonprofit making music education accessible to all students, regardless of background or financial means.
          </p>
        </div>
        
        <div>
          <h4 className="kc-footer__heading">Explore</h4>
          <ul className="kc-footer__links">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/get-involved">Get Involved</Link></li>
            <li><Link href="/donate">Donate</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="kc-footer__heading">Connect</h4>
          <ul className="kc-footer__links">
            <li>
              <a href="mailto:keychange.team@gmail.com">Email Us</a>
            </li>
            <li>
              <a href="https://instagram.com/keychangeproject/" target="_blank" rel="noopener">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="kc-footer__heading">Location</h4>
          <ul className="kc-footer__links">
            <li>Upper Valley</li>
            <li>New Hampshire & Vermont</li>
          </ul>
        </div>
      </div>
      
      <div className="kc-footer__bottom">
        <p>&copy; {currentYear} Key Change. All rights reserved.</p>
        <p>A 501(c)(3) nonprofit organization</p>
      </div>
    </footer>
  )
}
