import { useEffect, useState } from 'react';
import {
  useLazyGetActivityHistoryQuery,
  useLazyGetActivityHistoryRecordQuery,
} from '../../../../external';
import { formatLocaleMoney } from '../../../utils/format';
import {
  ActivityHistoryRecordResponse,
  ActivityHistoryResponse,
} from '../../../../external/endpoint/activity/history/ActivityHistoryEndpoint';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import moment from 'moment';

type IDayOption = {
  label: string;
  value: number;
};

type IActivityOption = {
  value?: string | null;
  label: string;
  type: string | ActivityType;
};

export type TActivityRecordItem = {
  time: string; //Tempo
  name: string; //Nomes do evento
  bonus: string; //Valor do bônus
  status: boolean; //Estado
  ip: string; //ip
};

interface IActivityRecordState {
  isNoRecord: boolean; // 使用者無任何活動記錄
  dayOptions: IDayOption[]; //日期選單
  activityOptions: IActivityOption[]; //活動類型選單
  currentTypeName: IActivityOption; //當前查詢的活動類型
  currentDay: IDayOption; //當前查詢的持續時間
  totalBonus: string; // 當前加總
  tableHeads: string[]; //活動記錄標題 //bônus {0,00}
  tableBody: TActivityRecordItem[]; //活動記錄資料
}

type ActivityType = 'ALL' | 'BET_REWARD' | 'LOSS_REWARD';

const TableHeads: string[] = [
  'Tempo',
  'Nomes do evento',
  'Valor do bônus',
  'Estado',
  'ip',
];

const AllActivityOption: IActivityOption = {
  value: null,
  label: 'Todos os eventos',
  type: 'All',
};
const OneDayOption: IDayOption = { label: 'Hoje', value: 0 };
const DayOptions: IDayOption[] = [
  OneDayOption,
  { label: 'Ontem', value: 1 },
  { label: 'Quase 7 dias', value: 7 },
  { label: 'Quase 15 dias', value: 15 },
  { label: 'Quase 30 dias', value: 30 },
  { label: 'Quase 60 dias', value: 60 },
];

export const useActivityRecord = () => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const [triggerActivityHistory, { data, currentData: historyOptionsData }] =
    useLazyGetActivityHistoryQuery();
  const [triggerActivityHistoryRecord, { data: historyRecordData, isError }] =
    useLazyGetActivityHistoryRecordQuery();
  const [activityRecordState, setActivityRecordState] =
    useState<IActivityRecordState>({
      isNoRecord: true,
      dayOptions: DayOptions,
      activityOptions: [AllActivityOption],
      currentTypeName: AllActivityOption,
      currentDay: OneDayOption,
      totalBonus: 'R$ 0.00',
      tableHeads: TableHeads,
      tableBody: [],
    });

  const [activityOptions, setActivityOptions] = useState<IActivityOption[]>([
    AllActivityOption,
  ]);

  useEffect(() => {
    if (isLogin) {
      triggerActivityHistory({});
    }
  }, [isLogin]);

  useEffect(() => {
    //使用者有用過活動記錄，預設載入第一筆資料
    if (historyOptionsData && historyOptionsData.data) {
      if (historyOptionsData.data.length > 0) {
        assembleActivityOptions(historyOptionsData.data);
      }
    }
  }, [historyOptionsData]);

  useEffect(() => {
    if (historyRecordData) {
      setState(historyRecordData.data, activityOptions);
    } else {
      setState([], activityOptions);
    }
  }, [historyRecordData, activityOptions]);

  const setState = (
    resp: ActivityHistoryRecordResponse[],
    activityOptions: IActivityOption[]
  ) => {
    let totalBonus: number = 0;
    let items: TActivityRecordItem[] = resp.map((item) => {
      totalBonus += item.bonus;
      // claimTime 需支援本地時間格式。改型態 string
      return {
        time: item.claimTime,
        name: item.actName,
        bonus: `R$ ${formatLocaleMoney(item.bonus)}`,
        status: item.status !== 0,
        ip: item.ip,
      };
    });

    setActivityRecordState({
      ...activityRecordState,
      isNoRecord: items.length === 0,
      activityOptions: activityOptions,
      dayOptions: DayOptions,
      totalBonus: `R$ ${formatLocaleMoney(totalBonus)}`,
      tableHeads: TableHeads,
      tableBody: items,
    });
  };

  // 組裝活動類型選單
  const assembleActivityOptions = (
    recordOptions: ActivityHistoryResponse[]
  ) => {
    const items: IActivityOption[] = recordOptions.map((item) => {
      return {
        value: `${item.id}`,
        label: item.title,
        type: item.type,
      };
    });
    const itemsResult: IActivityOption[] = [AllActivityOption, ...items];
    setActivityOptions(itemsResult);
    useQueryByActivityOptionAndDayOption(AllActivityOption, OneDayOption);
  };

  const useQueryByActivityOptionAndDayOption = (
    activityOption: IActivityOption,
    dayOption: IDayOption
  ) => {
    setActivityRecordState({
      ...activityRecordState,
      currentDay: dayOption,
      currentTypeName: activityOption,
    });

    triggerActivityHistoryRecord({
      activityId: activityOption.value,
      dayOfDuration: dayOption.value,
    });
  };

  return {
    activityRecordState,
    useQueryByActivityOptionAndDayOption,
  };
};
