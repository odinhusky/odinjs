import { useLazyGetDailyCashbackQuery } from '../../../../external';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { formatLocaleMoney } from '../../../utils/format';
import {
  DailyCashbackTableResponse,
  RewardStatus,
} from '../../../../external/endpoint/activity/dailyCashback/ActivityDailyCashbackEndpoint';

type IItem = {
  amount: string;
  subs: ISubItem[];
};

type ISubItem = {
  brandName: string;
  rewards: string;
};

export interface IDalyCashbackState {
  bannerTitle: string; // 活動廣告文宣
  isEnabled: boolean; //活動是否啟用
  yesterdayBets: string; // 昨日虧損
  todayBonus: string; // 今日回饋
  description: string; // 活動描述，<html>
  tableHeads: string[]; // 活動規則
  tableBody: IItem[]; // 回動規則
  isRedeemable: boolean; // user 達標可以兌換
}

const TableHeads = [
  'Valor da aposta',
  'Fabricantes de jogos',
  'Recompensas extra (%)',
];

export const useDalyCashback = () => {
  const [triggerDalyCashback, { isSuccess, currentData, isFetching }] =
    useLazyGetDailyCashbackQuery();
  const [dalyCashbackState, setDalyCashbackState] =
    useState<IDalyCashbackState>();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  useEffect(() => {
    isLogin && useRefreshDalyCashback();
  }, [isLogin]);

  const assembleTableBody = (tables: DailyCashbackTableResponse[]): IItem[] => {
    const tableBody: IItem[] = tables.flatMap((item) => {
      return {
        amount: `R$ ${formatLocaleMoney(
          item.lowerAmount
        )} ~ ${formatLocaleMoney(item.upperAmount)}`,
        subs: item.providers.map((subItem) => {
          return {
            brandName: `${subItem.provider}`,
            rewards: `${subItem.bonus}%`,
          };
        }),
      };
    });
    return tableBody;
  };

  const useRefreshDalyCashback = () => {
    triggerDalyCashback({}).then((value) => {
      if (value.isSuccess) {
        const dalyCashbackData = value.data.data;
        setDalyCashbackState({
          bannerTitle: dalyCashbackData.bannerContext
            ? dalyCashbackData.bannerContext
            : '',
          isEnabled: dalyCashbackData.enabled,
          yesterdayBets: `R$ ${formatLocaleMoney(
            dalyCashbackData.yesterdayBets
          )}`,
          todayBonus: `R$ ${formatLocaleMoney(dalyCashbackData.todayBonus)}`,
          tableHeads: TableHeads,
          tableBody: assembleTableBody(dalyCashbackData.tables),
          description: `${dalyCashbackData.content}`,
          isRedeemable:
            dalyCashbackData.rewardStatus === RewardStatus.UNCLAIMED,
        });
      }
    });
  };

  return {
    dalyCashbackState,
    useRefreshDalyCashback,
  };
};
