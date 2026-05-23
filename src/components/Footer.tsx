import { ArrowUpRight } from 'lucide-react'
import { Button } from './Button'

export function Footer() {
  return (
    <footer className="max-w-300 mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <Button variant="primary" href="#contact">
          Discutons-en
        </Button>

        <div className="flex items-start gap-8">
          <ArrowUpRight className="w-5 h-5 text-[#051A24] mt-0.5 shrink-0" />

          <div className="flex gap-12">
            <nav className="flex flex-col gap-3">
              <a href="#services" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">
                Services
              </a>
              <a href="#work" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">
                Projets
              </a>
              <a href="#about" className="text-base text-[#051A24] hover:opacity-70 transition-opacity">
                À propos
              </a>
            </nav>

            <nav className="flex flex-col gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
              >
                x.com
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
