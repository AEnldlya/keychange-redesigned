'use client'

export default function ScrollChevron({ className = '' }) {
  function handleClick(e) {
    e.currentTarget.closest('section')?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <button className={`scroll-chevron ${className}`.trim()} aria-label="Scroll to next section" onClick={handleClick}>
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="1,1 11,12 21,1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
