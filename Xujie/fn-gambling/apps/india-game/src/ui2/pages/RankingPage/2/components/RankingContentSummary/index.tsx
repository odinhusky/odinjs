import {
  cx,
  useDeepEffect,
  useObserverElementMetrics,
} from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import RankingContentSummaryTabs from '../RankingContentSummaryTabs';
import BaseBadgeBtn from '@components/BaseBadgeBtn';
import useRankingPageActions from '@libs/mode2/action/rankingPageAction/useRankingPageActions';
import { useTranslation } from 'react-i18next';
import { handleRankingPageHistoryBtnClick } from '@mode2/action/actionTypes';
import RankingContentSummaryJockPotSection from '../RankingContentSummaryJockPotSection';
import RankingContentSummaryTop3Section from '../RankingContentSummaryTop3Section';

export interface RankingPageModalMode {
  isModalMode?: boolean; // 是否在 Modal 中顯示，決定某些元件要不要顯示
}

export const RANKING_PAGE_SCALE_TIMES = 0.78571429;
export const scaleRankingValue = ({
  isModalMode,
  value,
}: {
  isModalMode?: boolean;
  value: number;
}): number => (isModalMode ? value * RANKING_PAGE_SCALE_TIMES : value);

export interface RankingContentSummaryProps extends RankingPageModalMode {
  styles?: {
    JockPotSection?: string;
    JockPotSectionAnimateCounterBox?: string;
    JockPotSectionAnimateCounter?: string;
    JockPotSectionText?: string;
    top3Section?: string;
  };
}

export const RankingContentSummary = ({
  isModalMode = false,
  styles,
}: RankingContentSummaryProps) => {
  const { t } = useTranslation();

  const { handleRankingPageClick } = useRankingPageActions();

  const setSummaryElMetrics = useRankingPageStore(
    (state) => state.setSummaryElMetrics
  );

  const { elementRef: summaryElRef, elementMetrics: summaryElMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  useDeepEffect(() => {
    setSummaryElMetrics(summaryElMetrics);
  }, [summaryElMetrics]);

  return (
    <div ref={summaryElRef} className={cx('w-full', 'relative')}>
      {/* 用該圖片撐開整個容器的高度 */}
      <img
        src={getImgUrl(EResourceLevel.V, 'ranking_background')}
        alt="Summary background image"
        className={cx('block', 'w-full', 'max-h-[530px]', 'relative', 'z-[0]')}
      />

      {/* 上方得 時間區間 切換Tab */}
      {!isModalMode ? (
        <div className={cx('w-full', 'absolute top-0 left-0 z-[2]')}>
          <RankingContentSummaryTabs />
        </div>
      ) : null}

      {/* 左邊的歷史紀錄按鈕 */}
      {!isModalMode ? (
        <div className={cx('w-full', 'absolute top-[34%] left-0 z-[5]')}>
          <BaseBadgeBtn
            onClick={() => {
              handleRankingPageClick({
                actionName: handleRankingPageHistoryBtnClick,
              });
            }}
            children={t('deposit_history_page_title')}
          />
        </div>
      ) : null}

      {/* Summary JockPot Section */}
      <RankingContentSummaryJockPotSection
        styles={styles}
        isModalMode={isModalMode}
      />

      {/* 前三名區塊 */}
      <RankingContentSummaryTop3Section
        styles={styles}
        isModalMode={isModalMode}
      />
    </div>
  );
};

export default RankingContentSummary;
