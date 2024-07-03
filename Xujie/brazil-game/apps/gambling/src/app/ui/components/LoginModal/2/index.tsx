import LoginStatusSection from "../1/index"
import "./style.scss"

export default (props: Parameters<typeof LoginStatusSection>[0]) => (
  <LoginStatusSection
    {...props}
    className={`mode-login-modal-2 ${props.className}`}
  />
)
