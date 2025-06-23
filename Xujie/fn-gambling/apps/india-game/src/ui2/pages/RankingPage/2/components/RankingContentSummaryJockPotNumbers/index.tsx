import AnimateCounter from '@components/AnimateCounter';
import { formatMoney } from '@libs/mode2/utils';
import {
  RankingPeriodsTabs,
  useRankingPageStore,
} from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { memo, useCallback, useEffect, useState } from 'react';
import { RankingContentSummaryProps } from '../RankingContentSummary';
import { cx, useIncrementalUpdate } from '@libs/commonUtils';
import isEqual from 'lodash/isEqual';

const INTERVALS = [4, 5, 10, 8, 5, 5, 7, 5, 3, 8]; // 秒
const INCREMENT_RANGES: [number, number][] = [
  [0.4, 0.8],
  [0.6, 0.9],
  [1.6, 1.99],
  [0.9, 1.2],
  [0.4, 0.8],
  [0.4, 0.8],
  [0.7, 1.0],
  [1.0, 1.2],
  [0.2, 0.4],
  [0.3, 0.6],
];

export interface RankingContentSummaryJockPotNumbersProps
  extends RankingContentSummaryProps {}

export const RankingContentSummaryJockPotNumbers = memo(
  ({ isModalMode, styles }: RankingContentSummaryJockPotNumbersProps) => {
    const rankingSummaryPeriodsActiveTab = useRankingPageStore(
      (state) => state.rankingSummaryPeriodsActiveTab
    );

    const dailyJackpotFromAmount = useRankingPageStore(
      (state) => state.dailyJackpotFromAmount
    );

    const mainContentJackpotAmount = useRankingPageStore(
      (state) => state.mainContentJackpotAmount
    );

    const mainContentJackpotAmountFrom = useRankingPageStore(
      (state) => state.mainContentJackpotAmountFrom
    );

    const setPrevDailyJockPotNum = useRankingPageStore(
      (state) => state.setPrevDailyJockPotNum
    );

    const setPrevWeeklyJockPotNum = useRankingPageStore(
      (state) => state.setPrevWeeklyJockPotNum
    );

    const setPrevMonthlyJockPotNum = useRankingPageStore(
      (state) => state.setPrevMonthlyJockPotNum
    );

    const handleGetCurrentJockPotNum = useCallback((): number => {
      switch (rankingSummaryPeriodsActiveTab) {
        case RankingPeriodsTabs.DAILY:
          return useRankingPageStore.getState().prevDailyJockPotNum;

        case RankingPeriodsTabs.WEEKLY:
          return useRankingPageStore.getState().prevWeeklyJockPotNum;

        case RankingPeriodsTabs.MONTHLY:
          return useRankingPageStore.getState().prevMonthlyJockPotNum;
      }
    }, [rankingSummaryPeriodsActiveTab]);

    const formatterMoneyOnce = useCallback((value: number) => {
      return formatMoney({
        value,
        showCurrency: false,
        includeDecimal: value === 0 ? false : true,
      });
    }, []);

    const imageDigitNameFn = useCallback((char: string | number) => {
      return `number_imgs_v2_${
        char === '.' ? 'period' : char === ',' ? 'comma' : char
      }`;
    }, []);

    const handleSetPrevJockPotNum = useCallback(
      (num: number) => {
        switch (rankingSummaryPeriodsActiveTab) {
          case RankingPeriodsTabs.DAILY:
            setPrevDailyJockPotNum(num);
            break;

          case RankingPeriodsTabs.WEEKLY:
            setPrevWeeklyJockPotNum(num);
            break;

          case RankingPeriodsTabs.MONTHLY:
            setPrevMonthlyJockPotNum(num);
            break;
        }
      },
      [rankingSummaryPeriodsActiveTab]
    );

    // 根據當下 activeTab 取得之前紀錄的值
    const prevJockPotAmount = handleGetCurrentJockPotNum();

    // 建立 count 的計數範圍
    const incrementalUpdateFromValue =
      Math.max(prevJockPotAmount, mainContentJackpotAmountFrom) || 0;

    const incrementalUpdateToValue = mainContentJackpotAmount;

    const defaultAnimateCounterFromValue = isModalMode
      ? prevJockPotAmount || dailyJackpotFromAmount
      : 0;
    const defaultAnimateCounterToValue = isModalMode
      ? prevJockPotAmount || dailyJackpotFromAmount
      : mainContentJackpotAmountFrom;

    const [animateCounterFromValue, setAnimateCounterFromValue] =
      useState<number>(defaultAnimateCounterFromValue);
    const [animateCounterToValue, setAnimateCounterToValue] = useState<number>(
      defaultAnimateCounterToValue
    );
    const [animateCounterDuration, setAnimateCounterDuration] =
      useState<number>(2000);

    // 主要做累加計算的 hook
    const { count, prevCount } = useIncrementalUpdate({
      from: incrementalUpdateFromValue,
      to: incrementalUpdateToValue,
      intervals: INTERVALS,
      incrementRanges: INCREMENT_RANGES,
    });

    useEffect(() => {
      if (isModalMode) return;

      // 根據當下 activeTab 取得之前紀錄的值
      const prevJockPotAmount = handleGetCurrentJockPotNum();

      // 設定如果目前的 prevJockPotAmount
      setAnimateCounterFromValue(
        prevJockPotAmount > 0 ? prevJockPotAmount : prevCount
      );
      setAnimateCounterToValue(count);

      // 紀錄目前數到的 count 為下一次進來的 From 值
      if (count > 0) handleSetPrevJockPotNum(count);
    }, [count]);

    // 處理 duration 的秒數
    useEffect(() => {
      if (isModalMode) return;

      const countDiff = count - prevCount;
      let duration = 2000;

      if (countDiff > 4) {
        duration = 4000;
      }

      if (countDiff < 1) {
        duration = 4000;
      }

      setAnimateCounterDuration(duration);
    }, [count]);
    return (
      <AnimateCounter
        from={animateCounterFromValue}
        to={animateCounterToValue}
        trigger={rankingSummaryPeriodsActiveTab}
        updateInterval={25}
        isImage={true}
        isFormatByDecimalPlaces={false}
        isUserFormatterInImage={true}
        duration={animateCounterDuration}
        leadingUnitImgName=""
        digitClass={cx('h-[36px]', styles?.JockPotSectionAnimateCounter)}
        formatter={formatterMoneyOnce}
        imageDigitNameFn={imageDigitNameFn}
      />
    );
  },
  (prev, next) => isEqual(prev, next)
);

export default RankingContentSummaryJockPotNumbers;
