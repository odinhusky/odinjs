import useWalletPageLimitStr from '../../pages/walletPage/useWalletPageLimitStr';
import useRechargeCardList from './useRechargeCardList';
import useRechargeChannelConfig from './useRechargeChannelConfig';
import { useRechargeModal } from './useRechargeModal';
import useRechargePayOptionSelection from '@/ui/hooks/components/rechargeContent/useRechargePayOptionSelection';
import useRechargeAmountInputChange from '@/ui/hooks/components/rechargeContent/useRechargeAmountInputChange';
import useRechargeRebateAmountChange from '@/ui/hooks/components/rechargeContent/useRechargeRebateAmountChange';
import { useEffect } from 'react';
import { useUserState } from '@/usecase/useUserState';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const useRechargeContentBase = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  const { refreshUserState } = useUserState();

  // ==== 充值卡片資料
  useRechargeCardList();

  // ==== 支付通道選項＆充值金額選項列表
  useRechargeChannelConfig();

  // ==== 根據當前選定支付通道設定最大最小充值金額顯示字串
  useWalletPageLimitStr();

  // ==== 根據選中的充值金額選項設定充值金額輸入框資料
  useRechargePayOptionSelection();

  // ==== 根據充值金額輸入框改變向下匹配最適合產品
  useRechargeAmountInputChange();

  // ==== 根據匹配最適合產品，找產品回扣金額
  useRechargeRebateAmountChange();

  // ==== ShowRechargeConfirmationModal
  useRechargeModal({ isRechargeFromGame });

  // ==== 不重新打 API 回覆預設通道，預選產品
  useEffect(() => {
    refreshUserState();
    return () => {
      useRechargeStore.getState().setRechargeAmount('');
      useWalletPageRechargeContentStore.getState().reset();
    };
  }, []);
};

export default useRechargeContentBase;
