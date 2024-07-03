import { PhoneSvg } from "../../../UserLoginForm/env/u5/components/PhoneSvg";
import { Input } from "../../../../../Inputs/Input";
import { IOpenNotificationWithIcon } from "../../../../../../pageTemplate";
import onValidatePhoneInput from "../../../UserLoginForm/OnValidatePhoneInput";
import onValidatePasswordInput from "../../../UserLoginForm/OnValidatePasswordInput";
import { usePageNavigate } from "../../../../../../router/hooks/usePageNavigate";
import { Captcha } from "../../Captcha";
import { CheckableICON } from "../../../../../Icons/CheckableICON";
import { PhonePrefix } from "../../../../components/PhonePrefix";
import { useUserRegisterForm } from "../../../../hooks/useUserRegisterForm";
import { renderByUVersion } from "../../../../../../utils/renderByUVersion";
import { ConfirmButton as CocoConfirmButton } from "../../../../../Buttons/ConfirmButton";
import { ConfirmButton } from "../../../../components/ConfirmButton";
import { notification } from "antd";
import { useEffect } from "react";
import { HidableEyeSvg } from "../../../../../Icons/HidableEyeSvg";
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

	return (
		<section className={"flex flex-col"}>
			{contextHolder}
			<Input
				readonly
				disableReadOnlyAfterRender
				type={"number"}
				className={`border-2 py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm lg:text-base border-transparent outline-transparent`}
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
				onChange={(event: any) => {
					onValidatePhoneInput(event.target.value, setPhoneInput);
				}}
			/>

			<Input
				readonly
				disableReadOnlyAfterRender
				type={"number"}
				className={`border-2 py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm lg:text-base border-transparent outline-transparent`}
				inputClassName="!text-white placeholder:!text-[var(--transparente-40)] mb-3 md:mb-5 lg:mb-5 text-sm lg:text-base login-autofill-input"
				prefix={
					<>
						<PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_tel" />
						<PhonePrefix className="!text-white font-medium text-sm lg:text-base" />
					</>
				}
				placeholder={t['confirmPhone']}
				value={confirmPhoneInput.data}
				validation={confirmPhoneInput.isValidation}
				errorMessage={confirmPhoneInput.errorMessage}
				errorMessageClassName="text-[var(--state-error-main)]"
				focusClassName="border-[var(--grayscale-70)]"
				errorClassName="border-[var(--state-error-main)]"
				onChange={(event: any) => {
					onValidateConfirmPhoneInput(phoneInput.data, event.target.value, setConfirmPhoneInput);
				}}
			/>

			<Input
				readonly
				disableReadOnlyAfterRender
				type={isPasswordVisible ? 'text' : 'password'}
				className={`border-2 py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm border-transparent outline-transparent`}
				inputClassName="!text-white placeholder:!text-[var(--transparente-40)] text-sm lg:text-base login-autofill-input"
				prefix={<PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_pwd" />}
				placeholder={t['pwdHint']}
				value={passwordInput.data}
				validation={passwordInput.isValidation}
				errorMessage={passwordInput.errorMessage}
				errorMessageClassName="text-[var(--state-error-main)]"
				focusClassName="border-[var(--grayscale-70)]"
				errorClassName="border-[var(--state-error-main)]"
				onChange={(event: any) => {
					onValidatePasswordInput(event.target.value, setPasswordInput);
				}}
				suffix={(
					<div
						className="password-toggle shrink-0"
						onClick={togglePasswordVisibility}
					>
						<HidableEyeSvg hide={!isPasswordVisible} className="!w-6 !h-6 cursor-pointer" />
					</div>
				)}
			/>

			<section className="flex">
				<div className="flex-1">
					<Input
						readonly
						disableReadOnlyAfterRender
						type={"text"}
						className={`border-2 py-2 md:py-1.5 lg:py-2.5 !px-2 bg-transparente-gray-30 text-sm border-transparent outline-transparent`}
						inputClassName="!text-white placeholder:!text-[var(--transparente-40)] text-sm lg:text-base login-autofill-input"
						prefix={<PhoneSvg className="mr-2 lg:!w-6 lg:!h-6" icon="icon_valid" />}
						placeholder={t['verifyCode']}
						value={captchaInput.data}
						validation={captchaInput.isValidation}
						errorMessage={captchaInput.errorMessage}
						errorMessageClassName="text-[var(--state-error-main)]"
						focusClassName="border-[var(--grayscale-70)]"
						errorClassName="border-[var(--state-error-main)]"
						onChange={(event: any) => {
							onValidateCaptchaInput(event.target.value, setCaptchaInput);
						}}
					/>
				</div>
				<Captcha 
				    className=" !h-10 lg:!h-12 !w-[90px] md:!w-[100px] lg:!w-[120px] ml-2 md:ml-4  rounded-lg shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]" onClickCaptcha={onClickCaptcha} imgSrc={imgSrc}
					textClassName='font-normal'
					isLoading={isCaptchaLoading} text='Recarregar'/>
			</section>
			<section className={"flex flex-row items-center mb-3 md:mb-5 lg:mb-8"}>
				<button className={"mr-2 relative top-[1px] shrink-0"} onClick={toggleCheck}>
					<CheckableICON isChecked={isChecked} />
				</button>
				<a>
					<span className={"text-white mr-1 text-sm"} onClick={toggleCheck}>{t['agree']}</span>
					<span className={"text-[var(--text-1)] underline break-all text-sm"} onClick={() => {
						onClickToPrivacyAgreement();
					}}>{t['policyANDPrivacy']}</span>
				</a>
			</section>
			<section className={"flex flex-col"}>
				<div onClick={() => isChecked && onFormConfirm()}>
					<ConfirmButton
						disable={!isChecked}
					>{t['login']}</ConfirmButton>
				</div>
			</section>
		</section>
	)
}
