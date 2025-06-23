import { create } from 'zustand';
import { PreloadType } from '@mode2/usecase/preloadResources/command/PreloadResourcesCommand';

export interface PreloadResources {
  src: string;
  type: PreloadType;
}

interface PreloadDynamicResourcesStoreType {
  preloadResources: PreloadResources[];
  setPreloadResources: (values: PreloadResources[]) => void;
}

export const usePreloadDynamicResourcesStore =
  create<PreloadDynamicResourcesStoreType>((set) => ({
    preloadResources: [],
    setPreloadResources: (values) => set(() => ({ preloadResources: values })),
  }));
