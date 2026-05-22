import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// 👉 Remplace par ton lien Cal.com après avoir créé ton compte sur app.cal.com
const CAL_LINK = 'ton-username/30min'

const PRIMARY_SHADOW =
  '0 1px 2px 0 rgba(5,26,36,0.1), 0 4px 4px 0 rgba(5,26,36,0.09), 0 9px 6px 0 rgba(5,26,36,0.05), 0 17px 7px 0 rgba(5,26,36,0.01), 0 26px 7px 0 rgba(5,26,36,0), inset 0 2px 8px 0 rgba(255,255,255,0.5)'

declare global {
  interface Window {
    Cal?: (...args: unknown[]) => void
  }
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      [labelRef.current, headingRef.current, rightRef.current],
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#F9F6F1] border-t border-[#0D212C]/8 py-24 md:py-36 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1200px] mx-auto">

        <p
          ref={labelRef}
          className="font-mono text-[10px] tracking-widest uppercase text-[#0D212C]/35 mb-8"
          style={{ opacity: 0 }}
        >
          Contact
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-8">

          <h2
            ref={headingRef}
            className="font-mondwest text-[44px] md:text-[64px] lg:text-[80px] leading-none tracking-tight text-[#0D212C]"
            style={{ opacity: 0 }}
          >
            Prenons<br />rendez-vous.
          </h2>

          <div
            ref={rightRef}
            className="flex flex-col gap-5 md:items-end"
            style={{ opacity: 0 }}
          >
            <p className="text-sm text-[#0D212C]/50 leading-relaxed md:text-right max-w-[260px]">
              Réponse sous 24h.<br />
              Premier échange gratuit,<br />
              sans engagement.
            </p>

            {/* Bouton principal — ouvre le popup Cal.com */}
            <button
              data-cal-link={CAL_LINK}
              data-cal-config='{"theme":"light"}'
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5
                         text-sm font-medium text-white bg-[#051A24]
                         hover:opacity-80 active:scale-95 transition-all cursor-pointer"
              style={{ boxShadow: PRIMARY_SHADOW }}
            >
              Réserver un créneau
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <a
              href="mailto:jules.sore13@gmail.com"
              className="font-mono text-[10px] tracking-widest uppercase text-[#0D212C]/35 hover:text-[#0D212C]/70 transition-colors"
            >
              jules.sore13@gmail.com
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
