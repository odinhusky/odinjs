import { useEffect, useState } from 'react';
import { usePostLoginMutation } from '../external/api';
import { AdjustEventKey } from '../utils/sdk/persistant/adjust/AdjustEventKey';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '../utils/sdk';
import { useIsLoginStore } from '../zustand/loginStore';
import { FetchMyIp } from '@libs/commonUtils';
import { LoginPayload } from '@mode2API/endpoint/user/PostLoginEndpoint';
import { Form } from 'antd';
import { useLoadingStore } from '../zustand/components/loadingStore';

interface LoginProps {
  successCallback?: () => void; // 登入成功的 callback
  failCallback?: () => void; // 登入失敗的 callback
}

export const useLogin = ({ successCallback, failCallback }: LoginProps) => {
  const setIsLogin = useIsLoginStore((state) => state.setIsLogin);

  const [postLogin, { data: loginResult, isSuccess: isLoginSuccess }] =
    usePostLoginMutation();

  useEffect(() => {
    FetchMyIp.doFetchMyIp();
  }, []);

  const login = (values: LoginPayload) => {
    setShowLoading(true);
    postLogin(values).finally(() => {
      setShowLoading(false);
    });
  };

  useEffect(() => {
    if (isLoginSuccess && loginResult?.token) {
      sdkUtils.sendEvent(AdjustEventKey.LOGIN);
      sdkUtils.setStorage(AppLocalStorageKey.TOKEN, loginResult.token);
      sdkUtils.removeStorage(AppLocalStorageKey.REFERRAL_CODE);
      setIsLogin(true);
      successCallback?.();
    } else {
      setIsLogin(false);
      failCallback?.();
    }
  }, [isLoginSuccess, loginResult]);

  const [form] = Form.useForm();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);
  const [policyCheck, setPolicyCheck] = useState(true);
  const togglePolicyCheck = () => {
    setPolicyCheck((pre) => !pre);
  };
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((pre) => !pre);
  };

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
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
