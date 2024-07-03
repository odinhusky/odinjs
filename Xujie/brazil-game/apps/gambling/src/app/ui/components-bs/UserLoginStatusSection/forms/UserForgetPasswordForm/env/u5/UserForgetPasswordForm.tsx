import { PhoneSvg } from "../../../UserLoginForm/env/u5/components/PhoneSvg";
import { ConfirmButton } from "../../../../components/ConfirmButton";
import { Input } from "../../../../../Inputs/Input";
import { HidableEyeSvg } from "../../../../../Icons/HidableEyeSvg";
import { PhonePrefix } from "../../../../components/PhonePrefix";
import { useUserForgetPasswordForm } from "../../../../hooks/useUserForgetPasswordForm";
import { IUserForgetPasswordForm } from "../../types";
import { SendSMSCodeButton } from "../../SendSMSCodeButton";
import t from "apps/gambling/src/assets/constant/lang";

export const UserForgetPasswordForm = (props: IUserForgetPasswordForm) => {

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

  return (
    <section className={""}>
      <div className={"mb-2 md:mb-5 lg:mb-5"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"number"}
          pureContainer={true}
          className={`border-2 bg-[var(--transparente-40)] text-sm py-2 md:py-1.5 lg:py-2.5 lg:text-base border-transparent outline-transparent text-[var(--transparente-60)]`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-60)] mb-3 md:mb-5 lg:mb-5 text-sm md:text-base lg:text-base login-autofill-input"
          prefix={
            <>
              <PhoneSvg className="mr-2" icon="icon_tel" />
              <PhonePrefix className="text-[var(--transparente-80)] font-bold text-sm md:text-base lg:text-base !leading-[20px] md:!leading-[24px] lg:leading-[24px]" />
            </>
          }
          placeholder={t['phoneNumberHint']}
          value={phoneInput.data}
          validation={phoneInput.isValidation}
          errorMessage={phoneInput.errorMessage}
          errorMessageClassName="text-white"
          focusStyle="border-color: var(--grayscale-100);"
          onChange={onChangePhoneInput}
        />
      </div>

      <div className={"mb-2 md:mb-5 lg:mb-5 flex justify-between"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"text"}
          pureContainer={true}
          className={`border-2 bg-[var(--transparente-40)] w-[196px] md:w-[240px] lg:w-[240px] text-sm py-2 md:py-1.5 lg:py-2.5 lg:text-base border-transparent outline-transparent text-[var(--transparente-60)]`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-60)] text-sm md:text-base lg:text-base login-autofill-input"
          prefix={<PhoneSvg className="mr-2" icon="icon_valid" />}
          placeholder={t['verifyCode']}
          value={captchaInput.data}
          validation={captchaInput.isValidation}
          errorMessage={captchaInput.errorMessage}
          errorMessageClassName="text-white"
          focusStyle="border-color: var(--grayscale-100);"
          onChange={onChangeCaptchaInput}

        />
        <SendSMSCodeButton
          className={`
                state-success-button w-20 md:w-[100px] lg:w-[100px] h-10 lg:h-12 flex justify-center items-center text-sm
                rounded-[100px] font-extrabold text-white 
              `}
          valid={isValidSMSCode}
          onClick={onClickSendSMSCode} />
      </div>

      <div className={"mb-3 md:mb-5 lg:mb-8"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={isPasswordVisible ? 'text' : 'password'}
          className={`border-2 bg-[var(--transparente-40)] py-2 md:py-1.5 lg:py-2.5 text-sm lg:text-base border-transparent outline-transparent text-[var(--transparente-60)]`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-60)] text-sm md:text-base lg:text-base login-autofill-input"
          prefix={<PhoneSvg className="mr-2" icon="icon_pwd" />}
          suffix={(
            <div
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <HidableEyeSvg hide={!isPasswordVisible} className="w-5 h-5" />
            </div>
          )}
          placeholder={t['pwdHint']}
          value={passwordInput.data}
          validation={passwordInput.isValidation}
          errorMessage={passwordInput.errorMessage}
          errorMessageClassName="text-white"
          focusStyle="border-color: var(--grayscale-100);"
          onChange={onChangePasswordInput}
        />
      </div>

      <div className={"w-full mb-3 md:mb-8 lg:mb-8"} onClick={() => onFormConfirm()}>
        <ConfirmButton>{t['login']}</ConfirmButton>
      </div>
    </section>
  )
}
