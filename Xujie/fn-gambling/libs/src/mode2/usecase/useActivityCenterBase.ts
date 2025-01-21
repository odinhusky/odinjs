import { useEffect, useState } from 'react';
import { usePostCampaignLaunchMutation } from '../external/api';
import useActivityCenterStore, {
  ERedEnvelopRainStatus,
  ICurrentActivityData,
  IRedEnvelopeRainResult,
} from '../zustand/components/activityCenterStore';
import { useIsLoginStore } from '../zustand/loginStore';
import dayjs from 'dayjs';
import { useLocation } from 'react-router';
import { BasePagePathObj } from '../routerTypes/types';
import { ECampaignType } from '../external/api/endpoint/campaign/PostCampaignLaunchEndpoint';

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
  const { setActiveOnHomeList, campaignList, setCampaignList } =
    useActivityCenterStore((state) => ({
      setActiveOnHomeList: state.setActiveOnHomeList,
      campaignList: state.campaignList,
      setCampaignList: state.setCampaignList,
    }));
  const [postCampaignLaunch] = usePostCampaignLaunchMutation();
  const isLogin = useIsLoginStore((state) => state.isLogin);

  useEffect(() => {
    if (isLogin) {
      if (campaignList.length) return;
      postCampaignLaunch().then((res) => {
        if ('data' in res && res.data) {
          setCampaignList(res.data);
        }
      });
    } else {
      setCampaignList([]);
    }
  }, [isLogin]);

  const location = useLocation();

  // const redEnvelopeRainResult = useActivityCenterStore(
  //   (state) => state.redEnvelopeRainResult
  // );
  // const setShowActivityCenterModal = useActivityCenterStore(
  //   (state) => state.setShowActivityCenterModal
  // );
  // const setCurrentActivityData = useActivityCenterStore(
  //   (state) => state.setCurrentActivityData
  // );

  // useEffect(() => {
  //   if (redEnvelopeRainResult?.isAutoOpen) {
  //     setCurrentActivityData(redEnvelopeRainResult.type);
  //     setShowActivityCenterModal(true);
  //   }
  // }, [redEnvelopeRainResult?.isAutoOpen]);

  useEffect(() => {
    if (location.pathname === BasePagePathObj.HallPage && isLogin) {
      setActiveOnHomeList(campaignList.filter((v) => v.showOnHomePopup));
    } else {
      setActiveOnHomeList([]);
    }
  }, [campaignList, location, isLogin]);
};

export default useActivityCenterBase;
