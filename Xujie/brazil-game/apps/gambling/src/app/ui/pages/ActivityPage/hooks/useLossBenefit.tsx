import { useLazyGetLossBenefitQuery } from '../../../../external';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { formatLocaleMoney } from '../../../utils/format';
import {
  RewardStatus,
  LossBenefitTableResponse,
} from '../../../../external/endpoint/activity/lossBenefit/ActivityLossBenefitEndpoint';

type IItem = {
  amount: string;
  subs: ISubItem[];
};

type ISubItem = {
  brandName: string;
  rewards: string;
};

export type ILossBenefitState = {
  bannerTitle: string; // 活動廣告文宣
  isEnabled: boolean; //活動是否啟用
  yesterdayLoss: string; // 昨日虧損
  todayBonus: string; // 今日回饋
  description: string; // 活動描述，<html>
  tableHeads: string[]; // 活動規則
  tableBody: IItem[]; // 回動規則
  isRedeemable: boolean; // user 達標可以兌換
};

const TableHeads = [
  'Montante da perda',
  'Fabricantes de jogos',
  'Recompensas extra (%)',
];

export const useLossBenefit = () => {
  const [triggerLossBenefit, { isSuccess, currentData }] =
    useLazyGetLossBenefitQuery();
  const [lossBenefitState, setLossBenefitState] = useState<ILossBenefitState>();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  useEffect(() => {
    isLogin && useRefreshLossBenefit();
  }, [isLogin]);

  const assembleTableBody = (tables: LossBenefitTableResponse[]): IItem[] => {
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

  const useRefreshLossBenefit = () => {
    triggerLossBenefit({}).then((value) => {
      if (value.isSuccess) {
        const lossBenefitData = value.data.data;
        setLossBenefitState({
          bannerTitle: lossBenefitData.bannerContext
            ? lossBenefitData.bannerContext
            : '',
          isEnabled: lossBenefitData.enabled,
          yesterdayLoss: `R$ ${formatLocaleMoney(
            lossBenefitData.yesterdayLoss
          )}`,
          todayBonus: `R$ ${formatLocaleMoney(lossBenefitData.todayBonus)}`,
          tableHeads: TableHeads,
          tableBody: assembleTableBody(lossBenefitData.tables),
          description: `${lossBenefitData.content}`,
          isRedeemable: lossBenefitData.rewardStatus === RewardStatus.UNCLAIMED,
        });
      }
    });
  };

  return {
    lossBenefitState,
    useRefreshLossBenefit,
  };
};
