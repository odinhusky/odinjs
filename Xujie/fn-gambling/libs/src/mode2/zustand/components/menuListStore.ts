import { create } from 'zustand';

interface SubMenuItem {
  label: string;
  action: () => void;
  isShowRedDot?: boolean;
  isHide?: boolean;
}

export interface MenuUnit {
  label: string;
  icon: string;
  param?: string;
  iconColor?: string;
  active?: boolean;
  action?: () => void;
  children?: SubMenuItem[];
  isShowRedDot?: boolean;
  isHide?: boolean;
}

export enum MenuScenarios {
  DEFAULT_SIDE_MENU = 'DEFAULT_SIDE_MENU',
  DEFAULT_DRAWER_MENU = 'DEFAULT_DRAWER_MENU',

  TEAM_CLUB_SIDE_MENU = 'TEAM_CLUB_SIDE_MENU',
  TEAM_CLUB_DRAWER_MENU = 'TEAM_CLUB_DRAWER_MENU',

  IN_MODE1_COMMON_MENU = 'IN_MODE1_COMMON_MENU', // IN mode1 common menu

  PK_MODE1_COMMON_MENU = 'PK_MODE1_COMMON_MENU', // PK mode1 common menu
}

interface UsageScenarios {
  scenarios: MenuScenarios;
  menuList: MenuUnit[];
}

interface MenuListStoreTypes {
  menuUsageScenariosList: UsageScenarios[];
  setMenuUsageScenariosList: (list: UsageScenarios[]) => void;
}

export const useMenuListStore = create<MenuListStoreTypes>()((set) => ({
  menuUsageScenariosList: [] as UsageScenarios[],
  setMenuUsageScenariosList: (list) =>
    set(() => ({ menuUsageScenariosList: list })),
}));
