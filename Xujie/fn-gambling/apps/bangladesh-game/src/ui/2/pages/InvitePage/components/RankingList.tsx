import { useEffect } from 'react';
import '../index.scss';
import RankingListRules from './RankingListRules';
import RankingListContent from './RankingListContent';
import RankingListBanner from './RankingListBanner';
import RankListWeekControl from './RankListWeekControl';
import { useMode2InvitePageRankingListStore } from '@mode2/zustand/page/invitePageStore';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

export const RankingList = () => {
  const setShowLastData = useMode2InvitePageRankingListStore(
    (state) => state.setShowLastData
  );

  useEffect(() => {
    return () => {
      setShowLastData(false);
    };
  }, []);

  return (
    <div className={cx(FLEX_COL, 'gap-3 mobile:gap-5')}>
      <RankingListBanner />

      <RankListWeekControl />

      <RankingListContent />

      <RankingListRules />
    </div>
  );
};
