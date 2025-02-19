import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { usePostPlayerBindAccountMutation } from '@libs/mode2/external/api';
import { useLoadingStore } from '@libs/mode2/zustand/components/loadingStore';
import { PlayerBindAccountPayload } from '@libs/mode2/external/api/endpoint/user/PostPlayerBindAccountEndpoint';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useUpdateEffect } from '@libs/commonUtils';
import { OTPCodeValidator, PasswordValidator } from '@/validator/antdValidator';

export interface BindPlayerPhoneFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useBindPlayerPhoneForm = ({
  onClose,
  onSuccess,
}: BindPlayerPhoneFormProps) => {
  const { t } = useTranslation();
  const [postBind, { data: bindPlayerPhoneData, isSuccess: isBindSuccess }] =
    usePostPlayerBindAccountMutation();

  const setShowLoading = useLoadingStore((state) => state.setShowLoading);

  const setUserRole = useUserProfileStore((state) => state.setUserRole);

  const bindPlayerPhone = (values: PlayerBindAccountPayload) => {
    setShowLoading(true);
    postBind(values).finally(() => {
      setShowLoading(false);
    });
  };

  const OTPCodeValidatorInstance = OTPCodeValidator(t);
  const PasswordValidatorInstance = PasswordValidator(t);

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
      otpCode: OTPCodeValidatorInstance.otpCode,
      password: PasswordValidatorInstance.password,
      confirmPassword: PasswordValidatorInstance.confirmPassword,
    }),
    [t]
  );

  useEffect(() => {
    return () => {
      setShowLoading(false);
    };
  }, []);

  useUpdateEffect(() => {
    onSuccess?.();
    onClose?.();

    if (bindPlayerPhoneData?.userRole)
      setUserRole(bindPlayerPhoneData?.userRole);
  }, [isBindSuccess]);

  return {
    bindPlayerPhone,
    validator,
  };
};
export default useBindPlayerPhoneForm;
