import {
  InputHTMLAttributes,
  LegacyRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import Icon from "./Icon"
import t from "../lang"
import Captcha from "./Captcha"
import SMSCodeButton from "./SMSCodeButton"

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
          {suffix && <div className="input-suffix">{suffix}</div>}
        </div>
        {outerSuffix}
      </div>
    </div>
  )
}
Input.Phone = (props: InputProps) => {
  return (
    <Input
      type="number"
      prefix={
        <div className="phone-prefix">
          <Icon name="phone" />
          <span>{t["phoneCode"]}</span>
        </div>
      }
      {...props}
    />
  )
}
Input.Password = (props: InputProps) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  return (
    <Input
      type={isPasswordVisible ? "text" : "password"}
      prefix={<Icon name="key" />}
      suffix={
        <Icon
          name={isPasswordVisible ? "eye_open" : "eye_close"}
          className="cursor-pointer"
          onClick={() => setPasswordVisible((pre) => !pre)}
        />
      }
      {...props}
    />
  )
}


export default Input
