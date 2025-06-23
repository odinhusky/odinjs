import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Input from '@mode2/components/Input';
import Form from '@mode2/components/Form';
import {
  PasswordValidator,
  CommonEmptyValidator,
} from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { usePostForgetPasswordMutation } from '@mode2API/index';
import {
  OTPCountDownKeys,
  useOTPCountDownStore,
} from '@libs/mode2/zustand/components/OTPCountDownStore';
import OTPCountDown from '@components/OTPCountDown';
import './index.scss';
import Icon from '@components/Icon';
import { FLEX_CENTER } from '@libs/constant/style';
import {
  ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS,
  ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS,
} from '@constant/options';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';

// TODO Ronan
// TODO i18n
/** 忘記密碼modal */
export const ForgotPasswordModal = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const PasswordValidatorInstance = PasswordValidator(t);
  const CommonEmptyValidatorInstance = CommonEmptyValidator(t);

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [formValues, setFormValues] = useState({
    phone: '',
    otpCode: '',
    password: '',
  });

  const [step, setStep] = useState<number>(0); // 0 | 1
  const [disabled, setDisabled] = useState(false);

  const otpId = useOTPCountDownStore((state) => state.otpId);

  const setIsShowForgotPasswordModal = useIsShowLoginModalStore(
    (state) => state.setIsShowForgotPasswordModal
  );

  const [
    postForgetPassword,
    { data: forgetPasswordResult, isLoading: isForgetPasswordLoding },
  ] = usePostForgetPasswordMutation();

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClose = () => {
    setIsShowForgotPasswordModal(false);
    form.resetFields();
  };

  const handleResetPassword = (values: {
    phone: string;
    otpCode: string;
    password: string;
  }) => {
    console.log('@@===> handleResetPassword click', values);

    postForgetPassword({
      otpCode: values.otpCode,
      otpId: otpId || '',
      password: values.password,
    });
  };

  const getCurrentMobile = () => {
    const currentMobile = form.getFieldValue('phone');
    return currentMobile;
  };

  const handleForgotPasswordSubmit = async () => {
    if (step === 0) {
      // 因為驗證策略改為送出時驗證，無論如何都要先送出，並且觸發 onFinishFailed 的 callback 顯示提示
      form.submit();

      // 在此處確定是否要進入到 step1
      try {
        await form.validateFields(['phone', 'otpCode']); // 只驗證 phone 和 otpCode
        // console.log('!! 忘記密碼step0: 驗證無誤');

        const phone = form.getFieldValue('phone');
        const otpCode = form.getFieldValue('otpCode');
        setFormValues((prev) => ({ ...prev, phone, otpCode }));
        setStep(1);
      } catch (error) {
        // console.log('!! 忘記密碼step0: 驗證錯誤 =>', error);
      }
    } else {
      form.submit();
    }
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

  useEffect(() => {
    setDisabled(isForgetPasswordLoding);
  }, [isForgetPasswordLoding]);

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
            {t('forgot_password_title')}
          </div>
          <Icon className="w-6 h-6" name="ic_close" onClick={handleClose} />
        </div>

        <hr className="bgi-[var(--transparent-white-10)] h-0.5 mt-4 border-none" />

        <div className={cx('my-8 text-xs font-medium gap-2', FLEX_CENTER)}>
          <div onClick={() => setStep(0)}>
            {t('forgot_password_steps_enter_phone_number')}
          </div>
          <div
            className={cx('w-14 h-[1px]', {
              'bgi-[var(--transparent-white-10)]': step === 0,
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
            <span>{t('forgot_password_steps_reset_password')}</span>
          </div>
        </div>

        <div>
          <Form
            form={form}
            className="mt-[24px]"
            {...ANTD_FORM_VALIDATE_WHEN_SUBMIT_PROPS}
            onFinish={(values) =>
              handleResetPassword({ ...formValues, ...values })
            }
            onFinishFailed={(errorInfo) => {
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              if (message) useMessageStore.getState().info(message);
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
                        CommonEmptyValidatorInstance.inputValue(value, {
                          emptyI18nKey: 'sign_up_sign_in_phone_error_toast',
                        }),
                    },
                  ]}
                  {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
                >
                  <Input
                    type="number"
                    maxLength={11}
                    placeholder={{
                      i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
                    }}
                    styles={{
                      input: 'forgot-password', // placeholder的字体
                      inputPrefix:
                        '!bgi-border-[var(----transparent-white-10)]',
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
                        CommonEmptyValidatorInstance.inputValue(value, {
                          emptyI18nKey:
                            'forgot_password_enter_verification_code_toast',
                        }),
                    },
                  ]}
                  {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
                >
                  <Input
                    type="number"
                    styles={{
                      input: 'forgot-password',
                      inputPrefix: '!border-0',
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
                        className="active:transition active:duration-300 active:scale-95 !bg-transparent shadow-[var(--box-shadow)]"
                        currentKey={OTPCountDownKeys.FORGOT_PASSWORD}
                        getMobileFn={getCurrentMobile}
                        showUnit={false}
                        i18nKey="forgot_password_verification_code_sent_toast"
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
                        PasswordValidatorInstance.password(value),
                    },
                  ]}
                  {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
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
                    ({ getFieldValue }) => ({
                      required: true,
                      validator: (_, value) =>
                        PasswordValidatorInstance.confirmPassword(
                          value,
                          getFieldValue
                        ),
                    }),
                  ]}
                  {...ANTD_FORM_ITEM_WITHOUT_HELP_TEXT_PROPS}
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
            onClick={handleForgotPasswordSubmit}
            disabled={disabled}
            debounceTimer={500}
          >
            {step === 0
              ? t('forgot_password_continue_button')
              : t('forgot_password_reset_password_complete_button')}
          </BasePrimaryBtn>
        </div>
      </div>
    </BaseModal>
  );
};
