import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from '../lib/gsap'
import { usePreloader, type PreloaderAssets } from '../hooks/usePreloader'

const BG = '#F9F6F1'
const TEXT_COLOR = '#051A24'
const TEXT_FLASH = '#C4B4A8'  // gris clair — text only, fond reste fixe
const GLYPHS = '█▓▒░01ABXZ#@$%&'
const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace'

type Phase = 'counting' | 'flashing' | 'done'

// ─── Background number grid — direct DOM, no React re-renders ────────────────
function NumberBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const COLS = 16
    const ROWS = 9
    const spans: HTMLSpanElement[] = []

    for (let i = 0; i < COLS * ROWS; i++) {
      const s = document.createElement('span')
      s.textContent = String(Math.floor(Math.random() * 100)).padStart(2, '0')
      s.style.cssText = [
        `font-family: ${MONO}`,
        'font-size: clamp(0.5rem, 0.85vw, 0.72rem)',
        'color: #051A24',
        'opacity: 0.11',
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'letter-spacing: 0.1em',
        'transition: opacity 0.4s',
      ].join(';')
      container.appendChild(s)
      spans.push(s)
    }

    const id = setInterval(() => {
      const count = Math.ceil(spans.length * 0.22)
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * spans.length)
        spans[idx].textContent = String(Math.floor(Math.random() * 100)).padStart(2, '0')
        spans[idx].style.opacity = (0.06 + Math.random() * 0.12).toFixed(2)
      }
    }, 110)

    return () => {
      clearInterval(id)
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(16, 1fr)',
        gridTemplateRows: 'repeat(9, 1fr)',
        padding: '1.5rem',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    />
  )
}

// ─── Scramble digit animation ─────────────────────────────────────────────────
function ScrambleNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState('0')
  const prevRef = useRef(-1)
  const rafRef = useRef(0)

  useEffect(() => {
    if (value === prevRef.current) return
    prevRef.current = value

    const target = String(value)
    const len = target.length
    let frame = 0
    const maxFrames = 3

    const animate = () => {
      frame++
      if (frame >= maxFrames) {
        setDisplay(target)
        return
      }
      setDisplay(
        Array.from({ length: len }, () =>
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join('')
      )
      rafRef.current = requestAnimationFrame(animate)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return (
    <span style={{ display: 'inline-block', minWidth: '3ch', textAlign: 'right' }}>
      {display}
    </span>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
interface SplashscreenProps {
  assets?: PreloaderAssets
  /** Called when fade-out BEGINS — reveals site in parallel with the dissolve */
  onExit?: () => void
  /** Called when fade-out ENDS — unmount Splashscreen to stop preloader RAF */
  onDone?: () => void
}

export function Splashscreen({ assets = {}, onExit, onDone }: SplashscreenProps) {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const counterRef  = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('counting')
  const phaseRef = useRef<Phase>('counting')
  const { progress, isReady } = usePreloader(assets)

  useEffect(() => { phaseRef.current = phase }, [phase])

  const runExit = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => onExit?.(),       // site reveal starts NOW (parallel with fade)
      onComplete: () => {
        setPhase('done')
        onDone?.()                     // signal App to unmount this component
      },
    })
  }, [onExit, onDone])

  // progress=100 + isReady → 3 text flashes → fade out
  useEffect(() => {
    if (!isReady || progress < 100 || phaseRef.current !== 'counting') return
    setPhase('flashing')

    const counter = counterRef.current
    if (!counter) return

    // repeat:5 + yoyo = 6 half-cycles = 3 full flashes (~720ms)
    // Only the text color oscillates — background stays fixed
    gsap.to(counter, {
      color: TEXT_FLASH,
      duration: 0.12,
      repeat: 5,
      yoyo: true,
      ease: 'none',
      onComplete: runExit,
    })
  }, [isReady, progress, runExit])

  if (phase === 'done') return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'opacity, background-color',
        overflow: 'hidden',
      }}
    >
      <NumberBackground />

      {/* 1px progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          backgroundColor: '#051A24',
          width: `${progress}%`,
          opacity: 0.3,
        }}
      />

      {/* Counter — counterRef targeted for text-color flash */}
      <div
        ref={counterRef}
        style={{
          position: 'relative',
          fontFamily: MONO,
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          fontWeight: 600,
          color: TEXT_COLOR,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'baseline',
          zIndex: 1,
        }}
      >
        <ScrambleNumber value={progress} />
        <span style={{ fontSize: '0.42em', fontWeight: 400, opacity: 0.4, marginLeft: '0.1em' }}>
          %
        </span>
      </div>
    </div>
  )
}
