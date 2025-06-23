import { useTranslation } from 'react-i18next';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import Form from '@mode2/components/Form';
import { useAppStore } from '@mode2/zustand/appStore';
import { useEffect } from 'react';
import useRegister from '@mode2/usecase/useRegister';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { RegisterPayload } from '@mode2API/endpoint/user/PostRegisterEndpoint';
import { PhoneNumberValidator } from '@/validator/antdValidator';
import usePopPageStore from '@libs/mode2/zustand/page/PopPage';

export const useInvitedRegister = () => {
  const { t } = useTranslation();

  const PhoneNumberValidatorInstance = PhoneNumberValidator(t);

  const setShowPopPageRegitsterSuccessModal = usePopPageStore(
    (state) => state.setShowPopPageRegitsterSuccessModal
  );
  const setHasToken = usePopPageStore((state) => state.setHasToken);

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
      setHasToken(true); // 設定有 Token 並且 disabled input

      const isIOSKernel = sdkUtils.isIOSKernel();

      if (isIOSKernel) {
        navToHallPage();
      } else {
        // 有 token 但不是安著內核
        setShowPopPageRegitsterSuccessModal(true);
      }
    },
    isVisitor: true,
  });

  const invitedRegister = (values: RegisterPayload) => {
    register(
      {
        ...VISITOR_REGISTER_VALUES,
        ...values,
        // phone: generateUniqueNumber(),
        // password: generateUniqueNumber(),
      },
      true
    );
  };

  return {
    form,
    validator: {
      phone: PhoneNumberValidatorInstance.phone,
    },
    register: invitedRegister,
  };
};

export default useInvitedRegister;
