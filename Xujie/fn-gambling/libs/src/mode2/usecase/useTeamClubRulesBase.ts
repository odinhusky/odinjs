import {
  usePostInviteDailyConfigMutation,
  usePostInviteTeamRewardConfigMutation,
  usePostTeamLevelConfigMutation,
} from '@mode2API/index';
import { useEffect } from 'react';
import {
  TeamClubCommissionRules,
  TeamClubEstimatedRules,
  TeamClubFirstDepositRebates,
  TeamClubUpgradeRequired,
  useTeamClubRulesStore,
} from '@mode2/zustand/page/teamClubRulesPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { TeamLevelConfigItemResult } from '@mode2API/endpoint/teamClub/PostTeamLevelConfigEndpoint';

export const useTeamClubRulesBase = () => {
  const [postTeamLevelConfig, { data: teamLevelConfigData }] =
    usePostTeamLevelConfigMutation();

  const teamClubEstimatedRulesItems = useTeamClubRulesStore(
    (state) => state.teamClubEstimatedRulesItems
  );

  const setTeamClubEstimatedRulesItems = useTeamClubRulesStore(
    (state) => state.setTeamClubEstimatedRulesItems
  );
  const setTeamClubCommissionRulesItems = useTeamClubRulesStore(
    (state) => state.setTeamClubCommissionRulesItems
  );
  const setTeamClubFirstDepositRebatesItems = useTeamClubRulesStore(
    (state) => state.setTeamClubFirstDepositRebatesItems
  );

  const setTeamClubUpgradeRequiredItems = useTeamClubRulesStore(
    (state) => state.setTeamClubUpgradeRequiredItems
  );

  useEffect(() => {
    if (teamClubEstimatedRulesItems.length <= 0) {
      postTeamLevelConfig();
    }
  }, [teamClubEstimatedRulesItems]);

  useEffect(() => {
    if (teamLevelConfigData) {
      // Estimated income // TODO Evan 廣告資料，先寫死
      const teamClubEstimatedRulesItems: TeamClubEstimatedRules[] = [
        {
          level: 1,
          requiredBets: 200000,
          monthMaxRebates: 20000,
        },
        {
          level: 2,
          requiredBets: 2000000,
          monthMaxRebates: 300000,
        },
        {
          level: 3,
          requiredBets: 20000000,
          monthMaxRebates: 3000000,
        },
      ];
      setTeamClubEstimatedRulesItems(teamClubEstimatedRulesItems);

      // set Store

      // Commission rate
      const teamClubCommissionRulesItems: TeamClubCommissionRules[] = [
        1, 2, 3,
      ].map((agentLevel) => {
        const rebatesRateKey =
          `agentLevel${agentLevel}RebatesRate` as keyof TeamLevelConfigItemResult; // 类型断言
        const newRates = teamLevelConfigData.map((item, index) => ({
          [`teamLevel${index}`]: item[rebatesRateKey],
        }));
        return {
          agentLevel,
          ...Object.assign({}, ...newRates), // 合并每个 `rebatesRate${index}`
        };
      });
      setTeamClubCommissionRulesItems(teamClubCommissionRulesItems);

      // First deposit rebate
      const teamClubFirstDepositRebatesItems: TeamClubFirstDepositRebates[] =
        teamLevelConfigData.map((item) => {
          const { level, firstDepositRebatesRate } = item;
          return {
            level: level,
            firstDepositRebatesRate: firstDepositRebatesRate,
          };
        });
      setTeamClubFirstDepositRebatesItems(teamClubFirstDepositRebatesItems);

      // How to increase the club’s level rating?
      const teamClubUpgradeRequiredItems: TeamClubUpgradeRequired[] =
        teamLevelConfigData.map((item) => {
          const { level, requiredBets, requiredMembers } = item;
          return {
            level: level,
            requiredBets: requiredBets,
            requiredMembers: requiredMembers,
          };
        });
      setTeamClubUpgradeRequiredItems(teamClubUpgradeRequiredItems);
    }
  }, [teamLevelConfigData]);

  const [postInviteTeamRewardConfig, { data: inviteTeamRewardConfigData }] =
    usePostInviteTeamRewardConfigMutation();
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );

  const setValidDepositRebates = useTeamClubRulesStore(
    (state) => state.setValidDepositRebates
  );

  const setInviteTaskRules = useTeamClubRulesStore(
    (state) => state.setInviteTaskRules
  );

  useEffect(() => {
    if (validDepositRebates <= 0) {
      postInviteTeamRewardConfig();
    }
  }, [validDepositRebates]);

  useEffect(() => {
    if (inviteTeamRewardConfigData) {
      setValidDepositRebates(inviteTeamRewardConfigData.validDepositRebates);
      setInviteTaskRules(inviteTeamRewardConfigData.inviteRules);
    }
  }, [inviteTeamRewardConfigData]);

  const [postInviteDailyConfig, { data: inviteDailyConfigData }] =
    usePostInviteDailyConfigMutation();
  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const setInviteDailyRule = useTeamClubRulesStore(
    (state) => state.setInviteDailyRule
  );
  useEffect(() => {
    if (inviteDailyRule.dailyValidInvitees <= 0) {
      postInviteDailyConfig();
    }
  }, [inviteDailyRule]);

  useEffect(() => {
    if (inviteDailyConfigData) {
      setInviteDailyRule(inviteDailyConfigData);
    }
  }, [inviteDailyConfigData]);
};

export default useTeamClubRulesBase;
