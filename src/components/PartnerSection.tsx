import { useRef, useCallback, useEffect } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Button } from './Button'

const GIF_URLS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
]

const HEADING_WORDS = ['Travaillons', 'ensemble']

export function PartnerSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)
  const lastSpawnRef = useRef(0)
  const gifIndex = useRef(0)

  // Word-by-word heading reveal
  useGSAP(
    () => {
      const words = wordRefs.current.filter(Boolean)
      const cta = ctaRef.current
      if (!words.length) return

      gsap.fromTo(
        words,
        { opacity: 0, y: 80, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.18,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )

      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, scale: 0.85, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out(1.4)',
            delay: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  // GIF mouse trail — enhanced with GSAP
  const spawnGif = useCallback((x: number, y: number) => {
    const container = containerRef.current
    if (!container) return

    const now = Date.now()
    if (now - lastSpawnRef.current < 80) return
    lastSpawnRef.current = now

    const url = GIF_URLS[gifIndex.current % GIF_URLS.length]
    gifIndex.current++

    const rect = container.getBoundingClientRect()
    const localX = x - rect.left
    const localY = y - rect.top
    const rotation = (Math.random() * 20 - 10)

    const el = document.createElement('img')
    el.src = url
    el.style.cssText = `
      position: absolute;
      left: ${localX}px;
      top: ${localY}px;
      width: 130px;
      height: 88px;
      object-fit: cover;
      border-radius: 14px;
      pointer-events: none;
      transform-origin: center center;
      z-index: 10;
      box-shadow: 0 6px 24px rgba(0,0,0,0.18);
    `
    container.appendChild(el)

    // Entrance: scale + fade in fast
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.6, rotate: rotation - 4 },
      { opacity: 1, scale: 1, rotate: rotation, duration: 0.22, ease: 'power2.out',
        xPercent: -50, yPercent: -50 }
    )

    // Exit: fade out + scale down after delay
    gsap.to(el, {
      opacity: 0,
      scale: 0.75,
      y: '-=16',
      duration: 0.55,
      ease: 'power2.in',
      delay: 0.55,
      onComplete: () => el.remove(),
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    spawnGif(e.clientX, e.clientY)
  }, [spawnGif])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <section ref={sectionRef} className="w-full py-12 px-6">
      <div
        ref={containerRef}
        className="relative max-w-300 mx-auto rounded-3xl md:rounded-[40px] py-20 md:py-36 lg:py-48 flex flex-col items-center justify-center overflow-hidden"
        style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.06)' }}
      >
        {/* Word-by-word heading */}
        <h2
          className="font-mondwest text-[48px] md:text-[64px] lg:text-[80px] text-[#0D212C] tracking-tight text-center mb-12 relative z-20"
          style={{ perspective: 800 }}
        >
          {HEADING_WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => { wordRefs.current[i] = el }}
              className="inline-block mr-[0.3em] last:mr-0"
              style={{ opacity: 0, willChange: 'transform, opacity', display: 'inline-block' }}
            >
              {word}
            </span>
          ))}
        </h2>

        <div ref={ctaRef} className="relative z-20" style={{ opacity: 0 }}>
          <Button variant="primary" size="sm" href="#contact">
            <img
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="Jules"
              className="w-10 h-10 rounded-full object-cover"
            />
            Démarrer une conversation avec Jules
          </Button>
        </div>
      </div>
    </section>
  )
}
