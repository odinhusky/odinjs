import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

interface SocialInfo {
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
}

interface UsageScenarios {
  scenarios: SocialScenarios;
  socialList: SocialInfo[];
}

interface SocialListStoreTypes {
  usageScenariosList: UsageScenarios[];
  setUsageScenariosList: (list: UsageScenarios[]) => void;
}

export const useSocialListStore = create<SocialListStoreTypes>()(
  devtoolsAndPersistWrapper('[component store] useSocialListStore', (set) => ({
    usageScenariosList: [] as UsageScenarios[],
    setUsageScenariosList: (list) => set(() => ({ usageScenariosList: list })),
  }))
);
