import { usePostReportGameTypeBetAmountMutation } from '@mode2/external/api';
import { handleRecordPageReportProgressClick } from '@mode2/action/recordPageAction/acitonType';
import useRecordPageActions from '@mode2/action/recordPageAction/useRecordPageActions';
import {
  RecordPageReportGameUnit,
  useRecordPageBalanceReportActionsStore,
  useRecordPageBalanceReportStore,
} from '@mode2/zustand/page/recordPageStore';

import { useEffect } from 'react';
import { BetGameTypeName } from '@libs/mode2/external/api/endpoint/info/PostReportGameTypeBetAmountEndpoint';

export const useMode2RecordPageBalanceReport = () => {
  const { handleRecordPageClick } = useRecordPageActions();
  // - Record Time Tab List ============
  const setReportTimeTabList = useRecordPageBalanceReportStore(
    (state) => state.setReportTimeTabList
  );
  const activeReportTimeTabIndex = useRecordPageBalanceReportStore(
    (state) => state.activeReportTimeTabIndex
  );

  const setReportGameList = useRecordPageBalanceReportStore(
    (state) => state.setReportGameList
  );
  const setGameTypeListActions = useRecordPageBalanceReportActionsStore(
    (state) => state.setGameTypeListActions
  );
  const setSelectProgressInfo = useRecordPageBalanceReportStore(
    (state) => state.setSelectProgressInfo
  );

  const [
    triggerPostReportGameTypeBetAmount,
    { data: reportGameTypeBetAmountData },
  ] = usePostReportGameTypeBetAmountMutation();

  useEffect(() => {
    const tabs = [
      { i18nKey: 'earn_money_team_data_content_today' },
      { i18nKey: 'earn_money_team_data_content_yesterday' },
      { i18nKey: 'account_balance_report_a_week' },
      { i18nKey: 'account_balance_report_a_month' },
    ];

    setReportTimeTabList(tabs);
  }, []);

  useEffect(() => {
    if (reportGameTypeBetAmountData) {
      const { betAmountByGameType, totalBetAmount } =
        reportGameTypeBetAmountData;

      const games: RecordPageReportGameUnit[] = [
        {
          name: { i18nKey: 'home_game_zone_casino' },
          colorKey: 'Casino',
          icon: 'ic_casino',
          balance: betAmountByGameType[BetGameTypeName.CASINO],
          totalBalance: totalBetAmount,
        },
        {
          name: { i18nKey: 'home_game_zone_slots' },
          colorKey: 'Slots',
          icon: 'ic_slots',
          balance: betAmountByGameType[BetGameTypeName.SLOTS],
          totalBalance: totalBetAmount,
        },
        {
          name: { i18nKey: 'home_game_zone_sports' },
          colorKey: 'Sports',
          icon: 'ic_sports',
          balance: betAmountByGameType[BetGameTypeName.SPORTS],
          totalBalance: totalBetAmount,
        },
        {
          name: { i18nKey: 'home_game_zone_game' },
          colorKey: 'Game',
          icon: 'ic_game',
          balance: betAmountByGameType[BetGameTypeName.GAME],
          totalBalance: totalBetAmount,
        },
        {
          name: { i18nKey: 'home_game_zone_fishing' },
          colorKey: 'Fishing',
          icon: 'ic_fishing',
          balance: betAmountByGameType[BetGameTypeName.FISHING],
          totalBalance: totalBetAmount,
        },
        {
          name: { i18nKey: 'home_game_zone_original' },
          colorKey: 'Original',
          icon: 'ic_original',
          balance: betAmountByGameType[BetGameTypeName.ORIGINAL],
          totalBalance: totalBetAmount,
        },
      ];

      setReportGameList(games);

      const gameTypeListActions = games.map((progressInfo) => () => {
        handleRecordPageClick({
          actionName: handleRecordPageReportProgressClick,
          payload: { progressInfo },
        });
      });
      setGameTypeListActions(gameTypeListActions);
    }
  }, [reportGameTypeBetAmountData]);

  useEffect(() => {
    setSelectProgressInfo(null);
    triggerPostReportGameTypeBetAmount({
      intervalType: activeReportTimeTabIndex,
    });
  }, [activeReportTimeTabIndex]);
};

export default useMode2RecordPageBalanceReport;
