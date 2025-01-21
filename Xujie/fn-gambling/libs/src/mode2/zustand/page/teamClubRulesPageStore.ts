import { create } from 'zustand';
import { InviteDailyConfigResult } from '@mode2API/endpoint/teamClub/PostInviteDailyConfigEndpoint';
import { InviteTeamRewardRuleItemResult } from '@mode2API/endpoint/teamClub/PostInviteTeamRewardConfigEnpoint';
import { cloneDeep } from 'lodash';

export interface TeamClubEstimatedRules {
  level: number;
  requiredBets: number;
  monthMaxRebates: number;
}

export interface TeamClubCommissionRules {
  agentLevel: number;
  teamLevel0: number;
  teamLevel1: number;
  teamLevel2: number;
  teamLevel3: number;
}

export interface TeamClubFirstDepositRebates {
  level: number;
  firstDepositRebatesRate: number;
}

export interface TeamClubUpgradeRequired {
  level: number;
  requiredBets: number;
  requiredMembers: number;
}

interface TeamClubRulesStoreType {
  validDepositRebates: number;
  teamClubEstimatedRulesItems: TeamClubEstimatedRules[];
  setTeamClubEstimatedRulesItems: (values: TeamClubEstimatedRules[]) => void;
  teamClubCommissionRulesItems: TeamClubCommissionRules[];
  setTeamClubCommissionRulesItems: (values: TeamClubCommissionRules[]) => void;
  teamClubFirstDepositRebatesItems: TeamClubFirstDepositRebates[];
  setTeamClubFirstDepositRebatesItems: (
    values: TeamClubFirstDepositRebates[]
  ) => void;
  teamClubUpgradeRequiredItems: TeamClubUpgradeRequired[];
  setTeamClubUpgradeRequiredItems: (values: TeamClubUpgradeRequired[]) => void;

  setValidDepositRebates: (value: number) => void;
  inviteTaskRules: InviteTeamRewardRuleItemResult[];
  setInviteTaskRules: (values: InviteTeamRewardRuleItemResult[]) => void;
  inviteDailyRule: InviteDailyConfigResult;
  setInviteDailyRule: (value: InviteDailyConfigResult) => void;
}

const defaultData = {
  validDepositRebates: 0,
  teamClubEstimatedRulesItems: [] as TeamClubEstimatedRules[],
  teamClubCommissionRulesItems: [0, 1, 2].map((index) => ({
    agentLevel: index,
    teamLevel0: 0,
    teamLevel1: 0,
    teamLevel2: 0,
    teamLevel3: 0,
  })),
  teamClubFirstDepositRebatesItems: [0, 1, 2, 3].map((index) => ({
    level: index,
    firstDepositRebatesRate: 0,
  })),
  teamClubUpgradeRequiredItems: [0, 1, 2, 3].map((index) => ({
    level: index,
    requiredBets: 0,
    requiredMembers: 0,
  })),
  inviteTaskRules: [0, 1, 2, 3, 4].map((index) => ({
    indexKey: `${index}`,
    invitationCount: 0,
    commission: 0,
  })),
  inviteDailyRule: {
    dailyValidInvitees: 0,
    commission: 0,
    validInviteRebates: 0,
  } as InviteDailyConfigResult,
};

export const useTeamClubRulesStore = create<TeamClubRulesStoreType>((set) => ({
  ...cloneDeep(defaultData),
  setTeamClubEstimatedRulesItems: (values) =>
    set(() => ({ teamClubEstimatedRulesItems: values })),
  setTeamClubCommissionRulesItems: (values) =>
    set(() => ({ teamClubCommissionRulesItems: values })),
  setTeamClubFirstDepositRebatesItems: (values) =>
    set(() => ({ teamClubFirstDepositRebatesItems: values })),
  setTeamClubUpgradeRequiredItems: (values) =>
    set(() => ({ teamClubUpgradeRequiredItems: values })),
  setValidDepositRebates: (value) =>
    set(() => ({ validDepositRebates: value })),
  setInviteTaskRules: (values) => set(() => ({ inviteTaskRules: values })),
  setInviteDailyRule: (value) => set(() => ({ inviteDailyRule: value })),
}));
