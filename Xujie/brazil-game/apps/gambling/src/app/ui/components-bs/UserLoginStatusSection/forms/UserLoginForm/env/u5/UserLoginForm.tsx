import { PhoneSvg } from "../../env/u5/components/PhoneSvg";
import { PhonePrefix } from "../../../../components/PhonePrefix";
import { HidableEyeSvg } from "../../../../../Icons/HidableEyeSvg";
import { useUserLoginForm } from "../../../../hooks/useUserLoginForm";
import { ConfirmButton } from "../../../../components/ConfirmButton";
import { Input } from "../../../../../Inputs/Input";
import { IUserLoginForm } from "../../types";
import onValidatePhoneInput from "../../OnValidatePhoneInput";
import onValidatePasswordInput from "../../OnValidatePasswordInput";
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
              <PhoneSvg className="mr-2" icon="icon_tel" />
              <PhonePrefix className="text-[var(--transparente-80)] font-bold text-sm md:text-base lg:text-base !leading-[20px] md:!leading-[24px] lg:leading-[24px]" />
            </>
          }
          className={`border-2  py-2 md:py-1.5 lg:py-2.5 bg-[var(--transparente-40)] text-sm lg:text-base border-transparent text-[var(--transparente-60)]`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-60)] mb-3 md:mb-5 lg:mb-5 text-sm md:text-base lg:text-base login-autofill-input"
          placeholder={t['phoneNumberHint']}
          value={phoneInput.data}
          validation={phoneInput.isValidation}
          errorMessage={phoneInput.errorMessage}
          errorMessageClassName="text-white"
          focusStyle="border-color: var(--grayscale-100);"
         
          onChange={(event: any) => onValidatePhoneInput(event.target.value, setPhoneInput)}
        />

        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          className={`border-2  py-2 md:py-1.5 lg:py-2.5 bg-[var(--transparente-40)] text-sm border-transparent text-[var(--transparente-60)]`}
          inputClassName="!text-white placeholder:!text-[var(--transparente-60)] text-sm md:text-base lg:text-base login-autofill-input"
          prefix={
            <PhoneSvg className="mr-2" icon="icon_pwd" />
          }
          placeholder={t['pwdHint']}
          value={passwordInput.data}
          validation={passwordInput.isValidation}
          errorMessage={passwordInput.errorMessage}
          errorMessageClassName="text-white"
          focusStyle="border-color: var(--grayscale-100);"
         
          onChange={(event: any) => {
            onValidatePasswordInput(event.target.value, setPasswordInput)
          }}
          suffix={(
            <div
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <HidableEyeSvg hide={!isPasswordVisible} className="w-[20px] lg:w-5 h-5 lg:h-5"/>
            </div>
          )}
        />

        <section className={"flex flex-col"}>
          <button
            className={"text-right mb-3 md:mb-5 lg:mb-8 text-base text-white font-normal underline"}
            onClick={() => {
              props.onSwitchToForgetPassword();
            }}
          >{t['forgetPwdLowerCase']}</button>

          <div className={"w-full"} onClick={() => onFormConfirm()}>
            <ConfirmButton>{t['login']}</ConfirmButton>
          </div>
        </section>
      </div>
    </div>
  )
}
