import t from "apps/gambling/src/assets/constant/lang"
import Form from "../../../../../components/Form"
import Input from "../../../../../components/Input"
import useLoginForm from "../../../../../components/LoginModal/hooks/useLoginForm"
import {useState} from 'react'
import { environment } from "apps/gambling/src/environments/environment"
import Icon from "apps/gambling/src/app/ui/components-bs/Icon"

const LoginForm = () => {
  const { validator, onConfirm, onConfirmFail, onClickForget } = useLoginForm()
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  return (
    <Form
      className="login-form"
      onConfirm={onConfirm}
      onConfirmFail={onConfirmFail}
    >
      <div className="mode-title">{t["login"]}</div>
      <div className="login-logo">
        <img
          alt="logo"
          src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
        />
        <div className="info">
          <span>{environment.platformName}</span>
          <span>ResponsibleCasino</span>
        </div>
      </div>
      <Form.Item name="phone" validate={validator?.phone}>
      <Input
      type="number"
      prefix={
        <div className="phone-prefix">
          <Icon name="phone" />
          <span>phoneCode</span>
        </div>
      }
     
    />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
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
  
    />
      </Form.Item>
      <a className="forget-link" onClick={onClickForget}>
          {t["forgetPwd"]}
          <span>?</span>
        </a>
        <button type="submit" className="form-button">
          {t["login"]}
        </button>
    </Form>
  )
}
export default LoginForm
