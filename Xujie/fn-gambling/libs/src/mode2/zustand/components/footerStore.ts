import { create } from 'zustand';
import { DeviceBreakPointType } from '@libs/commonUtils';
import { I18NContent } from '@libs/mode2/@types/i18nType';

export interface LinkInfo {
  labelKey: I18NContent;
  icon: string;
  isAction: boolean;
  onActionClick: () => void;
  className?: string;
}

interface FooterStoreTypes {
  isDisplayFooter: boolean;
  setDisplayFooter: (isDisplay: boolean) => void;
  copyrightInfo: string;
  setCopyrightInfo: (src: string) => void;
  introduction: string[];
  setIntroduction: (list: string[]) => void;
  versionInfo: string;
  setVersionInfo: (src: string) => void;
  hyperlinks: LinkInfo[];
  setHyperlinks: (list: LinkInfo[]) => void;
  manufacturerList: string[];
  setManufacturerList: (list: string[]) => void;
  customerServiceTitle: string;
  setCustomerServiceTitle: (title: string) => void;
  displayConfig: DeviceBreakPointType;
  setDisplayConfig: (config: DeviceBreakPointType) => void;
}

export const useFooterStore = create<FooterStoreTypes>()((set) => ({
  isDisplayFooter: true,
  setDisplayFooter: (isDisplay) => set(() => ({ isDisplayFooter: isDisplay })),
  copyrightInfo: '',
  setCopyrightInfo: (src) => set(() => ({ copyrightInfo: src })),
  introduction: [] as string[],
  setIntroduction: (list) => set(() => ({ introduction: list })),
  versionInfo: '',
  setVersionInfo: (src) => set(() => ({ versionInfo: src })),
  hyperlinks: [] as LinkInfo[],
  setHyperlinks: (list) => set(() => ({ hyperlinks: list })),
  manufacturerList: [] as string[],
  setManufacturerList: (list) => set(() => ({ manufacturerList: list })),
  customerServiceTitle: '',
  setCustomerServiceTitle: (title) =>
    set(() => ({ customerServiceTitle: title })),
  displayConfig: {
    isDesktop: false,
    isMobile: false,
    isTablet: false,
  },
  setDisplayConfig: (config) => set(() => ({ displayConfig: config })),
}));
