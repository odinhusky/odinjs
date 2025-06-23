import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import cx from '@commonUtils/cx';
import BaseModal from '@mode2/components/Modal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import Input from '@mode2/components/Input';
import Form from '@mode2/components/Form';
import Icon from '@components/Icon';
import {
  OTPCodeValidator,
  PasswordValidator,
  PhoneNumberValidator,
} from '@/validator/antdValidator';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { usePostForgetPasswordMutation } from '@mode2API/index';
import {
  OTPCountDownKeys,
  useOTPCountDownStore,
} from '@libs/mode2/zustand/components/OTPCountDownStore';
import OTPCountDown from '@components/OTPCountDown';

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
      <Icon className="w-4 h-4" name="ic_close" />
    </button>
  );
};

/** 忘記密碼modal */
export const ForgotPasswordModal = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Validator Instances
  const PhoneNumberValidatorInstance = PhoneNumberValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);
  const OTPCodeValidatorInstance = OTPCodeValidator(t);

  const otpId = useOTPCountDownStore((state) => state.otpId);

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const setIsShowForgotPasswordModal = useIsShowLoginModalStore(
    (state) => state.setIsShowForgotPasswordModal
  );

  const [
    postForgetPassword,
    { data: forgetPasswordResult, isLoading: isForgetPasswordLoding },
  ] = usePostForgetPasswordMutation();

  const handleClose = () => {
    setIsShowForgotPasswordModal(false);
    form.resetFields();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleResetPassword = (formValues: {
    phone: string;
    otpCode: string;
    password: string;
  }) => {
    postForgetPassword({
      otpCode: formValues.otpCode,
      otpId: otpId || '',
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
                    PhoneNumberValidatorInstance.phone(value),
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
                    PasswordValidatorInstance.password(value),
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
                    OTPCodeValidatorInstance.otpCode(value),
                },
              ]}
            >
              <Input
                styles={{
                  container: 'w-full flex items-center gap-2',
                  containerDiv: 'flex-1 bgi-[var(--transparent-white-30)]',
                }}
                type={'number'}
                placeholder={{
                  i18nKey:
                    'sign_in_popup_new_password_input_hint_enter_verification_code',
                }}
                outerSuffix={
                  <OTPCountDown
                    currentKey={OTPCountDownKeys.FORGOT_PASSWORD}
                    duration={OTP_CODE_COUNTDOWN}
                    getMobileFn={() => form.getFieldValue('phone')}
                    className="!h-12 !w-[70px] !px-0 flex items-center justify-center rounded"
                    btnClassName="w-full h-full !px-0 !text-base font-medium !bgi-[var(--base-1-main)]"
                    classNameText="!bgi-text-[var(--grayscale-100)]"
                  />
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
