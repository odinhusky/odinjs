import { useMemo } from 'react';
import cx from '@commonUtils/cx';
import {
  RankingPageTabs,
  useRankingPageStore,
} from '@mode2/zustand/page/RankingPage/rankingPageStore';
import useRankingPageBaseOverride from './useRankingPageBaseOverride';
import RankingRulesContent from './components/RankingRulesContent';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import RankingRewardsContent from './components/RankingRewardsContent';
import RankingRewardsHistoryModal from './modals/RankingRewardsHistoryModal';
import RankingContent from './components/RankingContent';
import { RankingShareModal } from './modals/RankingShareModal';

export const RankingPage = () => {
  useRankingPageBaseOverride();
  const rankingPageTab = useRankingPageStore((state) => state.rankingPageTab);

  const ruleContent = useMemo(() => {
    switch (rankingPageTab) {
      case RankingPageTabs.MAIN:
        return <RankingContent />;
      case RankingPageTabs.RULE:
        return <RankingRulesContent />;
      case RankingPageTabs.RECORDS:
        return <RankingRewardsContent />;
      default:
        return <div></div>;
    }
  }, [rankingPageTab]);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen',
        'm-auto',
        '-mx-4'
      )}
    >
      {/* 内容 */}
      {ruleContent}
      {/**/}
      <RankingShareModal />
      <RankingRewardsHistoryModal />
    </div>
  );
};

export default RankingPage;
