import '../styles/global.css'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PasswordGate from '../components/PasswordGate'
import ScrollToTop from '../components/ScrollToTop'

export const metadata = {
  title: 'Key Change',
  description: 'Making music accessible to all students.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PasswordGate>
          <ScrollToTop />
          <Nav />
          {children}
          <Footer />
        </PasswordGate>
      </body>
    </html>
  )
}
