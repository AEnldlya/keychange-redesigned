import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PasswordGate from './components/PasswordGate'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Donate from './pages/Donate'
import GetInvolved from './pages/GetInvolved'
import Contact from './pages/Contact'

// 🔑 Change this to your desired password
const PASSWORD = '0nestepatatime'

export default function App() {
  const [unlocked, setUnlocked] = useState(() =>
    localStorage.getItem('kc_unlocked') === '1'
  )

  if (!unlocked) {
    return (
      <PasswordGate
        correctPassword={PASSWORD}
        onUnlock={() => {
          localStorage.setItem('kc_unlocked', '1')
          setUnlocked(true)
        }}
      />
    )
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
