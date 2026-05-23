import { useState, useEffect, useRef } from 'react'

export interface PreloaderAssets {
  videos?: string[]
  images?: string[]
}

export interface PreloaderResult {
  progress: number
  isReady: boolean
}

export function usePreloader(
  assets: PreloaderAssets = {},
  minDuration = 1400
): PreloaderResult {
  const [visualProgress, setVisualProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const allDoneRef = useRef(false)
  const stepRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const videos = assets.videos ?? []
    const images = assets.images ?? []
    const total = videos.length + images.length + 1

    const videoPromises = videos.map(src =>
      new Promise<void>(resolve => {
        const el = document.createElement('video')
        el.muted = true
        el.preload = 'auto'
        const timeout = setTimeout(resolve, 8000)
        const done = () => { clearTimeout(timeout); resolve() }
        el.addEventListener('canplaythrough', done, { once: true })
        el.addEventListener('error', done, { once: true })
        el.src = src
        el.load()
      })
    )

    const imagePromises = images.map(src =>
      new Promise<void>(resolve => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = src
      })
    )

    const fontPromise = document.fonts.ready

    Promise.all([...videoPromises, ...imagePromises, fontPromise]).then(() => {
      if (!cancelled) allDoneRef.current = true
    })

    // Counter advances purely by time — 1 step every stepInterval ms
    // No asset-gating mid-way; isReady waits for both 100% and allDone
    const stepInterval = Math.max(8, Math.floor(minDuration / 100))
    let elapsed = 0

    const id = setInterval(() => {
      if (cancelled) return
      elapsed += stepInterval

      if (stepRef.current < 100) {
        stepRef.current += 1
        setVisualProgress(stepRef.current)
      }

      if (stepRef.current >= 100 && allDoneRef.current) {
        clearInterval(id)
        if (!cancelled) setIsReady(true)
      }
    }, stepInterval)

    // Safety: if assets take longer than 2× minDuration, force ready
    const safetyTimeout = setTimeout(() => {
      allDoneRef.current = true
    }, minDuration * 2)

    return () => {
      cancelled = true
      clearInterval(id)
      clearTimeout(safetyTimeout)
    }
  }, [])

  return { progress: visualProgress, isReady }
}
