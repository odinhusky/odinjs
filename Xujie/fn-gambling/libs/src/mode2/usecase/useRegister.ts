import { useEffect, useState } from 'react';
import {
  usePostCaptchaMutation,
  usePostRegisterMutation,
} from '../external/api';
import { RegisterPayload } from '../external/api/endpoint/user/PostRegisterEndpoint';
import { AdjustEventKey } from '../utils/sdk/persistant/adjust/AdjustEventKey';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '../utils/sdk';
import { useIsLoginStore } from '../zustand/loginStore';
import { FetchMyIp } from '@libs/commonUtils';
import { useAppStore } from '@mode2/zustand/appStore';
import { useReminderModalStore } from '../zustand/components/reminderModalStore';
import { useLoadingStore } from '../zustand/components/loadingStore';
import { Form } from 'antd';

import { useDebounceAction } from '../action/common/handleAction';
interface RegisterProps {
  successCallback?: () => void; // 登入成功的 callback
  failCallback?: () => void; // 登入失敗的 callback
}

export const useRegister = ({
  successCallback,
  failCallback,
}: RegisterProps) => {
  const setShowReminderModal = useReminderModalStore(
    (state) => state.setShowReminderModal
  );
  const setRegisterBonus = useReminderModalStore(
    (state) => state.setRegisterBonus
  );
  const setIsLogin = useIsLoginStore((state) => state.setIsLogin);

  const [postRegister, { data, isSuccess, status }] = usePostRegisterMutation();

  useEffect(() => {
    FetchMyIp.doFetchMyIp();
  }, []);

  const register = (values: RegisterPayload) => {
    const referralCode =
      sdkUtils.getStorage(AppLocalStorageKey.REFERRAL_CODE) || undefined;
    const pushToken = useAppStore.getState().pushToken;
    setShowLoading(true);
    postRegister({
      ...values,
      referralCode: referralCode,
      pushToken: pushToken,
    }).finally(() => {
      setShowLoading(false);
    });
  };

  useEffect(() => {
    if (isSuccess && data?.token) {
      sdkUtils.sendEvent(AdjustEventKey.REGISTER);
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, data.token);
      setShowReminderModal(data.isShowPopup);
      setRegisterBonus(data.registerBonus);
      setIsLogin(true);
      sdkUtils.setStorage(AppLocalStorageKey.IS_OLD_USER, 'false');
      sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
      successCallback?.();
    } else {
      // NOTICE isSuccess = false 可能是未提交状态
      // failCallback?.();
    }
    if (status === 'rejected') {
      refreshCaptcha();
      failCallback?.();
    }
  }, [isSuccess, data, status]);

  const [postCaptcha, { isLoading }] = usePostCaptchaMutation();
  const isShowLoading = useLoadingStore((state) => state.isShowLoading);
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  const [captcha, setCaptcha] = useState({
    isEnabled: false,
    captchaId: '',
    base64CaptchaImg: '',
  });
  const refreshCaptcha = useDebounceAction(() => {
    setShowLoading(true);
    postCaptcha()
      .then((res) => {
        if ('data' in res && res.data) {
          setCaptcha(res.data);
        }
      })
      .finally(() => {
        setShowLoading(false);
      });
  }, 1000);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((pre) => !pre);
  };

  return {
    form,
    register,
    captcha: {
      ...captcha,
      isLoading,
      refresh: refreshCaptcha,
    },
    isSubmitDisable: isShowLoading || !submittable,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

export default useRegister;
