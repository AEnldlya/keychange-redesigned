'use client'
import { useState } from 'react'

/**
 * Renders an input with inline ghost-text completion.
 * - Suggestions are matched by prefix (case-insensitive)
 * - Tab or ArrowRight accepts the suggestion
 * - Esc dismisses it for the current value
 * - Works with uncontrolled forms (FormData reads the DOM value directly)
 */
export default function AutocompleteInput({ suggestions = [], name, required, type = 'text', placeholder, className, style }) {
  const [value, setValue] = useState('')
  const [dismissed, setDismissed] = useState(false)

  const match = !dismissed && value
    ? suggestions.find(s =>
        s.toLowerCase().startsWith(value.toLowerCase()) &&
        s.toLowerCase() !== value.toLowerCase()
      )
    : null

  const suffix = match ? match.slice(value.length) : ''

  function handleChange(e) {
    setValue(e.target.value)
    setDismissed(false)
  }

  function handleKeyDown(e) {
    if (suffix && (e.key === 'Tab' || e.key === 'ArrowRight')) {
      e.preventDefault()
      setValue(match)
      setDismissed(false)
    } else if (e.key === 'Escape') {
      setDismissed(true)
    }
  }

  // Shared text rendering styles — must match the global input styles exactly
  // so the ghost text aligns with the real input cursor position.
  const textStyle = {
    fontFamily: 'var(--font)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    padding: '14px 20px',
    letterSpacing: 'normal',
  }

  return (
    <div style={{ position: 'relative', display: 'block' }}>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        style={{
          ...textStyle,
          background: 'transparent',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          ...style,
        }}
      />
      {suffix && (
        <div
          aria-hidden="true"
          style={{
            ...textStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 2,
            whiteSpace: 'pre',
            overflow: 'hidden',
            // Inherit border/border-radius from the sibling input visually — no border here
            border: '1.5px solid transparent',
            borderRadius: '999px',
          }}
        >
          {/* invisible prefix takes up exactly the width of what's been typed */}
          <span style={{ visibility: 'hidden' }}>{value}</span>
          {/* ghost suffix appears right where the cursor is */}
          <span style={{ color: 'rgba(13,26,58,0.35)' }}>{suffix}</span>
        </div>
      )}
    </div>
  )
}
