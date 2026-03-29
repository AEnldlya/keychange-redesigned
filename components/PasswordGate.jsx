'use client'
import { useState, useEffect } from 'react'

const PASSWORD = process.env.NEXT_PUBLIC_GATE_PASSWORD || '0nestepatatime'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setMounted(true)
    setUnlocked(localStorage.getItem('kc_unlocked') === '1')
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (value === PASSWORD) {
      localStorage.setItem('kc_unlocked', '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 600)
    }
  }

  if (!mounted) return null
  if (unlocked) return children

  return (
    <div className="kc-pw-gate">
      <div className={`kc-pw-card${shake ? ' kc-pw-card--shake' : ''}`}>
        <img src="/assets/logo.svg" alt="Key Change" className="kc-pw-logo" />
        <p className="kc-pw-sub">Enter password to continue</p>
        <form onSubmit={handleSubmit} className="kc-pw-form">
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            placeholder="Password"
            className={`kc-pw-input${error ? ' kc-pw-input--error' : ''}`}
            autoFocus
            aria-label="Password"
          />
          {error && <p className="kc-pw-error" role="alert">Incorrect password. Try again.</p>}
          <button type="submit" className="kc-btn kc-btn--gold kc-btn--full">Enter →</button>
        </form>
      </div>
    </div>
  )
}
