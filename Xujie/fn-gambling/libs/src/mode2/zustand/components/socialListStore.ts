import { create } from 'zustand';

export interface SocialInfo {
  label: string;
  icon: string;
  onActionClick: () => void;
  className?: string;
}

export enum SocialScenarios {
  FOOTER = 'FOOTER',
  INVITE_PAGE = 'INVITE_PAGE',
  TEAM_CLUB = 'TEAM_CLUB',
  SHARE = 'SHARE',
  V6_VERSION_SHARE = 'V6_VERSION_SHARE',
  ABOUT_US = 'ABOUT_US',
}

interface UsageScenarios {
  scenarios: SocialScenarios;
  socialList: SocialInfo[];
}

interface SocialListStoreTypes {
  usageScenariosList: UsageScenarios[];
  setUsageScenariosList: (list: UsageScenarios[]) => void;
}

export const useSocialListStore = create<SocialListStoreTypes>()((set) => ({
  usageScenariosList: [] as UsageScenarios[],
  setUsageScenariosList: (list) => set(() => ({ usageScenariosList: list })),
}));
