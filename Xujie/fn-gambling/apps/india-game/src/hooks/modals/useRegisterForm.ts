import { ILoginModalProps } from './useLoginForm';
import { useMemo } from 'react';
import useRegister from '@mode2/usecase/useRegister';
import { useTranslation } from 'react-i18next';

const useRegisterForm = (props: ILoginModalProps) => {
  const { t } = useTranslation();
  const { onClose, onSuccess } = props;

  const baseRegisterFormState = useRegister({
    successCallback: () => {
      onClose?.();
      onSuccess?.();
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

  return {
    ...baseRegisterFormState,
    validator,
  };
};

export default useRegisterForm;
