import { create } from 'zustand';

export enum SettingPageMusicSwitchTypes {
  ON = 'ON', // 開
  OFF = 'OFF', // 關
}

export enum SettingPageTypes {
  MUSIC_SETTING = 0, // 音樂設定頁
  SOCIALLIST = 1, // 客服社群列表頁
}

export type SettingPageStoreTypes = {
  tabIndex: SettingPageTypes;
  setTabIndex: (index: SettingPageTypes) => void;

  musicSwitch: SettingPageMusicSwitchTypes;
  setMusicSwitch: (index: SettingPageMusicSwitchTypes) => void;
};

export const useSettingPageStore = create<SettingPageStoreTypes>()(
  (set) => ({
    tabIndex: SettingPageTypes.MUSIC_SETTING,
    setTabIndex: (index: SettingPageTypes) =>
      set(() => ({ tabIndex: index })),

    musicSwitch: SettingPageMusicSwitchTypes.ON,
    setMusicSwitch: (index: SettingPageMusicSwitchTypes) =>
      set(() => ({ musicSwitch: index })),
  })
);
