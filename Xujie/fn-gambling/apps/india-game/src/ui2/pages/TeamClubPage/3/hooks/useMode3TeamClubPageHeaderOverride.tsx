import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import TeamClubPageTabList from '../components/TeamClubPageTabList';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';
import { usePostInviteDailyConfigMutation } from '@libs/mode2/external/api';
import isEmpty from 'lodash/isEmpty';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';

export const useMode3TeamClubPageHeaderOverride = () => {
  const [postInviteDailyConfig, { data: inviteDailyConfigData }] =
    usePostInviteDailyConfigMutation();

  const thisPath = BasePagePathObj.TeamClubPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setInviteDailyRule = useTeamClubRulesStore(
    (state) => state.setInviteDailyRule
  );

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Empty,
        render: () => {
          return <TeamClubPageTabList />;
        },
      });

      postInviteDailyConfig();
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(inviteDailyConfigData)) {
      setInviteDailyRule(inviteDailyConfigData);
    }
  }, [inviteDailyConfigData]);
};

export default useMode3TeamClubPageHeaderOverride;
