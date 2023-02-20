import useEventListener from './useEventListener'

export const useClickOutside = (ref, callback) => {
  useEventListener(
    'click',
    e => {
      if(ref.current === null || ref.current.contains(e.target)) return
      callback(e)
    }
  )
}

export default useClickOutside