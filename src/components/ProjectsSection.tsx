import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

interface Project {
  name: string
  description: string
  gif: string
}

const PROJECTS: Project[] = [
  {
    name: 'AXON',
    description: 'Déployer l\'IA souveraine chez les PME qui ne peuvent pas envoyer leurs données dans le cloud.',
    gif: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  },
  {
    name: 'Beatmakerz',
    description: 'Une marque de prod qui tourne avec l\'IA, pas contre elle.',
    gif: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif',
  },
  {
    name: 'LIFE BOARD',
    description: 'Transformer la vie de tous les jours en système jouable.',
    gif: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  },
]

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 2.5,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ willChange: 'transform' }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.name}
            className="relative shrink-0 overflow-hidden"
            style={{ width: '100vw', height: '100vh' }}
          >
            {/* Full-bleed background gif */}
            <img
              src={project.gif}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,26,36,0.72) 0%, rgba(5,26,36,0.18) 50%, transparent 100%)',
              }}
            />

            {/* Slide index */}
            <span className="absolute top-10 right-10 font-mono text-xs text-white/40 tracking-widest">
              {String(i + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>

            {/* Text block */}
            <div className="absolute bottom-16 left-12 md:left-20 max-w-sm md:max-w-lg">
              <h3 className="font-mondwest text-5xl md:text-7xl font-semibold text-white mb-4 leading-none tracking-tight">
                {project.name}
              </h3>
              <p className="text-sm md:text-base text-white/75 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
