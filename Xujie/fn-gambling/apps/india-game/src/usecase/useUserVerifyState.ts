import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { isEmpty } from 'lodash';

export const useUserVerifyState = () => {
  const checkIsPersonalInfoFirstBind = (): boolean => {
    const realPhone = useUserProfileStore.getState().realPhone;
    return isEmpty(realPhone) || isNaN(Number(realPhone));
  };

  /**
   * 是否錢包充值前認證通過
   */
  const requiredVerifyBeforeRecharging = (): boolean => {
    return false;
  };

  const checkIsBankFirstBind = (): boolean => {
    const isBankFirstBind = useUserProfileStore.getState().isBankFirstBind;
    return checkIsPersonalInfoFirstBind() || isBankFirstBind;
  };

  /**
   * 認證個人資訊是否有提交過名稱
   * nickname 新註冊用戶會是 number，用這判斷是否提交過
   */
  const hasCertificationPersonalInfoNickname = (): boolean => {
    const nickname = useUserProfileStore.getState().nickname;
    return isNaN(Number(nickname));
  };

  /**
   * 是否定過電話號碼
   */
  const hasRealPhone = (): boolean => {
    const realPhone = useUserProfileStore.getState().realPhone;
    return !isEmpty(realPhone) || !isNaN(Number(realPhone));
  };

  return {
    checkIsPersonalInfoFirstBind,
    requiredVerifyBeforeRecharging,
    checkIsBankFirstBind,
    hasCertificationPersonalInfoNickname,
    hasRealPhone,
  };
};
