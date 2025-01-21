import { create } from 'zustand';

interface ITab {
  id: EDetailContentId;
  icon: string;
  label: string;
  children?: Array<{ id: EDetailTableId; label: string }>;
}
export interface IRewardsDetailStore {
  recordDetailTab: ITab;
  withdrawalHistoryTab: ITab;
  activeDetailContentId: EDetailContentId;
  activeDetailTableId: EDetailTableId;
  setActiveDetailContent: (id: EDetailContentId) => void;
  setActiveDetailTable: (id: EDetailTableId) => void;
  resetRewardsDetail: () => void;
}
export enum EDetailContentId {
  RECORD_DETAIL = '1',
  WITHDRAWAL_HISTORY = '2',
}
export enum EDetailTableId {
  DETAIL_ALL = 'All',
  DETAIL_BET = 'Bet',
  DETAIL_DEPOSIT = 'Deposit',
  DETAIL_INVITE = 'Invite',
  DETAIL_INVITE_TASK = 'InviteTask',
}

type TOptions =
  | {
      type: 'detailId';
      id: EDetailContentId;
    }
  | {
      type: 'tableId';
      id: EDetailTableId;
    };
const getActiveTabId = (type: TOptions['type']) => {
  const params = new URLSearchParams(window.location.search);

  return (
    params.get(type) ||
    (type === 'detailId'
      ? EDetailContentId.RECORD_DETAIL
      : EDetailTableId.DETAIL_ALL)
  );
};

export const useRewardsDetailStore = create<IRewardsDetailStore>((set) => ({
  recordDetailTab: {
    id: EDetailContentId.RECORD_DETAIL,
    icon: 'ic_rewards_detail',
    label: 'earn_rewards_detail_rewards_detail',
    children: [
      {
        id: EDetailTableId.DETAIL_ALL,
        label: 'earn_rewards_detail_category_all',
      },
      {
        id: EDetailTableId.DETAIL_BET,
        label: 'earn_rewards_detail_category_bet',
      },
      {
        id: EDetailTableId.DETAIL_DEPOSIT,
        label: 'earn_rewards_detail_category_deposit',
      },
      {
        id: EDetailTableId.DETAIL_INVITE,
        label: 'earn_rewards_detail_category_invite',
      },
      {
        id: EDetailTableId.DETAIL_INVITE_TASK,
        label: 'earn_rewards_detail_category_invite_task',
      },
    ],
  },
  withdrawalHistoryTab: {
    id: EDetailContentId.WITHDRAWAL_HISTORY,
    icon: 'ic_withdrawal_history',
    label: 'earn_rewards_detail_withdrawal_history',
  },
  activeDetailContentId: getActiveTabId('detailId') as EDetailContentId,
  activeDetailTableId: getActiveTabId('tableId') as EDetailTableId,
  setActiveDetailContent: (activeDetailContentId) =>
    set(() => {
      return { activeDetailContentId };
    }),
  setActiveDetailTable: (activeDetailTableId) =>
    set(() => {
      return { activeDetailTableId };
    }),
  resetRewardsDetail: () =>
    set(() => {
      return {
        activeDetailContentId: EDetailContentId.RECORD_DETAIL,
        activeDetailTableId: EDetailTableId.DETAIL_ALL,
      };
    }),
}));
