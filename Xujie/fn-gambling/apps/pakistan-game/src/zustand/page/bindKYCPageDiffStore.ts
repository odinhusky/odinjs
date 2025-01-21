import { create } from 'zustand';
import { devtoolsWrapper } from '@mode2/zustand/middlewareWrapper';
import {
  BankOptionListUnit,
  RequiredWalletAndOtherBankUnit,
} from '@/external/api/endpoint/PostWalletAndOtherBankListEndpoint';
import { SavedBankListResult } from '@/external/api/endpoint/PostSavedBankListEndpoint';
import { EASYPAISA_TAB } from '@/external/api/endpoint/PostWalletAndOtherBankListEndpoint';

// key === Code === value，區別語意

export interface SelectOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  [key: string]: any;
}

export interface useBindKYCPageDiffStoreTypes {
  bankWalletList: RequiredWalletAndOtherBankUnit[];
  setBankWalletList: (list: RequiredWalletAndOtherBankUnit[]) => void;

  otherBankList: BankOptionListUnit[];
  setOtherBankList: (list: BankOptionListUnit[]) => void;

  savedBankList: SavedBankListResult[];
  setSavedBankList: (list: SavedBankListResult[]) => void;

  activeBankAccountTab: RequiredWalletAndOtherBankUnit;
  setActiveBankAccountTab: (tabObj: RequiredWalletAndOtherBankUnit) => void;

  bankAccountTabList: RequiredWalletAndOtherBankUnit[];
  setBankAccountTabList: (list: RequiredWalletAndOtherBankUnit[]) => void;

  bankAccountSelectOptions: SelectOption[];
  setBankAccountSelectOptions: (list: SelectOption[]) => void;
}

/** Action不做固化 */
export const useBindKYCPageDiffStore = create<useBindKYCPageDiffStoreTypes>()(
  devtoolsWrapper('[page diff store] useIsLoginStore', (set) => ({
    bankWalletList: [{ code: '', name: '' }],
    setBankWalletList: (list) => set(() => ({ bankWalletList: list })),

    otherBankList: [{ label: '', value: '' }],
    setOtherBankList: (list) => set(() => ({ otherBankList: list })),

    savedBankList: [] as SavedBankListResult[],
    setSavedBankList: (list) => set(() => ({ savedBankList: list })),

    activeBankAccountTab: { ...EASYPAISA_TAB }, // 目前 Active 狀態的 Tab
    setActiveBankAccountTab: (tabObj) =>
      set(() => ({ activeBankAccountTab: tabObj })),

    bankAccountTabList: [] as RequiredWalletAndOtherBankUnit[],
    setBankAccountTabList: (list) => set(() => ({ bankAccountTabList: list })),

    bankAccountSelectOptions: [] as SelectOption[],
    setBankAccountSelectOptions: (list: SelectOption[]) =>
      set(() => ({ bankAccountSelectOptions: list })),
  }))
);
