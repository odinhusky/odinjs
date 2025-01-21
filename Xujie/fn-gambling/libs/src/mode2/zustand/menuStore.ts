import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from './middlewareWrapper';

export interface ShowMenuStoreTypes {
  isShowMenu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const useShowMenuStore = create<ShowMenuStoreTypes>()(
  devtoolsAndPersistWrapper('[menu store] useShowMenuStore', (set) => ({
    isShowMenu: false,
    openMenu: () => set(() => ({ isShowMenu: true })),
    closeMenu: () => set(() => ({ isShowMenu: false })),
    toggleMenu: () =>
      set((state: ShowMenuStoreTypes) => ({ isShowMenu: !state.isShowMenu })),
  }))
);
