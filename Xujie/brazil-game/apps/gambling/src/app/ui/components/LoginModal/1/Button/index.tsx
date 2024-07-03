import { ButtonHTMLAttributes, ReactNode } from "react"
import './index.scss'
const Button = ({
  children,
  type = 'button',
  ...props
}: {
  children?: ReactNode
  type?: 'link' | ButtonHTMLAttributes<HTMLButtonElement>['type']
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>,'type'>) => {
  return (
    <button
      {...props}
      type={type === 'link' ? "button" : type}
      className={`mode-button-1 ${type === 'link' ? 'link' : ''} ${props.className}`}
    >
      <span>{children}</span>
      <div className="ripple-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  )
}
export default Button
