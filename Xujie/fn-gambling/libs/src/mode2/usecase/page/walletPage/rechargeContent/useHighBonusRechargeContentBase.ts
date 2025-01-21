import { useEffect, useMemo } from 'react';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
  useWalletRechargeHighBonusStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  handleWalletPagePayPayChannelOtpClick,
  handleWalletPageSetPayChannelClick,
} from '@mode2/action/walletPageAction/acitonType';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';

// 優惠限時5 分鐘
const HIGH_BONUS_LIMITED_TIME_DURATION = dayjs()
  .add(5, 'minute')
  .diff(dayjs(), 'second');

// 重置優惠限時，30分鐘後
const RESET_HIGH_BONUS_LIMITED_TIME_DURATION = dayjs()
  .add(30, 'minute')
  .diff(dayjs(), 'second');

export const useHighBonusRecharge = () => {
  const getRemainTime = async (): Promise<number> => {
    const lastTime = await userLocalForage.getItem<string>(
      UserLocalforageStoreKeys.LAST_HIGH_BONUS_LIMITED_TIME
    );

    const now = dayjs().unix();

    // 表示第一次5分鐘倒數
    if (lastTime === null) {
      return HIGH_BONUS_LIMITED_TIME_DURATION;
    }
    // 上次紀錄時間大於現在，代表倒數5分鐘還沒結束，繼續倒數，有例外超過5分鐘，限縮到設定範圍內
    if (Number(lastTime) > now) {
      const remainTime = Number(lastTime) - now;
      return remainTime > HIGH_BONUS_LIMITED_TIME_DURATION
        ? HIGH_BONUS_LIMITED_TIME_DURATION
        : remainTime;
    }
    // 現在時間超過可刷新時間，重置5分鐘
    if (now > Number(lastTime) + RESET_HIGH_BONUS_LIMITED_TIME_DURATION) {
      return HIGH_BONUS_LIMITED_TIME_DURATION;
    }
    // 表示已經倒數過5分鐘，且等待下一次30分鐘後刷新時機。
    return 0;
  };

  const saveRemainTime = async (countdown: number) => {
    const saveData = dayjs().unix() + countdown;
    userLocalForage.setItem(
      UserLocalforageStoreKeys.LAST_HIGH_BONUS_LIMITED_TIME,
      JSON.stringify(saveData)
    );
  };

  const handleOverdueCoolDown = () => {
    const currentRechargeCard =
      useWalletPageRechargeCardStore.getState().currentRechargeCard;
    if (currentRechargeCard !== RechargeCard.HIGH_BONUS) {
      useWalletRechargeHighBonusStore.getState().setSupportHighBonus(false);
      useWalletPageRechargeCardStore
        .getState()
        .setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);
    }
  };

  return {
    getRemainTime: () => getRemainTime(),
    saveRemainTime: (countdown: number) => saveRemainTime(countdown),
    handleOverdueCoolDown: () => handleOverdueCoolDown(),
    // isHighBonus: getRemainTime() > 0,
  };
};

const useHighBonusRechargeContentBase = () => {
  const { getRemainTime } = useHighBonusRecharge();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const originalPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.originalPayChannelActionItems
  );

  const setAllPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.setAllPayChannelActionItems
  );

  const setSupportHighBonus = useWalletRechargeHighBonusStore(
    (state) => state.setSupportHighBonus
  );

  const setHighBonusRemainTime = useWalletRechargeHighBonusStore(
    (state) => state.setHighBonusRemainTime
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const fetchData = () => {
    getRemainTime().then((remainTime) => {
      setSupportHighBonus(remainTime > 0);
      console.log('@@@===> setSupportHighBonus', remainTime);
      if (remainTime > 0) {
        setHighBonusRemainTime(remainTime);
      }
    });
  };

  useEffect(() => {
    // setSupportHighBonus(isHighBonus);
    // const remainTime = getRemainTime();
    // console.log('@@@===> setSupportHighBonus', remainTime);
    // if (remainTime > 0) {
    //   setHighBonusRemainTime(remainTime);
    // }
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);
  }, [isFirstDeposit]);

  const allPayChannelActionItems = useMemo(() => {
    const isHighBonus = currentRechargeCard === RechargeCard.HIGH_BONUS;
    return originalPayChannelActionItems.flatMap((item) => {
      const filterOptions = item.options.filter(
        (item) => item.isHighBonus === isHighBonus
      );

      const optionActions = (
        isEmpty(filterOptions) ? item.options : filterOptions
      ).map((item) => {
        return {
          ...item,
          onAction: () => {
            handleWalletPageBaseClick({
              actionName: handleWalletPagePayPayChannelOtpClick,
              payload: { item },
            });
          },
        };
      });

      return {
        ...item,
        options: isEmpty(filterOptions) ? item.options : filterOptions,
        optionActions: optionActions,
        onAction: () => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageSetPayChannelClick,
            payload: {
              item: {
                ...item,
                options: isEmpty(filterOptions) ? item.options : filterOptions,
              },
            },
          });
        },
      };
    });
  }, [currentRechargeCard, originalPayChannelActionItems]);

  useEffect(() => {
    const currentPayChannel =
      useWalletPageRechargeContentStore.getState().currentPayChannel;
    setAllPayChannelActionItems(allPayChannelActionItems);
    const newCurrentPayChannel = allPayChannelActionItems.find(
      (item) => item.payName === currentPayChannel.payName
    );
    if (newCurrentPayChannel) {
      useWalletPageRechargeContentStore
        .getState()
        .setCurrentPayChannel(newCurrentPayChannel);
      useWalletPageRechargeContentStore
        .getState()
        .setDefaultPayOption(newCurrentPayChannel);
    }
  }, [allPayChannelActionItems]);
};

export default useHighBonusRechargeContentBase;
