import Form from "../../../../components/Form"
import Button from "../Button"
import Icon from "apps/gambling/src/app/ui/components-bs/Icon"
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
    animate
  } = useForgetPwdForm()

  return (
    <Form
      className={`forget-form ${animate.showForget}`}
      ref={ref}
      onConfirmFail={onConfirmFail}
      onConfirm={onConfirm}
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
          suffix={
            <SMSCodeButton
              render={Button}
              onClick={onClickSendSMSCode}
            />
          }
          placeholder={t["verifyCode"]}
        />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
        <Input.Password
          autoComplete="new-password"
          placeholder={t["pwdHint"]}
        />
      </Form.Item>
      <Button type="submit" className="form-button">
        {t["resetPwd"]}
      </Button>
    </Form>
  )
}
export default ForgetPasswordForm
