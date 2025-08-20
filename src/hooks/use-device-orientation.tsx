import { useState, useEffect, useCallback } from 'react'

export interface DeviceOrientationData {
  alpha: number | null  // Z-axis rotation (0-360°)
  beta: number | null   // X-axis rotation (-180° to 180°)
  gamma: number | null  // Y-axis rotation (-90° to 90°)
  absolute: boolean
}

export interface UseDeviceOrientationReturn {
  orientation: DeviceOrientationData
  isSupported: boolean
  hasPermission: boolean | null
  requestPermission: () => Promise<boolean>
  error: string | null
}

export function useDeviceOrientation(): UseDeviceOrientationReturn {
  const [orientation, setOrientation] = useState<DeviceOrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false
  })
  
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if device orientation is supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('DeviceOrientationEvent' in window)
    }
  }, [])

  // Handle device orientation change
  const handleOrientationChange = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute
    })
  }, [])

  // Request permission (required for iOS 13+)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Device orientation is not supported')
      return false
    }

    try {
      // Check if permission API exists (iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        const granted = permission === 'granted'
        setHasPermission(granted)
        
        if (!granted) {
          setError('Device orientation permission denied')
          return false
        }
      } else {
        // For other browsers, assume permission is granted
        setHasPermission(true)
      }

      // Add event listener
      window.addEventListener('deviceorientation', handleOrientationChange)
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request permission')
      setHasPermission(false)
      return false
    }
  }, [isSupported, handleOrientationChange])

  // Cleanup event listener
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientationChange)
      }
    }
  }, [handleOrientationChange])

  return {
    orientation,
    isSupported,
    hasPermission,
    requestPermission,
    error
  }
}