import { create } from 'zustand';
import {
  defElementMetrics,
  ElementMetrics,
} from '@commonUtils/hooks/useObserverElementMetrics';
import { CSSProperties, RefObject } from 'react';

export enum ScreenOrientationType {
  Portrait = 'Portrait',
  Landscape = 'Landscape',
}
interface TemplateLayoutStoreTypes {
  currentPxTimes: number;
  setCurrentPxTimes: (px: number) => void;
  headerElementRef: RefObject<HTMLDivElement> | null;
  headerElMetrics: ElementMetrics;
  setHeaderElMetrics: (
    headerElementRef: RefObject<HTMLDivElement> | null,
    elMetrics: ElementMetrics
  ) => void;
  menuElMetrics: ElementMetrics;
  setMenuElMetrics: (elMetrics: ElementMetrics) => void;
  mainElementRef: RefObject<HTMLDivElement> | null;
  mainContentElMetrics: ElementMetrics;
  setMainContentElMetrics: (
    mainElementRef: RefObject<HTMLDivElement> | null,
    elMetrics: ElementMetrics
  ) => void;
  bottomNavigationRef: RefObject<HTMLDivElement> | null;
  bottomNavigationElMetrics: ElementMetrics;
  setBottomNavigationElMetrics: (
    bottomNavigationRef: RefObject<HTMLDivElement> | null,
    elMetrics: ElementMetrics
  ) => void;
  footerElementRef: RefObject<HTMLDivElement> | null;
  footerElMetrics: ElementMetrics;
  setFooterElMetrics: (
    footerElementRef: RefObject<HTMLDivElement> | null,
    elMetrics: ElementMetrics
  ) => void;
  mainStyle: CSSProperties;
  setMainStyle: (style: CSSProperties) => void;
  screenOrientation: ScreenOrientationType;
  setScreenOrientation: (orientation: ScreenOrientationType) => void;
  // 任務中心
  missionTipCount: number;
  setMissionTipCount: (count: number) => void;
  refreshMissionTipCount: number;
  refreshMissionTip: VoidFunction;
}

export const useTemplateLayoutStore = create<TemplateLayoutStoreTypes>()(
  (set, get) => ({
    currentPxTimes: 1,
    setCurrentPxTimes: (px) =>
      set(() => ({
        currentPxTimes: px,
      })),
    headerElementRef: null as RefObject<HTMLDivElement> | null,
    headerElMetrics: defElementMetrics,
    setHeaderElMetrics: (headerElementRef, elMetrics) =>
      set(() => ({
        headerElementRef: headerElementRef,
        headerElMetrics: elMetrics,
      })),
    menuElMetrics: defElementMetrics,
    setMenuElMetrics: (elMetrics) => set(() => ({ menuElMetrics: elMetrics })),
    mainElementRef: null as RefObject<HTMLDivElement> | null,
    mainContentElMetrics: defElementMetrics,
    setMainContentElMetrics: (mainElementRef, elMetrics) =>
      set(() => ({
        mainElementRef: mainElementRef,
        mainContentElMetrics: elMetrics,
      })),
    bottomNavigationRef: null as RefObject<HTMLDivElement> | null,
    bottomNavigationElMetrics: defElementMetrics,
    setBottomNavigationElMetrics: (bottomNavigationRef, elMetrics) =>
      set(() => ({
        bottomNavigationRef: bottomNavigationRef,
        bottomNavigationElMetrics: elMetrics,
      })),
    footerElementRef: null as RefObject<HTMLDivElement> | null,
    footerElMetrics: defElementMetrics,
    setFooterElMetrics: (footerElementRef, elMetrics) =>
      set(() => ({ footerElementRef, footerElMetrics: elMetrics })),

    mainStyle: {},
    setMainStyle: (mainStyle) => set(() => ({ mainStyle })),
    screenOrientation: ScreenOrientationType.Portrait,
    setScreenOrientation: (orientation) =>
      set(() => ({ screenOrientation: orientation })),
    // 任務中心
    missionTipCount: 0,
    setMissionTipCount: (count) => set(() => ({ missionTipCount: count })),
    refreshMissionTipCount: 0,
    refreshMissionTip: () =>
      set(() => ({ refreshMissionTipCount: get().refreshMissionTipCount + 1 })),
  })
);
