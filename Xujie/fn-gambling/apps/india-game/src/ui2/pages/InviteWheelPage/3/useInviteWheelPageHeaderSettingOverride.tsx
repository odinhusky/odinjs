import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import InvitationWheelHeader from './components/InvitationWheelHeader';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import { useDeepEffect } from '@libs/commonUtils';
import isEmpty from 'lodash/isEmpty';
import { useInviteWheelPageStoreStore } from '@mode2/zustand/page/inviteWheelPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const useInviteWheelPageHeaderSettingOverride = () => {
  const thisPath = BasePagePathObj.InviteWheelPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const referralCode = useUserProfileStore((state) => state.referralCode);
  const referralLink = useUserProfileStore((state) => state.referralLink);

  const refreshPromoteHomeData = useMode2InviteEarnStore(
    (state) => state.refreshPromoteHomeData
  );

  const { inviteWheelPortalInfo, setIsShowInviteWheelTipsModal } =
    useInviteWheelPageStoreStore((state) => ({
      inviteWheelPortalInfo: state.inviteWheelPortalInfo,
      setIsShowInviteWheelTipsModal: state.setIsShowInviteWheelTipsModal,
    }));

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        headerBgColor: 'var(--linear-12)',
        render: () => {
          return <InvitationWheelHeader />;
        },
      });
    }
  }, []);

  useDeepEffect(() => {
    if (isEmpty(referralCode) || isEmpty(referralLink)) {
      refreshPromoteHomeData();
    }
  }, [referralLink]);

  useEffect(() => {
    if (
      inviteWheelPortalInfo.cumulativeReward > 0 &&
      inviteWheelPortalInfo.cumulativeReward >=
        inviteWheelPortalInfo.withdrawRequire
    ) {
      setIsShowInviteWheelTipsModal(true);
    }
  }, [inviteWheelPortalInfo]);
};

export default useInviteWheelPageHeaderSettingOverride;
