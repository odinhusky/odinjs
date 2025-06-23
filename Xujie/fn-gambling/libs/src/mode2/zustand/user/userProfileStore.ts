import { create } from 'zustand';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '@libs/mode2/utils/sdk';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';

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

  refreshUserDataCount: number;
  refreshUserData: VoidFunction;

  isAPIMainInfoLoading: boolean;
  setIsAPIMainInfoLoading: (isLoading: boolean) => void;

  userRole: UserRoleType;
  setUserRole: (role: UserRoleType) => void;

  isLogoutWeakTipsModalShow: boolean;
  setIsLogoutWeakTipsModalShow: (isShow: boolean) => void;

  gender: string;
  setGender: (gender: string) => void;

  hasSetPassword: boolean;
  setHasSetPassword: (hasSetPassword: boolean) => void;

  referralCode: string;
  setReferralCode: (referralCode: string) => void;

  referralLink: string;
  setReferralLink: (referralLink: string) => void;

  bindReferralCode: string;
  setBindReferralCode: (bindReferralCode: string) => void;

  displayUserName: string;
  setDisplayUserName: (displayUserName: string) => void;

  clear: () => void;
}

const defaultProfileStoreState = {
  id: 0,
  playerName: '',
  realPhone: '',
  nickname: '',
  avatarOrder: '',
  avatarFrameOrder: '',
  isPasswordExp: false,
  level: 0,
  totalAssets: 0.0,
  lastApiUpdateTime: 0,
  isPersonalInfoFirstBind: false, // 是否需要去完善個人資訊
  isBankFirstBind: true, // 是否沒綁定過帳戶資訊, 如果是第一次綁定還需要設定提現密碼
  isFirstDeposit: null as boolean | null,
  isLowBalance: null as boolean | null,
  currentTotalTeamMembers: 0,
  isNewJoinNotice: false,
  refreshUserDataCount: 0, // 一變動就會去檢查是否登入，登入的話就去打 API MainInfo
  isAPIMainInfoLoading: false,
  userRole: UserRoleType.GUEST,
  isLogoutWeakTipsModalShow: false,

  gender: '',
  hasSetPassword: false,
  referralCode: '',
  referralLink: '',
  bindReferralCode: '',
  displayUserName: 'Guest',
};

/**
 * 使用者相關
 */
export const useUserProfileStore = create<UserProfileStoreTypes>(
  (set, get) => ({
    ...defaultProfileStoreState,
    setId: (id) =>
      set(() => {
        sdkUtils.setStorage(AppLocalStorageKey.USER_ID, String(id));
        return { id };
      }),
    setPlayerName: (playerName) => set(() => ({ playerName: playerName })),
    setRealPhone: (realPhone) => set(() => ({ realPhone: realPhone })),
    setNickname: (name) => set(() => ({ nickname: name })),
    setAvatarOrder: (index) =>
      set((state: UserProfileStoreTypes) => {
        if (state.avatarOrder !== index) {
          return { avatarOrder: index };
        } else {
          return state;
        }
      }),
    setAvatarFrameOrder: (order) => set(() => ({ avatarFrameOrder: order })),
    setPasswordExp: (state) => set(() => ({ isPasswordExp: state })),
    setLevel: (state) => set(() => ({ level: state })),
    setTotalAssets: (state) => set(() => ({ totalAssets: state })),
    setLastApiUpdateTime: (timestamp) =>
      set(() => ({ lastApiUpdateTime: timestamp })),
    setIsPersonalInfoFirstBind: (value) =>
      set(() => ({
        isPersonalInfoFirstBind:
          value === null ? get().isPersonalInfoFirstBind : value,
      })),
    setIsBankFirstBind: (value) =>
      set(() => ({
        isBankFirstBind: value === null ? get().isBankFirstBind : value,
      })),
    setIsFirstDeposit: (value) =>
      set(() => ({
        isFirstDeposit: value,
      })),
    setLowBalance: (value) => set(() => ({ isLowBalance: value })),
    setCurrentTotalTeamMembers: (count) =>
      set(() => ({
        currentTotalTeamMembers: count,
      })),
    setNewJoinNotice: (isNewJoinNotice) =>
      set(() => ({
        isNewJoinNotice: isNewJoinNotice,
      })),
    refreshUserData: () =>
      set(() => ({
        refreshUserDataCount: get().refreshUserDataCount + 1,
      })),
    setIsAPIMainInfoLoading: (isLoading) =>
      set(() => ({
        isAPIMainInfoLoading: isLoading,
      })),

    setUserRole: (role) =>
      set(() => {
        console.log('@@@===> setUserRole', role);
        return { userRole: role };
      }),

    setIsLogoutWeakTipsModalShow: (isShow: boolean) =>
      set(() => ({
        isLogoutWeakTipsModalShow: isShow,
      })),

    setGender: (gender) => set(() => ({ gender: gender })),

    setHasSetPassword: (hasSetPassword) => set(() => ({ hasSetPassword })),

    setReferralCode: (referralCode) => set(() => ({ referralCode: referralCode.toUpperCase() })),
    setReferralLink: (referralLink) => set(() => ({ referralLink })),

    setBindReferralCode: (bindReferralCode) =>
      set(() => ({ bindReferralCode: bindReferralCode.toUpperCase() })),
    setDisplayUserName: (displayUserName) => set(() => ({ displayUserName })),

    clear: () =>
      set(() => ({
        ...defaultProfileStoreState,
      })),
  })
);
