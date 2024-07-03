import {PhoneSvg} from "../../../../../Icons/PhoneSvg";
import {KeySvg} from "../../../../../Icons/KeySvg";
import {HidableEyeSvg} from "../../../../../Icons/HidableEyeSvg";
import {PhonePrefix} from "../../../../components/PhonePrefix";
import {useUserLoginForm} from "../../../../hooks/useUserLoginForm";
import {ConfirmButton} from "../../../../components/ConfirmButton";
import {Input} from "../../../../../Inputs/Input";
import {IUserLoginForm} from "../../types";
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

  const isDisabled = !(
    phoneInput.data &&
    phoneInput.isValidation &&
    passwordInput.data &&
    passwordInput.isValidation
  )
  return (
    <div className={"form"}>
      <div className={"flex flex-col"}>
        <Input
            type="number"
            prefix={
              <>
                {/*<PhoneSvg fill="#6c7083" className="mr-2 w-[24px] h-[24px]" />*/}
                <PhoneSvg className="mr-1" />
                <PhonePrefix/>
              </>
            }
            className={`bg-[var(--grayscale-30)]`}
            placeholder={t['phoneNumberHint']}
            value={phoneInput.data}
            validation={phoneInput.isValidation}
            errorMessage={phoneInput.errorMessage}
            onChange={(event: any) => onValidatePhoneInput(event.target.value, setPhoneInput)}
        />

        <Input
            type={isPasswordVisible ? 'text' : 'password'}
            className={`bg-[var(--grayscale-30)]`}
            // prefix={<KeySvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>}
            prefix={<KeySvg className={"mr-1"}/>}
            placeholder={t['pwdHint']}
            value={passwordInput.data}
            validation={passwordInput.isValidation}
            errorMessage={passwordInput.errorMessage}
            onChange={(event: any) => {
              onValidatePasswordInput(event.target.value, setPasswordInput)
            }}
            suffix={(
              <div
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <HidableEyeSvg hide={!isPasswordVisible}/>
              </div>
            )}
        />

        <section className={"flex flex-col"}>
          <button
            className={"text-[var(--white)] text-right mb-3 ml-3 text-[var(--state-info-main)]"}
            onClick={() => {
              props.onSwitchToForgetPassword();
            }}
          >{t['forgetPwdLowerCase']}</button>

          <div className={"w-full"} onClick={() => {
            if (isDisabled) return
            onFormConfirm()
          }}>
            <ConfirmButton disable={isDisabled}>{t['login']}</ConfirmButton>
          </div>
        </section>
      </div>
    </div>
  )
}
