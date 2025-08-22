"use client"

import { useState, useEffect } from 'react'
import ImageModulePreloader from '~/utils/image-module-preloader'

export default async function usePreloadedImage(
  importFn: () => Promise<{ default: string }>,
  fallbackToImport: boolean = true
) {
  const [src, setSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First, try to get from cache
        let imageSrc = ImageModulePreloader.getCachedImageSrc(importFn)

        if (!imageSrc && fallbackToImport) {
          // Fallback to dynamic import if not preloaded
          imageSrc = await ImageModulePreloader.preloadImageModule(importFn)
        }

        if (imageSrc) {
          setSrc(imageSrc)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [importFn, fallbackToImport])

  return { src, isLoading, error }
}