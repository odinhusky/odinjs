import { create } from 'zustand';
import { ClipboardInfo, ClipboardState } from '@commonUtils/hooks/useClipboard';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { FundDetailItemResult } from '@mode2API/endpoint/record/PostFundDetailEndpoint';
import { RechargeRecordItemResult } from '@mode2API/endpoint/record/PostRechargeRecordsEndpoint';
import { WithdrawRecordItemResult } from '@mode2API/endpoint/record/PostWithdrawRecordsEndpoint';
import { I18NContent } from '@mode2/@types/i18nType';

export enum RecordPageTabs {
  RECORD,
  REPORT,
}

export enum RecordPageBalanceRecordTabs {
  FUND_TRANSFER_RECORD,
  ADD_CASH_RECORD,
  WITHDRAWALS_RECORD,
}

export enum RecordPageReportTimeTabs {
  TODAY,
  YESTERDAY,
  A_WEEK,
  A_MONTH,
}

export interface useRecordPageStoreTypes {
  tabIndex: RecordPageTabs;
  setTabIndex: (index: RecordPageTabs) => void;
}

export const useRecordPageStore = create<useRecordPageStoreTypes>()(
  devtoolsAndPersistWrapper('[page store] useRecordPageStore', (set) => ({
    tabIndex: RecordPageTabs.RECORD,
    setTabIndex: (index) => set(() => ({ tabIndex: index })),
  }))
);

// - Balance Record Component

export interface useRecordPageBalanceRecordStoreTypes {
  fundTransferRecordList: FundDetailItemResult[];
  setFundTransferRecords: (list: FundDetailItemResult[]) => void;
  rechargeRecordList: RechargeRecordItemResult[];
  setRechargeRecords: (list: RechargeRecordItemResult[]) => void;
  withdrawRecordList: WithdrawRecordItemResult[];
  setWthdrawRecords: (list: WithdrawRecordItemResult[]) => void;
  listSwitchTabList: I18NContent[];
  setListSwitchTabList: (list: I18NContent[]) => void;
  activeListSwitchTabIndex: number;
  setActiveListSwitchTabIndex: (index: number) => void;
  clipboardResult: ClipboardInfo;
  setClipboardResult: (result: ClipboardInfo) => void;
}

export const useRecordPageBalanceRecordStore =
  create<useRecordPageBalanceRecordStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useRecordPageBalanceRecordStore',
      (set) => ({
        fundTransferRecordList: [] as FundDetailItemResult[],
        setFundTransferRecords: (list) =>
          set(() => ({ fundTransferRecordList: list })),
        rechargeRecordList: [] as RechargeRecordItemResult[],
        setRechargeRecords: (list) => set(() => ({ rechargeRecordList: list })),
        withdrawRecordList: [] as WithdrawRecordItemResult[],
        setWthdrawRecords: (list) => set(() => ({ withdrawRecordList: list })),
        listSwitchTabList: [] as I18NContent[],
        setListSwitchTabList: (list) =>
          set(() => ({ listSwitchTabList: list })),
        activeListSwitchTabIndex:
          RecordPageBalanceRecordTabs.FUND_TRANSFER_RECORD,
        setActiveListSwitchTabIndex: (index) =>
          set(() => ({ activeListSwitchTabIndex: index })),
        clipboardResult: {
          state: ClipboardState.INCOMPLETE,
          message: '',
        },
        setClipboardResult: (result) =>
          set(() => ({ clipboardResult: result })),
      })
    )
  );

// - Balance Report Component
export const recordPageReportButtonsGroupColors = {
  Casino: 'linear-gradient(180deg,#0fc998 0%,#082e41 100%)',
  Slots: 'linear-gradient(180deg, #C841FD 0%, #7F0BF0 100%)',
  Sports: 'linear-gradient(180deg, #FC9E47 0%, #EA1785 100%)',
  Game: 'linear-gradient(180deg, #2E73EC 0%, #062051 100%)',
  Fishing: 'linear-gradient(180deg, #08FAA5 0%, #0081FF 100%)',
  Original: 'linear-gradient(180deg, #FED03F 0%, #FC8A34 100%)',
};

export type RecordPageReportButtonKeys =
  keyof typeof recordPageReportButtonsGroupColors;

export interface RecordPageReportGameUnit {
  name: I18NContent;
  colorKey: RecordPageReportButtonKeys;
  icon: string;
  balance: number;
  totalBalance: number;
}

export interface RecordPageReportSelectedProgressInfoUnit {
  name: I18NContent;
  colorKey: RecordPageReportButtonKeys;
  icon: string;
  balance: number;
  totalBalance: number;
}

export interface useRecordPageBalanceReportStoreTypes {
  reportTimeTabList: I18NContent[];
  setReportTimeTabList: (list: I18NContent[]) => void;
  activeReportTimeTabIndex: RecordPageReportTimeTabs;
  setActiveReportTimeTabIndex: (index: RecordPageReportTimeTabs) => void;
  reportGameList: RecordPageReportGameUnit[];
  setReportGameList: (list: RecordPageReportGameUnit[]) => void;
  selectProgressInfo: RecordPageReportSelectedProgressInfoUnit | null;
  setSelectProgressInfo: (
    value: RecordPageReportSelectedProgressInfoUnit | null
  ) => void;
}

export const useRecordPageBalanceReportStore =
  create<useRecordPageBalanceReportStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useRecordPageBalanceReportStore',
      (set) => ({
        reportTimeTabList: [] as I18NContent[],
        setReportTimeTabList: (list) =>
          set(() => ({ reportTimeTabList: list })),
        activeReportTimeTabIndex: RecordPageReportTimeTabs.TODAY,
        setActiveReportTimeTabIndex: (index) =>
          set(() => ({ activeReportTimeTabIndex: index })),
        reportGameList: [] as RecordPageReportGameUnit[],
        setReportGameList: (list) => set(() => ({ reportGameList: list })),
        selectProgressInfo:
          null as RecordPageReportSelectedProgressInfoUnit | null,
        setSelectProgressInfo: (value) =>
          set(() => ({ selectProgressInfo: value })),
      })
    )
  );

interface RecordPageBalanceReportActionsStoreTypes {
  gameTypeListActions: (() => void)[];
  setGameTypeListActions: (list: (() => void)[]) => void;
}

export const useRecordPageBalanceReportActionsStore =
  create<RecordPageBalanceReportActionsStoreTypes>((set) => ({
    gameTypeListActions: [] as (() => void)[],
    setGameTypeListActions: (list) =>
      set(() => ({ gameTypeListActions: list })),
  }));
