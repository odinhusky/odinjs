import { create } from 'zustand';

export interface InboxMessageTypes {
  refreshNotifyUnreadCount: number;
  refreshNotifyUnread: VoidFunction;
}

const defaultProfileStoreState = {
  refreshNotifyUnreadCount: 0,
};

/**
 * 使用者相關
 */
export const useInboxMessageStore = create<InboxMessageTypes>((set, get) => ({
  ...defaultProfileStoreState,
  refreshNotifyUnread: () =>
    set(() => ({
      refreshNotifyUnreadCount: get().refreshNotifyUnreadCount + 1,
    })),
}));
