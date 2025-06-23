import { useEffect, useState } from 'react';
import { usePostCampaignLaunchMutation } from '../external/api';
import useActivityCenterStore, {
  ERedEnvelopRainStatus,
  ICurrentActivityData,
  IRedEnvelopeRainResult,
} from '../zustand/components/activityCenterStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useLocation } from 'react-router';
import { BasePagePathObj } from '../routerTypes/types';
import { ECampaignType } from '../external/api/endpoint/campaign/PostCampaignLaunchEndpoint';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useActivityCountdown = (data: ICurrentActivityData) => {
  const refreshActivityResult = useActivityCenterStore(
    (state) => state.refreshActivityResult
  );
  const [countdown, setCountdown] = useState<number>();
  const getCountdown = () => {
    switch (data?.type) {
      case ECampaignType.RED_ENVELOPE_RAIN: {
        const now = dayjs();
        const d = data as IRedEnvelopeRainResult;
        if (!d.nextTimes) return 0;
        return d.status === ERedEnvelopRainStatus.HALF_HOUR_BEFORE_START
          ? d.nextTimes.start.diff(now, 'second')
          : d.status === ERedEnvelopRainStatus.IN_PROGRESS
          ? d.nextTimes.end.diff(now, 'second')
          : 0;
      }

      default:
        return 0;
    }
  };

  useEffect(() => {
    if (countdown === 0 && data) {
      setCountdown(undefined);
      data.type && refreshActivityResult(data.type);
      return;
    }
  }, [countdown]);
  useEffect(() => {
    data?.type && refreshActivityResult(data.type);
  }, []);
  useEffect(() => {
    const value = getCountdown();
    if (value <= 0) return;
    const interval = setInterval(
      () =>
        setCountdown((pre) => {
          return pre ? (pre > 0 ? pre - 1 : 0) : value;
        }),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [data]);
  return countdown;
};

const useActivityCenterBase = () => {
  const location = useLocation();
  const setActiveOnHomeList = useActivityCenterStore(
    (state) => state.setActiveOnHomeList
  );
  const campaignList = useActivityCenterStore((state) => state.campaignList);
  const setCampaignList = useActivityCenterStore(
    (state) => state.setCampaignList
  );

  const [postCampaignLaunch, { data, isSuccess }] =
    usePostCampaignLaunchMutation();

  const userRole = useUserProfileStore((state) => state.userRole);

  const refreshCampaignListCount = useActivityCenterStore(
    (state) => state.refreshCampaignListCount
  );

  useEffect(() => {
    if (data && isSuccess) {
      setCampaignList(data);
    }
  }, [data, isSuccess]);

  // 角色改變刷新
  useEffect(() => {
    useActivityCenterStore.getState().refreshCampaignList();
  }, [userRole]);

  // 使用在 useTemplateLayoutBase 其他地方需要資料刷新
  // 用 useActivityCenterStore.getState().refreshCampaignList() 方式刷新
  useEffect(() => {
    const userRole = useUserProfileStore.getState().userRole;
    if ([UserRoleType.USER, UserRoleType.PLAYER].includes(userRole)) {
      postCampaignLaunch();
    }
  }, [refreshCampaignListCount]);

  useEffect(() => {
    if (location.pathname === BasePagePathObj.HallPage) {
      setActiveOnHomeList(campaignList.filter((v) => v.showOnHomePopup));
    } else {
      setActiveOnHomeList([]);
    }
  }, [campaignList, location]);
};

export default useActivityCenterBase;
