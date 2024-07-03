import {PhoneSvg} from "../../../../../Icons/PhoneSvg";
import {KeySvg} from "../../../../../Icons/KeySvg";
import {ConfirmButton} from "../../../../../Buttons/ConfirmButton";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import {Input} from "../../../../../Inputs/Input";
// import {MobileInput} from "../../../../components/Inputs/MobileInput";
import onValidatePasswordInput from "../../../UserLoginForm/OnValidatePasswordInput";
import onValidatePhoneInput from "../../../UserLoginForm/OnValidatePhoneInput";
import {SecuritySvg} from "../../../../../Icons/SecuritySvg";
import {usePageNavigate} from "../../../../../../router/hooks/usePageNavigate";
import {Captcha} from "../../Captcha";
import {HidableEyeSvg} from "../../../../../Icons/HidableEyeSvg";
import {CheckableICON} from "../../../../../Icons/CheckableICON";
import {PhonePrefix} from "../../../../components/PhonePrefix";
import {useUserRegisterForm} from "../../../../hooks/useUserRegisterForm";
import {IUserRegisterForm} from "../u2/UserRegisterForm";
import {notification} from "antd";
import {useEffect} from "react";
import t from "apps/gambling/src/assets/constant/lang";

export const UserRegisterForm = (props: IUserRegisterForm) => {
    const {isMobile} = useBreakpoint();
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

    return (
        <section className={"flex flex-col"}>
            {contextHolder}
            <Input
                readonly
                disableReadOnlyAfterRender
                type={"number"}
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

            <Input
                readonly
                disableReadOnlyAfterRender
                type={"text"}
                className={"rounded-br-[0px] rounded-tr-[0px] border-r-[0px]"}
                // prefix={<SecuritySvg fill={"#6c7083"} className={"mr-2 w-[24px] h-[24px]"}/>}
                prefix={<SecuritySvg className={"mr-1"}/>}
                outerSuffix={<Captcha className="rounded-br-[8px] rounded-tr-[8px] !h-[50px]" 
                                      reloadBtnClassName="px-6 box-border !bg-gradient-to-b from-[var(--secondary-main-from)] to-[var(--secondary-main-to)]"
                                      iconClassName="w-5 h-5"
                                      onClickCaptcha={onClickCaptcha}
                                      imgSrc={imgSrc} isLoading={isCaptchaLoading}/>}
                placeholder={isMobile ? t['verifyGraph'] : t['verifyCode']}
                value={captchaInput.data}
                validation={captchaInput.isValidation}
                errorMessage={captchaInput.errorMessage}
                onChange={(event: any) => {
                    onValidateCaptchaInput(event.target.value, setCaptchaInput);
                }}
            />

            <section className={"flex flex-col mb-4"}>
                <ConfirmButton
                    className="!w-full my-2 "
                    disable={!isChecked}
                    onClick={() => isChecked && onFormConfirm()}
                >{t['registerNow']}</ConfirmButton>
            </section>

            <section className={"flex flex-row items-center mb-4"}>
                <button className={"mr-2 relative top-[1px] shrink-0"} onClick={toggleCheck}>
                    <CheckableICON isChecked={isChecked}/>
                </button>
                <a
                    className={"text-white font-thin text-md"}
                    // style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '300px' }}
                >
                    <span className={"text-[var(--white)] font-medium mr-1 my-2 text-sm"} onClick={toggleCheck}>{t['agree']}</span>
                    <span className={"text-[#00C6FF] font-medium underline break-all text-sm"} onClick={() => {
                        onClickToPrivacyAgreement();
                    }}>{t['policyANDPrivacy']}</span>
                </a>
            </section>
        </section>
    )
}
