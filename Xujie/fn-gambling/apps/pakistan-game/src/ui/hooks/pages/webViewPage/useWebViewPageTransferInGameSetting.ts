import { useEffect } from 'react';
import {
  RechargeFromResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';

export const useWebViewPageTransferInGameSetting = () => {
  const setRechargeFrom = useRechargeStore((state) => state.setRechargeFrom);

  useEffect(() => {
    setRechargeFrom(RechargeFromResult.TRANSFER_IN_GAME);
  }, []);

  useEffect(() => {
    return () => {
      useRechargeStore.getState().finishRecharge();
    };
  }, []);
};
