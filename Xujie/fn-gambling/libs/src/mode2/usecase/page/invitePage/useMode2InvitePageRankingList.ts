import { useDeepEffect } from '@commonUtils/hooks';
import {
  useMode2InvitePageRankingListStore,
  useMode2InviteTabStore,
} from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';
import { usePostAgentWeekRankingMutation } from '@mode2/external/api';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';

export const useMode2InvitePageRankingList = () => {
  const [triggerFetchWeekRankingData, { data: weekRankingData }] =
    usePostAgentWeekRankingMutation();

  const showLastData = useMode2InvitePageRankingListStore(
    (state) => state.showLastData
  );
  const inviteCurTab = useMode2InviteTabStore((state) => state.inviteCurTab);

  const setRankingBonus = useMode2InvitePageRankingListStore(
    (state) => state.setRankingBonus
  );
  const setRankingData = useMode2InvitePageRankingListStore(
    (state) => state.setRankingData
  );
  const setCountdownTIme = useMode2InvitePageRankingListStore(
    (state) => state.setCountdownTIme
  );

  useDeepEffect(() => {
    if (weekRankingData) {
      setRankingBonus(weekRankingData.rankingBonus);
      setRankingData(weekRankingData.rankingList);
      setCountdownTIme(weekRankingData.countDownSec);
    }
  }, [weekRankingData]);

  useEffect(() => {
    if (inviteCurTab === InvitePageTabType.RANKING_LIST) {
      if (showLastData) {
        triggerFetchWeekRankingData({ weekType: -1 });
      } else {
        triggerFetchWeekRankingData({});
      }
    }
  }, [showLastData, inviteCurTab]);
};

export default useMode2InvitePageRankingList;
