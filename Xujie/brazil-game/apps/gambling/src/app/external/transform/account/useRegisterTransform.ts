import { usePostRegisterMutation } from '../../index';
import { useMemo } from 'react';
import { IUserInfo } from '../../../persistant/IUserInfo';

type WebFinger = {
  canvas: string;
  screenWidth: number;
  webgl: string;
  cpuSize: number;
  inviteUrl: string;
  userAgent: string;
};
type TriggerData = {
  appChannel: string;
  appPackageName: string;
  appVersion: string;
  deviceVersion: string;
  deviceId: string;
  deviceModel: string;
  sysLanguage: string;
  sysTimezone: string;
  account?: string;
  password: string;
  phone: string;
  verifyCode: string;
  installTime: string;
  captcha_image_key: string;
  captcha_image_code: string;
  web_finger: WebFinger;
  web_uuid: string;
  isSimulator: number;
};

type RegisterResult = {
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

export const useRegisterTransform = () => {
  const [triggerRegister, { data, ...rest }] = usePostRegisterMutation();

  const trigger = async (data: TriggerData) => {
    return triggerRegister({ ...data });
  };

  const registerResult: RegisterResult | undefined = useMemo(() => {
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
    registerResult,
    ...rest,
  };
};
