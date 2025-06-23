import { useEffect } from 'react';
import { handleTeamClubPageTabClick } from '@mode2/action/actionTypes';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import {
  TeamClubPageTabConfig,
  useMode2TeamClubPageActionsStore,
  useMode2TeamClubPageStore,
} from '@mode2/zustand/page/teamClubPageStore';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { today } from '@libs/constant/date';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

export const useMode2TeamClubPageTabList = () => {
  const curTab = useMode2TeamClubPageStore((state) => state.curTab);
  const setTabList = useMode2TeamClubPageStore((state) => state.setTabList);
  const setTeamClubTabActionList = useMode2TeamClubPageActionsStore(
    (state) => state.setTeamClubTabActionList
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: curTab,
  });

  const { handleTeamClubPageClick } = useTeamClubPageActions();

  const inviteTimeRedDot = useRedDotStore((state) => state.inviteTimeRedDot);
  const setInviteTimeRedDot = useRedDotStore(
    (state) => state.setInviteTimeRedDot
  );

  useEffect(() => {
    const tabDataList: TeamClubPageTabConfig[] = [
      {
        id: TeamClubPageTabType.SHARE_FOR_BONUS,
        titleKey: 'earn_tab_1',
        isShow: true,
        isShowRedDot: inviteTimeRedDot,
        isActive: false,
      },
      {
        id: TeamClubPageTabType.MY_REWARDS,
        titleKey: 'earn_tab_2',
        isShow: true,
        isShowRedDot: false,
        isActive: false,
      },
      {
        id: TeamClubPageTabType.INVITE_REWARDS,
        titleKey: 'earn_tab_3',
        isShow: true,
        isShowRedDot: false,
        isActive: false,
      },
      {
        id: TeamClubPageTabType.RULES,
        titleKey: 'earn_tab_4',
        isShow: true,
        isShowRedDot: false,
        isActive: false,
      },
    ];

    const list = tabDataList.map((item) => ({
      ...item,
      isActive: curTab === item.id,
    }));

    const pageActionList = list.map((item) => () => {
      if (item.id === TeamClubPageTabType.SHARE_FOR_BONUS) {
        userLocalForage.setItem(UserLocalforageStoreKeys.INVITE_TIME, today);
      }
      handleTeamClubPageClick({
        actionName: handleTeamClubPageTabClick,
        payload: { tabId: item.id },
      });
    });

    setTabList(list);
    setTeamClubTabActionList(pageActionList);
    userLocalForage
      .getItem(UserLocalforageStoreKeys.INVITE_TIME)
      .then((inviteTime) => {
        setInviteTimeRedDot(inviteTime !== today);
      });
  }, [curTab, inviteTimeRedDot]);
};
export default useMode2TeamClubPageTabList;
