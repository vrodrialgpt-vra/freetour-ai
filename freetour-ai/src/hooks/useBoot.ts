import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'

export function useBoot() {
  const init = useAppStore((state) => state.init)
  const hydrated = useAppStore((state) => state.hydrated)

  useEffect(() => {
    init()
  }, [init])

  return hydrated
}
