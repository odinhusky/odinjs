import { useEffect, useMemo, useState } from 'react';
import {
  useGetActivityLobbyQuery,
  useGetGlobalConfigQuery,
} from '../../../../external';
import { isEmpty } from 'lodash';
import { ActivityPageRouter } from '../index';
import useDeepEffect from '../../../hooks/useDeepEffect';
import { useInviteInCompatible } from '../../../hooks/useInviteInCompatible';
import { ActivityLobbyResponse } from '../../../../external/endpoint/activity/lobby/ActivityLobbyEndpoint';
import { formatLocaleMoney } from '../../../utils/format';

type ActivityItem = {
  // id: number;
  isTop: boolean;
  title: string;
  name: string;
  type: string; //[BET_REWARD, LOSS_REWARD]
  router: string;
};

type ActivityItemImpl = {
  // id: number;
  isTop: boolean;
  title: string;
  subTitle: string;
  name: string;
  type: string; //[BET_REWARD, LOSS_REWARD]
  router: string;
};

interface IActivityHallState {
  activityItems: ActivityItem[];
}

interface IActivityHallState2 {
  activityItems: ActivityItemImpl[];
}

export const useActivityHall = () => {
  // 在 Component 之外吃不到 ActivityPageRouter，所以搬進來用 memo 包住，避免重複生成
  const FixedActivitySquad: ActivityItem[] = useMemo(
    () => [
      {
        isTop: false,
        title: 'Convide uma pessoa e receba Até R$%s', // %s 吃動態資訊
        name: '',
        type: 'INVITE',
        router: `${ActivityPageRouter.INVITE}`,
      },
      {
        isTop: false,
        title: 'Check-in todos os dias O dinheiro não para!',
        name: '',
        type: 'CHECK_IN',
        router: `${ActivityPageRouter.CHECK_IN}`,
      },
      {
        isTop: false,
        title: 'Primeiro depósito +bônus de %s', // %s 吃動態資訊
        name: '',
        type: 'INITIAL_CHARGE',
        router: `${ActivityPageRouter.INITIAL_CHARGE}`,
      },
      {
        isTop: false,
        title: 'Benefícios-ofertas de deposito Ate %s bônus', // %s 吃動態資訊
        name: '',
        type: 'RECHARGE',
        router: `${ActivityPageRouter.RECHARGE}`,
      },
      // {
      //   isTop: false,
      //   title: "Venha jogar! Ganhe um prêmio de R$777,77!",
      //   name: "",
      //   type: "LUCKY_WHEEL",
      //   router: `${ActivityPageRouter.LUCKY_WHEEL}`
      // }
    ],
    [ActivityPageRouter]
  );

  // 活動列表 Query
  const { activityData } = useGetActivityLobbyQuery(
    {},
    {
      selectFromResult: (result) => ({ activityData: result?.data?.data }),
    }
  );

  // ! global-config Query
  const { data: configData } = useGetGlobalConfigQuery(null);

  const [activityState, setActivityState] = useState<IActivityHallState>({
    activityItems: [],
  });

  // fixedActivityItems 用於 user/activity/lobby 發生錯誤，也讓固定的活動 items 顯示於UI
  const [fixedActivityItems, setFixedActivityItems] = useState<ActivityItem[]>(
    []
  );

  // 邀請寶箱互斥
  const { isShowBoxInvite } = useInviteInCompatible();

  // 固定的活動 items，部份吃動態資訊
  useDeepEffect(() => {
    const fixedActivityData = FixedActivitySquad.map((item) => {
      let replaced: string | undefined = '';
      if (item.type === 'INITIAL_CHARGE') {
        replaced = configData?.data?.recharge_first_cashback_rate;
      } else if (item.type === 'RECHARGE') {
        replaced = configData?.data?.recharge_cashback_rate;
      } else if (item.type === 'INVITE') {
        replaced = formatLocaleMoney(configData?.data?.invite_hig_reward || 0);
      }
      return {
        ...item,
        title: replaced ? item.title.replace('%s', replaced) : item.title,
      };
    });

    setFixedActivityItems(filterFixedItems(fixedActivityData, isShowBoxInvite));
    setActivityState({ activityItems: fixedActivityData });
  }, [FixedActivitySquad, configData, isShowBoxInvite]);

  // 邀請，寶箱互斥處理，有寶箱取消邀請連結功能
  const filterFixedItems = (
    fixedItems: ActivityItem[],
    isShowBoxInvite: boolean | undefined
  ): ActivityItem[] => {
    let filterFixedItems: ActivityItem[] = fixedItems.filter((item) =>
      isShowBoxInvite ? item.type !== 'INVITE' : true
    );
    return filterFixedItems;
  };

  // 邀請，寶箱互斥處理，無寶箱取消動態寶箱功能
  const filterDynamicItems = (
    activityItems: ActivityLobbyResponse[],
    isShowBoxInvite: boolean | undefined
  ): ActivityItem[] => {
    let filterDynamicItems: ActivityItem[] = activityItems
      .filter((item) =>
        !isShowBoxInvite ? item.type !== 'BOX_INVITE_REWARD' : true
      )
      .map((item) => {
        return {
          isTop: true,
          title: item.bannerContext ? item.bannerContext : '',
          name: item.name,
          type: item.type,
          router: item.type.toLocaleLowerCase(),
        };
      });
    return filterDynamicItems;
  };

  // 動態 + 固定靜態活動
  useDeepEffect(() => {
    if (!isEmpty(activityData) && activityData !== undefined) {
      setActivityState({
        activityItems: [
          ...filterDynamicItems(activityData, isShowBoxInvite),
          ...filterFixedItems(fixedActivityItems, isShowBoxInvite),
        ],
      });
    }
  }, [activityData, fixedActivityItems, isShowBoxInvite]);

  return {
    activityState,
  };
};

