import { useCallback, useEffect } from 'react';
import {
  usePostDownloadReceivePrizeMutation,
  usePostPlayerMainInfoMutation,
  usePostRemoveLevelCacheMutation,
} from '@mode2API/index';
import sdkUtils from '@mode2/utils/sdk';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { PlayerMainInfoResult } from '../external/api/endpoint/user/PostPlayerMainInfoEndpoint';
import {
  SensorsEventLabel,
  SensorsEventPayload,
  SensorsPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/SensorsAnalytics';
import { useActiveUserEvent } from '@mode2/usecase/useActiveUserEvent';
import {
  SentryEventPayload,
  SentryPayloadType,
  SentryUserProfile,
} from '@mode2/utils/sdk/strategy/analytics/SentryAnalytics';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useDeepEffect, useUpdateEffect } from '@libs/commonUtils';
import { UserRoleType } from '../@types/userRoleTypes';
import { replaceSubdomainWithWWW } from '@mode2/utils';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

const REFRESH_THRESHOLD = 3 * 1000;

const useUserInfo = () => {
  const { doActiveEventReport } = useActiveUserEvent();

  const [
    postPlayerMainInfo,
    { data: mainInfo, isSuccess, isError, isLoading, reset },
  ] = usePostPlayerMainInfoMutation();
  const [playerRemoveLevelCache] = usePostRemoveLevelCacheMutation();
  const [triggerDownloadReceivePrize] = usePostDownloadReceivePrizeMutation();

  const setId = useUserProfileStore((state) => state.setId);
  const setPlayerName = useUserProfileStore((state) => state.setPlayerName);
  const setRealPhone = useUserProfileStore((state) => state.setRealPhone);
  const setNickname = useUserProfileStore((state) => state.setNickname);
  const setAvatarOrder = useUserProfileStore((state) => state.setAvatarOrder);
  const setAvatarFrameOrder = useUserProfileStore(
    (state) => state.setAvatarFrameOrder
  );

  const setPasswordExp = useUserProfileStore((state) => state.setPasswordExp);
  const setLevel = useUserProfileStore((state) => state.setLevel);
  const setTotalAssets = useUserProfileStore((state) => state.setTotalAssets);
  const setLastApiUpdateTime = useUserProfileStore(
    (state) => state.setLastApiUpdateTime
  );
  const setLowBalance = useUserProfileStore((state) => state.setLowBalance);
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const setUserRole = useUserProfileStore((state) => state.setUserRole);

  const setGender = useUserProfileStore((state) => state.setGender);
  const setHasSetPassword = useUserProfileStore(
    (state) => state.setHasSetPassword
  );
  const setReferralCode = useUserProfileStore((state) => state.setReferralCode);
  const setReferralLink = useUserProfileStore((state) => state.setReferralLink);
  const setBindReferralCode = useUserProfileStore(
    (state) => state.setBindReferralCode
  );
  const setDisplayUserName = useUserProfileStore(
    (state) => state.setDisplayUserName
  );

  const refreshUserDataCount = useUserProfileStore(
    (state) => state.refreshUserDataCount
  );
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const setIsAPIMainInfoLoading = useUserProfileStore(
    (state) => state.setIsAPIMainInfoLoading
  );

  const handleSetProfileForSaleSmartChat = (mainInfo: PlayerMainInfoResult) => {
    const packagename = import.meta.env['VITE_PACKAGENAME'];

    sdkUtils.setUserChatProfile({
      userName: `${mainInfo.nickname}`, // 对应用户名
      description: `username: ${mainInfo.nickname} \n userId: ${
        mainInfo.playerId
      } \n vipLevel: ${
        mainInfo.level
      } \n platform: ${packagename} \n deviceId: ${sdkUtils.getDeviceID()}`,
      labelNames: [`vip_level_${mainInfo.level}`],
    });
  };

  // Sentry 定位使用者資訊
  const handleSentryUser = (mainInfo: PlayerMainInfoResult) => {
    const userInfo: SentryUserProfile = {
      id: `${mainInfo.playerId}`,
      username: mainInfo.nickname,
      ip_address: useFetchMyIpStore.getState().ip,
      device_id: sdkUtils.getDeviceID(),
      current_token: sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '',
    };

    sdkUtils.sendAnalyticsEvent<SentryEventPayload>({
      event: 'sentry.user',
      sentryType: SentryPayloadType.USER,
      severityLevel: 'info',
      profile: JSON.stringify(userInfo),
    });

    sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
      event: 'posthog.user',
      postHogType: PostHogPayloadType.USER,
      parameter: '',
    });
  };

  const handleRefreshUserData = useCallback(() => {
    if (isLogin) {
      postPlayerMainInfo();
    }
  }, [isLogin]);

  useDeepEffect(() => {
    if (isSuccess && mainInfo) {
      // [BI]活躍用戶上報
      doActiveEventReport();

      // [BI]神策
      sdkUtils.sendAnalyticsEvent<SensorsEventPayload>({
        event: 'sensors.login',
        sensorsType: SensorsPayloadType.LOGIN,
        label: SensorsEventLabel.LOGIN,
        profile: `${mainInfo.playerId}`,
      });

      setId(mainInfo.playerId);
      setPlayerName(mainInfo.playerName);
      setRealPhone(mainInfo.realPhone);
      setNickname(mainInfo.nickname);
      setAvatarOrder(mainInfo.avatarOrder);
      setAvatarFrameOrder(mainInfo.avatarFrameOrder);
      setPasswordExp(mainInfo.isPasswordExp);
      setLevel(mainInfo.level);
      setTotalAssets(mainInfo.totalAssets);
      setLastApiUpdateTime(dayjs().unix());
      setLowBalance(mainInfo.isLowBalance);
      setUserRole(mainInfo.userRole);
      setGender(mainInfo.gender);
      setHasSetPassword(mainInfo.hasSetPassword);
      setReferralCode(mainInfo.referralCode);
      // setReferralLink(
      //   `${location.origin}/pop?referral_code=${mainInfo.referralCode.toUpperCase()}`
      // );
      setReferralLink(
        `${replaceSubdomainWithWWW()}/pop?referral_code=${
          mainInfo.referralCode.toUpperCase()
        }`
      );
      setBindReferralCode(mainInfo.bindReferralCode);

      if (mainInfo.isLevelPopup) {
        playerRemoveLevelCache();
      }
      const needDownloadReceivePrize = mainInfo.needDownloadReceivePrize;
      if (needDownloadReceivePrize && sdkUtils.isInNative()) {
        triggerDownloadReceivePrize();
      }

      handleSetProfileForSaleSmartChat(mainInfo);

      // 定位 Sentry 使用者資訊
      handleSentryUser(mainInfo);
      reset();

      const displayUserName = getDisplayUserName(mainInfo);
      setDisplayUserName(displayUserName);
    }
  }, [mainInfo, isSuccess, isLoading]);

  useDeepEffect(() => {
    if (isError) {
      useUserProfileStore.getState().setLastApiUpdateTime(dayjs().unix());
    }
  }, [isError]);

  useEffect(() => {
    // 紀錄是否還在 fetch user data
    setIsAPIMainInfoLoading(isLoading);

    // 判斷是否要送出 fetch user data
    if (isLoading) return;

    const lastApiUpdateTime = useUserProfileStore.getState().lastApiUpdateTime;

    /** 第一次進入或超過threshold才發請求 */
    const needRefresh =
      !lastApiUpdateTime ||
      (dayjs().unix() > lastApiUpdateTime + REFRESH_THRESHOLD &&
        !!lastApiUpdateTime);

    if (needRefresh) {
      refreshUserData();
    }
  }, [isLoading]);

  // 觸發打 API 的地方，固定只有單一個 dependency真正打 API 的地方
  useUpdateEffect(() => {
    handleRefreshUserData();
  }, [refreshUserDataCount]);

  // 是否修改過暱稱
  const getDisplayUserName = (mainInfo: PlayerMainInfoResult) => {
    const isGuest = mainInfo.userRole === UserRoleType.GUEST;
    if (isGuest) {
      return 'Guest';
    }

    if (mainInfo.playerName === mainInfo.nickname) {
      return `Player${mainInfo.nickname}`;
    } else {
      return `${mainInfo.nickname}`;
    }
  };
};

export default useUserInfo;
