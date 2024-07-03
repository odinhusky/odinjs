import { usePostForgetPasswordMutation } from '../../index';
import { IUserInfo } from '../../../persistant/IUserInfo';
import { useMemo } from 'react';

type TriggerData = {
  appChannel: string;
  appPackageName: string;
  appVersion: string;
  deviceId: string;
  deviceModel: string;
  deviceVersion: string;
  sysLanguage: string;
  sysTimezone: string;
  phone: string;
  password: string;
  verifyCode: string;
};

type ForgetPasswordResult = {
  token: string;
  connectionIp: string;

  userId: number;
  nickname: string;
  avatar: string;
  birthday: string;
  mail: string;
  facebookUsername: string;
  whatsappUsername: string;
  twitterUsername: string;
  telegramUsername: string;
  vipLevel: number;
  userInfo: IUserInfo;
};
export const useForgetPasswordTransform = () => {
  const [triggerForget, { data, ...rest }] = usePostForgetPasswordMutation();

  const trigger = async (data: TriggerData) => {
    return triggerForget({ ...data });
  };

  const forgetPasswordResult: ForgetPasswordResult | undefined = useMemo(() => {
    if (rest.isUninitialized || rest.isError) return;
    if (rest.isSuccess && !rest.isLoading && data?.data) {
      const resp = data?.data;
      const info = resp.user_info;
      return {
        token: resp.token,
        connectionIp: resp.connection.ip,

        userId: info.user_id,
        nickname: info?.nickname || '',
        avatar: info?.avatar || '0',
        birthday: info?.birthday || '',
        mail: info?.mail || '',
        facebookUsername: info?.facebook_username || '',
        whatsappUsername: info?.whatsapp_username || '',
        twitterUsername: info?.twitter_username || '',
        telegramUsername: info?.telegram_username || '',
        vipLevel: info?.vip_level || 0,
        userInfo: info,
      };
    }
  }, [data, rest]);

  return {
    trigger,
    forgetPasswordResult,
    ...rest,
  };
};
