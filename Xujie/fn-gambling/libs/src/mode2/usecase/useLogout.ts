import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useIsLoginStore } from '../zustand/loginStore';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import { useMode2FeedBackPageInBoxStore } from '../zustand/page/feedbackPageStore';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import {
  SentryEventPayload,
  SentryPayloadType,
  SentryUserProfile,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { LOGOUT_URL } from '@mode2API/urls';
import { fetchBatch } from '@libs/commonUtils';
import { initData } from '@mode2API/requestInitData';
import { UserRoleType } from '../@types/userRoleTypes';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';
import useLowBalanceRechargeModalStore from '@mode2/zustand/modal/LowBalanceRechargeModal';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';
import useDepositJackpotWheelModalStore from '../zustand/modal/DepositJackpotWheelModal';

const handleSetGuestProfileForSaleSmartChat = () => {
  const packagename = import.meta.env['VITE_PACKAGENAME'];

  sdkUtils.clearUserChatProfile();
  sdkUtils.setUserChatProfile({
    userName: `guest_${sdkUtils.getDeviceID()}`, // 对应用户名
    description: `username: guest \n platform: ${packagename} \n deviceId: ${sdkUtils.getDeviceID()}`,
    labelNames: [],
  });
};

const handleSentryGuestUser = () => {
  const userInfo: SentryUserProfile = {
    id: '',
    username: 'guest',
    ip_address: useFetchMyIpStore.getState().ip,
    device_id: sdkUtils.getDeviceID(),
    current_token: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
  };

  sdkUtils.sendAnalyticsEvent<SentryEventPayload>({
    event: 'sentry.guest',
    sentryType: SentryPayloadType.USER,
    severityLevel: 'info',
    profile: JSON.stringify(userInfo),
  });

  sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
    event: 'posthog.logout',
    postHogType: PostHogPayloadType.LOGOUT,
    parameter: '',
  });
};

const resetDataAfterLogout = () => {
  // 清除 zustand 中的資料變回預設值
  // TODO 依照其他需求清空資料
  useIsLoginStore.getState().setIsLogin(false);
  // kyc
  // useKycDataStore.getState().resetKycData();
  // 遊戲收藏
  // useGameListStore.getState().setFavoriteGameList([]);
  // 站內信
  // useMode2FeedBackPageInBoxStore.getState().setNoticeUnreadCount(0);
  // useMode2FeedBackPageInBoxStore.getState().setMailUnreadCount(0);
  // user profile
  // useUserProfileStore.getState().clear();
  // useMyPageStore.getState().clear();

  // 使用者相關
  const resetUserDataFromClear = [
    // 遊戲收藏
    useGameListStore.getState().clear,
    // 站內信
    useMode2FeedBackPageInBoxStore.getState().clear,
    // user profile
    useUserProfileStore.getState().clear,
    useMyPageStore.getState().clear,
  ];

  resetUserDataFromClear.forEach((clear) => clear());

  // 限時優惠相關
  const resetLimitedOffersEndTime = [
    useLowBalanceRechargeModalStore.getState()
      .upLowBalanceRechargeLimitedOffersEndTime,
    useLowBalanceRescueBoxModalStore.getState()
      .upLowBalanceRescueBoxLimitedOffersEndTime,
    useDepositJackpotWheelModalStore.getState()
      .setDoubleBuffRechargeBonusLimitedEndTime,
    useDepositJackpotWheelModalStore.getState()
      .setDepositJackpotWheelRemainSpin,
  ];

  resetLimitedOffersEndTime.forEach((setEndTime) => setEndTime(0));

  // 清除 indexDB 中固化的資料
  // usePlatformInfoStore.getState().clear();
};

// NOTE Evan logout api 不走 RTK Query
export const logoutApi = async () => {
  const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '';
  const lang = sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en-US';
  const isEnableCrypto = import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1';
  const requestData = await initData({ reqData: {} });
  const dataBody = isEnableCrypto
    ? sdkUtils.encryption(JSON.stringify(requestData))
    : JSON.stringify(requestData);

  fetchBatch(LOGOUT_URL, {
    method: 'POST',
    headers: {
      ContentType: 'application/x-www-form-urlencoded',
      'Accept-Language': lang,
      Token: token,
      CacheControl: 'max-age=3',
    },
    body: dataBody,
  });
};

// 改為一般的 function
export const logout = () => {
  // 打 API logout
  logoutApi();

  // 移除 token
  sdkUtils.removeStorage(AppLocalStorageKey.TOKEN);
  sdkUtils.removeStorage(AppLocalStorageKey.USER_ID);
  // reset 相關資料
  // console.log('@@@===> logout');
  resetDataAfterLogout();

  // 重新設置 smartChatProfile
  handleSetGuestProfileForSaleSmartChat();

  // 重新設置 Sentry 定位使用者資訊
  handleSentryGuestUser();

  // Reset Use Role
  useUserProfileStore.getState().setUserRole(UserRoleType.GUEST);

  // 登出回首頁
  // navToHallPage();
  // navigate(BasePagePathObj.HallPage);
};
