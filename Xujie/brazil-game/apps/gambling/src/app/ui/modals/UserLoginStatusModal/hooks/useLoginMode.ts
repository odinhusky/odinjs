import { useDispatch, useSelector } from 'react-redux';
import {
  usePostForgetPasswordMutation,
  usePostLoginMutation,
  usePostRegisterMutation,
} from '../../../../external';
import { getDeviceId } from '../../../hooks/useGetDeviceId';
import { environment } from '../../../../../environments/environment';
import { setLoginLocalStorage } from '../../../../persistant/setLoginLocalStorage';
import { appSlice } from '../../../../reduxStore/appSlice';
import { connect } from '../../../../gateway/socket';
import t from '../../../components/LoginModal/lang';
import { AppLocalStorage } from 'apps/gambling/src/app/persistant/localstorage';
import { AppLocalStorageKey } from 'apps/gambling/src/app/persistant/AppLocalStorageKey';
import { ILoginModeProps } from '../../../components/LoginModal/types';
import { RootState } from 'apps/gambling/src/app/reduxStore';

const validatePasswordInput = (data: string) => {
  const valid = !data.includes(' ') && data.length >= 4 && data.length <= 16;
  if (!valid) {
    return new Error(t['pwdError']);
  }
};
const validatePhoneInput = (data: string) => {
  const valid = data.length === 10 || data.length === 11;
  if (!valid) {
    return new Error(t['phoneNumberError']);
  }
};
const validateConfirmPhoneInput = (data: string, values: any) => {
  if (data !== values.phone) {
    return new Error(t['phoneNumberDifferent']);
  }
};

const validateCaptchaInput = (data: string) => {
  if (!data) {
    return new Error(t['enterVerify']);
  }
};
const validateVerifyCodeInput = (data: string) => {
  if (!data) {
    return new Error(t['enterVerify']);
  }
};
const useLoginMode = (props: {
  setIsLogin: (isLogin: boolean) => void;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const [triggerLogin] = usePostLoginMutation();
  const [triggerRegister, { isLoading: registerLoading, isError, isSuccess }] =
    usePostRegisterMutation();
  const [triggerForgetpassword] = usePostForgetPasswordMutation();
  const login: ILoginModeProps['service']['login'] = async (formValue) => {
    try {
      const response = await triggerLogin({
        appChannel: 'pc',
        appPackageName: environment.appPackageName,
        deviceId: getDeviceId(formValue.phone, 'login'),
        deviceModel: 'WEB',
        deviceVersion: 'WEB',
        appVersion: environment.appVersion,
        sysTimezone: '',
        sysLanguage: '',
        account: formValue.phone,
        password: formValue.password,
      });
      console.log('[debug]triggerLogin-data', response);
      if (!(response as any).error) {
        setLoginLocalStorage({
          token: (response as any).data?.data?.token,
          userInfo: (response as any).data?.data?.user_info,
          kPhone: formValue.phone,
          kPassword: formValue.password,
          amount: 100,
          ip: (response as any).data?.data?.connection?.ip,
        });
        dispatch(
          appSlice.actions.setUserVIPLevel(
            (response as any).data?.data?.user_info?.vip_level
          )
        );

        const url = (response as any).data?.data?.connection?.ip;
        const token = (response as any).data?.data?.token;
        if (token && url) connect(url, token);
        props.setIsLogin(true);
        props.onClose();
        return Promise.resolve();
      }
      return Promise.reject((response as any).error);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const register: ILoginModeProps['service']['register'] = async (
    formValue
  ) => {
    if (!formValue.captcha.key) {
      return;
    }
    if (registerLoading) {
      return;
    }
    const inviteUrl =
      AppLocalStorage.getItem(AppLocalStorageKey.inviteUrl) ||
      window.location.href;
    try {
      const response = await triggerRegister({
        appChannel: 'pc',
        deviceId: getDeviceId(formValue.phone, 'register'),
        appPackageName: environment.appPackageName,
        deviceModel: 'WEB',
        deviceVersion: 'WEB',
        appVersion: environment.appVersion,
        sysTimezone: '',
        sysLanguage: '',
        phone: formValue.phone,
        password: formValue.password,
        verifyCode: 'register',
        web_finger: {
          cpuSize: 10,
          canvas: '76b55d9781385eac47339cc7c2f88340',
          webgl: 'f2334ad6094e54920ca9fb85c526c843',
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          inviteUrl: inviteUrl,
        },
        installTime: String(new Date().getTime()),
        captcha_image_key: formValue.captcha.key,
        captcha_image_code: formValue.captcha.code,
        web_uuid: '39b1e7e2-0a02-4fd2-958f-e8a85215010f',
        isSimulator: 0,
      });
      if (!(response as any).error) {
        setLoginLocalStorage({
          token: (response as any).data?.data?.token,
          userInfo: (response as any).data?.data?.user_info,
          kPhone: formValue.phone,
          kPassword: formValue.password,
          amount: 100,
          ip: (response as any).data?.data?.connection?.ip,
        });
        const url = (response as any).data?.data?.connection?.ip;
        const token = (response as any).data?.data?.token;
        if (url && token) connect(url, token);
        props.setIsLogin(true);
        props.onClose();
        return Promise.resolve();
      } else {
        return Promise.reject((response as any).error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const forgetPassword: ILoginModeProps['service']['forgetPassword'] = async (
    formValue
  ) => {
    try {
      const response = (await triggerForgetpassword({
        phone: formValue.phone,
        password: formValue.password,
        verifyCode: formValue.verifyCode,
        appChannel: 'mobile',
        deviceId: getDeviceId(formValue.phone, 'forget'),
        deviceModel: 'WEB',
        deviceVersion: 'WEB',
        sysTimezone: '',
        sysLanguage: '',
        appPackageName: environment.appPackageName,
        appVersion: environment.appVersion,
      })) as any;

      if (!response.error) {
        setLoginLocalStorage({
          token: response.data?.data?.token,
          userInfo: response.data?.data?.user_info,
          kPhone: formValue.phone,
          kPassword: formValue.password,
          amount: 100,
          ip: response.data?.data?.connection?.ip,
        });

        const url = response.data?.data?.connection?.ip;
        const token = response.data?.data?.token;
        if (url && token) connect(url, token);
        props.setIsLogin(true);
        props.onClose();
        return Promise.resolve();
      }
      return Promise.reject(response.error);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const defaultStatusType = useSelector(
    (rootState: RootState) => rootState.app.loginUIStatusType
  );
  return {
    service: {
      login,
      register,
      forgetPassword,
    },
    validator: {
      password: validatePasswordInput,
      confirmPhone: validateConfirmPhoneInput,
      captcha: validateCaptchaInput,
      phone: validatePhoneInput,
      verifyCode: validateVerifyCodeInput,
    },
    onClose: props.onClose,
    defaultStatusType,
  };
};
export default useLoginMode;