export const useActivityHallImpl = () => {
  const { data: configData } = useGetGlobalConfigQuery(null);
  const { activityState: activityStateBase } = useActivityHall(); // 原有的 hook
  const [activityStateImpl, setActivityStateImpl] =
    useState<IActivityHallState2>({
      activityItems: [],
    });
  const titles: any = {
    BOX_INVITE_REWARD: {
      title: 'Aliança de agências Compartilhe até',
      subTitle: '%s% de comissão',
    },
    BET_REWARD: {
      title: 'Aposta diária, bônus ',
      subTitle: 'de reembolso de %s%',
    },
    LOSS_REWARD: {
      title: 'Desconto de até %s%',
      subTitle: 'Desconto de até %s%',
    },
    INVITE: {
      title: 'Convide amigos e ganhe',
      subTitle: 'Até R$%s cada',
    },
    CHECK_IN: {
      title: 'Check-in',
      subTitle: 'todos os dias O dinheiro não para!',
    },
    INITIAL_CHARGE: {
      title: 'Três bônus grátis no seu primeiro depósito',
      subTitle: '+ bônus de %s%',
    },
    RECHARGE: {
      title: 'Três bônus grátis no seu primeiro depósito',
      subTitle: 'Ate %s% bônus',
    },
    LUCKY_WHEEL_REWARD: {
      title: 'Venha jogar! Ganhe um prêmio de',
      subTitle: 'R$%s!',
    },
  };  
  useEffect(() => {
    const data = activityStateBase.activityItems.map((item: any) => {
      // let replaced: string | undefined = '';
      // if (item.type === 'INITIAL_CHARGE') {
      //   replaced = configData?.data?.recharge_first_cashback_rate;
      // } else if (item.type === 'RECHARGE') {
      //   replaced = configData?.data?.recharge_cashback_rate;
      // } else if (item.type === 'INVITE') {
      //   replaced = formatLocaleMoney(configData?.data?.invite_hig_reward || 0);
      // }
      // return {
      //   ...item,
      //   title:
      //     titles[item.type]['title'].indexOf('%s') >= 0 && replaced
      //       ? item.title.replace('%s', replaced)
      //       : titles[item.type]['title'],
      //   subTitle:
      //     titles[item.type]['subTitle'].indexOf('%s') >= 0 && replaced
      //       ? item.title.replace('%s', replaced)
      //       : titles[item.type]['subTitle'],
      // };
      const arr = item.title.match(/\d+/g);
      return {
          ...item,
          title: titles[item.type]['title'].indexOf('%s') >= 0 && arr && arr[0] ? titles[item.type]['title'].replace('%s', arr[0]) : titles[item.type]['title'],
          subTitle: titles[item.type]['subTitle'].indexOf('%s') >= 0 && arr && arr[0] ? titles[item.type]['subTitle'].replace('%s', arr[0]) : titles[item.type]['subTitle'],
        };
    });
    setActivityStateImpl({ activityItems: data });
  }, [activityStateBase]);
  return {
    activityStateImpl,
  };
};
