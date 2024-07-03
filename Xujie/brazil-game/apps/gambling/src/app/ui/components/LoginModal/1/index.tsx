import useComMode from "../hooks/useComMode"
import { ILoginModeProps, IStatusType } from "../types"
import t from "../lang"
import Icon from "../components/Icon"
import Tabs from "../components/Tabs"
import LoginModeContext from "../LoginModeContext"
import ForgetPasswordForm from "./Form/ForgetPwdForm"
import RegisterForm from "./Form/RegisterForm"
import LoginForm from "./Form/LoginForm"
import Button from "./Button"
import "./style.scss"
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
  } = useComMode({
    ...props,
    animates: {
      showLogin: "animate__fadeInLeft",
      showRegister: "animate__fadeInRight",
      showForget: "animate__fadeIn",
      clickAgreement: "animate__fadeOut",
      clickForget: "_"
    },
  })

  return (
    <LoginModeContext.Provider value={contextValue}>
      <div className={`mode-login-modal-1 ${className}`}>
        <div className="mode-container">
          <Icon name="close" onClick={onClose} />
          {contextHolder}
          <div className="mode-wrapper">
            {loginUIStatusType === "forget" ? (
              <ForgetPasswordForm />
            ) : (
              <>
                <Tabs
                  value={loginUIStatusType}
                  onChange={setLoginUIStatusType}
                  options={[
                    { label: t["login"], value: "login" },
                    { label: t["register"], value: "register" },
                  ]}
                  itemRender={Button}
                />
                <div className="overflow-hidden">
                  {loginUIStatusType === "login" && <LoginForm />}

                  {loginUIStatusType === "register" && <RegisterForm />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LoginModeContext.Provider>
  )
}
export default LoginStatusSection
