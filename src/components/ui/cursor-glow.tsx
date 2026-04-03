'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || coarsePointer) return

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    const apply = () => {
      el.style.setProperty('--cursor-x', `${x}px`)
      el.style.setProperty('--cursor-y', `${y}px`)
      el.style.setProperty('--cursor-glow-opacity', '1')
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        apply()
      })
    }

    const onHide = () => {
      el.style.setProperty('--cursor-glow-opacity', '0')
    }

    const onShow = () => {
      el.style.setProperty('--cursor-glow-opacity', '1')
    }

    // Start hidden until the first pointer move.
    el.style.setProperty('--cursor-glow-opacity', '0')
    el.style.setProperty('--cursor-x', `${x}px`)
    el.style.setProperty('--cursor-y', `${y}px`)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('blur', onHide)
    document.addEventListener('mouseleave', onHide)
    document.addEventListener('mouseenter', onShow)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('blur', onHide)
      document.removeEventListener('mouseleave', onHide)
      document.removeEventListener('mouseenter', onShow)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
}
