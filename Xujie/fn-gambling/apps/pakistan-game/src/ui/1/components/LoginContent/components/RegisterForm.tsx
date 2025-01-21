import Form from '@mode2/components/Form';
import { notification } from 'antd';
import Input from '@mode2/components/Input';
import { ILoginModalProps } from '@/hooks/modals/useLoginForm';
import { RegisterPayload } from '@mode2/external/api/endpoint/user/PostRegisterEndpoint';
import useRegisterForm from '@/hooks/modals/useRegisterForm';
import { useTranslation } from 'react-i18next';
import Icon from '@libs/mode2/components/Icon';
import useHeaderAction from '@libs/mode2/action/components/header/headerAction';
import { handleLoginActionClick } from '@libs/mode2/action/components/header/actionType';
import { LoginFormType } from '@libs/mode2/zustand/loginStore';
import PhoneInput from '@/components/PhoneInput';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { useState } from 'react';

const RegisterForm = (props: ILoginModalProps) => {
  const {
    register,
    isPasswordVisible,
    togglePasswordVisibility,
    validator,
    captcha,
  } = useRegisterForm(props);
  const { t } = useTranslation();
  const { handleHeaderClick } = useHeaderAction();
  const [selectFocusIndex, setSelectFocusIndex] = useState(-1);

  return (
    <Form<RegisterPayload & Record<string, unknown>>
      className="register-form"
      onFinish={(values) => {
        register({ ...values, captchaId: captcha.captchaId || '' });
      }}
      onFinishFailed={(errorInfo) => {
        const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
        notification.error({
          message,
        });
      }}
    >
      <Form.Item
        className="mobile:mb-4 mb-3"
        name="phone"
        rules={[
          {
            required: true,
            validator: (_, value) => validator.phone(value),
          },
        ]}
      >
        <PhoneInput
          // prefixNum="0"
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
          // onBlur={() => {
          //   setSelectFocusIndex(-1);
          // }}
          outerSuffix={
            <span className="bgi-text-[var(--state-warn-main)] text-sm font-normal mt-1">
              *Please enter your real mobile phone numbers
            </span>
          }
        />
      </Form.Item>
      <Form.Item
        className="mobile:mb-4 mb-3"
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
              className="w-6 h-6"
              name="ic_lock"
            />
          }
          suffix={
            <Icon
              name={isPasswordVisible ? 'ic_eye_on' : 'ic_eye_off'}
              onClick={togglePasswordVisibility}
              color="var(--grayscale-100)"
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
          // onBlur={() => {
          //   setSelectFocusIndex(-1);
          // }}
        />
      </Form.Item>
      {captcha.isEnabled && (
        <Form.Item
          className="mobile:mb-4 mb-3"
          name="verifyCode"
          rules={[
            {
              required: true,
              validator: (_, value) => validator.verifyCode(value),
            },
          ]}
        >
          <Input
            type="number"
            maxLength={4}
            styles={{
              container: 'w-full flex items-center gap-2',
              inputPrefix: '!border-[var(--grayscale-70)]',
              input: cx(
                'caret-[var(--game-1-main)]',
                selectFocusIndex === 2 &&
                  'placeholder:!bgi-text-[var(--grayscale-100)]',
                selectFocusIndex !== 2 &&
                  'placeholder:!bgi-text-[var(--grayscale-70)]'
              ),
              containerDiv: cx(
                'flex-1 !bgi-[var(--grayscale-15)] border',
                selectFocusIndex === 2 && 'bgi-border-[var(--game-1-main)]'
              ),
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
            onFocus={() => {
              setSelectFocusIndex(2);
            }}
            onBlur={() => {
              setSelectFocusIndex(-1);
            }}
          />
        </Form.Item>
      )}

      <BasePrimaryBtn
        type="submit"
        className={cx(
          'text-xl font-medium rounded-xl',
          'mobile:py-2 mobile:px-4 py-3 px-4 mt-9',
          'bg-shadow-[var(--inset-shadow)]'
          // 'shadow-[0px_-2px_2px_0px_#FFFFFF66_inset,0px_2px_2px_0px_#FFFFFF99_inset]'
        )}
        debounceTimer={500}
        children={
          <span className="bgi-text-[var(--grayscale-00)]">
            {t('header_sign_up')}
          </span>
        }
      />

      <div className="text-center mt-4 text-base font-medium">
        <span className="bgi-text-[var(--grayscale-100)]">
          {t('sign_up_do_you_have_an_account')}
        </span>
        <button
          type="button"
          className="bgi-text-[var(--state-success-main)] !underline ml-1"
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
