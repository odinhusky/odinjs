import { useMemo } from 'react';
import { LoginFormType } from '@mode2/zustand/loginStore';

import useLogin from '@mode2/usecase/useLogin';
import { useTranslation } from 'react-i18next';

export interface ILoginModalProps {
  open?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  type: `${LoginFormType}`;
  className?: string;
}

const useLoginForm = (props: ILoginModalProps) => {
  const { t } = useTranslation();
  const { onClose, onSuccess } = props;
  const baseLoginFormState = useLogin({
    successCallback: () => {
      onClose?.();
      onSuccess?.();
    },
  });

  const validator = useMemo(
    () => ({
      phone: (value: string) => {
        const nameRegex = /^\d{11}$/;
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
    }),
    []
  );

  return {
    ...baseLoginFormState,
    validator,
  };
};
export default useLoginForm;
