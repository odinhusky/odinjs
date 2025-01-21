import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { InviteWithdrawItemResult } from '@libs/mode2/external/api/endpoint/wheel/PostInviteWheelWithdrawListEndpoint';
import { WheelSpinHistoryResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelPlayerSpinHistoryListEndpoint';

export enum ActivityRecordPageTypes {
  DEFAULT = -1,
  INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT,
  RECHARGE_WHEEL_REWARDS_RECORD_CONTENT,
}

export enum SortNameTypes {
  SPIN_TIME = 'SPIN_TIME',
  REWARDS = 'REWARDS',
}

export interface SortTypes {
  sortName: SortNameTypes;
  sortIndex: number; // 1: 升序 2: 降序 3: 默认
}

export type ActivityRecordPageStoreTypes = {
  tabIndex: ActivityRecordPageTypes;
  setTabIndex: (index: ActivityRecordPageTypes) => void;
  listSort: SortTypes;
  setListSort: (map: SortTypes) => void;
  inviteWithdrawalHistoryList: InviteWithdrawItemResult[];
  setInviteWithdrawalHistoryList: (arr: InviteWithdrawItemResult[]) => void;
  rechargeRewardRecordList: WheelSpinHistoryResult[];
  setRechargeRewardRecordList: (arr: WheelSpinHistoryResult[]) => void;
  totalRewards: number;
  setTotalRewards: (value: number) => void;
};

export const useActivityRecordPageStore =
  create<ActivityRecordPageStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useActivityRecordPageStore',
      (set) => ({
        tabIndex: ActivityRecordPageTypes.DEFAULT,
        setTabIndex: (index: ActivityRecordPageTypes) =>
          set(() => ({ tabIndex: index })),
        inviteWithdrawalHistoryList: [] as InviteWithdrawItemResult[],
        setInviteWithdrawalHistoryList: (arr: InviteWithdrawItemResult[]) =>
          set(() => ({ inviteWithdrawalHistoryList: arr })),
        rechargeRewardRecordList: [] as WheelSpinHistoryResult[],
        setRechargeRewardRecordList: (arr: WheelSpinHistoryResult[]) =>
          set(() => ({ rechargeRewardRecordList: arr })),
        listSort: {} as SortTypes,
        setListSort: (map: SortTypes) => set(() => ({ listSort: map })),
        totalRewards: 0,
        setTotalRewards: (value) => set(() => ({ totalRewards: value })),
      })
    )
  );
