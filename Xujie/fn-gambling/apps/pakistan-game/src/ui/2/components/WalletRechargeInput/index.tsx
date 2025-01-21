import Input from '@mode2/components/Input';
import {
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
} from '@/action/walletPageAction/acitonType';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { memo } from 'react';
import Icon from '@mode2/components/Icon';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const WalletRechargeInput = memo(() => {
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );
  const { handleWalletPageClick } = useWalletPageActions();
  return (
    <div className="mt-2 rounded-[4px] bgi-[var(--grayscale-30)]">
      <div className="relative">
        <Input
          className=""
          disabled={currentPayChannel.disableAmountInput}
          placeholder={{ i18nKey: '' }}
          type={'number'}
          value={rechargeAmount}
          onChange={(value) => {
            handleWalletPageClick({
              actionName: handleWalletPageRechargeAmountChange,
              payload: { value },
            });
          }}
          suffix={
            <Icon
              className="w-6 h-6 mr-2 cursor-pointer"
              name={'ic_close'}
              color="var(--grayscale-70)"
              onClick={() => {
                if (!currentPayChannel.disableAmountInput) {
                  handleWalletPageClick({
                    actionName: handleWalletPageRechargeAmountClearClick,
                  });
                }
              }}
            />
          }
        />
      </div>
    </div>
  );
});

export default WalletRechargeInput;
