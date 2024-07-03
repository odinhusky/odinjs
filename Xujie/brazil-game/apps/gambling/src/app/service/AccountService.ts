import { useLoginTransform } from '../external/transform/account/useLoginTransform';
import { useChangeLoginPasswordTransform } from '../external/transform/account/useChangeLoginPasswordTransform';
import { useChangePhoneTransform } from '../external/transform/account/useChangePhoneTransform';
import { useRegisterTransform } from '../external/transform/account/useRegisterTransform';
import { useUserUpdateTransform } from '../external/transform/account/useUserUpdateTransform';
import { useEffect, useMemo } from 'react';
import { AppLocalStorageKey } from '../persistant/AppLocalStorageKey';
import { AppLocalStorage } from '../persistant/localstorage';
import { IUserInfo } from '../persistant/IUserInfo';
import { environment } from '../../environments/environment';
import { getDeviceId } from '../ui/hooks/useGetDeviceId';
import { appSlice } from '../reduxStore/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../gateway/socket';
import { RootState } from '../reduxStore';
import { useForgetPasswordTransform } from '../external/transform/account/useForgetPasswordTransform';

// 註冊所需資料
type RegisterData = {
  account: string;
  phone: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
};

// 登入所需資料
type LoginData = {
  account: string;
  password: string;
};

// 更新用戶資訊所需資料
type UserUpdateData = {
  nickname: string;
  avatar: string;
  birthday: string;
  mail: string;
  whatsAppUserName: string;
  facebookUserName: string;
  telegramUserName: string;
  twitterUserName: string;
};

// 修改密碼所需資料
type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
};

// 修改電話號碼所需資料
type ChangePhoneData = {
  phone: string;
};

type ForgetPasswordData = {
  phone: string;
  password: string;
  verifyCode: string;
};

