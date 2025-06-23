import Form from '@mode2/components/Form';
import { notification } from 'antd';
import Input from '@mode2/components/Input';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import { RegisterPayload } from '@mode2/external/api/endpoint/user/PostRegisterEndpoint';
import useRegisterForm from '@/hooks/modals/useRegisterForm';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import { handleLoginActionClick } from '@mode2/action/actionTypes';
import { LoginFormType } from '@libs/mode2/zustand/loginStore';
import { cx } from '@libs/commonUtils';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

const RegisterForm = (props: ILoginModalProps) => {
  const {
    form,
    register,
    isPasswordVisible,
    togglePasswordVisibility,
    validator,
    captcha,
    isSubmitDisable,
  } = useRegisterForm(props);
  const { t } = useTranslation();
  const { handleHeaderClick } = useHeaderAction();

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
          styles={{ input: 'placeholder:!bgi-text-[var(--grayscale-70)]' }}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            validator: (_, value) => validator.password(value),
          },
        ]}
      >
        <Input
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={{ i18nKey: 'sign_up_input_hint_enter_your_password' }}
          prefix={
            <Icon
              color="var(--grayscale-70)"
              className={'w-6 h-6'}
              name="ic_lock"
            />
          }
          suffix={
            <Icon
              name={isPasswordVisible ? 'ic_eye_on' : 'ic_eye_off'}
              onClick={togglePasswordVisibility}
              color={'var(--grayscale-70)'}
            />
          }
          styles={{ input: 'placeholder:!bgi-text-[var(--grayscale-70)]' }}
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
              input: 'placeholder:!bgi-text-[var(--grayscale-70)]',
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
