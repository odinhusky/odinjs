import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '@mode2/zustand/middlewareWrapper';
import { cloneDeep } from 'lodash';

export interface InviteesLevelMilestoneItem {
  isCurrentProgress: boolean; //  當前進度
  isAchieve: boolean; // 是否已經達標
  achieveCount: number; // 達標數量
  requiredPeople: number;
  reward: number;
  levelResName: string;
  className?: string;
  lastRequiredPeople: number;
}

export interface InviteRewardsContentStoreType {
  totalInvitationRewards: number; //總邀請獎勵
  setTotalInvitationRewards: (value: number) => void;
  totalInvitees: number; //總邀請人數
  setTotalInvitees: (value: number) => void;
  validInvitees: number; // 有效邀請人數
  setValidInvitees: (value: number) => void;
  rewardPerInvite: number; //每邀請一人獎勵多少
  setRewardPerInvite: (value: number) => void;
  dailyValidInvitees: number; // 每日有效邀請有效數量
  setDailyValidInvitees: (value: number) => void;
  dailyInviteLimit: number; // 每日最大邀請有效數量
  setDailyInviteLimit: (value: number) => void;
  maxInvitationRewards: number; //最高邀請獎勵
  setMaxInvitationRewards: (value: number) => void;
  maxInvitees: number; //最高邀請人數
  setMaxInvitees: (value: number) => void;
  inviteesLevelMilestoneItems: InviteesLevelMilestoneItem[]; // 邀請獎勵里程
  setInviteesLevelMilestoneItems: (
    values: InviteesLevelMilestoneItem[]
  ) => void;
  validMilestoneProgress: number; // 邀請里程進度
  setValidMilestoneProgress: (value: number) => void;
  clear: () => void;
}

const defaultMilestoneItem = [0, 1, 2, 3, 4].map((item, index) => {
  return {
    isCurrentProgress: index === 0,
    isAchieve: false,
    achieveCount: 0,
    requiredPeople: 0,
    reward: 0,
    levelResName: `invite_rewards_goal_${index + 1}`,
    lastRequiredPeople: 0,
  };
});

const defaultData = {
  totalInvitationRewards: 0,
  totalInvitees: 0,
  validInvitees: 0,
  rewardPerInvite: 0,
  dailyValidInvitees: 0,
  dailyInviteLimit: 0,
  maxInvitationRewards: 0,
  maxInvitees: 0,
  inviteesLevelMilestoneItems: defaultMilestoneItem,
  validMilestoneProgress: 0,
};

export const useInviteRewardsContentStore =
  create<InviteRewardsContentStoreType>()(
    devtoolsAndPersistWrapper(
      '[component store] useInviteRewardsContentStore',
      (set) => ({
        ...cloneDeep(defaultData),
        setTotalInvitationRewards: (value) =>
          set(() => ({ totalInvitationRewards: value })),
        setTotalInvitees: (value) => set(() => ({ totalInvitees: value })),
        setValidInvitees: (value) => set(() => ({ validInvitees: value })),
        setRewardPerInvite: (value) => set(() => ({ rewardPerInvite: value })),
        setDailyValidInvitees: (value) =>
          set(() => ({ dailyValidInvitees: value })),
        setDailyInviteLimit: (value) =>
          set(() => ({ dailyInviteLimit: value })),
        setMaxInvitationRewards: (value) =>
          set(() => ({ maxInvitationRewards: value })),
        setMaxInvitees: (value) => set(() => ({ maxInvitees: value })),
        setInviteesLevelMilestoneItems: (values) =>
          set(() => ({ inviteesLevelMilestoneItems: values })),
        setValidMilestoneProgress: (value) =>
          set(() => ({ validMilestoneProgress: value })),
        clear: () => set(() => ({ ...cloneDeep(defaultData) })),
      })
    )
  );
