import { useEffect } from 'react'
import { useLocalStorage } from './useStorage'
import useMediaQuery from './useMediaQuery'

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useLocalStorage('useDarkMode')
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const enabled = darkMode ?? preferDarkMode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', enabled)

    return [enabled, setDarkMode]
  })
}