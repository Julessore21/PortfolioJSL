import { useRef, useEffect } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// 👉 Remplace par ton slug Cal.com (pas l'URL complète)
// Ex : si ton lien est cal.com/jules-sore/30min → mettre 'jules-sore/30min'
const CAL_LINK = 'jules-sore/premier-echange'

declare global {
  interface Window {
    Cal?: (...args: unknown[]) => void
  }
}

export function ContactSection() {
  const sectionRef    = useRef<HTMLElement>(null)
  const headerRef     = useRef<HTMLDivElement>(null)
  const calRef        = useRef<HTMLDivElement>(null)

  // Inline Cal.com embed — injecte dans #cal-inline
  useEffect(() => {
    const init = () => {
      window.Cal?.('inline', {
        elementOrSelector: '#cal-inline',
        calLink: CAL_LINK,
        layout: 'month_view',
        config: { theme: 'light' },
      })
    }

    if (window.Cal) {
      init()
    } else {
      const tid = setInterval(() => {
        if (window.Cal) { init(); clearInterval(tid) }
      }, 80)
      return () => clearInterval(tid)
    }
  }, [])

  useGSAP(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
      }
    )
    gsap.fromTo(calRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        delay: 0.15,
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#F9F6F1] border-t border-[#0D212C]/8 py-20 md:py-28 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1100px] mx-auto flex flex-col gap-10">

        {/* ── En-tête ──────────────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#0D212C]/35">
              Contact
            </p>
            <h2 className="font-mondwest text-[38px] md:text-[52px] lg:text-[64px] leading-none tracking-tight text-[#0D212C]">
              Prenons<br />rendez-vous.
            </h2>
          </div>

          <div className="flex flex-col gap-1.5 md:items-end pb-1">
            <p className="text-sm text-[#0D212C]/50 leading-relaxed md:text-right">
              Premier échange gratuit · sans engagement
            </p>
            <a
              href="mailto:jules.sore13@gmail.com"
              className="font-mono text-[10px] tracking-widest uppercase text-[#0D212C]/35 hover:text-[#0D212C]/65 transition-colors"
            >
              jules.sore13@gmail.com
            </a>
          </div>
        </div>

        {/* ── Calendrier inline ─────────────────────────────────────────── */}
        <div
          style={{ opacity: 0 }}
          ref={calRef}
        >
          <div
            className="rounded-2xl overflow-hidden border border-[#0D212C]/8"
            style={{ boxShadow: '0 4px 32px rgba(13,33,44,0.06), 0 1px 4px rgba(13,33,44,0.04)' }}
          >
            {/* Cal.com injecte le calendrier ici */}
            <div
              id="cal-inline"
              style={{ width: '100%', height: '660px', overflow: 'hidden' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
