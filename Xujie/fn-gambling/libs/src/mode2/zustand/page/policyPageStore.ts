import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

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
  devtoolsAndPersistWrapper(
    '[page store] useMode2PolicyPageListStore',
    (set) => ({
      policyList: [] as IPolicyListType[],
      setPolicyList: (value) => set({ policyList: value }),
    })
  )
);
