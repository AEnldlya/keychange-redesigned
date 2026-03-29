'use client'
import { useState } from 'react'

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`kc-faq__item${open ? ' open' : ''}`}>
      <button
        className="kc-faq__question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <svg className="kc-faq__chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5,8 10,13 15,8" />
        </svg>
      </button>
      <div className="kc-faq__answer">
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default function FAQ({ title = 'Frequently Asked Questions', items = [] }) {
  return (
    <div className="kc-faq">
      {title && <h2 className="kc-faq__heading">{title}</h2>}
      {items.map((item, i) => (
        <FAQItem key={i} question={item.q} answer={item.a} />
      ))}
    </div>
  )
}
