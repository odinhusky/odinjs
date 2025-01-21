import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { TOptions } from 'i18next';

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
  create<useMode2FeedBackPageTabsStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2FeedBackPageTabStore',
      (set) => ({
        isShowRedDot: false,
        setIsShowRedDot: (bool) => set(() => ({ isShowRedDot: bool })),
        activeTabId: 1,
        setActiveTabId: (tabId) => set(() => ({ activeTabId: tabId })),
        tabList: [] as FeedBackTabType[],
        setTabList: (list) => set(() => ({ tabList: list })),
      })
    )
  );

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
  create<useMode2FeedBackPageFAQStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2FeedBackPageFAQStore',
      (set) => ({
        faqList: [] as FAQUnit[],
        setFaqList: (list) => set(() => ({ faqList: list })),
      })
    )
  );

// - InBox List ===================================
import { MessageInfoResult } from '@mode2/external/api/endpoint/message/PostMessageListEndpoint';
import { I18NContent } from '@libs/mode2/@types/i18nType';
export interface useMode2FeedBackPageInBoxStoreTypes {
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
}

export const useMode2FeedBackPageInBoxStore =
  create<useMode2FeedBackPageInBoxStoreTypes>()(
    devtoolsAndPersistWrapper(
      '[page store] useMode2FeedBackPageInBoxStore',
      (set) => ({
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
        setNoticeUnreadCount: (count) =>
          set(() => ({ noticeUnreadCount: count })),
        mailUnreadCount: 0,
        setMailUnreadCount: (count) => set(() => ({ mailUnreadCount: count })),
        isShowMessageModal: false,
        setIsShowMessageModal: (bool) =>
          set(() => ({ isShowMessageModal: bool })),

        curMessageData: {} as MessageInfoResult,
        setCurMessageData: (data: MessageInfoResult) =>
          set(() => ({ curMessageData: data })),
        isShowMessageModalGoNowBtn: true,
        setIsShowMessageModalGoNowBtn: (bool) =>
          set(() => ({ isShowMessageModalGoNowBtn: bool })),
      })
    )
  );
