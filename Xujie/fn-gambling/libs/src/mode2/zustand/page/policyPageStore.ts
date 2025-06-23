import { create } from 'zustand';

export interface IPolicyListType {
  i18nTitleKey: string;
  i18nContentKey: string;
  i18nItemKeys: string[];
}

interface useMode2PolicyPageListType {
  policyList: IPolicyListType[];
  setPolicyList: (policyList: IPolicyListType[]) => void;
}

export const useMode2PolicyPageListStore = create<useMode2PolicyPageListType>()(
  (set) => ({
    policyList: [] as IPolicyListType[],
    setPolicyList: (value) => set({ policyList: value }),
  })
);
