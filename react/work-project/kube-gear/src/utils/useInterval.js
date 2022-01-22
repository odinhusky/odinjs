import { useEffect } from 'react'

export const useInterval = (callback, delay, depandency = []) => {
  useEffect(() => {
    const intervalFunc = setInterval(()=>{
      callback()
    }, delay)

    return () => clearInterval(intervalFunc)

  }, [callback, delay, ...depandency])
}