import LoginStatusSection from "../3/index"
import "./style.scss"

export default (props: Parameters<typeof LoginStatusSection>[0]) => (
  <LoginStatusSection
    {...props}
    className={`mode-login-modal-4 ${props.className}`}
  />
)
