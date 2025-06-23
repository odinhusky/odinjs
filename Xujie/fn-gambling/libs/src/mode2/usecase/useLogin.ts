import { useEffect, useState } from 'react';
import { usePostLoginMutation, usePostOtpLoginMutation } from '../external/api';
import { AdjustEventKey } from '../utils/sdk/persistant/adjust/AdjustEventKey';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '../utils/sdk';
import { useIsLoginStore } from '../zustand/loginStore';
import { FetchMyIp } from '@libs/commonUtils';
import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { Form } from 'antd';
import { useLoadingStore } from '../zustand/components/loadingStore';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import { useOTPCountDownStore } from '../zustand/components/OTPCountDownStore';
import handleGlobalClick from '../action/handleGlobalClick';
import { useAppStore } from '@mode2/zustand/appStore';
import { useAppDeviceEventStore } from '@mode2/zustand/platform/appDeviceEventStore';
import { AppDeviceEvent } from '@mode2API/endpoint/event/PostDeviceEventEndpoint';

interface LoginProps {
  successCallback?: () => void; // 登入成功的 callback
  failCallback?: () => void; // 登入失敗的 callback
}

export const useLogin = ({ successCallback, failCallback }: LoginProps) => {
  const setIsLogin = useIsLoginStore((state) => state.setIsLogin);

  const setUserRole = useUserProfileStore((state) => state.setUserRole);

  const otpId = useOTPCountDownStore((state) => state.otpId);

  const [postLogin, { data: loginResult, isSuccess: isLoginSuccess }] =
    usePostLoginMutation();
  const [postOtpLogin, { data: optLoginResult, isSuccess: isOptLoginSuccess }] =
    usePostOtpLoginMutation();

  useEffect(() => {
    // FetchMyIp.doFetchMyIp();
  }, []);

  const login = (values: LoginPayload) => {
    setShowLoading(true);
    postLogin(values).finally(() => {
      setShowLoading(false);
    });
  };

  useEffect(() => {
    if (isLoginSuccess && loginResult?.token) {
      useAppDeviceEventStore.getState().setAppEvents([AppDeviceEvent.LOGIN]);
      sdkUtils.sendEvent(AdjustEventKey.LOGIN);
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, loginResult.token);
      sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
      useAppStore.getState().setTemporaryReferralCode('');
      if (loginResult.userRole) setUserRole(loginResult.userRole);

      setIsLogin(true);
      successCallback?.();
    } else {
      setIsLogin(false);
      failCallback?.();
    }
  }, [isLoginSuccess, loginResult]);

  const pushToken = useAppStore.getState().pushToken;

  const optLogin = (values: LoginPayload) => {
    setShowLoading(true);
    const data = {
      ...values,
      otpCode: values.verifyCode || '',
      otpId: otpId || '',
      pushToken: pushToken,
    };
    postOtpLogin(data).finally(() => {
      setShowLoading(false);
    });
  };

  useEffect(() => {
    if (isOptLoginSuccess && optLoginResult?.token) {
      useAppDeviceEventStore.getState().setAppEvents([AppDeviceEvent.LOGIN]);
      sdkUtils.sendEvent(AdjustEventKey.LOGIN);
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, optLoginResult.token);
      sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
      useAppStore.getState().setTemporaryReferralCode('');
      if (optLoginResult.userRole) setUserRole(optLoginResult.userRole);

      setIsLogin(true);
      successCallback?.();
    } else {
      setIsLogin(false);
      failCallback?.();
    }
  }, [isOptLoginSuccess, optLoginResult]);

  const [form] = Form.useForm();
  // const [submittable, setSubmittable] = useState(false); // 沒有用到的變數
  const values = Form.useWatch([], form);
  const [policyCheck, setPolicyCheck] = useState(true);
  const togglePolicyCheck = () => {
    handleGlobalClick({
      target: 'handlePolicyCheckClick',
      callback: () => {
        setPolicyCheck((pre) => !pre);
      },
    });
  };
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    handleGlobalClick({
      target: 'handlePasswordVisibilityClick',
      callback: () => {
        setPasswordVisible((pre) => !pre);
      },
    });
  };

  useEffect(() => {
    form.validateFields({ validateOnly: true });
    // .then(() => setSubmittable(true))
    // .catch(() => setSubmittable(false));
  }, [form, values]);
  const isShowLoading = useLoadingStore((state) => state.isShowLoading);
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  useEffect(() => {
    return () => {
      setShowLoading(false);
    };
  }, []);

  return {
    login,
    optLogin,
    form,
    policyCheck,
    setPolicyCheck,
    togglePolicyCheck,
    isPasswordVisible,
    setPasswordVisible,
    togglePasswordVisibility,
    isSubmitDisable: !policyCheck || isShowLoading,
    // isSubmitDisable: !submittable || !policyCheck || isShowLoading,
  };
};

export default useLogin;
