import { useTranslation } from 'react-i18next';
import useLoginForm, { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import Form from '@mode2/components/Form';
import Input from '@mode2/components/Input';
import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { notification } from 'antd';
import {
  handleForgotPasswordActionClick,
  handleLoginActionClick,
  handlePrivacyPolicyLinkActionClick,
} from '@mode2/action/components/header/actionType';
import { LoginFormType } from '@mode2/zustand/loginStore';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import Icon from '@libs/mode2/components/Icon';
import PhoneInput from '@/components/PhoneInput';
import { cx } from '@libs/commonUtils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useState } from 'react';

const LoginForm = (props: ILoginModalProps) => {
  const {
    login,
    isSubmitDisable,
    isPasswordVisible,
    togglePasswordVisibility,
    validator,
    policyCheck,
    setPolicyCheck,
    togglePolicyCheck,
  } = useLoginForm(props);
  const [form] = Form.useForm();
  const { handleHeaderClick } = useHeaderAction();
  const { t } = useTranslation();
  const [selectFocusIndex, setSelectFocusIndex] = useState(-1);

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
        <PhoneInput
          // prefixNum="03"
          // maxLength={10}
          prefixClassName="bgi-text-[var(--grayscale-70)] text-base font-medium"
          prefixRegionClassName="bgi-text-[var(--grayscale-100)] text-base font-medium"
          styles={{
            // inputPrefix: 'relative !border-none !mr-3',
            input: cx(
              'caret-[var(--game-1-main)]',
              selectFocusIndex === 0 &&
                'placeholder:!bgi-text-[var(--grayscale-100)]',
              selectFocusIndex !== 0 &&
                'placeholder:!bgi-text-[var(--grayscale-70)]'
            ),
            containerDiv: cx(
              '!bgi-[var(--grayscale-15)] border',
              selectFocusIndex === 0 && 'bgi-border-[var(--game-1-main)]'
            ),
          }}
          onFocus={() => {
            setSelectFocusIndex(0);
          }}
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
          styles={{
            inputPrefix: '!border-[var(--grayscale-70)]',
            input: cx(
              'caret-[var(--game-1-main)]',
              selectFocusIndex === 1 &&
                'placeholder:!bgi-text-[var(--grayscale-100)]',
              selectFocusIndex !== 1 &&
                'placeholder:!bgi-text-[var(--grayscale-70)]'
            ),
            containerDiv: cx(
              '!bgi-[var(--grayscale-15)] border',
              selectFocusIndex === 1 && 'bgi-border-[var(--game-1-main)]'
            ),
          }}
          onFocus={() => {
            setSelectFocusIndex(1);
          }}
        />
      </Form.Item>
      <div className="flex text-base font-medium -mt-1 items-center justify-between">
        <div className="flex gap-1 bgi-text-[var(--grayscale-100)] items-center">
          <div
            className="mt-1 w-5 h-5 bgi-[var(--state-success-main)] border border-[var(--grayscale-100)] rounded-full cursor-pointer"
            onClick={togglePolicyCheck}
          >
            {policyCheck && (
              <Icon
                className="w-full"
                name="ic_check"
                color="var(--grayscale-100)"
              />
            )}
          </div>

          <div
            className="ml-1 policy-text underline cursor-pointer"
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
        <button
          type="button"
          className="text-base font-medium bgi-text-[var(--state-success-main)] underline cursor-pointer"
          onClick={() => {
            handleHeaderClick({
              actionName: handleForgotPasswordActionClick,
            });
          }}
        >
          {t('sign_in_link_forgot_password')}
        </button>
      </div>

      <BasePrimaryBtn
        type="submit"
        debounceTimer={500}
        className={cx(
          'text-xl font-medium rounded-xl',
          'mobile:py-2 mobile:px-4 py-3 px-4 mt-6',
          'bg-shadow-[var(--inset-shadow)]'
          // 'shadow-[0px_-2px_2px_0px_#FFFFFF66_inset,0px_2px_2px_0px_#FFFFFF99_inset]'
        )}
        disabled={isSubmitDisable}
        children={
          <span className="bgi-text-[var(--grayscale-00)]">
            {t('header_sign_in')}
          </span>
        }
      />

      <div className="text-end mt-4">
        <button
          type="button"
          className="text-base font-medium bgi-text-[var(--state-success-main)] underline cursor-pointer"
          onClick={() => {
            handleHeaderClick({
              actionName: handleLoginActionClick,
              payload: { type: LoginFormType.REGISTER },
            });
          }}
        >
          {t('header_sign_up')}
        </button>
      </div>
    </Form>
  );
};
export default LoginForm;
