import { create } from 'zustand';
import { BasePagePaths } from '@libs/mode2/routerTypes/types';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { NavigateOptions } from 'react-router/dist/lib/context';

interface BottomNavigationUnit {
  labelKey: I18NContent;
  icon: string;
  iconActive: string;
  isDrop: boolean;
  isActive: boolean;
  isShowRedDot: boolean;
  actionPayload: {
    navigateTarget: BasePagePaths;
    options?: NavigateOptions;
  };
}

export enum BottomNavigationScenarios {
  DEFAULT = 'DEFAULT',
  TEAM_CLUB = 'TEAM_CLUB',
  INVITE_WHEEL = 'INVITE_WHEEL',
}

interface UsageScenarios {
  scenarios: BottomNavigationScenarios;
  bottomNavigationList: BottomNavigationUnit[];
}

interface BottomNavigationStoreTypes {
  isDisplayBottomNavigation: boolean;
  setDisplayBottomNavigation: (isDisplay: boolean) => void;
  // bottomNavigationList: BottomNavigationUnit[];
  // setBottomNavigationList: (list: BottomNavigationUnit[]) => void;
  usageScenariosList: UsageScenarios[];
  setUsageScenariosList: (list: UsageScenarios[]) => void;
}

export const useBottomNavigationStore = create<BottomNavigationStoreTypes>(
  (set) => ({
    isDisplayBottomNavigation: false,
    setDisplayBottomNavigation: (isDisplay) =>
      set(() => ({ isDisplayBottomNavigation: isDisplay })),
    // bottomNavigationList: [] as BottomNavigationUnit[],
    // setBottomNavigationList: (list) =>
    //   set(() => ({ bottomNavigationList: list })),
    usageScenariosList: [] as UsageScenarios[],
    setUsageScenariosList: (list) => set(() => ({ usageScenariosList: list })),
  })
);
