import { create } from 'zustand';

export interface TeamClubModalStoreTypes {
  isShowTeamClubModal: boolean;
  setShowTeamClubModal: (isShow: boolean) => void;

  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;
}

export const useTeamClubModalStore = create<TeamClubModalStoreTypes>(
  (set, get) => ({
    isShowTeamClubModal: false,
    setShowTeamClubModal: (isShow) =>
      set(() => ({ isShowTeamClubModal: isShow })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),
  })
);

export default useTeamClubModalStore;
