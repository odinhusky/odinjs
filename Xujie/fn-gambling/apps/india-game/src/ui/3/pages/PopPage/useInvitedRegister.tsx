import { useTranslation } from 'react-i18next';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import Form from '@mode2/components/Form';
import { useAppStore } from '@mode2/zustand/appStore';
import { useEffect, useMemo } from 'react';
import useRegister from '@mode2/usecase/useRegister';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { RegisterPayload } from '@mode2API/endpoint/user/PostRegisterEndpoint';
import generateUniqueNumber from '@commonUtils/generateUniqueNumber';

export const useInvitedRegister = () => {
  const { t } = useTranslation();

  const { navToHallPage } = useNavPageClick();
  const VISITOR_REGISTER_VALUES = {
    phone: '',
    password: '',
    verifyCode: '',
    captchaId: '',
    referralCode: '',
    pushToken: '',
    isVisitor: true,
  };

  const [form] = Form.useForm();
  const temporaryReferralCode = useAppStore(
    (state) => state.temporaryReferralCode
  );
  useEffect(() => {
    form.setFieldsValue({
      referralCode: temporaryReferralCode,
    });
  }, [temporaryReferralCode]);

  const { register } = useRegister({
    successCallback: () => {
      sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
      useAppStore.getState().setTemporaryReferralCode('');
      // NavToHall
      // refreshUserState();
      navToHallPage();
    },
    isVisitor: true,
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
    }),
    [t]
  );

  const invitedRegister = (values: RegisterPayload) => {
    register(
      {
        ...VISITOR_REGISTER_VALUES,
        ...values,
        phone: generateUniqueNumber(),
        password: generateUniqueNumber(),
      },
      true
    );
  };

  return {
    form,
    validator,
    register: invitedRegister,
  };
};

export default useInvitedRegister;
