import { PromoteDailyDetailListItemResult } from '@libs/mode2/external/api/endpoint/team/PostPromoteDailyDetailEndpoint';
import { create } from 'zustand';

interface ITeamDataDetailModalStore {
  teamDataDetailModalVisible: boolean;
  setTeamDataDetailModalVisible: (visible: boolean) => void;
  teamDataDetailList: PromoteDailyDetailListItemResult[];
  setTeamDataDetailList: (list: PromoteDailyDetailListItemResult[]) => void;
}

export const useTeamDataDetailModalStore = create<ITeamDataDetailModalStore>(
  (set) => ({
    teamDataDetailModalVisible: false,
    setTeamDataDetailModalVisible: (value: boolean) =>
      set({ teamDataDetailModalVisible: value }),
    teamDataDetailList: [],
    setTeamDataDetailList: (value) => set({ teamDataDetailList: value }),
  })
);
