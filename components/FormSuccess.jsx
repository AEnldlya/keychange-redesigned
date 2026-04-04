'use client'

export default function FormSuccess({
  title = 'Message sent',
  message = "We'll be in touch soon.",
}) {
  return (
    <div className="kc-success" role="status" aria-live="polite">
      <div className="kc-success__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="kc-success__title">{title}</h3>
      <p className="kc-success__msg">{message}</p>
    </div>
  )
}
