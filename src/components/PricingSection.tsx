import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const CAL_SLUG = 'jules-sore'

type Card = {
  id: string
  index: number
  category: string
  title: string
  duration: string
  price: string
  description: string
  bullets: string[]
  calLink: string
}

const CARDS: Card[] = [
  {
    id: 'echange',
    index: 1,
    category: 'Découverte',
    title: 'Premier Échange',
    duration: '30 min',
    price: 'Gratuit',
    description: "Un appel sans engagement pour cadrer ton besoin, valider la faisabilité et voir si le courant passe.",
    bullets: [
      'Présentation mutuelle',
      'Analyse du besoin',
      'Questions / réponses',
      'Prochaines étapes',
    ],
    calLink: `${CAL_SLUG}/premier-echange`,
  },
  {
    id: 'consultation',
    index: 2,
    category: 'Stratégie',
    title: 'Consultation Projet',
    duration: '60 min',
    price: 'Sur devis',
    description: "Session de travail approfondie pour définir l'architecture, la roadmap et l'estimation budgétaire.",
    bullets: [
      'Architecture IA / web',
      'Roadmap & jalons',
      'Estimation budgétaire',
      'Choix de stack adaptés',
    ],
    calLink: `${CAL_SLUG}/consultation`,
  },
  {
    id: 'audit',
    index: 3,
    category: 'Diagnostic',
    title: 'Audit Site Web',
    duration: '45 min',
    price: 'Gratuit',
    description: "Revue technique et UX de ton site : performance, accessibilité, conversion et plan d'action prioritaire.",
    bullets: [
      'Audit performance',
      'Revue UX / conversion',
      'Analyse SEO basique',
      "Plan d'action concret",
    ],
    calLink: `${CAL_SLUG}/audit`,
  },
]

const CTA_SHADOW =
  '0 1px 2px rgba(5,26,36,0.12), 0 4px 8px rgba(5,26,36,0.10), 0 12px 24px rgba(5,26,36,0.08), inset 0 1px 0 rgba(255,255,255,0.08)'

function useCalEmbed() {
  useEffect(() => {
    if ((window as Window & { Cal?: unknown }).Cal) return
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.innerHTML = `(function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)}})(window,"https://app.cal.com/embed/embed.js","init");Cal("init",{origin:"https://cal.com"});`
    document.head.appendChild(s)
  }, [])
}

function GlassCard({ card, wrapperRef }: { card: Card; wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const num = String(card.index).padStart(2, '0')

  return (
    <div ref={wrapperRef} className="h-full" style={{ opacity: 0 }}>
      <article className="glass-card h-full flex flex-col" style={{ padding: '2px' }}>
        {/* Inner content wrapper keeps padding consistent */}
        <div className="flex flex-col flex-1 gap-0 px-8 pt-8 pb-8">

          {/* Top row: number + category */}
          <div className="flex items-start justify-between mb-6">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1220]/38">
              {card.category}
            </span>
            <span
              className="font-light leading-none text-[#0B1220]/07 select-none"
              style={{ fontSize: '56px', lineHeight: 1 }}
              aria-hidden="true"
            >
              {num}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-mondwest text-[26px] leading-tight text-[#0B1220] mb-3">
            {card.title}
          </h3>

          {/* Duration + price tags */}
          <div className="flex items-center gap-2 mb-5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] text-[#0B1220]/50 bg-[#0B1220]/06">
              {card.duration}
            </span>
            <span className="text-[#0B1220]/20 text-xs">·</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] text-[#0B1220]/50 bg-[#0B1220]/06">
              {card.price}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-5" style={{ background: 'rgba(11,18,32,0.07)' }} />

          {/* Description */}
          <p className="text-sm text-[#0B1220]/58 leading-relaxed mb-5">
            {card.description}
          </p>

          {/* Bullets */}
          <ul className="flex flex-col gap-2.5 flex-1 mb-7">
            {card.bullets.map(b => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-[#0B1220]/62">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* CTA — dark navy, premium */}
          <a
            href={`https://cal.com/${card.calLink}`}
            data-cal-link={card.calLink}
            data-cal-config='{"layout":"month_view"}'
            className="w-full inline-flex items-center justify-center gap-2 rounded-full
                       px-7 py-3.5 text-sm font-medium text-white
                       transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
            style={{
              background: '#051A24',
              boxShadow: CTA_SHADOW,
            }}
          >
            Réserver {card.duration}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6.5 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

        </div>
      </article>
    </div>
  )
}

export function PricingSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const wrapper1Ref = useRef<HTMLDivElement>(null)
  const wrapper2Ref = useRef<HTMLDivElement>(null)
  const wrapper3Ref = useRef<HTMLDivElement>(null)

  useCalEmbed()

  useGSAP(
    () => {
      const trigger = { trigger: sectionRef.current, start: 'top 78%', once: true }

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: trigger }
      )

      const wrappers = [wrapper1Ref.current, wrapper2Ref.current, wrapper3Ref.current]
      wrappers.forEach((wrapper, i) => {
        if (!wrapper) return
        gsap.fromTo(
          wrapper,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 + i * 0.12, scrollTrigger: trigger }
        )
      })
    },
    { scope: sectionRef, dependencies: [] }
  )

  void ScrollTrigger

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header — left-aligned, editorial ──────────────────────── */}
        <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#0B1220]/40 block mb-4">
                Discutons-en
              </span>
              <h2 className="font-mondwest text-[28px] md:text-[38px] lg:text-[52px] leading-[1.1] text-[#0B1220]">
                Trois manières de<br />démarrer la conversation
              </h2>
            </div>
            <p className="text-sm text-[#0B1220]/50 leading-relaxed lg:text-right max-w-[240px] shrink-0">
              Aucun engagement<br />pour les échanges gratuits.
            </p>
          </div>
          {/* Thin decorative rule */}
          <div className="mt-8 h-px" style={{ background: 'linear-gradient(to right, rgba(11,18,32,0.12), rgba(11,18,32,0.04), transparent)' }} />
        </div>

        {/* ── Cards grid ────────────────────────────────────────────── */}
        <div className="glass-cards-grid">
          <GlassCard card={CARDS[0]} wrapperRef={wrapper1Ref} />
          <GlassCard card={CARDS[1]} wrapperRef={wrapper2Ref} />
          <GlassCard card={CARDS[2]} wrapperRef={wrapper3Ref} />
        </div>

      </div>
    </section>
  )
}
