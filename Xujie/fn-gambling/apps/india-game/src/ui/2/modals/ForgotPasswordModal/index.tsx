import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { message, notification } from 'antd';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Input from '@mode2/components/Input';
import Form from '@mode2/components/Form';
import Icon from '@libs/mode2/components/Icon';
import { ForgotPasswordValidator } from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import {
  usePostForgetPasswordMutation,
  usePostSendOtpMutation,
} from '@mode2API/index';

// 再次獲取驗證碼需等待秒數
const OTP_CODE_COUNTDOWN = 120;

const CloseButton = ({
  onClose,
  customClass,
}: {
  onClose: () => void;
  customClass?: string;
}) => {
  return (
    <button
      className={cx(
        'flex justify-center items-center cursor-pointer h-6 w-6 rounded-[100px] border-[1px] border-solid z-[2] border-[var(--grayscale-50)]',
        customClass
      )}
      onClick={onClose}
    >
      <Icon className="w-4 h-4" color={'var(--grayscale-50)'} name="ic_close" />
    </button>
  );
};

/** 忘記密碼modal */
export const ForgotPasswordModal = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isSendOtpSuccess, setIsSendOtpSuccess] = useState(false);
  const [countdown, setCountdown] = useState(OTP_CODE_COUNTDOWN);

  const setIsShowForgotPasswordModal = useIsShowLoginModalStore(
    (state) => state.setIsShowForgotPasswordModal
  );

  const [triggerSendOtp, { data: sendOtpData }] = usePostSendOtpMutation();
  const [
    triggerForgetPassword,
    { data: forgetPasswordResult, isLoading: isForgetPasswordLoding },
  ] = usePostForgetPasswordMutation();

  const handleClose = () => {
    setIsShowForgotPasswordModal(false);
    setIsSendOtpSuccess(false);
    setCountdown(OTP_CODE_COUNTDOWN);
    form.resetFields();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSendOtpClick = () => {
    const phoneInputValue = form.getFieldValue('phone');
    if (phoneInputValue) {
      triggerSendOtp({ mobile: phoneInputValue });
    } else {
      message.info(t('toast_mobile_phone_cannot_be_empty'));
    }
  };

  const handleResetPassword = (formValues: {
    phone: string;
    otpCode: string;
    password: string;
  }) => {
    triggerForgetPassword({
      otpCode: formValues.otpCode,
      otpId: sendOtpData?.otpId || '',
      password: formValues.password,
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

  useEffect(() => {
    if (sendOtpData?.otpId) {
      message.info(t('toast_the_verification_code'));
      setIsSendOtpSuccess(true);
      setCountdown(OTP_CODE_COUNTDOWN);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSendOtpSuccess(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sendOtpData]);

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(isForgetPasswordLoding);
  }, [isForgetPasswordLoding]);

  const inputLabelClass =
    'text-white font-medium text-sm mobile:text-base mb-1';

  return (
    <BaseModal>
      <div
        id="ForgotPasswordModal"
        className={cx(
          'relative bgi-[var(--linear-8-main)] p-4 mobile:p-6 rounded-lg border-gradient-grayscale-50 border border-[var(--grayscale-50)]',
          'min-h-[404px] w-[328px]',
          'mobile:w-[368px] mobile:min-h-[440px]'
        )}
      >
        <CloseButton
          onClose={() => handleClose()}
          customClass="absolute top-3 right-3"
        />
        <div className="bgi-text-[var(--grayscale-100)] text-center font-semibold mobile:font-medium text-lg mobile:text-xl">
          {t('sign_in_popup_new_password_title_new_password')}
        </div>

        <hr className="bgi-[var(--linear-3)] h-[2px] mt-2 border-none" />

        <div>
          <Form
            form={form}
            className="mt-[24px]"
            onFinish={(values) => handleResetPassword(values)}
            onFinishFailed={(errorInfo) => {
              const message = errorInfo?.errorFields?.[0]?.errors?.[0] || '';
              notification.error({
                message,
              });
            }}
          >
            <Form.Item
              name="phone"
              className="mb-3 mobile:mb-4"
              labelCol={{ span: 24 }} // label 佔滿一整行
              label={
                <div className={inputLabelClass}>
                  {t('sign_in_popup_new_password_input_title_phone_number')}
                </div>
              }
              rules={[
                {
                  required: true,
                  validator: (_, value) =>
                    ForgotPasswordValidator.phone(value, t),
                },
              ]}
            >
              <Input
                name="phone"
                type={'number'}
                maxLength={11}
                placeholder={{
                  i18nKey: 'sign_up_input_hint_enter_your_mobile_phone',
                }}
                styles={{
                  containerDiv: 'bgi-[var(--transparent-white-30)]',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              className="mb-3 mobile:mb-4"
              labelCol={{ span: 24 }} // label 佔滿一整行
              label={
                <div className={inputLabelClass}>
                  {t('sign_in_popup_new_password_title_new_password')}
                </div>
              }
              rules={[
                {
                  required: true,
                  validator: (_, value) =>
                    ForgotPasswordValidator.password(value, t),
                },
              ]}
            >
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder={{
                  i18nKey:
                    'sign_in_popup_new_password_input_hint_enter_a_new_password',
                }}
                suffix={
                  <Icon
                    name={isPasswordVisible ? 'ic_eye_on' : 'ic_eye_off'}
                    onClick={togglePasswordVisibility}
                    color={'var(--grayscale-70)'}
                  />
                }
                styles={{
                  containerDiv: 'bgi-[var(--transparent-white-30)]',
                }}
              />
            </Form.Item>

            <Form.Item
              name="otpCode"
              className="mb-0"
              labelCol={{ span: 24 }} // label 佔滿一整行
              label={
                <div className={inputLabelClass}>
                  {t(
                    'sign_in_popup_new_password_input_title_verification_code'
                  )}
                </div>
              }
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
                  container: 'w-full flex items-center gap-2',
                  containerDiv: 'flex-1 bgi-[var(--transparent-white-30)]',
                }}
                type={'text'}
                placeholder={{
                  i18nKey:
                    'sign_in_popup_new_password_input_hint_enter_verification_code',
                }}
                outerSuffix={
                  isSendOtpSuccess ? (
                    <BasePrimaryBtn className="h-12 w-[70px]" disabled={true}>
                      {countdown}
                    </BasePrimaryBtn>
                  ) : (
                    <BasePrimaryBtn
                      className="h-12 w-[70px]"
                      onClick={handleSendOtpClick}
                    >
                      {t('sign_in_popup_new_password_btn_send')}
                    </BasePrimaryBtn>
                  )
                }
              />
            </Form.Item>
          </Form>
        </div>

        <BasePrimaryBtn
          type="submit"
          className="h-12 w-full mt-6"
          onClick={() => form.submit()}
          disabled={disabled}
          debounceTimer={500}
        >
          {t('sign_in_popup_new_password_btn_reset_password')}
        </BasePrimaryBtn>
      </div>
    </BaseModal>
  );
};
