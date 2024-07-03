import { environment } from "apps/gambling/src/environments/environment"
import Form from "../../../../components/Form"
import Input from "../../components/Input"
import Button from "../Button"
import t from "../../lang"
import useLoginForm from "../../hooks/useLoginForm"

const LoginForm = () => {
  const { validator, onConfirm, onConfirmFail, onClickForget, animate } = useLoginForm()
  return (
    <Form
      className={`login-form ${animate.showLogin}`}
      onConfirm={onConfirm}
      onConfirmFail={onConfirmFail}
    >
      <div className="login-logo">
        <img
          alt="logo"
          // src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
          src={`assets/${environment.uVersion}/${environment.mvVersion}/icon_logo.png`}
        />
        <div className="name">{environment.platformName}</div>
      </div>
      <Form.Item name="phone" validate={validator?.phone}>
        <Input.Phone placeholder={t["phoneNumberHint"]} />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
        <Input.Password placeholder={t["pwdHint"]} />
      </Form.Item>
      <Button type="link" className={`forget-link ${animate.clickForget}`} onClick={onClickForget}>
        {t["forgetPwd"]}
        <span>?</span>
      </Button>
      <Button type="submit" className="form-button font-bold border-solid border border-[var(--grayscale-60)] shandow-[0px_4px_4px_0px_#00000040]">
        {t["login"]}
      </Button>
    </Form>
  )
}
export default LoginForm
