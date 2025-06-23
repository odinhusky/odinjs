import { create } from 'zustand';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { persist } from 'zustand/middleware';

// - Tab List ===================================
export interface FeedBackTabType {
  id: number | string;
  tabNameI18N: I18NContent;
}

export interface useMode2FeedBackPageTabsStoreTypes {
  isShowRedDot: boolean;
  setIsShowRedDot: (bool: boolean) => void;
  activeTabId: number;
  setActiveTabId: (tabId: number) => void;
  tabList: FeedBackTabType[];
  setTabList: (list: FeedBackTabType[]) => void;
}

export const useMode2FeedBackPageTabStore =
  create<useMode2FeedBackPageTabsStoreTypes>()((set) => ({
    isShowRedDot: false,
    setIsShowRedDot: (bool) => set(() => ({ isShowRedDot: bool })),
    activeTabId: 1,
    setActiveTabId: (tabId) => set(() => ({ activeTabId: tabId })),
    tabList: [] as FeedBackTabType[],
    setTabList: (list) => set(() => ({ tabList: list })),
  }));

interface FeedBackPageActionsStoreTypes {
  feedbackTabActionList: VoidAction[];
  setFeedbackTabActionList: (list: VoidAction[]) => void;
}

// Actions 的行為就不做資料固化
export const useMode2FeedBackPageActionsStore =
  create<FeedBackPageActionsStoreTypes>((set) => ({
    feedbackTabActionList: [] as VoidAction[],
    setFeedbackTabActionList: (list) =>
      set(() => ({ feedbackTabActionList: list })),
  }));

// - FAQ List ===================================

export interface FAQUnit {
  titleKey: I18NContent;
  desc: I18NContent[];
}

export interface useMode2FeedBackPageFAQStoreTypes {
  faqList: FAQUnit[];
  setFaqList: (list: FAQUnit[]) => void;
}

export const useMode2FeedBackPageFAQStore =
  create<useMode2FeedBackPageFAQStoreTypes>()((set) => ({
    faqList: [] as FAQUnit[],
    setFaqList: (list) => set(() => ({ faqList: list })),
  }));

// - InBox List ===================================
import { MessageInfoResult } from '@mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { I18NContent } from '@libs/mode2/@types/i18nType';

interface IButtonUnit {
  text: string;
  onClick: () => void;
}

export interface useMode2FeedBackPageInBoxStoreTypes {
  inboxLoading: boolean;
  setInboxLoading: (bool: boolean) => void;
  inBoxPageNumber: number;
  setInBoxPageNumber: (num: number) => void;
  inBoxPageList: MessageInfoResult[];
  setInBoxPageList: (
    list:
      | MessageInfoResult[]
      | ((prev: MessageInfoResult[]) => MessageInfoResult[])
  ) => void;
  isEndOfInBoxPageList: boolean;
  setIsEndOfInBoxPageList: (bool: boolean) => void;

  noticeUnreadCount: number;
  setNoticeUnreadCount: (count: number) => void;
  mailUnreadCount: number;
  setMailUnreadCount: (count: number) => void;
  isShowMessageModal: boolean;
  setIsShowMessageModal: (bool: boolean) => void;
  curMessageData: MessageInfoResult;
  setCurMessageData: (data: MessageInfoResult) => void;
  isShowMessageModalGoNowBtn: boolean;
  setIsShowMessageModalGoNowBtn: (bool: boolean) => void;
  isShowReceiveModal: boolean;
  setIsShowReceiveModal: (bool: boolean) => void;
  totalReward: number;
  setTotalReward: (reward: number) => void;
  buttonList: IButtonUnit[];
  setButtonList: (list: IButtonUnit[]) => void;

  clear: () => void;
}

export const useMode2FeedBackPageInBoxStore =
  create<useMode2FeedBackPageInBoxStoreTypes>()((set) => ({
    inboxLoading: true,
    setInboxLoading: (bool) => set(() => ({ inboxLoading: bool })),
    inBoxPageNumber: 0,
    setInBoxPageNumber: (num) => set(() => ({ inBoxPageNumber: num })),
    inBoxPageList: [] as MessageInfoResult[],
    setInBoxPageList: (values) =>
      set((state: useMode2FeedBackPageInBoxStoreTypes) => ({
        inBoxPageList:
          values instanceof Function ? values(state.inBoxPageList) : values,
      })),
    isEndOfInBoxPageList: false,
    setIsEndOfInBoxPageList: (bool) =>
      set(() => ({ isEndOfInBoxPageList: bool })),
    noticeUnreadCount: 0,
    setNoticeUnreadCount: (count) => set(() => ({ noticeUnreadCount: count })),
    mailUnreadCount: 0,
    setMailUnreadCount: (count) => set(() => ({ mailUnreadCount: count })),
    isShowMessageModal: false,
    setIsShowMessageModal: (bool) => set(() => ({ isShowMessageModal: bool })),

    curMessageData: {} as MessageInfoResult,
    setCurMessageData: (data: MessageInfoResult) =>
      set(() => ({ curMessageData: data })),
    isShowMessageModalGoNowBtn: true,
    setIsShowMessageModalGoNowBtn: (bool) =>
      set(() => ({ isShowMessageModalGoNowBtn: bool })),
    isShowReceiveModal: false,
    setIsShowReceiveModal: (bool) => set(() => ({ isShowReceiveModal: bool })),
    totalReward: 0,
    setTotalReward: (totalReward) => set(() => ({ totalReward })),
    buttonList: [],
    setButtonList: (list) => set(() => ({ buttonList: list })),
    clear: () =>
      set(() => ({
        noticeUnreadCount: 0,
        mailUnreadCount: 0,
      })),
  }));

// FOR V6 InboxDetailPage
type InboxDetailPage = {
  inboxDetail: MessageInfoResult;
  setInboxDetail: (data: MessageInfoResult) => void;
};
const useInboxDetailPageStore = create<InboxDetailPage>()(
  persist(
    (set) => ({
      inboxDetail: {} as MessageInfoResult,
      setInboxDetail: (data: MessageInfoResult) =>
        set(() => ({ inboxDetail: data })),
    }),
    {
      name: 'inbox-detail-store',
    }
  )
);

export default useInboxDetailPageStore;
