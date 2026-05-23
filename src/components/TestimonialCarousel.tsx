import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
// ScrollTrigger registered via lib/gsap — imported to ensure plugin is active
import '../lib/gsap'

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
  avatar: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    /* TODO: témoignage à valider/remplacer */
    id: 1,
    quote: 'Jules a livré un MVP IA en 3 semaines là où d\'autres demandaient 3 mois. Le résultat est en prod, sans bug majeur depuis 6 mois.',
    name: 'Thomas Vidal',
    role: 'CTO, Atelier Numérique',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
  {
    /* TODO: témoignage à valider/remplacer */
    id: 2,
    quote: 'Il comprend autant le code que le design. Le rendu final fait premium sans qu\'on lui ait demandé.',
    name: 'Léa Marchand',
    role: 'Fondatrice, Studio Pivot',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
  {
    /* TODO: témoignage à valider/remplacer */
    id: 3,
    quote: 'Notre déploiement on-premise tournait sur du scotch. Jules a tout refait propre, documenté, monitoré.',
    name: 'Marc Lévêque',
    role: 'Lead Tech, BlueGrid',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
  {
    /* TODO: témoignage à valider/remplacer */
    id: 4,
    quote: 'Capable de bosser seul ou en équipe sans friction. Communique clairement, livre ce qu\'il dit.',
    name: 'Sophie Renard',
    role: 'PM, Northwave',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
  {
    /* TODO: témoignage à valider/remplacer */
    id: 5,
    quote: 'Le site qu\'il nous a fait a doublé notre taux de conversion en 2 mois. Pas de bullshit, du résultat.',
    name: 'Antoine Bertin',
    role: 'Co-fondateur, Lumen',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
  {
    /* TODO: témoignage à valider/remplacer */
    id: 6,
    quote: 'Jules a une vraie patte design en plus du dev. Rare.',
    name: 'Camille Ortiz',
    role: 'Head of Brand, Klima',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=96',
  },
]

const TRIPLED = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
const GAP = 24

function QuoteIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="mb-4 opacity-20">
      <path
        d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.8 1.84 7.68 0.16 11.52 0L12.48 1.44C10.08 2.08 8.16 3.28 6.72 5.04C5.28 6.8 4.56 8.72 4.56 10.8H8.64V24H0ZM19.2 24V14.4C19.2 10.56 20.16 7.28 22.08 4.56C24 1.84 26.88 0.16 30.72 0L31.68 1.44C29.28 2.08 27.36 3.28 25.92 5.04C24.48 6.8 23.76 8.72 23.76 10.8H27.84V24H19.2Z"
        fill="#0D212C"
      />
    </svg>
  )
}

export function TestimonialCarousel() {
  const ref = useInViewAnimation()
  const [current, setCurrent] = useState(TESTIMONIALS.length)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(427.5)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 480) setCardWidth(w * 0.88)
      else if (w < 768) setCardWidth(w * 0.82)
      else setCardWidth(427.5)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const goTo = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating])

  const prev = useCallback(() => {
    goTo(current - 1)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo(current + 1)
  }, [current, goTo])

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => goTo(current + 1), 3000)
    return () => clearInterval(id)
  }, [current, isPaused, goTo])

  useEffect(() => {
    if (current <= 0) {
      const id = setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = 'none'
        setCurrent(TESTIMONIALS.length)
        setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = ''
        }, 20)
      }, 50)
      return () => clearTimeout(id)
    }
    if (current >= TRIPLED.length - TESTIMONIALS.length) {
      const id = setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = 'none'
        setCurrent(TESTIMONIALS.length)
        setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = ''
        }, 20)
      }, 820)
      return () => clearTimeout(id)
    }
  }, [current])

  const translateX = -(current * (cardWidth + GAP))

  return (
    <section className="w-full py-20 overflow-hidden">
      <div className="px-6 md:px-8" ref={ref}>
        {/* Header */}
        <div
          data-animate
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:max-w-4xl md:ml-auto mb-10 gap-4"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight">
            Ce que disent les <span className="font-mondwest">builders</span>
          </h2>
          <div className="flex flex-col sm:items-end gap-1 sm:pt-2 shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5" fill="black" stroke="none" />
              ))}
            </div>
            <span className="text-xs text-[#273C46]">5 étoiles sur les retours clients</span>
          </div>
        </div>

        {/* Carousel track */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              gap: `${GAP}px`,
              willChange: 'transform',
            }}
          >
            {TRIPLED.map((t, i) => {
              const isCurrent = i === current
              return (
                <div
                  key={`${t.id}-${i}`}
                  className="shrink-0 rounded-4xl md:rounded-[40px] px-6 md:pl-10 md:pr-24 py-8 bg-white"
                  style={{
                    width: `${cardWidth}px`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    opacity: isCurrent ? 1 : 0.6,
                    transform: isCurrent ? 'scale(1)' : 'scale(0.97)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                  }}
                >
                  <QuoteIcon />
                  <p className="text-base text-[#0D212C] leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#0D212C]">{t.name}</p>
                      <p className="text-xs text-[#273C46]">→ {t.role}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8 px-1">
            <button
              type="button"
              onClick={prev}
              className="btn-glass btn-glass--secondary w-12 h-12 flex items-center justify-center"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5 text-[#0D212C]" />
            </button>
            <button
              type="button"
              onClick={next}
              className="btn-glass btn-glass--secondary w-12 h-12 flex items-center justify-center"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5 text-[#0D212C]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
