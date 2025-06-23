import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useEffect } from 'react';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
  WalletPageRechargeCardUnit,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageRechargeCardClick } from '@mode2/action/actionTypes';

export const useRechargeCardList = () => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

  const setRechargeCardList = useWalletPageRechargeCardStore(
    (state) => state.setRechargeCardList
  );

  useEffect(() => {
    const cardList: Omit<WalletPageRechargeCardUnit, 'onAction'>[] = [
      {
        card: RechargeCard.GENERAL,
        url: getImgUrl(EResourceLevel.V, 'payment'),
        text: 'general',
      },
      {
        card: RechargeCard.TOP_UP_BONUS,
        url: getImgUrl(EResourceLevel.V, 'payment_bonus'),
        text: 'top up bouns',
      },
    ];

    const cardListWithAction = cardList.map((item) => ({
      ...item,
      onAction: () => {
        handleWalletPageBaseClick({
          actionName: handleWalletPageRechargeCardClick,
          payload: { card: item.card },
        });
      },
    }));

    setRechargeCardList(cardListWithAction);
  }, []);
};

export default useRechargeCardList;
