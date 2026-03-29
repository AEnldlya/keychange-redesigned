import '../styles/global.css'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PasswordGate from '../components/PasswordGate'
import ScrollToTop from '../components/ScrollToTop'
import ScrollProgress from '../components/ScrollProgress'

const PASSWORD_ENABLED = process.env.NEXT_PUBLIC_PASSWORD_ENABLED === 'true'

export const metadata = {
  title: {
    default: 'Key Change — Making Music Accessible to All Students',
    template: '%s | Key Change',
  },
  description:
    'Key Change is a student-led nonprofit collecting and redistributing musical instruments to students and programs that lack resources. Based in Hanover, NH.',
  openGraph: {
    title: 'Key Change — Making Music Accessible to All Students',
    description:
      'Student-led nonprofit collecting and redistributing musical instruments to students who need them.',
    url: 'https://keychange.org',
    siteName: 'Key Change',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Key Change',
    description: 'Making music accessible to all students.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://keychange.org'),
}

function SiteShell({ children }) {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NonprofitOrganization',
              name: 'Key Change',
              alternateName: 'The Key Change Project',
              description:
                'Student-led nonprofit collecting and redistributing musical instruments',
              url: 'https://keychange.org',
              email: 'keychange.team@gmail.com',
              areaServed: {
                '@type': 'Place',
                name: 'Upper Valley, New Hampshire and Vermont',
              },
              foundingDate: '2024',
              sameAs: ['https://instagram.com/keychangeproject/'],
            }),
          }}
        />
      </head>
      <body>
        {PASSWORD_ENABLED ? (
          <PasswordGate>
            <SiteShell>{children}</SiteShell>
          </PasswordGate>
        ) : (
          <SiteShell>{children}</SiteShell>
        )}
      </body>
    </html>
  )
}
