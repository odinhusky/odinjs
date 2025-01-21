import { useTranslation } from 'react-i18next';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import Input from '@mode2/components/Input';
import {
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
} from '@/action/walletPageAction/acitonType';
import Icon from '@mode2/components/Icon';
import { memo } from 'react';
import { formatMoney } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const WalletRechargeInput = memo(() => {
  const { t } = useTranslation();
  const { handleWalletPageClick } = useWalletPageActions();
  /* 當前充值卡 */
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);
  const currentOptRebateAmount = useWalletPageRechargeContentStore(
    (state) => state.currentOptRebateAmount
  );
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );
  return (
    <div className="rounded-[4px] bgi-[var(--grayscale-30)]">
      <div className="relative">
        <Input
          styles={{
            container: '',
            containerDiv: '!p-2',
          }}
          disabled={currentPayChannel.disableAmountInput}
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
              className={
                'flex text-base items-center bgi-text-[var(--state-warn-main)]'
              }
            >
              {currentRechargeCard === RechargeCard.TOP_UP_BONUS
                ? t('wallet_deposit_input_extra', {
                    extra: formatMoney(currentOptRebateAmount),
                  })
                : null}
              <Icon
                className="cursor-pointer w-6 h-6"
                name="ic_close"
                color="var(--grayscale-70)"
                onClick={() => {
                  if (!currentPayChannel.disableAmountInput) {
                    handleWalletPageClick({
                      actionName: handleWalletPageRechargeAmountClearClick,
                    });
                  }
                }}
              />
            </div>
          }
        />
      </div>
    </div>
  );
});

export default WalletRechargeInput;
