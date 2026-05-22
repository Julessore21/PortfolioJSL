import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

export function useInViewAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const items = gsap.utils.toArray<HTMLElement>('[data-animate]', el)
      if (!items.length) return

      gsap.fromTo(
        items,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            once: true,
          },
        }
      )
    },
    { scope: ref, dependencies: [] }
  )

  return ref
}

export { ScrollTrigger }
