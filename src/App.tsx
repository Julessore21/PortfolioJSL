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
    gsap.set(nameRef.current, { opacity: 1 }) // chars hidden individually in JSX
    gsap.set([taglineRef.current, headingRef.current, descRef.current, badgeRef.current], { opacity: 0 })
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

  // ── Orchestrated reveal ──────────────────────────────────────────
  useEffect(() => {
    if (!isRevealing) return

    const GLYPHS    = '█▓▒░ABXZ#@$%&01'
    const START     = 0.5
    const STAGGER   = 0.65
    const CHAR_DUR  = 0.085
    const WRITE_G   = 3
    const ERASE_DUR = 0.038
    const ERASE_G   = 2
    const GLITCH_DT = 0.03

    const tl = gsap.timeline({ repeat: -1 })

    function getTextNodes(el: HTMLElement) {
      const result: Array<{ node: Text; chars: string[] }> = []
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let n: Text | null
      while ((n = walker.nextNode() as Text | null)) {
        const text = n.textContent ?? ''
        if (text.trim()) result.push({ node: n, chars: Array.from(text) })
      }
      return result
    }

    function scheduleTextEl(el: HTMLElement | null, writeStart: number, eraseStart: number) {
      if (!el) return
      const rawNodes = getTextNodes(el)
      if (!rawNodes.length) return

      let offset = 0
      const nodeData = rawNodes.map(({ node, chars }) => {
        const charOffset = offset
        offset += chars.length
        return { node, chars, charOffset }
      })
      const totalChars = offset

      tl.call(() => { gsap.set(el, { opacity: 1 }) }, [], writeStart)

      nodeData.forEach(({ node, chars, charOffset }) => {
        const buf: string[] = chars.map(() => ' ')
        tl.call(() => { node.textContent = buf.join('') }, [], writeStart)

        chars.forEach((char, i) => {
          const t = writeStart + (charOffset + i) * CHAR_DUR
          if (!char.trim()) {
            tl.call(() => { buf[i] = char; node.textContent = buf.join('') }, [], t)
            return
          }
          for (let g = 0; g < WRITE_G; g++) {
            tl.call(() => {
              buf[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              node.textContent = buf.join('')
            }, [], t + g * GLITCH_DT)
          }
          tl.call(() => {
            buf[i] = char
            node.textContent = buf.join('')
          }, [], t + WRITE_G * GLITCH_DT)
        })

        chars.forEach((char, i) => {
          const eraseT = eraseStart + (totalChars - 1 - (charOffset + i)) * ERASE_DUR
          if (!char.trim()) {
            tl.call(() => { buf[i] = ' '; node.textContent = buf.join('') }, [], eraseT)
            return
          }
          for (let g = 0; g < ERASE_G; g++) {
            tl.call(() => {
              buf[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              node.textContent = buf.join('')
            }, [], eraseT + g * GLITCH_DT)
          }
          tl.call(() => {
            buf[i] = ' '
            node.textContent = buf.join('')
          }, [], eraseT + ERASE_G * GLITCH_DT)
        })
      })

      tl.call(() => { gsap.set(el, { opacity: 0 }) }, [],
        eraseStart + totalChars * ERASE_DUR + ERASE_G * GLITCH_DT + 0.1)
    }

    const TYPE_SPEED = 0.10
    const nameChars  = gsap.utils.toArray<HTMLElement>('.tw-char', nameRef.current)
    const cursor     = cursorRef.current!
    const savedChars = nameChars.map(c => c.textContent ?? '')

    const surroundElems = [
      { el: taglineRef.current, ws: START + STAGGER },
      { el: headingRef.current, ws: START + STAGGER * 2 },
      { el: descRef.current,    ws: START + STAGGER * 3 },
      { el: badgeRef.current,   ws: START + STAGGER * 4 },
    ]

    let maxWriteEnd = START + nameChars.length * TYPE_SPEED + WRITE_G * GLITCH_DT
    surroundElems.forEach(({ el, ws }) => {
      if (!el) return
      const end = ws + Array.from(el.innerText).length * CHAR_DUR + WRITE_G * GLITCH_DT
      if (end > maxWriteEnd) maxWriteEnd = end
    })
    const eraseStart = maxWriteEnd + 3.0

    if (nameChars.length > 0) {
      nameChars[0].before(cursor)
      gsap.set(cursor, { opacity: 1 })
    }

    // Reset cursor position + visibility on each loop iteration
    tl.call(() => {
      if (nameChars.length > 0) nameChars[0].before(cursor)
      gsap.set(cursor, { opacity: 1 })
    }, [], START)

    nameChars.forEach((char, i) => {
      const t = START + i * TYPE_SPEED
      for (let g = 0; g < WRITE_G; g++) {
        tl.call(() => {
          gsap.set(char, { opacity: 1 })
          char.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          char.after(cursor)
        }, [], t + g * GLITCH_DT)
      }
      tl.call(() => {
        char.textContent = savedChars[i]
        char.after(cursor)
      }, [], t + WRITE_G * GLITCH_DT)
    })

    tl.call(() => {
      gsap.to(cursor, {
        opacity: 0, duration: 0.55, repeat: -1,
        yoyo: true, ease: 'sine.inOut', repeatDelay: 0.15,
      })
    }, [], START + nameChars.length * TYPE_SPEED + 0.2)

    ;[...nameChars].reverse().forEach((char, ri) => {
      const t = eraseStart + ri * ERASE_DUR
      for (let g = 0; g < ERASE_G; g++) {
        tl.call(() => {
          char.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }, [], t + g * GLITCH_DT)
      }
      tl.call(() => {
        char.textContent = savedChars[nameChars.length - 1 - ri]
        gsap.set(char, { opacity: 0 })
      }, [], t + ERASE_G * GLITCH_DT)
    })
    tl.call(() => {
      gsap.killTweensOf(cursor)
      gsap.set(cursor, { opacity: 0 })
    }, [], eraseStart + nameChars.length * ERASE_DUR + ERASE_G * GLITCH_DT)

    surroundElems.forEach(({ el, ws }) => scheduleTextEl(el, ws, eraseStart))

    const videoStart = START + STAGGER * 4 + 1.2
    gsap.to(videoRef.current, {
      opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 2.8, ease: 'expo.out',
      delay: videoStart,
      onStart: () => { videoRef.current?.play() },
    })
    gsap.to('.js-bottom-nav', {
      y: 0, opacity: 1, duration: 1.1, ease: 'back.out(2)',
      delay: videoStart + 3.0,
      onComplete: onRevealComplete,
    })

    return () => { tl.kill() }
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
      >
        <h1
          className="font-mondwest text-[28px] md:text-[38px] lg:text-[50px]
                     leading-none tracking-tight text-[#0D212C]"
          aria-label="Jules Sore-Larregain"
        >
          {'Jules'.split('').map((c, i) => (
            <span key={`j${i}`} className="tw-char inline-block" style={{ opacity: 0 }}>{c}</span>
          ))}
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
