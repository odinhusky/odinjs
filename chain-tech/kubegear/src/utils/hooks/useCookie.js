import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'

export const useCookie = (keyName, defaultValue) => {
  const [value, setValue] = useState(() => {
    const cookie = Cookies.get(keyName);
    if(cookie) return cookie
    Cookies.set(keyName, defaultValue)

    return defaultValue
  })

  const updateCookie = useCallback(
    (newValue, options) => {
      Cookies.set(keyName, newValue, options)
      setValue(newValue)
    },
    [keyName]
  )

  const deleteCookie = useCallback(() => {
    Cookies.remove(keyName)
    setValue(null)
  })

  return [value, updateCookie, deleteCookie]
}

export default useCookie