import { create } from 'zustand';
import { ReportPayloadUnit } from '../utils/sdk/strategy/analytics/local/types';

export type ReportStoreType = {
  reportCount: number;
  addReportCount: () => void;

  reportQueue: ReportPayloadUnit[];
  setReportQueue: (reportQueue: ReportPayloadUnit[]) => void;
};

export const useReportStore = create<ReportStoreType>((set) => ({
  reportCount: 0,
  addReportCount: () =>
    set((state) => ({ reportCount: state.reportCount + 1 })),

  reportQueue: [],
  setReportQueue: (reportQueue) => set(() => ({ reportQueue })),
}));

export default useReportStore;
