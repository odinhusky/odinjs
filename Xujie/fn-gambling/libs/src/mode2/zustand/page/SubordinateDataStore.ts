import { create } from 'zustand';
import dayjs from '@commonUtils/localizedDayjs';
import {
  ORDER,
  OrderType,
} from '@libs/mode2/action/subordinateDataAction/useSubordinateDataClickActions';
import { TeamFinanceTierSummaryItemResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamFinanceTierSummaryListEndpoint';
import { TeamMemberSummaryResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamMemberSummaryEndpoint';
import { TeamLevelUnit } from '../components/myRewardsContent';

export const defaultJoinTime = dayjs().endOf('date').unix();

export interface Mode2TeamClubSubordinateDataStoreTypes {
  mobile: string;
  setMobile: (mobile: string) => void;
  sortByTier: number;
  setSortByTier: (value: number) => void;
  sortByJoinTime: OrderType;
  setSortByJoinTime: (value: OrderType) => void;
  sortByCommission: OrderType;
  setSortByCommission: (value: OrderType) => void;
  datePicker: number;
  setDatePicker: (value: number) => void;
  currentClubLevelData: TeamLevelUnit;
  setCurrentClubLevelData: (value: TeamLevelUnit) => void;
  teamFinanceTierSummaryList: TeamFinanceTierSummaryItemResult[];
  setTeamFinanceTierSummaryList: (
    list: TeamFinanceTierSummaryItemResult[]
  ) => void;
  teamMemberSummaryData: TeamMemberSummaryResult;
  setTeamMemberSummaryData: (value: TeamMemberSummaryResult) => void;

  refreshUserDataCount: number;
  refreshUserData: () => void;
}

export const useMode2SubordinateDataPageStore =
  create<Mode2TeamClubSubordinateDataStoreTypes>()((set, get) => ({
    mobile: '',
    setMobile: (mobile) => set(() => ({ mobile: mobile })),
    sortByTier: 0,
    setSortByTier: (value: number) => set(() => ({ sortByTier: value })),
    sortByJoinTime: ORDER.DESC as OrderType,
    setSortByJoinTime: (value: OrderType) =>
      set(() => ({ sortByJoinTime: value })),
    sortByCommission: ORDER.DEFAULT as OrderType,
    setSortByCommission: (value: OrderType) =>
      set(() => ({ sortByCommission: value })),
    datePicker: defaultJoinTime,
    setDatePicker: (value) => set(() => ({ datePicker: value })),
    currentClubLevelData: {} as TeamLevelUnit,
    setCurrentClubLevelData: (value) =>
      set(() => ({ currentClubLevelData: value })),
    teamFinanceTierSummaryList: [] as TeamFinanceTierSummaryItemResult[],
    setTeamFinanceTierSummaryList: (list) =>
      set(() => ({ teamFinanceTierSummaryList: list })),
    teamMemberSummaryData: {} as TeamMemberSummaryResult,
    setTeamMemberSummaryData: (value) =>
      set(() => ({ teamMemberSummaryData: value })),

    refreshUserDataCount: 0,
    refreshUserData: () =>
      set(() => ({
        refreshUserDataCount: get().refreshUserDataCount + 1,
      })),
  }));
