import { PhoneSvg } from "../../../UserLoginForm/env/u5/components/PhoneSvg";
import { ConfirmButton } from "../../../../components/ConfirmButton";
import { Input } from "../../../../../Inputs/Input";
import { HidableEyeSvg } from "../../../../../Icons/HidableEyeSvg";
import { PhonePrefix } from "../../../../components/PhonePrefix";
import { useUserForgetPasswordForm } from "../../../../hooks/useUserForgetPasswordForm";
import { IUserForgetPasswordForm } from "../../types";
import { SendSMSCodeButton } from "../../SendSMSCodeButton";
import cx from "../../../../../../utils/cx";
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
      <div className={"mb-3 md:mb-4"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"number"}
          pureContainer={true}
          className={`border-2 bg-transparente-gray-30 text-sm py-1.5 md:py-1 lg:py-2.5 !px-2 lg:text-base border-transparent`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-40)] mb-3 md:mb-5 lg:mb-5 text-sm lg:text-base login-autofill-input"
          prefix={
            <>
              <PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_tel" />
              <PhonePrefix className="!text-white font-medium text-sm lg:text-base" />
            </>
          }
          placeholder={t['phoneNumberHint']}
          value={phoneInput.data}
          validation={phoneInput.isValidation}
          errorMessage={phoneInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          focusClassName="border-[var(--grayscale-70)]"
          errorClassName="border-[var(--state-error-main)]"
          onChange={onChangePhoneInput}
        />
      </div>

      <div className={"mb-3 md:mb-4 flex justify-between"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={"text"}
          pureContainer={true}
          inputOuterClassName="w-full"
          className={`border-2 bg-transparente-gray-30 w-full text-sm py-1.5 md:py-1 lg:py-2.5 !px-2 lg:text-base border-transparent`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-40)] text-sm lg:text-base login-autofill-input"
          prefix={
            <>
              <PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_valid" />
              <PhonePrefix className="!text-white font-medium text-sm lg:text-base" />
            </>
          }
          placeholder={t['verifyCode']}
          value={captchaInput.data}
          validation={captchaInput.isValidation}
          errorMessage={captchaInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          focusClassName="border-[var(--grayscale-70)]"
          errorClassName="border-[var(--state-error-main)]"
          onChange={onChangeCaptchaInput}

        />
        <SendSMSCodeButton
          className={cx("w-[51px] md:w-20 lg:w-[66px] h-10 lg:h-12 text-sm lg:text-base ml-1 md:ml-2 text-white rounded-lg shadow-button shrink-0")}
          disabledClassName="bg-transparente-gray-30 shadow-none"
          successClassName="bg-linear-2-main linear-2-button"
          valid={isValidSMSCode}
          count={120}
          onClick={onClickSendSMSCode} />
      </div>

      <div className={"mb-3 md:mb-5 lg:mb-8"}>
        <Input
          readonly
          disableReadOnlyAfterRender
          type={isPasswordVisible ? 'text' : 'password'}
          className={`border-2 bg-transparente-gray-30 py-2 md:py-2 lg:py-2.5 !px-2 text-sm lg:text-base border-transparent`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-40)] text-sm lg:text-base login-autofill-input"
          prefix={<PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_pwd" />}
          suffix={(
            <div
              className="password-toggle shrink-0"
              onClick={togglePasswordVisibility}
            >
              <HidableEyeSvg hide={!isPasswordVisible} className="!w-6 !h-6 cursor-pointer" />
            </div>
          )}
          placeholder={t['pwdHint']}
          value={passwordInput.data}
          validation={passwordInput.isValidation}
          errorMessage={passwordInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          focusClassName="border-[var(--grayscale-70)]"
          errorClassName="border-[var(--state-error-main)]"
          onChange={onChangePasswordInput}
        />
      </div>

      <div className={"w-full mb-3 md:mb-8 lg:mb-8"} onClick={() => onFormConfirm()}>
        <ConfirmButton>{t['login']}</ConfirmButton>
      </div>
    </section>
  )
}
