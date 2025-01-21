import { useDeviceStore } from '@mode2/zustand/deviceStore';

export interface DeviceBreakPointALLType {
  isSE: boolean;
  isPhone: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

export type DeviceBreakPointType = Omit<
  DeviceBreakPointALLType,
  'isSE' | 'isPhone'
>;

export const useBreakPoint = (): DeviceBreakPointALLType => {
  const isSE = useDeviceStore((state) => state.isSE);
  const isPhone = useDeviceStore((state) => state.isPhone);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  const isDesktop = useDeviceStore((state) => state.isDesktop);

  return {
    isSE,
    isPhone,
    isMobile,
    isTablet,
    isDesktop,
  };
};
