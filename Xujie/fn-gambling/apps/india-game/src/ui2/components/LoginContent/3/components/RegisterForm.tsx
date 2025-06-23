import Form from '@mode2/components/Form';
import { notification } from 'antd';
import Input from '@mode2/components/Input';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import { RegisterPayload } from '@mode2/external/api/endpoint/user/PostRegisterEndpoint';
import useRegisterForm from '@/hooks/modals/useRegisterForm';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import {
  handleLoginActionClick,
  handlePrivacyPolicyLinkActionClick,
} from '@mode2/action/actionTypes';
import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@libs/mode2/zustand/loginStore';
import { cx, useDeepEffect } from '@libs/commonUtils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import OTPCountDown from '@components/OTPCountDown';
import { OTPCountDownKeys } from '@libs/mode2/zustand/components/OTPCountDownStore';
import QuestionTooltip from '@components/QuestionTooltip';
import sdkUtils from '@mode2/utils/sdk';

const RegisterForm = (props: ILoginModalProps) => {
  const {
    form,
    register,
    validator,
    captcha,
    // isSubmitDisable,
    policyCheck,
    setPolicyCheck,
    togglePolicyCheck,
  } = useRegisterForm(props);
  const { t } = useTranslation();
  const { handleHeaderClick } = useHeaderAction();

  const referralCode = useIsShowLoginModalStore((state) => state.referralCode);

  useDeepEffect(() => {
    form.setFieldsValue({
      referralCode: sdkUtils.getAppReferralCode() || referralCode,
    });
  }, [referralCode]);

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  return (
    <Form<RegisterPayload & Record<string, unknown>>
      form={form}
      className="register-form"
      onFinish={(values) =>
        register({ ...values, captchaId: captcha.captchaId || '' })
      }
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        notification.error({
          message,
        });
      }}
      initialValues={{
        referralCode,
      }}
    >
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            validator: (_, value) => validator.phone(value),
          },
        ]}
      >
        <Input
          type="number"
          maxLength={11}
          placeholder={{
            i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
          }}
          prefix={
            <div className="phone-prefix text-sm">
              <span className="bgi-text-[var(--grayscale-70)]">+ 91</span>
            </div>
          }
        />
      </Form.Item>
      <Form.Item
        name="optCode"
        rules={[
          {
            required: true,
            validator: (_, value) => validator.optCode(value),
          },
        ]}
      >
        <Input
          type="number"
          prefix={
            <Icon
              name="ic_verification_code"
              color="var(--grayscale-70)"
              className="w-6 h-6 rounded"
            />
          }
          placeholder={{
            i18nKey: 'bind_phone_number_verification_code_placeholder',
          }}
          maxLength={6}
          suffix={
            <OTPCountDown
              currentKey={OTPCountDownKeys.REGISTER}
              getMobileFn={getCurrentMobile}
            />
          }
        />
      </Form.Item>
      <Form.Item
        name="referralCode"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input
          type="text"
          prefix={
            <div className="w-6 h-6 flex justify-center items-center border rounded-full border-[var(--grayscale-70)]">
              <Icon
                name="ic_add"
                color="var(--grayscale-70)"
                className="w-5 h-5"
              />
            </div>
          }
          placeholder={{ i18nKey: 'login_referral_code_optional' }}
          maxLength={10}
          suffix={
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <QuestionTooltip
                placement="bottomRight"
                title={t('login_referral_code_reward_tips')}
                iconClassName="w-6 h-6"
                overlayClassName=""
                btnClassName="!p-0"
                iconName="ic_alert"
              />
            </div>
          }
        />
      </Form.Item>
      {captcha.isEnabled && (
        <Form.Item
          name="verifyCode"
          rules={[
            {
              required: true,
              validator: (_, value) => validator.captchaCode(value),
            },
          ]}
        >
          <Input
            type="number"
            maxLength={4}
            styles={{
              container: 'w-full flex items-center gap-2',
              containerDiv: 'flex-1',
            }}
            placeholder={{
              i18nKey:
                'sign_in_popup_new_password_input_title_verification_code',
            }}
            prefix={
              <Icon
                name="ic_verification_code"
                color="var(--grayscale-70)"
                className="w-6 h-6 rounded"
              />
            }
            outerSuffix={
              <img
                src={captcha.base64CaptchaImg}
                alt=""
                className="w-28 h-12 rounded cursor-pointer bg-white"
                onClick={captcha.refresh}
              />
            }
          />
        </Form.Item>
      )}

      <div className="flex gap-1 bgi-text-[var(--grayscale-100)] items-center">
        <div
          className="mt-1 w-5 h-5 bgi-[var(--state-success-main)] border border-[var(--grayscale-100)] rounded-full cursor-pointer"
          onClick={togglePolicyCheck}
        >
          {policyCheck && <Icon className="w-full" name="ic_check" />}
        </div>

        <div
          className="ml-1 policy-text underline underline-offset-8 cursor-pointer"
          onClick={() => {
            setPolicyCheck(true);
            handleHeaderClick({
              actionName: handlePrivacyPolicyLinkActionClick,
            });
          }}
        >
          {t('sign_in_link_privacy_policy')}
        </div>
      </div>

      <BasePrimaryBtn
        // disabled={isSubmitDisable}
        debounceTimer={500}
        type="submit"
        className={cx('text-xl', 'font-medium', 'py-2 px-4', 'mt-6')}
        children={t('header_sign_up')}
      />

      <div className="text-center mt-4 text-base font-medium">
        <span className="bgi-text-[var(--grayscale-100)]">
          {t('sign_up_do_you_have_an_account')}
        </span>
        <button
          type="button"
          className="ml-1 bgi-text-[var(--state-success-main)] border-b border-[var(--state-success-main)]"
          onClick={() => {
            handleHeaderClick({
              actionName: handleLoginActionClick,
              payload: { type: LoginFormType.LOGIN },
            });
          }}
        >
          {t('header_sign_in')}
        </button>
      </div>
    </Form>
  );
};
export default RegisterForm;
