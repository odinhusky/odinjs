import { useEffect } from 'react';
import { useDeepEffect, useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { EResourceLevel, formatMoney } from '@mode2/utils';
import { useMode2InvitePageRankingListStore } from '@mode2/zustand/page/invitePageStore';
import {
  usePostActiveWeekRankingReceiveMutation,
  usePostAgentWeekRankingMutation,
} from '@mode2API/index';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';

export const RankingListBanner = () => {
  const { t } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const rankingBonus = useMode2InvitePageRankingListStore(
    (state) => state.rankingBonus
  );

  const showToast = useToastStore((state) => state.showToast);
  const setRankingBonus = useMode2InvitePageRankingListStore(
    (state) => state.setRankingBonus
  );
  const setRankingData = useMode2InvitePageRankingListStore(
    (state) => state.setRankingData
  );
  const setCountdownTIme = useMode2InvitePageRankingListStore(
    (state) => state.setCountdownTIme
  );

  const [triggerReceiveRankingBonus, { isSuccess }] =
    usePostActiveWeekRankingReceiveMutation();
  const [triggerFetchWeekRankingData, { data: weekRankingData }] =
    usePostAgentWeekRankingMutation();

  useEffect(() => {
    if (isSuccess) {
      showToast(t('toast_received_successfully'));

      // refresh
      setTimeout(() => {
        triggerFetchWeekRankingData({});
      }, 1000);
    }
  }, [isSuccess]);

  useDeepEffect(() => {
    if (weekRankingData) {
      setRankingBonus(weekRankingData.rankingBonus);
      setRankingData(weekRankingData.rankingList);
      setCountdownTIme(weekRankingData.countDownSec);
    }
  }, [weekRankingData]);

  const handleReceiveClick = () => {
    triggerReceiveRankingBonus();
  };

  return (
    <div className={cx('w-full', 'relative', 'font-medium')}>
      {/* 照原本的邏輯這裡後面兩個參數都是預設帶 true */}
      <img
        src={getImgUrlByBreakPoint(
          'ranking_list_banner',
          EResourceLevel.V,
          true,
          true
        )}
        alt="ranking list banner"
        className="w-full"
      />
      <div
        className={cx(
          'absolute left-2/4 top-2/4',
          '-translate-x-2/4 -translate-y-2/4',
          FLEX_CENTER,
          'flex-col',
          'gap-1 mobile:gap-3',
          'text-base mobile:text-xl',
          'bgi-text-[var(--grayscale-00)]'
        )}
      >
        <div
          className={cx(
            'bgi-text-[var(--state-warn-main)]',
            'text-3xl mobile:text-4xl'
          )}
        >
          {formatMoney(rankingBonus)}
        </div>
        <div
          className={cx(
            'text-base mobile:text-xl',
            'bgi-text-[var(--grayscale-00)]',
            'font-medium'
          )}
        >
          {t('earn_money_ranking_list_banner_ranking_bonus')}
        </div>

        <BaseSecondaryBtn
          className={cx(
            'w-[89px] mobile:w-[105px]',
            'h-8 mobile:h-9',
            'mobile:text-xl'
          )}
          onClick={handleReceiveClick}
        >
          {t('earn_money_ranking_list_btn_receive')}
        </BaseSecondaryBtn>
      </div>
    </div>
  );
};

export default RankingListBanner;
