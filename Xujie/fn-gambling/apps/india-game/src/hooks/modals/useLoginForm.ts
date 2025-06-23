import { useMemo } from 'react';
import { LoginFormType } from '@mode2/zustand/loginStore';

import useLogin from '@mode2/usecase/useLogin';
import { useTranslation } from 'react-i18next';
import { useUserState } from '@/usecase/useUserState';
import {
  OTPCodeValidator,
  PasswordValidator,
  PhoneNumberValidator,
} from '@/validator/antdValidator';

export interface ILoginModalProps {
  open?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  type: `${LoginFormType}`;
  className?: string;
}

const useLoginForm = (props: ILoginModalProps) => {
  const { t } = useTranslation();
  const { refreshUserState } = useUserState();

  const { onClose, onSuccess } = props;
  const baseLoginFormState = useLogin({
    successCallback: () => {
      onClose?.();
      onSuccess?.();
      refreshUserState();
    },
  });

  const PhoneNumberValidatorInstance = PhoneNumberValidator(t);
  const OTPCodeValidatorInstance = OTPCodeValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);

  const validator = useMemo(() => {
    return {
      phone: PhoneNumberValidatorInstance.phone,
      password: PasswordValidatorInstance.password,
      verifyCode: OTPCodeValidatorInstance.otpCode,
    };
  }, []);

  // Watch all values

  return {
    validator,
    ...baseLoginFormState,
  };
};
export default useLoginForm;
