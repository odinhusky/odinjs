import Form from "../../../../components/Form"
import Icon from "../../components/Icon"
import useForgetPwdForm from "../../hooks/useForgetPwdForm"
import t from "../../lang"
import Input from "../../components/Input"
import SMSCodeButton from "../../components/SMSCodeButton"

const ForgetPasswordForm = () => {
  const {
    ref,
    onClickSendSMSCode,
    validator,
    onConfirm,
    onConfirmFail,
    onClickLogin,
  } = useForgetPwdForm()

  return (
    <Form
      ref={ref}
      className="forget-form"
      onConfirm={onConfirm}
      onConfirmFail={onConfirmFail}
    >
      <Icon name="arrow_left" onClick={onClickLogin} />
      <div className="mode-title">{t["forgetPwd"]}</div>
      <Form.Item name="phone" validate={validator?.phone}>
        <Input.Phone
          autoComplete="new-password"
          placeholder={t["phoneNumberHint"]}
        />
      </Form.Item>
      <Form.Item name="verifyCode" validate={validator?.verifyCode}>
        <Input
          type={"number"}
          prefix={<Icon name="secure" />}
          suffix={<SMSCodeButton onClick={onClickSendSMSCode} />}
          placeholder={t["verifyCode"]}
        />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
        <Input.Password
          autoComplete="new-password"
          placeholder={t["pwdHint"]}
        />
      </Form.Item>
      <button type="submit" className="form-button">
        {t["resetPwd"]}
      </button>
    </Form>
  )
}
export default ForgetPasswordForm
