import { create } from 'zustand';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '@libs/mode2/utils/sdk';

export interface UserProfileStoreTypes {
  id: number;
  setId: (id: number) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  realPhone: string;
  setRealPhone: (realPhone: string) => void;
  nickname: string;
  setNickname: (name: string) => void;
  avatarOrder: string;
  setAvatarOrder: (index: string) => void;
  avatarFrameOrder: string;
  setAvatarFrameOrder: (order: string) => void;
  isPasswordExp: boolean;
  setPasswordExp: (state: boolean) => void;
  level: number;
  setLevel: (state: number) => void;
  totalAssets: number;
  setTotalAssets: (state: number) => void;
  lastApiUpdateTime: number;
  setLastApiUpdateTime: (timestamp: number) => void;
  // KYC
  isPersonalInfoFirstBind: boolean;
  setIsPersonalInfoFirstBind: (value: boolean | null) => void;
  isBankFirstBind: boolean;
  setIsBankFirstBind: (value: boolean | null) => void;
  isFirstDeposit: boolean | null;
  setIsFirstDeposit: (value: boolean | null) => void;
  isLowBalance: boolean | null;
  setLowBalance: (value: boolean | null) => void;

  currentTotalTeamMembers: number;
  setCurrentTotalTeamMembers: (count: number) => void;
  isNewJoinNotice: boolean;
  setNewJoinNotice: (isNewJoinNotice: boolean) => void;

  clear: () => void;
}

/**
 * 使用者相關
 */
export const useUserProfileStore = create<UserProfileStoreTypes>(
  (set, get) => ({
    id: 0,
    setId: (id) =>
      set(() => {
        sdkUtils.setStorage(AppLocalStorageKey.USER_ID, String(id));
        return { id };
      }),
    playerName: '',
    setPlayerName: (playerName) => set(() => ({ playerName: playerName })),
    realPhone: '',
    setRealPhone: (realPhone) => set(() => ({ realPhone: realPhone })),
    nickname: '',
    setNickname: (name) => set(() => ({ nickname: name })),
    avatarOrder: '',
    setAvatarOrder: (index) =>
      set((state: UserProfileStoreTypes) => {
        if (state.avatarOrder !== index) {
          return { avatarOrder: index };
        } else {
          return state;
        }
      }),
    avatarFrameOrder: '',
    setAvatarFrameOrder: (order) => set(() => ({ avatarFrameOrder: order })),
    isPasswordExp: false,
    setPasswordExp: (state) => set(() => ({ isPasswordExp: state })),
    level: 0,
    setLevel: (state) => set(() => ({ level: state })),
    totalAssets: 0.0,
    setTotalAssets: (state) => set(() => ({ totalAssets: state })),
    lastApiUpdateTime: 0,
    setLastApiUpdateTime: (timestamp) =>
      set(() => ({ lastApiUpdateTime: timestamp })),
    isPersonalInfoFirstBind: false, // 是否需要去完善個人資訊
    setIsPersonalInfoFirstBind: (value) =>
      set(() => ({
        isPersonalInfoFirstBind:
          value === null ? get().isPersonalInfoFirstBind : value,
      })),
    isBankFirstBind: true, // 是否沒綁定過帳戶資訊, 如果是第一次綁定還需要設定提現密碼
    setIsBankFirstBind: (value) =>
      set(() => ({
        isBankFirstBind: value === null ? get().isBankFirstBind : value,
      })),
    isFirstDeposit: null as boolean | null,
    setIsFirstDeposit: (value) =>
      set(() => ({
        isFirstDeposit: value,
      })),
    isLowBalance: null as boolean | null,
    setLowBalance: (value) => set(() => ({ isLowBalance: value })),
    currentTotalTeamMembers: 0,
    setCurrentTotalTeamMembers: (count) =>
      set(() => ({
        currentTotalTeamMembers: count,
      })),
    isNewJoinNotice: false,
    setNewJoinNotice: (isNewJoinNotice) =>
      set(() => ({
        isNewJoinNotice: isNewJoinNotice,
      })),
    clear: () =>
      set(() => ({
        id: 0,
        phone: '',
        nickname: '',
        avatarOrder: '',
        avatarFrameOrder: '',
        isPasswordExp: false,
        level: 0,
        totalAssets: 0.0,
        lastApiUpdateTime: 0,
        isPersonalInfoFirstBind: false,
        isBankFirstBind: true,
        isFirstDeposit: null,
        isLowBalance: null,
        currentTotalTeamMembers: 0,
        isNewJoinNotice: false,
      })),
  })
);
