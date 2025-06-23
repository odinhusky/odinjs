import { create } from 'zustand';

export interface ShowMenuStoreTypes {
  isShowMenu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const useShowMenuStore = create<ShowMenuStoreTypes>()((set) => ({
  isShowMenu: false,
  openMenu: () => set(() => ({ isShowMenu: true })),
  closeMenu: () => set(() => ({ isShowMenu: false })),
  toggleMenu: () =>
    set((state: ShowMenuStoreTypes) => ({ isShowMenu: !state.isShowMenu })),
}));
