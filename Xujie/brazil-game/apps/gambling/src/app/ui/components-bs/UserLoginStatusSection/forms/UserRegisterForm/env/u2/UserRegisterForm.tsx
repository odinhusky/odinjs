import {PhoneSvg} from "../../../../../Icons/PhoneSvg";
import {KeySvg} from "../../../../../Icons/KeySvg";
import {Input} from "../../../../../Inputs/Input";
import {IOpenNotificationWithIcon} from "../../../../../../pageTemplate";
import onValidatePasswordInput from "../../../UserLoginForm/OnValidatePasswordInput";
import onValidatePhoneInput from "../../../UserLoginForm/OnValidatePhoneInput";
import {SecuritySvg} from "../../../../../Icons/SecuritySvg";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {Captcha} from "../../Captcha";
import {HidableEyeSvg} from "../../../../../Icons/HidableEyeSvg";
import {CheckableICON} from "../../../../../Icons/CheckableICON";
import {PhonePrefix} from "../../../../components/PhonePrefix";
import {useUserRegisterForm} from "../../../../hooks/useUserRegisterForm";
import {ConfirmButton} from "../../../../components/ConfirmButton";
import {notification} from "antd";
import {useEffect} from "react";
import t from "apps/gambling/src/assets/constant/lang";

export type IUserRegisterForm = {
    confirmToRegister: () => void;
    openNotificationWithIcon: (props: IOpenNotificationWithIcon) => void;
}

export const UserRegisterForm = (props: IUserRegisterForm) => {
    const [api, contextHolder] = notification.useNotification();
    const {
        onClickToPrivacyAgreement
    } = usePageNavigate();

    const {
        phoneInput,
        setPhoneInput,
        confirmPhoneInput,
        setConfirmPhoneInput,
        onValidateConfirmPhoneInput,
        isPasswordVisible,
        passwordInput,
        setPasswordInput,
        togglePasswordVisibility,
        onClickCaptcha,
        imgSrc,
        isCaptchaLoading,
        captchaInput,
        setCaptchaInput,
        onValidateCaptchaInput,
        isChecked,
        onFormConfirm,
        toggleCheck,
        formConfirmState
    } = useUserRegisterForm({
        confirmToRegister: props.confirmToRegister,
    });

    // 增加提交後驗證失效彈窗
    useEffect(() => {
        if (formConfirmState) {
            if (!formConfirmState.isValidate) {
                // Validate Fail
                // show error
                api.error({
                    message: formConfirmState.errorMessage
                })
            }
        }
    }, [formConfirmState])
    const isDisabled = !(
        isChecked &&
        phoneInput.data &&
        phoneInput.isValidation &&
        confirmPhoneInput.data &&
        confirmPhoneInput.isValidation &&
        passwordInput.data &&
        passwordInput.isValidation &&
        captchaInput.data &&
        captchaInput.isValidation
    )
    return (
        <section className={"flex flex-col"}>
            {contextHolder}
            <Input
                readonly
                disableReadOnlyAfterRender
                type={"number"}
                className={'bg-[var(--grayscale-30)]'}
                prefix={
                    <>
                        {/*<PhoneSvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>*/}
                        <PhoneSvg className={"mr-1"}/>
                        <PhonePrefix/>
                    </>
                }
                placeholder={t['phoneNumberHint']}
                value={phoneInput.data}
                validation={phoneInput.isValidation}
                errorMessage={phoneInput.errorMessage}
                onChange={(event: any) => {
                    onValidatePhoneInput(event.target.value, setPhoneInput);
                }}
            />

            <Input
                readonly
                disableReadOnlyAfterRender
                type={"number"}
                className={'bg-[var(--grayscale-30)]'}
                prefix={
                    <>
                        {/*<PhoneSvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>*/}
                        <PhoneSvg className={"mr-1"}/>
                        <PhonePrefix/>
                    </>
                }
                placeholder={t['confirmPhone']}
                value={confirmPhoneInput.data}
                validation={confirmPhoneInput.isValidation}
                errorMessage={confirmPhoneInput.errorMessage}
                onChange={(event: any) => {
                    onValidateConfirmPhoneInput(phoneInput.data, event.target.value, setConfirmPhoneInput);
                }}
            />

            <Input
                readonly
                disableReadOnlyAfterRender
                type={isPasswordVisible ? 'text' : 'password'}
                className={'bg-[var(--grayscale-30)]'}
                // prefix={<KeySvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>}
                prefix={<KeySvg className={"mr-1"}/>}
                placeholder={t['pwdHint']}
                value={passwordInput.data}
                validation={passwordInput.isValidation}
                errorMessage={passwordInput.errorMessage}
                onChange={(event: any) => {
                    onValidatePasswordInput(event.target.value, setPasswordInput);
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

            <section className="flex">
                <div className="flex-1">
                    <Input
                        readonly
                        disableReadOnlyAfterRender
                        type={"text"}
                        className={"mr-1 bg-[var(--grayscale-30)]"}
                        // prefix={<SecuritySvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>}
                        prefix={<SecuritySvg className={"mr-1"}/>}
                        placeholder={t['verifyCode']}
                        value={captchaInput.data}
                        validation={captchaInput.isValidation}
                        errorMessage={captchaInput.errorMessage}
                        onChange={(event: any) => {
                            onValidateCaptchaInput(event.target.value, setCaptchaInput);
                        }}
                    />
                </div>
                <Captcha className="rounded-lg !h-[46px] bg-[var(--secondary-main)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]" onClickCaptcha={onClickCaptcha} imgSrc={imgSrc}
                         isLoading={isCaptchaLoading}/>
            </section>
            <section className={"flex flex-row items-center mb-5 lg:mb-10 md:mt-1"}>
                <button className={"mr-2 relative top-[1px] shrink-0"} onClick={toggleCheck}>
                    <CheckableICON isChecked={isChecked}/>
                </button>
                <a className={"text-white font-thin text-md"}>
                    <span className={"text-[var(--text-tertiary)] font-medium mr-1 my-2 text-sm"} onClick={toggleCheck}>{t['agree']}</span>
                    <span className={"text-[var(--state-info-main)] font-medium break-all text-sm"} onClick={() => {
                        onClickToPrivacyAgreement();
                    }}>{t['policyANDPrivacy']}</span>
                </a>
            </section>
            <section className={"flex flex-col mb-4"}>
                <div
                    onClick={() => !isDisabled && onFormConfirm()}
                >
                    <ConfirmButton
                        disable={isDisabled}
                    >{t['registerNow']}</ConfirmButton>
                </div>
            </section>
        </section>
    )
}
