import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import Captcha from "../../components/Captcha"
import Form from "../../../../components/Form"
import Icon from "../../components/Icon"
import Input from "../../components/Input"
import useRegisterForm from "../../hooks/useRegisterForm"
import t from "../../lang"
import Button from "../Button"
import Checkbox from "../Checkbox"

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
    animate,
  } = useRegisterForm()
  const { isMobile } = useBreakpoint()

  return (
    <Form
      ref={ref}
      className={`register-form ${animate.showRegister}`}
      onConfirm={onConfirm}
      onConfirmFail={onConfirmFail}
    >
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
      <Button type="submit" className="form-button font-bold border-solid border border-[var(--grayscale-60)] shandow-[0px_4px_4px_0px_#00000040]" disabled={!isPolicyChecked}>
        {t["registerNow"]}
      </Button>
      <Checkbox
        className="form-protocol"
        checked={isPolicyChecked}
        onChange={togglePolicyCheck}
      >
        <span className="protocol-text">
          {t["agree"]}{" "}
          <span
            className={`protocol-link ${animate.clickAgreement}`}
            onClick={onClickToPrivacyAgreement}
          >
            {t["policyANDPrivacy"]}
          </span>
        </span>
      </Checkbox>
    </Form>
  )
}
export default RegisterForm
