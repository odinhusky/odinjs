import {
  EResourceLevel,
  formatMoneyAbbrev4Digits,
  getImgUrl,
} from '@mode2/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';

export const RankingRewardsHistoryJackpot = () => {
  const { t } = useTranslation();
  const jackpotAmount = useRankingRewardsHistoryModalStore(
    (state) => state.jackpotAmount
  );
  return (
    <div className="relative bgi-[var(--linear-6)] mx-4">
      <div className="bgi-border-t-[var(--linear-7)] absolute top-0" />

      <div
        className="flex flex-col justify-center gap-1 items-center font-medium pt-1.5"
        style={{
          backgroundImage: `url(${getImgUrl(EResourceLevel.V, 'pattern')})`,
          backgroundSize: '100%',
          backgroundPosition: '1rem 1rem',
        }}
      >
        <p className="text-sm bgi-text-[var(--base-2-variant1)]">
          {t('ranking_history_jackpot')}
        </p>
        <p className="text-[32px] bgi-text-[var(--base-1-main)]">
          {formatMoneyAbbrev4Digits({
            value: jackpotAmount,
            includeDecimalAbbrev: true,
            includeCommaAbbrev: true,
          })}
        </p>
      </div>

      <div className="bgi-border-b-[var(--linear-7)] absolute bottom-0" />
    </div>
  );
};

export default RankingRewardsHistoryJackpot;
