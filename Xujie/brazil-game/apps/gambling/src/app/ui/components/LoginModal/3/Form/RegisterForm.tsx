import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import Captcha from "../../components/Captcha"
import Form from "../../../../components/Form"
import Icon from "../../components/Icon"
import Input from "../../components/Input"
import useRegisterForm from "../../hooks/useRegisterForm"
import t from "../../lang"

const RegisterForm = () => {
  const {
    ref,
    refreshCaptcha,
    imgSrc,
    isCaptchaLoading,
    // Policy
    isPolicyChecked,
    togglePolicyCheck,
    onClickToPrivacyAgreement,
    validator,
    onConfirm,
    onConfirmFail,
  } = useRegisterForm()
  const { isMobile } = useBreakpoint()

  return (
    <Form
      ref={ref}
      className="register-form"
      onConfirm={onConfirm}
      onConfirmFail={onConfirmFail}
    >
      <div className="mode-title">{t["register"]}</div>
      <Form.Item name="phone" validate={validator?.phone}>
        <Input.Phone
          autoComplete="new-password"
          placeholder={t["phoneNumberHint"]}
        />
      </Form.Item>
      <Form.Item name="confirmPhone" validate={validator?.confirmPhone}>
        <Input.Phone
          autoComplete="new-password"
          placeholder={t["confirmPhone"]}
        />
      </Form.Item>
      <Form.Item name="password" validate={validator?.password}>
        <Input.Password
          autoComplete="new-password"
          placeholder={t["pwdHint"]}
        />
      </Form.Item>

      <Form.Item name="captcha" validate={validator?.captcha}>
        <Input
          type="number"
          prefix={<Icon name="secure" />}
          outerSuffix={
            <Captcha
              isLoading={isCaptchaLoading}
              imgSrc={imgSrc}
              reloadText="Reload"
              onClick={refreshCaptcha}
            />
          }
          placeholder={isMobile ? t["verifyGraph"] : t["verifyCode"]}
        />
      </Form.Item>

      <button type="submit" className="form-button" disabled={!isPolicyChecked}>
        {t["registerNow"]}
      </button>
      <div className="form-protocol">
        <Icon
          name={isPolicyChecked ? "checkbox" : "uncheckbox"}
          className="cursor-pointer"
          onClick={togglePolicyCheck}
        />
        <span className="protocol-text">
          {t["agree"]}{" "}
          <span
            className={`protocol-link`}
            onClick={onClickToPrivacyAgreement}
          >
            {t["policyANDPrivacy"]}
          </span>
        </span>
      </div>
    </Form>
  )
}
export default RegisterForm
