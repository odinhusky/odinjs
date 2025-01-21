import { create } from 'zustand';

interface IReminderModalStore {
  isShowReminderModal: boolean;
  setShowReminderModal: (visible: boolean) => void;
  registerBonus: number;
  setRegisterBonus: (bonus: number) => void;
}

export const useReminderModalStore = create<IReminderModalStore>((set) => ({
  isShowReminderModal: false,
  setShowReminderModal: (value: boolean) => set({ isShowReminderModal: value }),
  registerBonus: 0,
  setRegisterBonus: (bonus) => set({ registerBonus: bonus }),
}));
