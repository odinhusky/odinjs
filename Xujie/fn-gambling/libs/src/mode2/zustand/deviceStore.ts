import { create } from 'zustand';

export type DeviceStoreType = {
  isSE: boolean;
  isPhone: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  setIsPhone: (value: boolean) => void;
  setIsSE: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setIsTablet: (value: boolean) => void;
  setIsDesktop: (value: boolean) => void;
};

export const useDeviceStore = create<DeviceStoreType>((set) => ({
  isSE: false,
  isPhone: false,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  setIsPhone: (value) => set(() => ({ isPhone: value })),
  setIsSE: (value) => set(() => ({ isSE: value })),
  setIsMobile: (value) => set(() => ({ isMobile: value })),
  setIsTablet: (value) => set(() => ({ isTablet: value })),
  setIsDesktop: (value) => set(() => ({ isDesktop: value })),
}));
