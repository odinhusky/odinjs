import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_END, remToPx } from '@libs/constant/style';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { RankingTop3Unit } from '../RankingTop3Unit';
import { formatMoney } from '@libs/mode2/utils';
import { RankingContentSummaryProps } from '../RankingContentSummary';
import { SpriteRanking3rdAvatarFrame } from '@components/SpriteRanking3rdAvatarFrame';
import SpriteRanking2ndAvatarFrame from '@components/SpriteRanking2ndAvatarFrame';
import SpriteRanking1stAvatarFrame from '@components/SpriteRanking1stAvatarFrame';

interface IsRisePropType {
  isRise?: boolean;
}

export const generateIsRiseProp = (
  currentRanking: number,
  lastRanking: number
): IsRisePropType => {
  return currentRanking > lastRanking
    ? { isRise: false }
    : currentRanking < lastRanking
    ? { isRise: true }
    : {};
};

export const RankingContentSummaryTop3Section = ({
  styles,
  isModalMode,
}: RankingContentSummaryProps) => {
  const summaryElMetrics = useRankingPageStore(
    (state) => state.summaryElMetrics
  );

  const jockPotElMetrics = useRankingPageStore(
    (state) => state.jockPotElMetrics
  );

  const rankingTop1 = useRankingPageStore(
    (state) => state.mainContentRankingData.rankingTop1
  );

  const rankingTop2 = useRankingPageStore(
    (state) => state.mainContentRankingData.rankingTop2
  );

  const rankingTop3 = useRankingPageStore(
    (state) => state.mainContentRankingData.rankingTop3
  );

  const shouldRankingTop1RiseProp =
    rankingTop1.currentRanking > rankingTop1.lastRanking
      ? { isRise: true }
      : rankingTop1.currentRanking < rankingTop1.lastRanking
      ? { isRise: false }
      : {};
  console.log(shouldRankingTop1RiseProp);

  const top3SectionHeight = summaryElMetrics?.height - jockPotElMetrics?.height;

  return (
    <div
      className={cx(
        'w-full',
        'max-h-[262px]',
        FLEX_ITEMS_END,
        'justify-center',
        'absolute left-0 bottom-0 z-[3]',
        styles?.top3Section
      )}
      style={{
        height: `${top3SectionHeight / remToPx}rem`,
      }}
    >
      {/* 第二名 */}
      <RankingTop3Unit
        place={2}
        reward={rankingTop2.rewardRate.toFixed(2)}
        bets={formatMoney({
          value: rankingTop2.betAmount,
          showCurrency: false,
          includeDecimal: true,
        })}
        playerName={rankingTop2.playerName}
        avatarId={rankingTop2.avatarId}
        avatarFrameNode={
          <SpriteRanking2ndAvatarFrame isModalMode={!!isModalMode} />
        }
        {...generateIsRiseProp(
          rankingTop2.currentRanking,
          rankingTop2.lastRanking
        )}
        isModal={isModalMode}
      />

      {/* 第一名 */}
      <RankingTop3Unit
        place={1}
        reward={rankingTop1.rewardRate.toFixed(2)}
        bets={formatMoney({
          value: rankingTop1.betAmount,
          showCurrency: false,
          includeDecimal: true,
        })}
        playerName={rankingTop1.playerName}
        avatarId={rankingTop1.avatarId}
        avatarFrameNode={
          <SpriteRanking1stAvatarFrame isModalMode={!!isModalMode} />
        }
        {...generateIsRiseProp(
          rankingTop1.currentRanking,
          rankingTop1.lastRanking
        )}
        isModal={isModalMode}
      />

      {/* 第三名 */}
      <RankingTop3Unit
        place={3}
        reward={rankingTop3.rewardRate.toFixed(2)}
        bets={formatMoney({
          value: rankingTop3.betAmount,
          showCurrency: false,
          includeDecimal: true,
        })}
        playerName={rankingTop3.playerName}
        avatarId={rankingTop3.avatarId}
        avatarFrameNode={
          <SpriteRanking3rdAvatarFrame isModalMode={!!isModalMode} />
        }
        {...generateIsRiseProp(
          rankingTop3.currentRanking,
          rankingTop3.lastRanking
        )}
        isModal={isModalMode}
      />
    </div>
  );
};

export default RankingContentSummaryTop3Section;
