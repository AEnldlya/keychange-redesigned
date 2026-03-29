'use client'
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      if (!barRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const progress = scrollTop / (scrollHeight - clientHeight) || 0
      barRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={barRef} className="kc-scroll-progress" style={{ transform: 'scaleX(0)' }} />
}
