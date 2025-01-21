import { handleInvitePageTabClick } from '@mode2/action/invitePageAction/actionType';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import {
  useMode2InvitePageActionsStore,
  useMode2InviteTabStore,
} from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';
import { useInviteRecommend } from '@mode2/usecase/useInviteRecommend';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { usePlatformDynamicConfigStore } from '@libs/mode2/zustand/platform/platformDynamicConfig';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { useRedDotStore } from '@libs/mode2/zustand/redDotStore';
import { today } from '@libs/constant/date';

export const useMode2InvitePageTabList = () => {
  const inviteCurTab = useMode2InviteTabStore((state) => state.inviteCurTab);
  const setTabList = useMode2InviteTabStore((state) => state.setTabList);
  const setInviteTabActionList = useMode2InvitePageActionsStore(
    (state) => state.setInviteTabActionList
  );
  const isEnableRankingReward = usePlatformDynamicConfigStore(
    (state) => state.isEnableRankingReward
  );

  const inviteTimeRedDot = useRedDotStore((state) => state.inviteTimeRedDot);
  const setInviteTimeRedDot = useRedDotStore(
    (state) => state.setInviteTimeRedDot
  );

  const fetchData = async () => {
    const inviteTime = await userLocalForage.getItem(
      UserLocalforageStoreKeys.INVITE_TIME
    );
    setInviteTimeRedDot(inviteTime !== today);
  };

  fetchData();

  useEffect(() => {
    if (inviteCurTab === InvitePageTabType.EARN) {
      userLocalForage.setItem(UserLocalforageStoreKeys.INVITE_TIME, `${today}`);
    }
  }, [inviteCurTab]);

  const { handleInvitePageClick } = useInvitePageActions();
  const { fetchNow } = useInviteRecommend();
  useEffect(() => {
    const tabDataList = [
      {
        id: InvitePageTabType.EARN,
        title: 'leftnav_earn',
        isShow: true,
      },
      {
        id: InvitePageTabType.STATISTICS,
        title: 'leftnav_statistics',
        isShow: true,
      },
      {
        id: InvitePageTabType.TEAM_DATA,
        title: 'leftnav_team_data',
        isShow: true,
      },
      {
        id: InvitePageTabType.RANKING_LIST,
        title: 'leftnav_ranking_list',
        isShow: isEnableRankingReward,
      },
    ];

    const list = tabDataList.map((item) => ({
      ...item,
      isActive: inviteCurTab === item.id,
      isShowRedDot: item.id === InvitePageTabType.EARN && inviteTimeRedDot,
    }));

    const invitePageActionList = list.map((item) => () => {
      if (item.id === InvitePageTabType.TEAM_DATA) {
        fetchNow();
      }
      if (item.id === InvitePageTabType.EARN) {
        userLocalForage.setItem(UserLocalforageStoreKeys.INVITE_TIME, today);
      }
      handleInvitePageClick({
        actionName: handleInvitePageTabClick,
        payload: { tabId: item.id },
      });
    });

    setTabList(list);
    setInviteTabActionList(invitePageActionList);
  }, [inviteCurTab, isEnableRankingReward, inviteTimeRedDot]);
};
export default useMode2InvitePageTabList;
