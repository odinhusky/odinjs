import { InputHTMLAttributes, LegacyRef, useState } from "react"

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "prefix"> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  outerSuffix?: React.ReactNode
  type?: string
  placeholder?: string
  error?: Error | undefined
  value?: string
  onChange?: (value: string) => void
  inputRef?: LegacyRef<HTMLInputElement>
  closeIcon?: React.ReactNode
}

const Input = ({
  prefix,
  suffix,
  outerSuffix,
  type,
  placeholder,
  error,
  value,
  onChange,
  inputRef,
  closeIcon,
  ...props
}: InputProps) => {
  const [focus, setFocus] = useState(false)
  return (
    <div className="mode-input">
      <div className="input-container">
        <div className={`input-box ${error ? "error" : focus ? "focus" : ""}`}>
          {prefix && <div className="input-prefix">{prefix}</div>}
          <input
            {...props}
            ref={inputRef}
            onWheel={(e) => e.currentTarget.blur()}
            type={type || "text"}
            placeholder={placeholder}
            value={value}
            onFocus={(event) => {
              props.onFocus?.(event)
              setFocus(true)
            }}
            onBlur={(event) => {
              props.onBlur?.(event)
              setFocus(false)
            }}
            onChange={(event: any) => {
              onChange?.(event.target.value)
            }}
          />
          {closeIcon && value && (
            <button className="input-close" onClick={() => onChange?.("")}>
              {closeIcon}
            </button>
          )}
          {suffix && <div className="input-suffix">{suffix}</div>}
        </div>
        {outerSuffix}
      </div>
    </div>
  )
}

export default Input
