import { useInViewAnimation } from '../hooks/useInViewAnimation'

const PORTRAIT_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85'

const STATS = [
  { label: 'Domaines',    value: 'LLM · Transcription · Trading · Web' },
  { label: 'Approche',    value: 'On-premise · Souveraine' },
  { label: 'Philosophie', value: 'Modèles légers · Frugale' },
  { label: 'Livraison',   value: 'POC → Production' },
]

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div data-animate className="stat-card-glass">
      <span className="block text-[10px] uppercase tracking-[0.18em] font-mono text-[#0B1220]/50 mb-2">
        {label}
      </span>
      <span className="block text-[14px] font-medium text-[#0B1220] leading-snug">
        {value}
      </span>
    </div>
  )
}

export function AboutSection() {
  const ref = useInViewAnimation()

  return (
    <section className="py-24 lg:py-32 px-6">
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start"
      >
        {/* ── Left: Portrait ─────────────────────────────────────────────── */}
        <div data-animate className="relative w-full max-w-[380px] mx-auto lg:mx-0">
          {/* Glass halo — blurred white shape offset diagonally behind portrait */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[24px] pointer-events-none"
            style={{
              transform: 'translate(12px, 12px) scale(1.05)',
              background: 'rgba(255,255,255,0.38)',
              filter: 'blur(36px)',
              opacity: 0.55,
              zIndex: 0,
            }}
          />
          {/* Portrait */}
          <div
            className="relative aspect-[4/5] rounded-[24px] overflow-hidden"
            style={{
              zIndex: 1,
              boxShadow: '0 24px 64px -16px rgba(0,0,0,0.18)',
            }}
          >
            <img
              src={PORTRAIT_URL}
              alt="Jules Sore-Larregain"
              className="w-full h-full object-cover object-top
                         transition-transform duration-[600ms] ease-out
                         hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* ── Right: Content ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Eyebrow */}
          <span
            data-animate
            className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#0B1220]/50"
          >
            À propos
          </span>

          {/* Heading */}
          <h2
            data-animate
            className="font-mondwest text-3xl lg:text-4xl leading-[1.15] text-[#0B1220]"
          >
            Ingénieur IA full-stack,<br />
            basé à Aix-en-Provence.
          </h2>

          {/* Pitch */}
          <p
            data-animate
            className="text-base lg:text-lg leading-relaxed text-[#0B1220]/75 max-w-prose"
          >
            Alternance au CEA Cadarache sur MAIA-AUDIO — un service de
            transcription audio souverain déployé en interne. En parallèle, je
            construis AXON, conseil et produits IA pour entreprises qui veulent
            garder leurs données. Conviction : l'IA utile est sobre, on-premise
            quand il faut, et livrée du POC à la prod sans casser le budget.
          </p>

          {/* Stat cards — 2×2 desktop, 1×4 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {STATS.map(s => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
