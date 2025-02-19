import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Input from '@mode2/components/Input';
import Form from '@mode2/components/Form';
import {
  ForgotPasswordValidator,
  PasswordValidator,
} from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { usePostForgetPasswordMutation } from '@mode2API/index';
import {
  OTPCountDownKeys,
  useOTPCountDownStore,
} from '@libs/mode2/zustand/components/OTPCountDownStore';
import OTPCountDown from '@libs/components/OTPCountDown';
import './index.scss';
import Icon from '@components/Icon';
import { FLEX_CENTER } from '@libs/constant/style';

// TODO Ronan
// TODO i18n
/** 忘記密碼modal */
export const ForgotPasswordModal = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const setIsShowForgotPasswordModal = useIsShowLoginModalStore(
    (state) => state.setIsShowForgotPasswordModal
  );
  const otpId = useOTPCountDownStore((state) => state.otpId);

  const [
    triggerForgetPassword,
    { data: forgetPasswordResult, isLoading: isForgetPasswordLoding },
  ] = usePostForgetPasswordMutation();

  const handleClose = () => {
    setIsShowForgotPasswordModal(false);
    form.resetFields();
  };

  const [formValues, setFormValues] = useState({
    phone: '',
    otpCode: '',
    password: '',
  });

  const handleResetPassword = (values: {
    phone: string;
    otpCode: string;
    password: string;
  }) => {
    console.log('@@===> handleResetPassword click', values);
    triggerForgetPassword({
      otpCode: values.otpCode,
      otpId: otpId || '',
      password: values.password,
    });
  };

  useEffect(() => {
    return () => {
      handleClose();
    };
  }, [location]);

  useEffect(() => {
    if (forgetPasswordResult?.isResetSuccess) {
      handleClose();
    }
  }, [forgetPasswordResult]);

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(isForgetPasswordLoding);
  }, [isForgetPasswordLoding]);

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  const [step, setStep] = useState<number>(0); // 0 | 1

  return (
    <BaseModal>
      <div
        id="ForgotPasswordModal"
        className={cx(
          'relative p-4 box-border rounded-xl border-gradient-grayscale-50 border border-[var(--base-1-main)]',
          'w-[408px] bgi-text-[var(--grayscale-100)]  bgi-[var(--base-2-variant9)]'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="font-medium text-lg">
            {/* {t('sign_in_popup_new_password_title_new_password')} */}
            Retrieve the password
          </div>
          <Icon className="w-6 h-6" name="ic_close" onClick={handleClose} />
        </div>

        <hr className="bgi-[var(--transparent-white-10)] h-0.5 mt-4 border-none" />

        <div className={cx('my-8 text-xs font-medium gap-2', FLEX_CENTER)}>
          <div onClick={() => setStep(0)}>Enter your phone no.</div>
          <div
            className={cx('w-14 h-[1px]', {
              'bgi-[var(--base-2-variant1)]': step === 0,
              'bgi-[var(--grayscale-100)]': step === 1,
            })}
          ></div>
          <div
            className={cx('flex items-center gap-1', {
              'bgi-text-[var(--base-2-variant1)]': step === 0,
              'bgi-text-[var(--grayscale-100)]': step === 1,
            })}
            onClick={() => setStep(1)}
          >
            <Icon
              name={cx(step === 1 ? 'forgot_step_2' : 'forgot_step')}
              className="w-2 h-2"
            />
            <span>Reset your password</span>
          </div>
        </div>

        <div>
          <Form
            form={form}
            className="mt-[24px]"
            onFinish={(values) =>
              handleResetPassword({ ...formValues, ...values })
            }
            onFinishFailed={(errorInfo) => {
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              notification.error({
                message,
              });
            }}
          >
            {step === 0 ? (
              <>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) =>
                        ForgotPasswordValidator.phone(value, t),
                    },
                  ]}
                >
                  <Input
                    type="number"
                    maxLength={11}
                    placeholder={{
                      i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
                    }}
                    styles={{
                      input: 'forgot-password', // placeholder的字体
                      containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                    }}
                    prefix={
                      <div className="flex items-center ">
                        <Icon name="ic_smartphone" className="w-7 h-7" />
                        <span className="bgi-text-[var(--transparent-white-70)]">
                          {t('common_area_code')}
                        </span>
                      </div>
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="otpCode"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) =>
                        ForgotPasswordValidator.otpCode(value, t),
                    },
                  ]}
                >
                  <Input
                    styles={{
                      input: 'forgot-password',
                      containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                    }}
                    prefix={
                      <Icon
                        name="ic_verification_code"
                        className="w-6 h-6 rounded"
                      />
                    }
                    placeholder={{
                      i18nKey:
                        'bind_phone_number_verification_code_placeholder',
                    }}
                    maxLength={6}
                    suffix={
                      <OTPCountDown
                        className="active:transition active:duration-300 active:scale-95 !bgi-[var(--base-2-variant5)] shadow-[var(--box-shadow)]"
                        currentKey={OTPCountDownKeys.FORGOT_PASSWORD}
                        getMobileFn={getCurrentMobile}
                      />
                    }
                  />
                </Form.Item>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) =>
                        ForgotPasswordValidator.password(value, t),
                    },
                  ]}
                >
                  <Input
                    type={
                      passwordVisibility.password ? 'text' : 'no_rules_password'
                    }
                    placeholder={{
                      i18nKey: 'sign_up_input_hint_enter_your_password',
                    }}
                    styles={{
                      input: 'forgot-password',
                      containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                    }}
                    suffix={
                      <Icon
                        name={
                          passwordVisibility.password
                            ? 'ic_eye_on'
                            : 'ic_eye_off'
                        }
                        onClick={() => togglePasswordVisibility('password')}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) =>
                        PasswordValidator(t).confirmPassword(
                          value,
                          form.getFieldValue
                        ),
                    },
                  ]}
                >
                  <Input
                    type={
                      passwordVisibility.confirmPassword
                        ? 'text'
                        : 'no_rules_password'
                    }
                    placeholder={{
                      i18nKey: 'Enter the modified password again',
                    }}
                    styles={{
                      input: 'forgot-password',
                      containerDiv: '!py-3.5 !bgi-[var(--base-2-variant6)]',
                    }}
                    suffix={
                      <Icon
                        name={
                          passwordVisibility.confirmPassword
                            ? 'ic_eye_on'
                            : 'ic_eye_off'
                        }
                        onClick={() =>
                          togglePasswordVisibility('confirmPassword')
                        }
                      />
                    }
                  />
                </Form.Item>
              </>
            ) : null}
          </Form>
        </div>

        <div className={cx(FLEX_CENTER)}>
          <BasePrimaryBtn
            type="submit"
            className="h-12 w-44 text-lg font-medium"
            onClick={() => {
              if (step === 0) {
                const phone = form.getFieldValue('phone');
                const otpCode = form.getFieldValue('otpCode');
                if (!phone || !otpCode) return form.submit();
                setFormValues((prev) => ({ ...prev, phone, otpCode }));
                setStep(1);
              } else {
                form.submit();
              }
            }}
            disabled={disabled}
            debounceTimer={500}
          >
            {step === 0 ? 'Continue' : 'Complete'}
          </BasePrimaryBtn>
        </div>
      </div>
    </BaseModal>
  );
};
