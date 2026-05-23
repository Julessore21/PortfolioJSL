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
  minDuration = 2800
): PreloaderResult {
  const [visualProgress, setVisualProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const assetProgressRef = useRef(0) // 0-100, gating ceiling
  const stepRef = useRef(0)          // current displayed step

  useEffect(() => {
    let cancelled = false
    const videos = assets.videos ?? []
    const images = assets.images ?? []
    const total = videos.length + images.length + 1
    let resolved = 0

    const onResolve = () => {
      resolved = Math.min(resolved + 1, total)
      assetProgressRef.current = Math.round((resolved / total) * 100)
    }

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
      }).then(onResolve)
    )

    const imagePromises = images.map(src =>
      new Promise<void>(resolve => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = src
      }).then(onResolve)
    )

    const fontPromise = document.fonts.ready.then(onResolve)

    // Step interval: spread 100 steps across minDuration
    const stepInterval = Math.max(10, Math.floor(minDuration / 100))

    const startTime = Date.now()
    let allDone = false

    Promise.all([...videoPromises, ...imagePromises, fontPromise]).then(() => {
      assetProgressRef.current = 100
      allDone = true
    })

    const id = setInterval(() => {
      if (cancelled) return

      const elapsed = Date.now() - startTime
      // Time-based ceiling: how far we'd be at this point if assets were the bottleneck
      const timeCeiling = Math.min(100, Math.floor((elapsed / minDuration) * 100))
      // Actual ceiling: min of time-based and asset-based
      const ceiling = Math.min(timeCeiling, assetProgressRef.current)

      if (stepRef.current < ceiling) {
        stepRef.current += 1
        setVisualProgress(stepRef.current)
      }

      // Once we hit 100 on both axes, signal ready
      if (stepRef.current >= 100 && allDone) {
        clearInterval(id)
        if (!cancelled) setIsReady(true)
      }
    }, stepInterval)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, []) // assets read once on mount

  return { progress: visualProgress, isReady }
}
