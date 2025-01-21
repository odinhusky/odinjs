import { useMode2InvitePageTeamStore } from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';
import { usePostAgentTeamStatisticsMutation } from '@mode2/external/api';

export const useMode2InvitePageTeamData = () => {
  const [triggerFetchTeamData, { data: teamData }] =
    usePostAgentTeamStatisticsMutation();

  const setBetValue = useMode2InvitePageTeamStore((state) => state.setBetValue);
  const setNumberOfDeposits = useMode2InvitePageTeamStore(
    (state) => state.setNumberOfDeposits
  );
  const setActiveMemberLevel = useMode2InvitePageTeamStore(
    (state) => state.setActiveMemberLevel
  );
  const setTotalCommission = useMode2InvitePageTeamStore(
    (state) => state.setTotalCommission
  );

  useEffect(() => {
    if (teamData) {
      const {
        betValueInfo,
        numberOfDepositInfo,
        activeMemberInfo,
        totalCommissionInfo,
      } = teamData;
      const betValueBlockData = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: betValueInfo.all,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_1' },
            bodyValue: betValueInfo.lv1,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_2' },
            bodyValue: betValueInfo.lv2,
          },
        ],
      };

      const numberOfDeposits = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: numberOfDepositInfo.all,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_1' },
            bodyValue: numberOfDepositInfo.lv1,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_2' },
            bodyValue: numberOfDepositInfo.lv2,
          },
        ],
      };

      const activeMemberLevel = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: activeMemberInfo.all,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_this_week' },
            bodyValue: activeMemberInfo.thisWeek,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_last_week' },
            bodyValue: activeMemberInfo.lastWeek,
          },
        ],
      };

      const totalCommission = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: totalCommissionInfo.all,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_1' },
            bodyValue: totalCommissionInfo.lv1,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_2' },
            bodyValue: totalCommissionInfo.lv2,
          },
        ],
      };

      setBetValue(betValueBlockData);
      setNumberOfDeposits(numberOfDeposits);
      setActiveMemberLevel(activeMemberLevel);
      setTotalCommission(totalCommission);
    }
  }, [teamData]);

  useEffect(() => {
    triggerFetchTeamData();
  }, []);
};

export default useMode2InvitePageTeamData;
