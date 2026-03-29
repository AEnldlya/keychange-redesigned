'use client'
import { useState, useEffect } from 'react'

const PASSWORD = '0nestepatatime'

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

  // Avoid flash of gate on page load while reading localStorage
  if (!mounted) return null

  if (unlocked) return children

  return (
    <div className="pw-gate">
      <div className={`pw-card${shake ? ' pw-card--shake' : ''}`}>
        <img src="/assets/logo.svg" alt="Key Change" className="pw-logo" />
        <p className="pw-sub">Enter password to continue</p>
        <form onSubmit={handleSubmit} className="pw-form">
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            placeholder="Password"
            className={`pw-input${error ? ' pw-input--error' : ''}`}
            autoFocus
          />
          {error && <p className="pw-error">Incorrect password. Try again.</p>}
          <button type="submit" className="pw-btn">Enter →</button>
        </form>
      </div>
    </div>
  )
}
