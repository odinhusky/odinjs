import { useTranslation } from 'react-i18next';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';

import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { notification } from 'antd';
import {
  handleForgotPasswordActionClick,
  handleLoginActionClick,
} from '@mode2/action/components/header/actionType';
import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import Icon from '@components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx, useDeepEffect } from '@libs/commonUtils';
import QuestionTooltip from '@components/QuestionTooltip';

const LoginForm = (props: ILoginModalProps) => {
  const {
    form,
    login,
    isSubmitDisable,
    isPasswordVisible,
    togglePasswordVisibility,
    validator,
  } = useLoginForm(props);

  const { handleHeaderClick } = useHeaderAction();
  const { t } = useTranslation();

  const referralCode = useIsShowLoginModalStore((state) => state.referralCode);

  useDeepEffect(() => {
    form.setFieldsValue({
      referralCode: referralCode,
    });
  }, [referralCode]);

  return (
    <Form<LoginPayload & Record<string, unknown>>
      form={form}
      className="login-form"
      onFinish={login}
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
              <span>{t('common_area_code')}</span>
            </div>
          }
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: t('toast_password_cannot_be_empty'),
            // validator: (_, value) => validator.password(value),
          },
        ]}
      >
        <Input
          type={isPasswordVisible ? 'text' : 'no_rules_password'}
          prefix={
            <Icon
              color="var(--grayscale-70)"
              className="w-6 h-6"
              name="ic_lock"
            />
          }
          placeholder={{ i18nKey: 'sign_up_input_hint_enter_your_password' }}
          suffix={
            <Icon
              name={isPasswordVisible ? 'ic_eye_on' : 'ic_eye_off'}
              onClick={togglePasswordVisibility}
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

      <BasePrimaryBtn
        type="submit"
        className={cx('text-xl', 'font-medium', 'py-2 px-4', 'mt-4')}
        disabled={isSubmitDisable}
        debounceTimer={500}
        children={t('header_sign_in')}
      />

      <div className="flex text-base font-medium items-center justify-between">
        <BasePrimaryBtn
          type="button"
          className={cx(
            '!bg-none w-auto',
            'text-base font-medium bgi-text-[var(--state-success-main)] underline underline-offset-8 cursor-pointer'
          )}
          classNameText="bgi-text-[var(--state-success-main)]"
          onClick={() => {
            handleHeaderClick({
              actionName: handleForgotPasswordActionClick,
            });
          }}
        >
          {t('sign_in_link_forgot_password')}
        </BasePrimaryBtn>

        <BasePrimaryBtn
          type="button"
          className="!bg-none w-auto text-base font-medium bgi-text-[var(--state-success-main)] underline underline-offset-8 cursor-pointer"
          classNameText="bgi-text-[var(--state-success-main)]"
          onClick={() => {
            handleHeaderClick({
              actionName: handleLoginActionClick,
              payload: { type: LoginFormType.REGISTER },
            });
          }}
        >
          {t('header_sign_up')}
        </BasePrimaryBtn>
      </div>
    </Form>
  );
};
export default LoginForm;
