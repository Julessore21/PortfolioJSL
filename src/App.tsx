import { useRef } from 'react'
import { gsap, useGSAP } from './lib/gsap'
import { AboutSection } from './components/AboutSection'
import { PricingSection } from './components/PricingSection'
import { TestimonialCarousel } from './components/TestimonialCarousel'
import { PartnerSection } from './components/PartnerSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { CopyrightBar } from './components/CopyrightBar'
import { BottomNav } from './components/BottomNav'

const MARQUEE_GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
]


function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const nameRef    = useRef<HTMLDivElement>(null)
  const cursorRef  = useRef<HTMLSpanElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const btnsRef    = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const nameChars = gsap.utils.toArray<HTMLElement>('.tw-char', nameRef.current)
    const cursor    = cursorRef.current!

    // Curseur positionné avant le premier char au départ
    if (nameChars.length > 0) nameChars[0].before(cursor)

    // ── Entrance: tous les éléments sauf le nom ───────────────────────────
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(videoRef.current,
        { opacity: 0, scale: 0.86 },
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }
      )
      .fromTo(taglineRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.55 },
        '-=1.0'
      )
      .fromTo(headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(descRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65 },
        '-=0.5'
      )
      .fromTo(btnsRef.current,
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55 },
        '-=0.42'
      )
      .fromTo(badgeRef.current,
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.45 },
        '-=0.5'
      )

    // ── Curseur : apparaît à t=0.65s puis clignote en continu ────────────
    gsap.timeline({ delay: 0.65 })
      .set(cursor, { opacity: 1 })
      .to(cursor, {
        opacity: 0,
        duration: 0.48,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        repeatDelay: 0.12,
      })

    // ── Nom : machine à écrire avec curseur qui suit chaque lettre ────────
    const TYPE_SPEED = 0.105  // secondes entre chaque frappe
    const DEL_SPEED  = 0.062  // secondes entre chaque suppression
    const HOLD       = 2.4    // pause sur le nom complet
    const LOOP_PAUSE = 0.7    // pause avant de recommencer

    const typeTl = gsap.timeline({ repeat: -1, delay: 0.8 })

    // Phase écriture : curseur se déplace APRÈS chaque lettre qui apparaît
    nameChars.forEach((char, i) => {
      typeTl.call(() => {
        char.after(cursor)       // curseur suit la lettre qui vient d'être tapée
        gsap.set(char, { opacity: 1 })
      }, [], i * TYPE_SPEED)
    })

    // Pause sur le nom complet
    typeTl.to({}, { duration: HOLD }, nameChars.length * TYPE_SPEED)

    // Phase suppression : curseur se déplace AVANT chaque lettre supprimée
    const deleteStart = nameChars.length * TYPE_SPEED + HOLD
    ;[...nameChars].reverse().forEach((char, i) => {
      typeTl.call(() => {
        char.before(cursor)      // curseur recule avant la lettre qui disparaît
        gsap.set(char, { opacity: 0 })
      }, [], deleteStart + i * DEL_SPEED)
    })

    // Pause avant le prochain cycle
    typeTl.to({}, { duration: LOOP_PAUSE }, deleteStart + nameChars.length * DEL_SPEED)

    // ── Scroll parallax ───────────────────────────────────────────────────
    gsap.to(videoRef.current, {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 2.5 },
    })
    gsap.to(bottomRef.current, {
      y: -36, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.3 },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#F9F6F1] overflow-hidden">

      {/* ─── HAND — truly centered, large, borderless ──────────────────────────────
          mix-blend-mode:multiply makes the white video bg disappear into the page crème */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="h-[56vh] md:h-[64vh] lg:h-[70vh] w-auto object-contain
                     translate-y-[12%]
                     max-md:opacity-20"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          style={{
            opacity: 0,
            mixBlendMode: 'multiply',
            willChange: 'transform, opacity',
            maskImage: 'radial-gradient(ellipse 78% 72% at 50% 48%, black 18%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 72%, transparent 84%)',
            WebkitMaskImage: 'radial-gradient(ellipse 78% 72% at 50% 48%, black 18%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.12) 72%, transparent 84%)',
          }}
        />
      </div>

      {/* ─── TOP-LEFT — name as masthead ──────────────────────────────────────────── */}
      <div
        ref={nameRef}
        className="absolute top-8 left-6 md:top-12 md:left-12 lg:top-16 lg:left-20 z-10"
      >
        <h1
          className="font-mondwest text-[28px] md:text-[38px] lg:text-[50px]
                     leading-none tracking-tight text-[#0D212C]"
          aria-label="Jules Sore-Larregain"
        >
          {'Jules'.split('').map((c, i) => (
            <span key={`j${i}`} className="tw-char inline-block" style={{ opacity: 0 }}>{c}</span>
          ))}
          {/* space visible only on mobile where there's no line break */}
          <span className="md:hidden tw-char inline-block" style={{ opacity: 0 }}>&nbsp;</span>
          <br className="hidden md:block" />
          {'Sore-Larregain'.split('').map((c, i) => (
            <span key={`s${i}`} className="tw-char inline-block" style={{ opacity: 0 }}>{c}</span>
          ))}
          <span
            ref={cursorRef}
            className="inline-block ml-0.5"
            style={{ opacity: 0, fontWeight: 300, letterSpacing: 0, verticalAlign: '0.05em' }}
            aria-hidden="true"
          >|</span>
        </h1>
      </div>

      {/* ─── TOP-RIGHT — editorial detail ─────────────────────────────────────────── */}
      <div
        ref={taglineRef}
        className="absolute top-8 right-6 md:top-12 md:right-12 lg:top-16 lg:right-20 z-10 text-right"
        style={{ opacity: 0 }}
      >
        <p className="font-mono text-[9px] md:text-[10px] text-[#0D212C]/50 leading-loose tracking-widest uppercase">
          Freelance IA &amp; Dev Web<br />
          Aix-en-Provence
        </p>
      </div>

      {/* ─── BOTTOM-LEFT — headline + CTA ─────────────────────────────────────────── */}
      <div
        ref={bottomRef}
        className="absolute bottom-10 left-6 md:bottom-14 md:left-12 lg:bottom-18 lg:left-20
                   z-10 flex flex-col gap-3 md:gap-4 max-w-xs md:max-w-sm lg:max-w-md"
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
        className="absolute bottom-12 right-6 md:bottom-16 md:right-12 lg:bottom-18 lg:right-20 z-10"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="font-mono text-[9px] md:text-[10px] text-[#0D212C]/55 tracking-wide">
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
  return (
    <div className="bg-[#F9F6F1] min-h-screen overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <PricingSection />
      <TestimonialCarousel />
      <PartnerSection />
      <ContactSection />
      <Footer />
      <CopyrightBar />
      <BottomNav />
    </div>
  )
}
