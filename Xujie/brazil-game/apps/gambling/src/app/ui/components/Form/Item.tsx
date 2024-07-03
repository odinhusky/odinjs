import React, {
  useContext,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
} from "react"

import FormContext, { IValidateFun } from "./FormContext"

export interface colType {
  span?: number
  offset?: number
}

export interface itemProps {
  className?: string
  children?: ReactElement
  name?: string
  validate?: IValidateFun
}

const Item = ({ name, validate, children ,className}: itemProps) => {
  const {
    onValueChange,
    values = {},
    setValues,
    validateRegister,
    errors,
    setErrors,
    focusName,
    setFocusName,
    onKeyDownInput,
    
  } = useContext(FormContext)
  const value = values?.[name || ""] || ""
  useEffect(() => {
    if (!name) return
    setValues?.({ [name]: value })
    validateRegister?.(name, validate)
  }, [])

  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (focusName === name) {
      ref.current?.focus()
    }
  }, [focusName])
  const childEle = children ? (
    React.Children.toArray(children).length > 1 ? (
      children
    ) : (
      React.cloneElement(children, {
        value,
        inputRef: ref,
        error: errors?.[name || ""],
        onFocus: () => {
          name && setFocusName?.(name)
        },
        onKeyDown: (event: any) => onKeyDownInput?.(name || "", event),
        onChange: (value: any) => {
          if (!name) return
          setValues?.({ [name]: value })
          onValueChange?.(name, value)

          const valid = validate?.(value, values)
          setErrors?.({ [name]: valid })
        },
      })
    )
  ) : (
    <></>
  )

  const errorMessage = useMemo(
    () => (name ? errors?.[name]?.message : ""),
    [errors, name]
  )

  return (
    <div className={`form-item ${className}`}>
      {childEle}
      {errorMessage && (
        <div className="overflow-hidden">
          <div className="form-error">{errorMessage}</div>
        </div>
      )}
    </div>
  )
}

export default Item
