import { useEffect } from 'react';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';

import { useRechargeConfirmationModalStore } from '@libs/mode2/zustand/components/rechargeConfirmationStore';
export const useRechargeModal = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  const { setIsShowRechargeConfirmationModal } =
    useRechargeConfirmationModalStore();
  const rechargeResult = useRechargeStore((state) => state.rechargeResult);
  useEffect(() => {
    setIsShowRechargeConfirmationModal(
      // 游戏内充值 && 有未完成支付的订单
      isRechargeFromGame && !!rechargeResult.rechargeUrl
    );
  }, [isRechargeFromGame, rechargeResult.rechargeUrl]);
};
