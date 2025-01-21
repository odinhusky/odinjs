import { create } from 'zustand';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';

export interface ServiceInfo {
  label: string;
  type: ServicesTypeResult;
  payload: { isLink: boolean; target: string };
  icon: string;
  onActionClick: () => void;
  className?: string;
}

export enum CustomerServiceScenarios {
  DRAWER_MENU = 'DRAWER_MENU',
  LOGIN = 'LOGIN',
  INVITE = 'INVITE',
  FOOTER = 'FOOTER',
  FEEDBACK = 'FEEDBACK',
  FAB = 'FAB',
}

interface UsageScenarios {
  scenarios: CustomerServiceScenarios;
  customerServiceList: ServiceInfo[];
}

interface CustomerServiceListTypes {
  usageScenariosList: UsageScenarios[];
  setUsageScenariosList: (list: UsageScenarios[]) => void;
}

export const useCustomerServiceListStore = create<CustomerServiceListTypes>(
  (set) => ({
    usageScenariosList: [] as UsageScenarios[],
    setUsageScenariosList: (list) => set(() => ({ usageScenariosList: list })),
  })
);
