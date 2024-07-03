import { environment } from "apps/gambling/src/environments/environment"
import Form from "../../../../components/Form"
import Input from "../../components/Input"
import t from "../../lang"
import useLoginForm from "../../hooks/useLoginForm"

const LoginForm = () => {
  const { validator, onConfirm, onConfirmFail, onClickForget } = useLoginForm()
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
          <span>{t["ResponsibleCasino"]}</span>
        </div>
      </div>
      <Form.Item name="phone" validate={validator?.phone}>
        <Input.Phone placeholder={t["phoneNumberHint"]} />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
        <Input.Password placeholder={t["pwdHint"]} />
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
