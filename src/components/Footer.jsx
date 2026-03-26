export default function Footer() {
  return (
    <footer className="m-footer">
      <div className="m-footer__body">
        <div className="m-footer__inner">
          <div className="m-footer__brand">
            <div className="m-footer__name">Key Change</div>
            <div className="m-footer__tagline">Change the key. Change a life.</div>
          </div>
          <div className="m-footer__contact">
            <div className="m-footer__contact-label">Contact</div>
            <a href="mailto:keychange.team@gmail.com" className="m-footer__email">
              keychange.team@gmail.com
            </a>
          </div>
        </div>
        <div className="m-footer__bottom">
          <p>&copy; 2025 Key Change. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
