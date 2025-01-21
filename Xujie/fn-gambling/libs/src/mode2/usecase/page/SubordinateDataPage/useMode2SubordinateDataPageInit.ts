import {
  ORDER,
  OrderType,
} from '@libs/mode2/action/subordinateDataAction/useSubordinateDataClickActions';
import {
  usePostTeamFinanceTierSummaryListMutation,
  usePostTeamInformationMutation,
  usePostTeamMemberSummaryMutation,
} from '@libs/mode2/external/api';
import { TeamFinanceTierSummaryItemResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamFinanceTierSummaryListEndpoint';
import { TeamLevelUnit } from '@libs/mode2/zustand/components/myRewardsContent';
import {
  defaultJoinTime,
  useMode2SubordinateDataPageStore,
} from '@libs/mode2/zustand/page/SubordinateDataStore';
import { get } from 'lodash';
import { useEffect, useState } from 'react';

type TSortBy = 'joinTime' | 'commissionAmount' | 'displayName';

const useMode2SubordinateDataPageInit = () => {
  const [postTeamMemberSummary, { data: teamMemberSummaryData }] =
    usePostTeamMemberSummaryMutation();
  const [postTeamFinanceTier, { data: teamFinanceTierList }] =
    usePostTeamFinanceTierSummaryListMutation();
  const [
    triggerPostTeamInformation,
    { data: teamInformationData, isSuccess: isPostTeamInformationSuccess },
  ] = usePostTeamInformationMutation();

  const datePicker = useMode2SubordinateDataPageStore(
    (state) => state.datePicker
  );

  const setCurrentClubLevelData = useMode2SubordinateDataPageStore(
    (state) => state.setCurrentClubLevelData
  );

  const sortByTier = useMode2SubordinateDataPageStore(
    (state) => state.sortByTier
  );
  const sortByJoinTime = useMode2SubordinateDataPageStore(
    (state) => state.sortByJoinTime
  );
  const sortByCommission = useMode2SubordinateDataPageStore(
    (state) => state.sortByCommission
  );
  const mobile = useMode2SubordinateDataPageStore((state) => state.mobile);
  const setMobile = useMode2SubordinateDataPageStore(
    (state) => state.setMobile
  );
  const setDatePicker = useMode2SubordinateDataPageStore(
    (state) => state.setDatePicker
  );
  const setSortByTier = useMode2SubordinateDataPageStore(
    (state) => state.setSortByTier
  );
  const setSortByJoinTime = useMode2SubordinateDataPageStore(
    (state) => state.setSortByJoinTime
  );
  const setSortByCommission = useMode2SubordinateDataPageStore(
    (state) => state.setSortByCommission
  );

  const setTeamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.setTeamMemberSummaryData
  );
  const setTeamFinanceTierSummaryList = useMode2SubordinateDataPageStore(
    (state) => state.setTeamFinanceTierSummaryList
  );

  /**
   * 排序
   * @param sortBy 'joinTime', 'commissionAmount', 'displayName'
   * @param order 1 升序，-1 降序，0 默認
   * @returns list
   */
  const sortBy = (
    list: TeamFinanceTierSummaryItemResult[],
    sortBy: TSortBy,
    order: OrderType = ORDER.ASC
  ): TeamFinanceTierSummaryItemResult[] => {
    return list!.sort((a, b) => {
      const compareValue = (a[sortBy] as number) - (b[sortBy] as number);
      if (order === ORDER.ASC) return compareValue;
      if (order === ORDER.DESC) return -compareValue;
      if (order === ORDER.DEFAULT) return 0;
      return compareValue;
    });
  };

  const getSortBy = (
    type: TSortBy = 'joinTime',
    by: number = sortByJoinTime
  ) => {
    if (teamFinanceTierList && teamFinanceTierList.length) {
      const list = sortBy([...teamFinanceTierList], type, by);
      setTeamFinanceTierSummaryList(list);
    } else {
      setTeamFinanceTierSummaryList([]);
    }
  };

  const [teamList, setTeamList] = useState<TeamLevelUnit[]>([]);
  const [teamTotalBets, setTeamTotalBets] = useState<number>(0);

  const data = {
    joinTime: datePicker,
    tier: sortByTier + 1,
  };

  useEffect(() => {
    if (isPostTeamInformationSuccess) {
      const teamClubLevelItems = get(teamInformationData, 'teamClubLevelItems');
      if (teamClubLevelItems?.length === 4) {
        const list: TeamLevelUnit[] = teamClubLevelItems.map(
          (item, index, arr) => ({
            ...item,
            isHighest: index + 1 === arr.length,
            id: `level config ${item.level}`,
            clubLevel: item.level + 1,
          })
        );

        setTeamTotalBets(get(teamInformationData, 'currentTeamTotalBets') || 0);
        setTeamList(list);
      }
    }
  }, [teamInformationData, isPostTeamInformationSuccess]);

  useEffect(() => {
    if (teamMemberSummaryData) {
      const level = get(teamMemberSummaryData, 'level') || 0;
      const data = teamList.filter((item) => item.level === level)[0];
      data.currentBets = teamTotalBets;
      setCurrentClubLevelData(data);

      setTeamMemberSummaryData(teamMemberSummaryData);
    }
  }, [teamMemberSummaryData]);

  useEffect(() => {
    getSortBy();
  }, [teamFinanceTierList]);

  useEffect(() => {
    getSortBy('joinTime', sortByJoinTime);
  }, [sortByJoinTime]);

  useEffect(() => {
    getSortBy('commissionAmount', sortByCommission);
  }, [sortByCommission]);

  useEffect(() => {
    if (teamFinanceTierList && teamFinanceTierList.length) {
      const list = teamFinanceTierList.filter((item) =>
        item.displayName.includes(mobile)
      );
      setTeamFinanceTierSummaryList(list);
    }
  }, [mobile]);

  const initData = async () => {
    await triggerPostTeamInformation();
    postTeamMemberSummary();
  };

  useEffect(() => {
    postTeamFinanceTier(data);
  }, [sortByTier, datePicker]);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    setCurrentClubLevelData({} as TeamLevelUnit);
    setMobile('');
    setSortByTier(0);
    setSortByJoinTime(ORDER.DESC);
    setSortByCommission(ORDER.DEFAULT);
    setDatePicker(defaultJoinTime);
  }, []);
};

export default useMode2SubordinateDataPageInit;
