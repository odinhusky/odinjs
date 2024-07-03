import {PhoneSvg} from "../../../../../Icons/PhoneSvg";
import {KeySvg} from "../../../../../Icons/KeySvg";
import {ConfirmButton} from "../../../../components/ConfirmButton";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import {Input as DesktopInput, Input} from "../../../../../Inputs/Input";
import {MobileInput} from "../../../../../Inputs/MobileInput";
// import {LoginFormData} from "./UserLoginForm/LoginFormData";
import {SecuritySvg} from "../../../../../Icons/SecuritySvg";
import {HidableEyeSvg} from "../../../../../Icons/HidableEyeSvg";
import {PhonePrefix} from "../../../../components/PhonePrefix";
import {useUserForgetPasswordForm} from "../../../../hooks/useUserForgetPasswordForm";
import {IUserForgetPasswordForm} from "../../types";
import {SendSMSCodeButton} from "../../SendSMSCodeButton";
import t from "apps/gambling/src/assets/constant/lang";

export const UserForgetPasswordForm = (props: IUserForgetPasswordForm) => {
  const {isMobile} = useBreakpoint();
  const Input = isMobile ? MobileInput : DesktopInput;

  const {
    // Phone
    phoneInput,
    onChangePhoneInput,

    // Captcha
    captchaInput,
    onChangeCaptchaInput,

    // Password
    isPasswordVisible,
    togglePasswordVisibility,
    passwordInput,
    onChangePasswordInput,

    // SMS Code
    onClickSendSMSCode,
    isValidSMSCode,

    // Form
    onFormConfirm,
  } = useUserForgetPasswordForm({
    confirmToRegister: props.confirmToRegister
  });
  const isDisabled = !(
    phoneInput.data &&
    phoneInput.isValidation &&
    passwordInput.data &&
    passwordInput.isValidation &&
    captchaInput.data &&
    captchaInput.isValidation
 )
  return (
    <section className={"flex flex-col"}>
      <div className={"mb-2"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"number"}
          prefix={
            <>
              <PhoneSvg fill={"#6c7083"} className={"mr-1"} />
              <PhonePrefix />
            </>
          }
          className={'bg-[var(--grayscale-30)]'}
          placeholder={t['phoneNumberHint']}
          value={phoneInput.data}
          validation={phoneInput.isValidation}
          errorMessage={phoneInput.errorMessage}
          onChange={onChangePhoneInput}
        />
      </div>

      <div className={"mb-2"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"text"}
          className={'bg-[var(--grayscale-30)]'}
          prefix={<SecuritySvg className={"mr-1"} />}
          suffix={
            <SendSMSCodeButton
              className={`
                text-lg h-[46px]
                px-5  rounded-r-lg
                bg-[var(--secondary-main)] text-[var(--white)]
                -m-2.5 md:-my-2 md:-mx-2.5 lg:-m-2.5
                shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.25)_inset,0px_4px_4px_0px_rgba(255,255,255,0.25)_inset]
              `}
              valid={isValidSMSCode}
              onClick={onClickSendSMSCode} />
          }
          placeholder={t['enterVerify']}
          value={captchaInput.data}
          validation={captchaInput.isValidation}
          errorMessage={captchaInput.errorMessage}
          onChange={onChangeCaptchaInput}

        />
      </div>

      <div className={"mb-5"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={isPasswordVisible ? 'text' : 'password'}
          className={'bg-[var(--grayscale-30)]'}
          prefix={<KeySvg fill={"#6c7083"} className={"mr-1"} />}
          suffix={(
            <div
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <HidableEyeSvg hide={!isPasswordVisible} />
            </div>
          )}
          placeholder={t['pwdHint']}
          value={passwordInput.data}
          validation={passwordInput.isValidation}
          errorMessage={passwordInput.errorMessage}
          onChange={onChangePasswordInput}
        />
      </div>

      <div className={"w-full"} onClick={() => onFormConfirm()}>
        <ConfirmButton disable={isDisabled}>{t['resetPwd']}</ConfirmButton>
      </div>

    </section>
  )
}
