import { usePostUserUpdateMutation } from '../../index';
import { IUserInfo } from '../../../persistant/IUserInfo';
import { useMemo } from 'react';

type TriggerData = {
  token: string;
  nickname: string;
  avatar: string;
  birthday: string;
  mail: string;
  whatsAppUserName: string;
  facebookUserName: string;
  telegramUserName: string;
  twitterUserName: string;
};


type UserUpdateResult = {
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
export const useUserUpdateTransform = () => {
  const [triggerUpdate, {data ,  ...rest }] = usePostUserUpdateMutation();

  const trigger = async (data: TriggerData) => {
    return triggerUpdate({...data});
  };
  
  const userUpdateResult: UserUpdateResult | undefined = useMemo(() => {
    if (rest.isUninitialized || rest.isError) return ;
    if (rest.isSuccess && !rest.isLoading && data?.data) {
      const resp = data?.data;
      const info = resp.user_info;

      return {
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
    userUpdateResult,
    ...rest,
  };
};
