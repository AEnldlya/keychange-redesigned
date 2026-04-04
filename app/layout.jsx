import '../styles/globals.css'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: 'Key Change — Music Belongs to Everyone',
    template: '%s | Key Change',
  },
  description:
    'Key Change is a student-led nonprofit collecting and redistributing musical instruments to students who lack access to music education.',
  openGraph: {
    title: 'Key Change — Music Belongs to Everyone',
    description:
      'Student-led nonprofit collecting and redistributing musical instruments.',
    url: 'https://keychange.org',
    siteName: 'Key Change',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://keychange.org'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
