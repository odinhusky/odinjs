import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import InvitationWheelHeader from '../InviteWheelPage/components/InvitationWheelHeader';
import { useMode2InviteEarnStore } from '@mode2/zustand/page/invitePageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { isEmpty } from 'lodash';

export const useInviteWheelPageHeaderSettingOverride = () => {
  const thisPath = BasePagePathObj.InviteWheelPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const referralInfo = useMode2InviteEarnStore((state) => state.referralInfo);

  const refreshPromoteHomeData = useMode2InviteEarnStore(
    (state) => state.refreshPromoteHomeData
  );

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        render: () => {
          return <InvitationWheelHeader />;
        },
      });
    }
  }, []);

  useDeepEffect(() => {
    if (isEmpty(referralInfo.code) || isEmpty(referralInfo.link)) {
      refreshPromoteHomeData();
    }
  }, [referralInfo]);
};

export default useInviteWheelPageHeaderSettingOverride;
