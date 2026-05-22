import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { Button } from './Button'

const BOOKING_URL = '#contact'

const INSET_SHADOW = 'inset 0 1px 2px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)'

function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 14,
      rotateX: -y * 14,
      transformPerspective: 800,
      ease: 'power2.out',
      duration: 0.35,
    })
  }
  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' })
  }
  return { onMouseMove, onMouseLeave }
}

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const darkCardRef = useRef<HTMLDivElement>(null)
  const lightCardRef = useRef<HTMLDivElement>(null)
  const darkTilt = useTilt(darkCardRef)
  const lightTilt = useTilt(lightCardRef)

  useGSAP(
    () => {
      const dark = darkCardRef.current
      const light = lightCardRef.current
      if (!dark || !light) return

      const trigger = {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      }

      gsap.fromTo(dark, { opacity: 0, x: -60, y: 30 }, {
        opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: trigger,
      })
      gsap.fromTo(light, { opacity: 0, x: 60, y: 30 }, {
        opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.12,
        scrollTrigger: trigger,
      })
    },
    { scope: sectionRef, dependencies: [] }
  )

  // Suppress "unused" warning — ScrollTrigger is used by the plugin internals
  void ScrollTrigger

  return (
    <section className="w-full py-12 px-6" ref={sectionRef}>
      <div className=" mr-130 grid grid-cols-1 md:grid-cols-2 gap-8 md:justify-end md:max-w-4xl md:ml-auto">

        {/* Dark card */}
        <div
          ref={darkCardRef}
          {...darkTilt}
          className="rounded-[40px]  pl-10 pr-10 md:pr-24 pt-3 pb-10 text-[#F6FCFF]"
          style={{
            backgroundColor: '#051A24',
            boxShadow: INSET_SHADOW,
            opacity: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <div className="flex items-center gap-2 mb-1 mt-4">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-[#E0EBF0] opacity-70">Available</span>
          </div>
          <h3 className="text-[22px] font-medium text-[#F6FCFF] mb-2 mt-4">Partenariat mensuel</h3>
          <p className="text-sm text-[#E0EBF0] opacity-80 mb-6 leading-relaxed">
            Une équipe d'un. Je gère le projet de bout en bout,<br />
            tu as un seul interlocuteur.
          </p>
          <div className="mb-8">
            <span className="text-2xl font-semibold text-[#F6FCFF]">Sur demande</span>
            <p className="text-sm text-[#E0EBF0] opacity-60 mt-0.5">Engagement mensuel</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="sm" href={BOOKING_URL}>
              Discutons-en
            </Button>
            <Button variant="secondary" size="sm" href={BOOKING_URL}>
              Comment ça marche
            </Button>
          </div>
        </div>

        {/* Light card */}
        <div
          ref={lightCardRef}
          {...lightTilt}
          className="rounded-[40px] pl-10 pr-10 md:pr-24 pt-3 pb-10 bg-white"
          style={{
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            opacity: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <div className="flex items-center gap-2 mb-1 mt-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-[#273C46] opacity-70">Available</span>
          </div>
          <h3 className="text-[22px] font-medium text-[#0D212C] mb-2 mt-4">Projet sur-mesure</h3>
          <p className="text-sm text-[#051A24] opacity-70 mb-6 leading-relaxed">
            Périmètre fixe, deadline fixe.<br />
            Même rigueur, mêmes standards.
          </p>
          <div className="mb-8">
            <span className="text-2xl font-semibold text-[#0D212C]">Sur devis</span>
            <p className="text-sm text-[#273C46] opacity-60 mt-0.5">Selon scope</p>
          </div>
          <Button variant="tertiary" href={BOOKING_URL}>
            Discutons-en
          </Button>
        </div>
      </div>
    </section>
  )
}
