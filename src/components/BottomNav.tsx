import { Button } from './Button'

export function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 nav-glass rounded-full px-4 py-2 flex items-center gap-4">
      <span className="font-mondwest mt-1 text-2xl font-semibold text-[#051A24] select-none flex items-center" style={{ lineHeight: 1 }}>
        J
      </span>
      <Button variant="primary" size="sm" href="#contact">
        Discutons-en
      </Button>
    </div>
  )
}
