import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const CAL_SLUG = 'jules-sore'

type Card = {
  id: string
  category: string
  title: string
  duration: string
  price: string
  description: string
  bullets: string[]
  calLink: string
  featured: boolean
  badge?: string
}

const CARDS: Card[] = [
  {
    id: 'echange',
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
    featured: false,
  },
  {
    id: 'consultation',
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
    featured: true,
    badge: 'Le plus complet',
  },
  {
    id: 'audit',
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
    featured: false,
  },
]

function useCalEmbed() {
  useEffect(() => {
    if ((window as Window & { Cal?: unknown }).Cal) return
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.innerHTML = `(function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)}})(window,"https://app.cal.com/embed/embed.js","init");Cal("init",{origin:"https://cal.com"});`
    document.head.appendChild(s)
  }, [])
}

function CheckIcon() {
  return (
    <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-6" stroke="#22c55e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function GlassCard({ card, wrapperRef }: { card: Card; wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const cardClass = `glass-card h-full p-8 flex flex-col gap-5${card.featured ? ' glass-card--featured' : ''}`
  const ctaClass = `btn-glass ${card.featured ? 'btn-glass--dark' : 'btn-glass--primary'} inline-flex items-center justify-center gap-2 px-7 py-3 text-sm mt-auto`

  return (
    <div ref={wrapperRef} className="h-full" style={{ opacity: 0 }}>
      <article className={cardClass}>
        {card.badge && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#0B1220]/10 text-[#0B1220]/65 border border-[#0B1220]/10">
              {card.badge}
            </span>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-[#0B1220]/45">
              {card.category}
            </span>
          </div>
          <h3 className="font-mondwest text-[24px] leading-snug text-[#0B1220] mb-1">
            {card.title}
          </h3>
          <p className="text-xs font-mono text-[#0B1220]/40">
            {card.duration} · {card.price}
          </p>
        </div>

        <p className="text-sm text-[#0B1220]/68 leading-relaxed">
          {card.description}
        </p>

        <ul className="flex flex-col gap-2.5 flex-1">
          {card.bullets.map(b => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-[#0B1220]/65">
              <CheckIcon />
              {b}
            </li>
          ))}
        </ul>

        <a
          href={`https://cal.com/${card.calLink}`}
          data-cal-link={card.calLink}
          data-cal-config='{"layout":"month_view"}'
          className={ctaClass}
        >
          Réserver {card.duration}
        </a>
      </article>
    </div>
  )
}

export function PricingSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const wrapper1Ref = useRef<HTMLDivElement>(null)
  const wrapper2Ref = useRef<HTMLDivElement>(null)
  const wrapper3Ref = useRef<HTMLDivElement>(null)

  useCalEmbed()

  useGSAP(
    () => {
      // ── Card entrance on scroll (wrapper only, CSS handles card transforms) ──
      const wrappers = [wrapper1Ref.current, wrapper2Ref.current, wrapper3Ref.current]
      const trigger = { trigger: sectionRef.current, start: 'top 80%', once: true }
      wrappers.forEach((wrapper, i) => {
        if (!wrapper) return
        gsap.fromTo(
          wrapper,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: i * 0.13, scrollTrigger: trigger }
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
      className="relative w-full py-28 px-6 overflow-hidden"
    >
      {/* ── Section header ──────────────────────────────────────────── */}
      <div className="relative z-10 text-center mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#0B1220]/50">
          Discutons-en
        </span>
        <h2 className="font-mondwest text-[36px] lg:text-[46px] leading-[1.15] text-[#0B1220] mt-4 mb-4">
          Trois manières de démarrer<br className="hidden sm:block" /> la conversation
        </h2>
        <p className="text-sm lg:text-base text-[#0B1220]/55 max-w-[380px] mx-auto leading-relaxed">
          Choisissez le format adapté à votre projet.<br />
          Aucun engagement pour les échanges gratuits.
        </p>
      </div>

      {/* ── Chips strip ─────────────────────────────────────────────── */}
      <div className="relative z-10 glass-chips">
        {CARDS.map(card => (
          <div key={card.id} className="glass-chip">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
            {card.title}
            <span className="opacity-35">·</span>
            <span className="opacity-55 font-normal">{card.duration}</span>
          </div>
        ))}
      </div>

      {/* ── Cards grid ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto glass-cards-grid">
        <GlassCard card={CARDS[0]} wrapperRef={wrapper1Ref} />
        <GlassCard card={CARDS[1]} wrapperRef={wrapper2Ref} />
        <GlassCard card={CARDS[2]} wrapperRef={wrapper3Ref} />
      </div>
    </section>
  )
}
