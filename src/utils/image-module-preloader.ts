export default class ImageModulePreloader {
  private static cache = new Map<string, string>()
  private static loading = new Map<string, Promise<string>>()

  static async preloadImageModule(importFn: () => Promise<{ default: string }>): Promise<string> {
    const importKey = importFn.toString() // Use function string as cache key
    
    if (this.cache.has(importKey)) {
      return this.cache.get(importKey)!
    }

    if (this.loading.has(importKey)) {
      return this.loading.get(importKey)!
    }

    const loadPromise = importFn().then(module => {
      const imageSrc = module.default
      this.cache.set(importKey, imageSrc)
      this.loading.delete(importKey)
      
      // Preload the actual image in browser
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(imageSrc)
        img.onerror = reject
        img.src = imageSrc
      })
    })

    this.loading.set(importKey, loadPromise)
    return loadPromise
  }

  static getCachedImageSrc(importFn: () => Promise<{ default: string }>): string | null {
    const importKey = importFn.toString()
    return this.cache.get(importKey) || null
  }
}