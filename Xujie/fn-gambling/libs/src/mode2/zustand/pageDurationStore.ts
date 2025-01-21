import { create } from 'zustand';
import dayjs from 'dayjs';

interface LastPageDurationInfo {
  from: string;
  pageDuration: number;
}

interface PageDurationEvent {
  id: string;
  message: string;
  extra: {
    from: string;
    to: string;
    pageDuration: number;
  };
}

interface PageDurationStoreType {
  lastPageDurationInfo: LastPageDurationInfo;
  setLastPageDurationInfo: (info: LastPageDurationInfo) => void;
  pageDurationEvents: PageDurationEvent[];
  setPageDurationEvent: (events: PageDurationEvent[]) => void;
  clearEvent: (uuid: string) => void;
}

export const usePageDurationStore = create<PageDurationStoreType>((set) => ({
  lastPageDurationInfo: {
    from: '',
    pageDuration: dayjs().valueOf(),
  },
  setLastPageDurationInfo: (info) =>
    set(() => ({ lastPageDurationInfo: info })),
  pageDurationEvents: [],
  setPageDurationEvent: (events) =>
    set((state) => {
      return {
        pageDurationEvents: [...state.pageDurationEvents, ...events],
      };
    }),
  clearEvent: (uuid) =>
    set((state) => {
      const events = state.pageDurationEvents.filter((item) => item.id != uuid);
      return {
        pageDurationEvents: events,
      };
    }),
}));