export const AccountService = () => {
  const {
    trigger: triggerRegister,
    isSuccess: isRegisterSuccess,
    registerResult,
    reset: resetRegister,
  } = useRegisterTransform();
  const {
    trigger: triggerLogin,
    isSuccess: isLoginSuccess,
    loginResult,
    reset: resetLogin,
  } = useLoginTransform();

  const {
    trigger: triggerForgetPassword,
    isSuccess: isForgetPasswordSuccess,
    forgetPasswordResult,
    reset: resetForgetPassword,
  } = useForgetPasswordTransform();

  const {
    trigger: triggerChangeLoginPassword,
    isSuccess: isChangePasswordSuccess,
    reset: resetChangeLoginPassword,
  } = useChangeLoginPasswordTransform();
  const {
    trigger: triggerChangePhone,
    isSuccess: isChangePhoneSuccess,
    reset: resetChangePhone,
  } = useChangePhoneTransform();
  const {
    trigger: triggerUserUpdate,
    isSuccess: isUserUpdateSuccess,
    userUpdateResult,
    reset: resetUserUpdate,
  } = useUserUpdateTransform();

  const dispatch = useDispatch();

  const vipLevel = useSelector((state: RootState) => state.app?.vip_level);

  /**
   * init reset
   */
  useEffect(() => {
    resetRegister(); // 重置註冊狀態
    resetLogin(); // 重置登入狀態
    resetUserUpdate(); // 重置更新狀態
    resetForgetPassword();
    resetChangeLoginPassword();
    resetChangePhone();
  }, []);

  /**
   * user profile
   */
  const userInfo: IUserInfo = useMemo(() => {
    let userInfo: IUserInfo = JSON.parse(
      AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
    );
    if (
      (isRegisterSuccess && registerResult) ||
      (isForgetPasswordSuccess && forgetPasswordResult) ||
      (isLoginSuccess && loginResult) ||
      (isUserUpdateSuccess && userUpdateResult)
    ) {
      userInfo = JSON.parse(
        AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '{}'
      );
    }

    return {
      ...userInfo,
      vip_level: vipLevel,
    };
  }, [
    isRegisterSuccess,
    isLoginSuccess,
    isForgetPasswordSuccess,
    isUserUpdateSuccess,
    vipLevel,
  ]);

  /**
   * register state deps
   * Socket Connect
   */
  useEffect(() => {
    if (isRegisterSuccess && registerResult) {
      // Socket Connect
      connect(registerResult.connectionIp, registerResult.token);
      dispatch(appSlice.actions.setIsLogin(true));
      dispatch(appSlice.actions.setUserVIPLevel(registerResult.vipLevel));
      AppLocalStorage.setItem(AppLocalStorageKey.token, registerResult.token);
      AppLocalStorage.setItem(
        AppLocalStorageKey.userInfo,
        JSON.stringify(registerResult.userInfo)
      );
      AppLocalStorage.setItem(
        AppLocalStorageKey.ip,
        registerResult.connectionIp
      );
      AppLocalStorage.setItem(
        AppLocalStorageKey.userId,
        String(registerResult.userId)
      );
      AppLocalStorage.removeItem(AppLocalStorageKey.inviteUrl);
    }
  }, [isRegisterSuccess, registerResult]);

  /**
   * login state deps
   * Socket Connect
   */
  useEffect(() => {
    if (isLoginSuccess && loginResult) {
      // Socket Connect
      connect(loginResult.connectionIp, loginResult.token);
      dispatch(appSlice.actions.setIsLogin(true));
      dispatch(appSlice.actions.setUserVIPLevel(loginResult.vipLevel));
      AppLocalStorage.setItem(AppLocalStorageKey.token, loginResult.token);
      AppLocalStorage.setItem(
        AppLocalStorageKey.userInfo,
        JSON.stringify(loginResult.userInfo)
      );
      AppLocalStorage.setItem(AppLocalStorageKey.ip, loginResult.connectionIp);
      AppLocalStorage.setItem(
        AppLocalStorageKey.userId,
        String(loginResult.userId)
      );
      AppLocalStorage.removeItem(AppLocalStorageKey.inviteUrl);
    }
  }, [isLoginSuccess, loginResult]);

  /**
   * forget password state deps
   * Socket Connect
   */
  useEffect(() => {
    if (isForgetPasswordSuccess && forgetPasswordResult) {
      // Socket Connect
      connect(forgetPasswordResult.connectionIp, forgetPasswordResult.token);
      dispatch(appSlice.actions.setIsLogin(true));
      dispatch(appSlice.actions.setUserVIPLevel(forgetPasswordResult.vipLevel));
      AppLocalStorage.setItem(
        AppLocalStorageKey.token,
        forgetPasswordResult.token
      );
      AppLocalStorage.setItem(
        AppLocalStorageKey.userInfo,
        JSON.stringify(forgetPasswordResult.userInfo)
      );
      AppLocalStorage.setItem(
        AppLocalStorageKey.ip,
        forgetPasswordResult.connectionIp
      );
      AppLocalStorage.setItem(
        AppLocalStorageKey.userId,
        String(forgetPasswordResult.userId)
      );
      AppLocalStorage.removeItem(AppLocalStorageKey.inviteUrl);
    }
  }, [isForgetPasswordSuccess, forgetPasswordResult]);

  /**
   * 註冊
   * @param data
   */
  const doRegister = (data: RegisterData) => {
    const inviteUrl =
      AppLocalStorage.getItem(AppLocalStorageKey.inviteUrl) ||
      window.location.href;
    return triggerRegister({
      appChannel: 'pc',
      deviceId: getDeviceId(data.account || data.phone, 'register'),
      appPackageName: environment.appPackageName,
      deviceModel: 'WEB',
      deviceVersion: 'WEB',
      appVersion: environment.appVersion,
      sysTimezone: '',
      sysLanguage: '',
      phone: data.phone,
      account: data.account,
      password: data.password,
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
      captcha_image_key: data.captchaKey,
      captcha_image_code: data.captchaCode,
      web_uuid: '39b1e7e2-0a02-4fd2-958f-e8a85215010f',
      isSimulator: 0,
    })
      .then((response) => {
        if (
          'data' in response &&
          response?.data?.code === 200 &&
          response?.data?.data
        ) {
          AppLocalStorage.setItem(
            AppLocalStorageKey.kPhone,
            data.account || data.phone
          );
          AppLocalStorage.setItem(AppLocalStorageKey.isOldUser, 'isOldUser');
          AppLocalStorage.removeItem(AppLocalStorageKey.inviteUrl);
        }
        return response;
      })
      .finally(() => {});
  };

  /**
   * 登入
   * @param data
   */
  const doLogin = (data: LoginData) => {
    return triggerLogin({
      appChannel: 'pc',
      appPackageName: environment.appPackageName,
      deviceId: getDeviceId(data.account, 'login'),
      deviceModel: 'WEB',
      deviceVersion: 'WEB',
      appVersion: environment.appVersion,
      sysTimezone: '',
      sysLanguage: '',
      account: data.account,
      password: data.password,
    })
      .then((response) => {
        if (
          'data' in response &&
          response?.data?.code === 200 &&
          response?.data?.data
        ) {
          AppLocalStorage.setItem(AppLocalStorageKey.kPhone, data.account);
          AppLocalStorage.setItem(AppLocalStorageKey.isOldUser, 'isOldUser');
          AppLocalStorage.removeItem(AppLocalStorageKey.inviteUrl);
        }
        return response;
      })
      .finally(() => {});
  };

  /**
   * 登出
   */
  const doLogout = () => {
    resetRegister(); // 重置註冊狀態
    resetLogin(); // 重置登入狀態
    resetUserUpdate(); // 重置更新狀態
    resetForgetPassword();
    resetChangeLoginPassword();
    resetChangePhone();
    AppLocalStorage.removeItem(AppLocalStorageKey.token);
    AppLocalStorage.removeItem(AppLocalStorageKey.userInfo);
    AppLocalStorage.removeItem(AppLocalStorageKey.kPhone);
  };

  /**
   * 修改登入密碼
   * @param data
   */
  const doChangePassword = (data: ChangePasswordData) => {
    return triggerChangeLoginPassword({ ...data })
      .then((response) => {
        return response;
      })
      .finally(() => {});
  };

  /**
   * 修改電話號碼
   * @param data
   */
  const doChangePhone = (data: ChangePhoneData) => {
    triggerChangePhone({ ...data })
      .then((response) => {
        return response;
      })
      .finally(() => {});
  };

  /**
   * 更新 個人資訊
   * @param data
   */
  const doUserUpdate = (data: UserUpdateData) => {
    const token = AppLocalStorage.getItem(AppLocalStorageKey.token) || '';
    return triggerUserUpdate({
      token: token,
      nickname: data.nickname,
      avatar: data.avatar,
      birthday: data.birthday,
      mail: data.mail,
      whatsAppUserName: data.whatsAppUserName,
      facebookUserName: data.facebookUserName,
      telegramUserName: data.telegramUserName,
      twitterUserName: data.twitterUserName,
    });
  };

  const doForgetPassword = (data: ForgetPasswordData) => {
    return triggerForgetPassword({
      phone: data.phone,
      password: data.password,
      verifyCode: data.verifyCode,
      appChannel: 'mobile',
      deviceId: getDeviceId(data.phone, 'forget'),
      deviceModel: 'WEB',
      deviceVersion: 'WEB',
      sysTimezone: '',
      sysLanguage: '',
      appPackageName: environment.appPackageName,
      appVersion: environment.appVersion,
    });
  };

  return {
    userInfo,
    doRegister,
    isRegisterSuccess,
    doLogin,
    isLoginSuccess,
    doLogout,
    doUserUpdate,
    isUserUpdateSuccess,
    doChangePassword,
    isChangePasswordSuccess,
    doChangePhone,
    isChangePhoneSuccess,
    doForgetPassword,
    isForgetPasswordSuccess,
  };
};
