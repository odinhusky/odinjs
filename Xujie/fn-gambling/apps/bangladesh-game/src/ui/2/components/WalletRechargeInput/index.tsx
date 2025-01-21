import Input from '@mode2/components/Input';
import {
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
} from '@/action/walletPageAction/acitonType';
import cx from '@commonUtils/cx';
import Icon from '@mode2/components/Icon';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { memo } from 'react';

export const WalletRechargeInput = memo(() => {
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);
  const { handleWalletPageClick } = useWalletPageActions();
  return (
    <div className="mt-2 rounded-[4px] bgi-[var(--grayscale-30)]">
      <div className="relative">
        <Input
          className=""
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
            <div
              className={cx('w-6 h-6', 'mr-2', 'cursor-pointer')}
              onClick={() => {
                handleWalletPageClick({
                  actionName: handleWalletPageRechargeAmountClearClick,
                });
              }}
            >
              <Icon
                className="w-full"
                name="ic_close"
                color="var(--grayscale-70)"
              />
            </div>
          }
        />
      </div>
    </div>
  );
});

export default WalletRechargeInput;
