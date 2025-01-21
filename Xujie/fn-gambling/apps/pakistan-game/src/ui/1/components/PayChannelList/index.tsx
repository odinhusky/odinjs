import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { useWalletPageRechargeCardStore } from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const PayChannelList = () => {
  const { t } = useTranslation();
  /* 當前充值卡 */
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  /* 全部支付通道 */
  const allPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.allPayChannelActionItems
  );

  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  // 'grid grid-cols-1 gap-2', 'mobile:grid-cols-2')
  return (
    <div className="flex justify-start gap-x-4">
      {allPayChannelActionItems.map((item, index) => (
        <div
          key={index}
          className={cx(
            'py-2 px-3.5',
            'text-base mobile:text-lg font-medium bgi-text-[var(--grayscale-100)]',
            'rounded relative',
            'cursor-pointer',
            item.payName === currentPayChannel.payName
              ? 'bgi-[var(--base-1-main)]'
              : 'rounded bgi-border-[var(--grayscale-30)] after-rounded'
          )}
          onClick={() => {
            item.onAction();
          }}
        >
          {item.displayName}
        </div>
      ))}
    </div>
  );
};
