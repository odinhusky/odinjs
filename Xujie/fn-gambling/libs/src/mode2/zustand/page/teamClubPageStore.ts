import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { TeamClubPageTabType } from '@mode2/@types/teamClubPageTabType';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { ClipboardInfo, ClipboardState } from '@commonUtils/hooks/useClipboard';
import { I18NContent } from '@libs/mode2/@types/i18nType';

export interface TeamClubPageTabConfig {
  id: TeamClubPageTabType;
  titleKey: string;
  isActive: boolean;
  isShowRedDot: boolean;
  isShow: boolean;
  className?: string;
}

export interface Mode2TeamClubPageStoreTypes {
  isShowRedDot: boolean;
  setIsShowRedDot: (bool: boolean) => void;
  curTab: TeamClubPageTabType;
  setCurTab: (tab: TeamClubPageTabType) => void;
  tabList: TeamClubPageTabConfig[];
  setTabList: (list: TeamClubPageTabConfig[]) => void;
}

export const useMode2TeamClubPageStore = create<Mode2TeamClubPageStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[page store] useMode2TeamClubPageStore',
    (set) => ({
      isShowRedDot: false,
      setIsShowRedDot: (bool) => set(() => ({ isShowRedDot: bool })),
      curTab: TeamClubPageTabType.MY_REWARDS,
      setCurTab: (tab) => set(() => ({ curTab: tab })),
      tabList: [] as TeamClubPageTabConfig[],
      setTabList: (list) => set(() => ({ tabList: list })),
    })
  )
);

interface TeamClubPageActionsStoreTypes {
  teamClubTabActionList: VoidAction[];
  setTeamClubTabActionList: (list: VoidAction[]) => void;
}

export const useMode2TeamClubPageActionsStore =
  create<TeamClubPageActionsStoreTypes>((set) => ({
    teamClubTabActionList: [] as VoidAction[],
    setTeamClubTabActionList: (list) =>
      set(() => ({ teamClubTabActionList: list })),
  }));

export interface EarnStepUnit {
  id: string | number;
  title: I18NContent;
  url: string;
  desc: I18NContent;
}

export interface Mode2TeamClubPageShareForBonusStoreTypes {
  lastFetchTime: number;
  setLastFetchTime: (time: number) => void;
  earnStepList: EarnStepUnit[];
  setEarnStepList: (list: EarnStepUnit[]) => void;
  clipboardLinkResult: ClipboardInfo;
  setClipboardLinkResult: (result: ClipboardInfo) => void;
}

export const useMode2TeamClubPageShareForBonusStore =
  create<Mode2TeamClubPageShareForBonusStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2TeamClubPageShareForBonusStore',
      (set) => ({
        lastFetchTime: 0,
        setLastFetchTime: (time) => set(() => ({ lastFetchTime: time })),
        earnStepList: [] as EarnStepUnit[],
        setEarnStepList: (list) => set(() => ({ earnStepList: list })),
        clipboardLinkResult: {
          state: ClipboardState.INCOMPLETE,
          message: '',
        },
        setClipboardLinkResult: (result) =>
          set(() => ({ clipboardLinkResult: result })),
      })
    )
  );
