import renderI18N from '@libs/commonUtils/renderI18N';
import { getParams } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';

import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@libs/mode2/zustand/loginStore';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useLoginPageSwitchForm = () => {
  const location = useLocation();

  const setFormTabs = useIsShowLoginModalStore((state) => state.setFormTabs);
  const setCurrentFormTab = useIsShowLoginModalStore(
    (state) => state.setCurrentFormTab
  );
  const currentFormTab = useIsShowLoginModalStore(
    (state) => state.currentFormTab
  );
  const isShowLoginModal = useIsShowLoginModalStore(
    (state) => state.isShowLoginModal
  );
  const setReferralCode = useIsShowLoginModalStore(
    (state) => state.setReferralCode
  );

  const formTabs = [
    {
      label: renderI18N({ i18nKey: 'login_verification_code_login' }, t),
      active: currentFormTab === LoginFormType.OTP_LOGIN,
      onAction: () => {
        setCurrentFormTab(LoginFormType.OTP_LOGIN);
      },
    },
    {
      label: renderI18N({ i18nKey: 'login_password_login' }, t),
      active: currentFormTab === LoginFormType.LOGIN,
      onAction: () => {
        setCurrentFormTab(LoginFormType.LOGIN);
      },
    },
  ];

  useEffect(() => {
    setFormTabs(formTabs);
  }, [currentFormTab, isShowLoginModal]);

  const params = getParams(['referral_code'], location.search, location.state);
  useEffect(() => {
    const { referral_code } = params || location.state || {};

    const referralCode =
      sdkUtils.getStorage(AppLocalStorageKey.REFERRAL_CODE) || undefined;

    const code = referralCode || referral_code;

    setReferralCode(code as string);
    setCurrentFormTab(LoginFormType.OTP_LOGIN);
  }, [location]);
};

export default useLoginPageSwitchForm;
