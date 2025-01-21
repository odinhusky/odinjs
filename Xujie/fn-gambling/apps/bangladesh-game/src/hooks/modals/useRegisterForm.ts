import { ILoginModalProps } from './useLoginForm';
import { useEffect, useMemo, useState } from 'react';
import useRegister from '@mode2/usecase/useRegister';
import { useTranslation } from 'react-i18next';
import { usePostCaptchaMutation } from '@libs/mode2/external/api';

const useRegisterForm = (props: ILoginModalProps) => {
  const { t } = useTranslation();
  const { onClose, onSuccess } = props;
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const { register } = useRegister({
    successCallback: () => {
      onClose?.();
      onSuccess?.();
    },
    failCallback: () => {
      postCaptcha();
    },
  });

  const validator = useMemo(
    () => ({
      phone: (value: string) => {
        const nameRegex = /^\d{10,11}$/;
        if (!value) {
          return Promise.reject(t('toast_mobile_phone_cannot_be_empty'));
        }
        if (!nameRegex.test(value)) {
          return Promise.reject(t('toast_phone_numbers_restrict'));
        }
        return Promise.resolve();
      },
      password: (value: string) => {
        const passwordRegex = /^(?!.*\s)[\s\S]{4,13}$/;
        if (!value) {
          return Promise.reject(t('toast_password_cannot_be_empty'));
        }
        if (!passwordRegex.test(value)) {
          return Promise.reject(t('toast_password_hint'));
        }
        return Promise.resolve();
      },
      verifyCode: (value: string) => {
        if (value.length !== 4) {
          //TODO yaleen 缺少i18next
          //return Promise.reject();
        }
        return Promise.resolve();
      },
    }),
    [t]
  );

  const togglePasswordVisibility = () => {
    setPasswordVisible((pre) => !pre);
  };

  const [postCaptcha, { data, isLoading }] = usePostCaptchaMutation();

  useEffect(() => {
    postCaptcha();
  }, []);

  const [captcha, setCaptcha] = useState({
    isEnabled: false,
    captchaId: '',
    base64CaptchaImg: '',
  });

  useEffect(() => {
    if (!data) return;
    setCaptcha(data);
  }, [data]);

  return {
    register,
    isPasswordVisible,
    togglePasswordVisibility,
    validator,
    captcha: {
      ...captcha,
      isLoading,
      refresh: () => postCaptcha(),
    },
  };
};

export default useRegisterForm;
