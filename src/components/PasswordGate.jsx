import { useState } from 'react'

export default function PasswordGate({ correctPassword, onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (value === correctPassword) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 600)
    }
  }

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
