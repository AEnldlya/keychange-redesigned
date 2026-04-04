'use client'
import { useState } from 'react'

export default function AutocompleteInput({ 
  suggestions = [], 
  name, 
  required, 
  type = 'text', 
  placeholder, 
  className = '' 
}) {
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase()) &&
    s.toLowerCase() !== value.toLowerCase()
  )

  function handleChange(e) {
    setValue(e.target.value)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  function handleSelect(suggestion) {
    setValue(suggestion)
    setShowSuggestions(false)
  }

  function handleKeyDown(e) {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => (i + 1) % filteredSuggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => (i - 1 + filteredSuggestions.length) % filteredSuggestions.length)
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelect(filteredSuggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="kc-autocomplete">
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        autoComplete="off"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="kc-autocomplete__suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`kc-autocomplete__suggestion ${index === highlightedIndex ? 'kc-autocomplete__suggestion--highlighted' : ''}`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
