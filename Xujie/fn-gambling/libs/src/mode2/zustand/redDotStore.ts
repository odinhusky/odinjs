import { create } from 'zustand';

export type RedDotStoreType = {
  inviteTimeRedDot: boolean;
  setInviteTimeRedDot: (bool: boolean) => void;
};

export const useRedDotStore = create<RedDotStoreType>((set) => ({
  inviteTimeRedDot: false,
  setInviteTimeRedDot: (value) => set(() => ({ inviteTimeRedDot: value })),
}));
