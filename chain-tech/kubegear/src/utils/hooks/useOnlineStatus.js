import { useState } from 'react'
import useEventListener from './useEventListener'

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEventListener('online', () => setIsOnline(navigator.onLine))
  useEventListener('offline', () => setIsOnline(navigator.onLine))

  return isOnline
}

export default useOnlineStatus