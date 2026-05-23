import { useRef, useState, useEffect, useCallback } from 'react'
import heroVideo from './assets/download.mp4'
import { gsap, useGSAP } from './lib/gsap'
import { Splashscreen } from './components/Splashscreen'
import { AboutSection } from './components/AboutSection'
import { PricingSection } from './components/PricingSection'
import { PartnerSection } from './components/PartnerSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { CopyrightBar } from './components/CopyrightBar'
import { BottomNav } from './components/BottomNav'

const PRELOAD_ASSETS = {
  videos: [heroVideo],
  images: [] as string[],
}

const MARQUEE_GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
]


interface HeroProps {
  isRevealing: boolean
  onRevealComplete?: () => void
}

function HeroSection({ isRevealing, onRevealComplete }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const nameRef    = useRef<HTMLDivElement>(null)
  const cursorRef  = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)

  // ── Initial hidden state ─────────────────────────────────────────────────
  useEffect(() => {
    // Name container visible — individual chars hidden in JSX (opacity:0)
    gsap.set(nameRef.current, { opacity: 1 })
    // Other texts: fully visible but clipped from the right
    gsap.set(
      [taglineRef.current, headingRef.current, descRef.current, badgeRef.current],
      { opacity: 1, clipPath: 'inset(0 100% 0 0)' }
    )
    gsap.set(videoRef.current, { scale: 0.95, filter: 'blur(12px)', opacity: 0 })
    gsap.set('.js-bottom-nav', { y: 64, opacity: 0 })
  }, [])

  // ── Scroll parallax ──────────────────────────────────────────────────────
  useGSAP(() => {
    gsap.to(videoRef.current, {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 2.5 },
    })
    gsap.to(bottomRef.current, {
      y: -36, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.3 },
    })
  }, { scope: sectionRef })

  // ── Orchestrated reveal ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isRevealing) return

    const START   = 0.4
    const STAGGER = 0.45
    const TYPE_SPEED = 0.075  // seconds per character

    const nameChars = gsap.utils.toArray<HTMLElement>('.tw-char', nameRef.current)
    const cursor = cursorRef.current!

    // Position cursor before first char and show it
    if (nameChars.length > 0) {
      nameChars[0].before(cursor)
      gsap.set(cursor, { opacity: 1 })
    }

    // Char-by-char typewriter for the name
    const typeTl = gsap.timeline({ delay: START })
    nameChars.forEach((char, i) => {
      typeTl.call(() => {
        gsap.set(char, { opacity: 1 })
        char.after(cursor)
      }, [], i * TYPE_SPEED)
    })
    // Cursor blink after name is fully typed
    typeTl.call(() => {
      gsap.to(cursor, {
        opacity: 0, duration: 0.52, repeat: -1,
        yoyo: true, ease: 'sine.inOut', repeatDelay: 0.15,
      })
    }, [], nameChars.length * TYPE_SPEED + 0.15)

    // Left→right clip wipe for surrounding texts
    const revealTl = gsap.timeline()
    revealTl
      .to(taglineRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'none' }, START + STAGGER)
      .to(headingRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'none' }, START + STAGGER * 2)
      .to(descRef.current,    { clipPath: 'inset(0 0% 0 0)', duration: 2.2, ease: 'none' }, START + STAGGER * 3)
      .to(badgeRef.current,   { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'none' }, START + STAGGER * 4)
      .to(videoRef.current, {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 2.8, ease: 'expo.out',
        onStart: () => { videoRef.current?.play() },
      }, START + STAGGER * 4 + 1.0)
      .to('.js-bottom-nav', {
        y: 0, opacity: 1, duration: 1.1, ease: 'back.out(2)',
        onComplete: onRevealComplete,
      }, START + STAGGER * 4 + 1.0 + 3.0)

    return () => { revealTl.kill(); typeTl.kill() }
  }, [isRevealing, onRevealComplete])

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#F9F6F1] overflow-hidden">

      {/* ─── HAND ─────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none max-md:opacity-20">
        <video
          ref={videoRef}
          muted loop playsInline
          src={heroVideo}
          className="h-[56vh] md:h-[64vh] lg:h-[70vh] w-auto object-contain translate-y-[12%]"
          style={{
            opacity: 0,
            mixBlendMode: 'multiply',
            willChange: 'transform, opacity',
            maskImage: 'radial-gradient(ellipse 78% 72% at 50% 48%, black 18%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 72%, transparent 84%)',
            WebkitMaskImage: 'radial-gradient(ellipse 78% 72% at 50% 48%, black 18%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 72%, transparent 84%)',
          }}
        />
      </div>

      {/* ─── TOP-LEFT — name ──────────────────────────────────────────────────────── */}
      <div
        ref={nameRef}
        className="absolute top-8 left-6 md:top-12 md:left-12 lg:top-16 lg:left-20 z-10"
        style={{ opacity: 0 }}
      >
        <h1
          className="font-mondwest text-[28px] md:text-[38px] lg:text-[50px]
                     leading-none tracking-tight text-[#0D212C]"
        >
          Jules<span className="md:hidden"> </span>
          <br className="hidden md:block" />
          Sore-Larregain
        </h1>
      </div>

      {/* ─── TOP-RIGHT — editorial detail ─────────────────────────────────────────── */}
      <div
        ref={taglineRef}
        className="absolute top-8 right-6 md:top-12 md:right-12 lg:top-16 lg:right-20 z-10 text-right"
        style={{ opacity: 0 }}
      >
        <p className="text-[9px] md:text-[10px] text-[#0D212C]/50 leading-loose tracking-widest uppercase">
          Freelance IA &amp; Dev Web<br />
          Aix-en-Provence
        </p>
      </div>

      {/* ─── BOTTOM-LEFT — headline + CTA ─────────────────────────────────────────── */}
      <div
        ref={bottomRef}
        className="absolute bottom-10 left-6 md:bottom-14 md:left-12 lg:bottom-18 lg:left-20
                   z-10 flex flex-col gap-3 md:gap-4 max-w-55 sm:max-w-xs md:max-w-sm lg:max-w-md"
      >
        <h2
          ref={headingRef}
          className="text-[22px] md:text-[30px] lg:text-[38px]
                     leading-[1.15] tracking-tight text-[#0D212C]"
          style={{ opacity: 0 }}
        >
          Construire la <span className="font-mondwest">vague&nbsp;IA</span>,<br />
          du <span className="font-mondwest">bon côté.</span>
        </h2>

        <p
          ref={descRef}
          className="text-xs md:text-sm text-[#0D212C]/55 leading-relaxed"
          style={{ opacity: 0 }}
        >
          Produits IA &amp; sites web sur-mesure.<br className="hidden md:block" />
          Je gère tout — conception, code, déploiement.
        </p>

      </div>

      {/* ─── BOTTOM-RIGHT — availability ──────────────────────────────────────────── */}
      <div
        ref={badgeRef}
        className="absolute bottom-12 right-6 md:bottom-16 md:right-12 lg:bottom-18 lg:right-20 z-10 hidden sm:block"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[9px] md:text-[10px] text-[#0D212C]/55 tracking-wide">
            Disponible — 2 slots
          </span>
        </div>
      </div>

    </section>
  )
}

function MarqueeSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      const track = trackRef.current
      if (!wrapper || !track) return

      // Stored ref for containerAnimation on per-card triggers
      const horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1.8,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      })

      // Per-card: scale up + opacity + slight Y lift as card enters viewport
      gsap.utils.toArray<HTMLElement>('.marquee-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.84, opacity: 0.25, y: 32 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: 'left 95%',
              end: 'left 35%',
              scrub: 1.2,
            },
          }
        )
      })
    },
    { scope: wrapperRef }
  )

  return (
    <div
      ref={wrapperRef}
      className="w-full h-screen overflow-hidden flex items-center"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {MARQUEE_GIFS.map((url, i) => (
          <div
            key={i}
            className="marquee-card mx-3 shrink-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{ height: '82vh', willChange: 'transform, opacity' }}
          >
            <img
              src={url}
              alt=""
              className="h-full w-auto object-cover block"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [splashDone, setSplashDone]   = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  // Scroll lock lives here — released by HeroSection after arm animation ends
  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const handleRevealComplete = useCallback(() => {
    document.body.style.overflow = ''
  }, [])

  return (
    <>
      {!splashDone && (
        <Splashscreen
          assets={PRELOAD_ASSETS}
          onExit={() => setIsRevealing(true)}
          onDone={() => setSplashDone(true)}
        />
      )}
      <div className="bg-[#F9F6F1] min-h-screen overflow-x-hidden">
        <HeroSection isRevealing={isRevealing} onRevealComplete={handleRevealComplete} />
        <AboutSection />
        <MarqueeSection />
        <PricingSection />
        <PartnerSection />
        <ContactSection />
        <Footer />
        <CopyrightBar />
        <BottomNav />
      </div>
    </>
  )
}
