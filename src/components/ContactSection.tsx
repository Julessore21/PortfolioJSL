import { useRef, useEffect } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// 👉 Remplace par ton slug Cal.com (ex: 'jules-sore/30min')
const CAL_LINK = 'jules-sore/premier-echange'

declare global {
  interface Window { Cal?: (...args: unknown[]) => void }
}

const DETAILS = [
  { label: 'Format',     value: '30 min · en ligne' },
  { label: 'Réponse',   value: 'Sous 24h' },
  { label: 'Tarif',     value: 'Premier échange gratuit' },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = () => {
      window.Cal?.('inline', {
        elementOrSelector: '#cal-inline',
        calLink: CAL_LINK,
        layout: 'month_view',
      })
      // Applique les couleurs du site
      window.Cal?.('ui', {
        cssVarsPerTheme: {
          light: {
            'cal-brand':        '#051A24',
            'cal-brand-subtle': '#F9F6F1',
            'cal-bg':           '#FFFFFF',
            'cal-text':         '#0D212C',
            'cal-border':       'rgba(13,33,44,0.10)',
          },
        },
        hideEventTypeDetails: true,
        layout: 'month_view',
      })
    }

    if (window.Cal) {
      init()
    } else {
      const tid = setInterval(() => { if (window.Cal) { init(); clearInterval(tid) } }, 80)
      return () => clearInterval(tid)
    }
  }, [])

  useGSAP(() => {
    const opts = { trigger: sectionRef.current, start: 'top 80%', once: true }
    gsap.fromTo(leftRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: opts }
    )
    gsap.fromTo(rightRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.12, scrollTrigger: opts }
    )
  }, { scope: sectionRef })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#F9F6F1] border-t border-[#0D212C]/8 py-20 md:py-28 px-6"
    >
      <div className="max-w-300 mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

        {/* ── Colonne gauche ─────────────────────────────────────────────── */}
        <div ref={leftRef} className="flex flex-col gap-8 lg:sticky lg:top-24" style={{ opacity: 0 }}>

          <p className="text-[10px] tracking-[0.18em] uppercase text-[#0D212C]/35">
            Contact
          </p>

          <h2 className="font-mondwest text-[40px] md:text-[52px] leading-none tracking-tight text-[#0D212C]">
            Prenons<br />rendez-vous.
          </h2>

          <p className="text-sm text-[#0D212C]/55 leading-relaxed max-w-[280px]">
            Sélectionne un créneau directement dans le calendrier.
            Premier échange de 30 min, sans engagement.
          </p>

          {/* Détails */}
          <div className="flex flex-col divide-y divide-[#0D212C]/8">
            {DETAILS.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3.5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#0D212C]/35">
                  {label}
                </span>
                <span className="text-sm text-[#0D212C] font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <a
            href="mailto:jules.sore13@gmail.com"
            className="text-[10px] tracking-[0.14em] uppercase text-[#0D212C]/35
                       hover:text-[#0D212C]/70 transition-colors w-fit"
          >
            jules.sore13@gmail.com
          </a>
        </div>

        {/* ── Colonne droite : calendrier ────────────────────────────────── */}
        <div
          ref={rightRef}
          className="rounded-2xl overflow-hidden border border-[#0D212C]/8 bg-white"
          style={{
            opacity: 0,
            boxShadow: '0 8px 40px rgba(13,33,44,0.06), 0 1px 4px rgba(13,33,44,0.04)',
          }}
        >
          <div
            id="cal-inline"
            className="cal-embed"
            style={{ width: '100%' }}
          />
        </div>

      </div>
    </section>
  )
}
