import useActivityCenterStore from '@mode2/zustand/components/activityCenterStore';
import { useMemo } from 'react';
import { ECampaignType } from '@mode2API/endpoint/campaign/PostCampaignLaunchEndpoint';
import sdkUtils from '@mode2/utils/sdk';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import { useDeepEffect } from '@libs/commonUtils';

const useActivityAutoDisplay = (
  autoDisplayWhitelist: string[] = [
    BasePagePathObj.HallPage,
    BasePagePathObj.ActivityPage,
    BasePagePathObj.InvitePage,
    BasePagePathObj.FeedBackPage,
    BasePagePathObj.RecordPage,
    BasePagePathObj.MyPage,
    BasePagePathObj.TeamClubPage,
  ]
) => {
  const location = useLocation();

  const isPageSupport = useMemo(() => {
    return autoDisplayWhitelist.includes(location.pathname);
  }, [location]);

  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );
  const setShowActivityCenterModal = useActivityCenterStore(
    (state) => state.setShowActivityCenterModal
  );
  const setCurrentActivityData = useActivityCenterStore(
    (state) => state.setCurrentActivityData
  );

  useDeepEffect(() => {
    if (
      redEnvelopeRainResult?.isAutoOpen &&
      isPageSupport &&
      sdkUtils.isCurrentLogin()
    ) {
      setCurrentActivityData(ECampaignType.RED_ENVELOPE_RAIN);
      setShowActivityCenterModal(true);
    }
  }, [redEnvelopeRainResult?.isAutoOpen, isPageSupport]);
};

export default useActivityAutoDisplay;
