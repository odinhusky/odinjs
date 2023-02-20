import { useState, useCallback } from "react"

export const useStateWithValidation = (validationFn, initValue) => {
  const [state, setState] = useState(initValue)
  const [isValid, setIsValid] = useState(() => validationFn(state))

  const onChange = useCallback(
    nextState => {
      const value = 
        typeof nextState === 'function' ? nextState(state) : nextState

        setState(value)
        setIsValid(validationFn(value))
    },
    [validationFn]
  )

  return [state, onChange, isValid]

};

export default useStateWithValidation;