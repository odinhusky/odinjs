import { environment } from "apps/gambling/src/environments/environment"
import { useBreakpoint } from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint"
import useComMode from "../hooks/useComMode"
import SMSCodeButton from "../components/SMSCodeButton"
import {
  IForgetPwdFormValues,
  ILoginFormValues,
  ILoginModeProps,
  IRegisterFormValues,
} from "../types"
import Input from "../components/Input"
import t from "../lang"
import Captcha from "../components/Captcha"
import Icon from "../components/Icon"
import ForgetPasswordForm from "./Form/ForgetPwdForm"
import LoginForm from "./Form/LoginForm"
import RegisterForm from "./Form/RegisterForm"
import LoginModeContext from "../LoginModeContext"

const LoginStatusSection = ({
  onClose,
  className,
  ...props
}: ILoginModeProps) => {
  const {
    loginUIStatusType,
    setLoginUIStatusType,
    contextHolder,
    contextValue,
  } = useComMode(props)

  return (
    <LoginModeContext.Provider value={contextValue}>
      <div className={className || `mode-login-modal-3`}>
      <div className="mode-container">
        <Icon
          name="arrow_left"
          onClick={() => setLoginUIStatusType("forget")}
        />
        <Icon name="close" onClick={onClose} />
        {contextHolder}
        <div className="mode-wrapper">
          {loginUIStatusType === "forget" ? <ForgetPasswordForm/> : (
            <>
              {loginUIStatusType === "login" &&  <LoginForm/>}
              {loginUIStatusType === "register" && <RegisterForm/>}
            </>
          )}
        </div>
        {loginUIStatusType !== "forget" && (
          <div className="mode-status-type-link">
            {loginUIStatusType === "register" ? (
              <>
                {t["HaveAccount"]}?{" "}
                <span onClick={() => setLoginUIStatusType("login")}>
                  {t["toLogin"]}
                </span>
              </>
            ) : (
              <>
                {t["noAccount"]}?{" "}
                <span onClick={() => setLoginUIStatusType("register")}>
                  {t["toRegister"]}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </LoginModeContext.Provider>
  )
}
export default LoginStatusSection
