import { create } from 'zustand';
import { useAlternateAdjustADID } from '@mode2/usecase/platform/useAlternateAdjustADID';

interface RealTimeH5Version {
  isNewVersion: boolean;
  lastModified: string | null;
  eTag: string | null;
}

interface AppStoreType {
  isAndroidFirstInteractionSuccess: boolean;
  setAndroidFirstInteractionSuccess: (state: boolean) => void;
  pushToken: string;
  setPushToken: (pushToken: string) => void;
  isUpdatePushToken: boolean;
  setUpdatePushToken: (state: boolean) => void;
  googleADID: string;
  setGoogleADID: (googleADID: string) => void;
  adjustADID: string;
  setAdjustADID: (adjustADID: string) => void;
  reqClientParameter: string;
  setReqClientParameter: (clientParameter: string) => void;
  realTimeH5Version: RealTimeH5Version;
  setRealTimeH5Version: (version: RealTimeH5Version) => void;

  temporaryReferralCode: string; // 一次性作用
  setTemporaryReferralCode: (value: string) => void;

  alternateAdjustADID: boolean;
  setAlternateAdjustADID: (value: boolean) => void;

  newIntentDeepLinkWakeUpCount: number;
  setNewIntentDeepLinkWakeUpCount: () => void;
  clear: () => void;
}

export const useAppStore = create<AppStoreType>((set, get) => ({
  isAndroidFirstInteractionSuccess: false,
  setAndroidFirstInteractionSuccess: (state) =>
    set(() => ({ isAndroidFirstInteractionSuccess: state })),
  pushToken: '',
  setPushToken: (pushToken) => set(() => ({ pushToken: pushToken })),
  isUpdatePushToken: false,
  setUpdatePushToken: (state) => set(() => ({ isUpdatePushToken: state })),
  googleADID: '',
  setGoogleADID: (googleADID: string) =>
    set(() => ({ googleADID: googleADID })),
  adjustADID: '',
  setAdjustADID: (adjustADID: string) =>
    set(() => ({ adjustADID: adjustADID })),
  reqClientParameter: '',
  setReqClientParameter: (clientParameter) =>
    set(() => ({ reqClientParameter: clientParameter })),
  realTimeH5Version: {
    isNewVersion: false,
    lastModified: null,
    eTag: null,
  },
  setRealTimeH5Version: (version) =>
    set(() => ({ realTimeH5Version: version })),
  temporaryReferralCode: '',
  setTemporaryReferralCode: (value) =>
    set(() => ({ temporaryReferralCode: value })),
  alternateAdjustADID: false,
  setAlternateAdjustADID: (value) =>
    set(() => ({ alternateAdjustADID: value })),
  newIntentDeepLinkWakeUpCount: 0,
  setNewIntentDeepLinkWakeUpCount: () =>
    set(() => ({
      newIntentDeepLinkWakeUpCount: get().newIntentDeepLinkWakeUpCount + 1,
    })),
  clear: () =>
    set(() => ({
      isAndroidFirstInteractionSuccess: false,
      pushToken: '',
      isUpdatePushToken: false,
      reqClientParameter: '',
    })),
}));
