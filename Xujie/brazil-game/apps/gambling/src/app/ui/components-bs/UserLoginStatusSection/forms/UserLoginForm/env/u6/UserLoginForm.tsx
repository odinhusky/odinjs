import { PhoneSvg } from "../u5/components/PhoneSvg";
import { PhonePrefix } from "../../../../components/PhonePrefix";
import { HidableEyeSvg } from "../../../../../Icons/HidableEyeSvg";
import { useUserLoginForm } from "../../../../hooks/useUserLoginForm";
import { ConfirmButton } from "../../../../components/ConfirmButton";
import { Input } from "../../../../../Inputs/Input";
import { IUserLoginForm } from "../../types";
import { onValidatePhoneInput } from "../../OnValidatePhoneInput";
import { onValidatePasswordInput } from "../../OnValidatePasswordInput";
import t from "apps/gambling/src/assets/constant/lang";

export const UserLoginForm = (props: IUserLoginForm) => {
  const {
    phoneInput,
    setPhoneInput,
    isPasswordVisible,
    passwordInput,
    setPasswordInput,
    togglePasswordVisibility,
    onFormConfirm,
  } = useUserLoginForm({
    confirmToLogin: props.confirmToLogin
  });


  return (
    <div className={"form"}>
      <div className={"flex flex-col"}>

        <Input
          type="number"
          prefix={
            <>
              <PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_tel" />
              <PhonePrefix className="!text-white font-medium text-sm lg:text-base" />
            </>
          }
          className={`border-2  py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm lg:text-base border-transparent u6-input`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-40)] mb-3 md:mb-5 lg:mb-5 text-sm lg:text-base login-autofill-input"
          placeholder={t['phoneNumberHint']}
          value={phoneInput.data}
          validation={phoneInput.isValidation}
          errorMessage={phoneInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          focusClassName="border-[var(--grayscale-70)]"
          errorClassName="border-[var(--state-error-main)]"
          onChange={(event: any) => onValidatePhoneInput(event.target.value, setPhoneInput)}
        />

        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          className={`border-2 py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm border-transparent`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-40)] text-sm lg:text-base login-autofill-input"
          prefix={
            <PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_pwd" />
          }
          placeholder={t['pwdHint']}
          value={passwordInput.data}
          validation={passwordInput.isValidation}
          errorMessage={passwordInput.errorMessage}
          errorMessageClassName="text-[var(--state-error-main)]"
          focusClassName="border-[var(--grayscale-70)]"
          errorClassName="border-[var(--state-error-main)]"
          onChange={(event: any) => {
            onValidatePasswordInput(event.target.value, setPasswordInput)
          }}
          suffix={(
            <div
              className="password-toggle shrink-0"
              onClick={togglePasswordVisibility}
            >
              <HidableEyeSvg hide={!isPasswordVisible} className="!w-6 !h-6 cursor-pointer"/>
            </div>
          )}
        />

        <section className={"flex flex-col"}>
          <button
            className={"text-center mb-3 md:mb-4 lg:mb-4 text-base font-normal underline text-[var(--text-1)]"}
            onClick={() => {
              props.onSwitchToForgetPassword();
            }}
          >{t['forgetPwd']}?</button>

          <div className={"w-full"} onClick={() => onFormConfirm()}>
            <ConfirmButton>{t['login']}</ConfirmButton>
          </div>
        </section>
      </div>
    </div>
  )
}
