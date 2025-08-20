/**
 * Utility functions for managing localStorage with expiration support
 */

interface StorageItem<T = any> {
  value: T
  expiration: number
}

/**
 * Sets a value in localStorage with a 3-day expiration
 * @param key - The localStorage key
 * @param value - The value to store (will be JSON stringified)
 * @param customExpirationDays - Optional custom expiration in days (defaults to 3)
 */
export function setWithExpiration<T>(
  key: string, 
  value: T, 
  customExpirationDays?: number
): void {
  const expirationDays = customExpirationDays || 3
  const expirationTime = Date.now() + (expirationDays * 24 * 60 * 60 * 1000) // 3 days in milliseconds
  
  const item: StorageItem<T> = {
    value,
    expiration: expirationTime
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error(`Failed to set localStorage item "${key}":`, error)
  }
}

/**
 * Gets a value from localStorage and checks if it's expired
 * @param key - The localStorage key
 * @returns The stored value if not expired, null if expired or not found
 */
export function getWithExpiration<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key)
    
    if (!itemStr) {
      return null
    }
    
    const item: StorageItem<T> = JSON.parse(itemStr)
    
    // Check if the item has expired
    if (Date.now() > item.expiration) {
      // Remove expired item
      localStorage.removeItem(key)
      return null
    }
    
    return item.value
  } catch (error) {
    console.error(`Failed to get localStorage item "${key}":`, error)
    // Remove corrupted item
    localStorage.removeItem(key)
    return null
  }
}

/**
 * Checks if a localStorage item exists and is not expired
 * @param key - The localStorage key
 * @returns true if item exists and is not expired, false otherwise
 */
export function isValidAndNotExpired(key: string): boolean {
  try {
    const itemStr = localStorage.getItem(key)
    
    if (!itemStr) {
      return false
    }
    
    const item: StorageItem = JSON.parse(itemStr)
    
    // Check if the item has expired
    if (Date.now() > item.expiration) {
      // Remove expired item
      localStorage.removeItem(key)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`Failed to check localStorage item "${key}":`, error)
    // Remove corrupted item
    localStorage.removeItem(key)
    return false
  }
}

/**
 * Removes a localStorage item
 * @param key - The localStorage key
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove localStorage item "${key}":`, error)
  }
}

/**
 * Clears all expired items from localStorage
 * This can be called periodically to clean up expired data
 */
export function clearExpiredItems(): void {
  try {
    const keysToRemove: string[] = []
    
    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      
      try {
        const itemStr = localStorage.getItem(key)
        if (!itemStr) continue
        
        const item: StorageItem = JSON.parse(itemStr)
        
        // Check if this item has our expiration structure and is expired
        if (item.expiration && Date.now() > item.expiration) {
          keysToRemove.push(key)
        }
      } catch {
        // Skip items that don't have our structure
        continue
      }
    }
    
    // Remove expired items
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} expired localStorage items`)
    }
  } catch (error) {
    console.error('Failed to clear expired localStorage items:', error)
  }
}

/**
 * Gets the expiration time for a localStorage item
 * @param key - The localStorage key
 * @returns Expiration timestamp or null if item doesn't exist
 */
export function getExpirationTime(key: string): number | null {
  try {
    const itemStr = localStorage.getItem(key)
    
    if (!itemStr) {
      return null
    }
    
    const item: StorageItem = JSON.parse(itemStr)
    return item.expiration
  } catch (error) {
    console.error(`Failed to get expiration time for localStorage item "${key}":`, error)
    return null
  }
} 