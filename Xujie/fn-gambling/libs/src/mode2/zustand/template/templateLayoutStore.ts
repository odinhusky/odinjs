import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '@mode2/zustand/middlewareWrapper';
import {
  defElementMetrics,
  ElementMetrics,
} from '@commonUtils/hooks/useObserverElementMetrics';
import { RefObject } from 'react';

interface TemplateLayoutStoreTypes {
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
}

export const useTemplateLayoutStore = create<TemplateLayoutStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[template store] useTemplateLayoutStore',
    (set) => ({
      headerElementRef: null as RefObject<HTMLDivElement> | null,
      headerElMetrics: defElementMetrics,
      setHeaderElMetrics: (headerElementRef, elMetrics) =>
        set(() => ({ headerElementRef: headerElementRef, headerElMetrics: elMetrics })),
      menuElMetrics: defElementMetrics,
      setMenuElMetrics: (elMetrics) =>
        set(() => ({ menuElMetrics: elMetrics })),
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
          bottomNavigationElMetrics: elMetrics
        })),
      footerElementRef: null as RefObject<HTMLDivElement> | null,
      footerElMetrics: defElementMetrics,
      setFooterElMetrics: (footerElementRef, elMetrics) =>
        set(() => ({ footerElementRef, footerElMetrics: elMetrics })),
    })
  )
);
