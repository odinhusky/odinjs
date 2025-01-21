import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import { useMemo } from 'react';

export const PayChannelAmountOptions = () => {
  /* 當前選定支付通道-充值選項 */
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );

  /* 當前充值選項索引 */
  const currentOptIndexKey = useWalletPageRechargeContentStore(
    (state) => state.currentOptIndexKey
  );

  /* 當前充值卡 */
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  return (
    <div
      className={cx(
        'select-none',
        'grid grid-cols-3 gap-4',
        'mobile:grid-cols-4',
        'tablet:grid-cols-6'
      )}
    >
      {currentPayOptionItems.map((item, index) => (
        <div
          key={item.indexKey}
          className={cx(
            'text-sm mobile:text-base font-medium',
            'h-[52px] mobile:h-16 rounded-[4px]',
            'flex justify-center items-center  relative cursor-pointer',
            item.indexKey === currentOptIndexKey
              ? 'bgi-[var(--base-1-main)]'
              : 'bgi-[var(--grayscale-30)]'
          )}
          onClick={item.onAction}
        >
          <div
            className={cx(
              currentRechargeCard === RechargeCard.TOP_UP_BONUS ? 'mb-3' : ''
            )}
          >
            {formatMoney(item?.amount)}
          </div>

          {item.isHot ? (
            <img
              className="h-6 w-6 mobile:w-9 mobile:h-9 absolute top-0 left-0"
              src={getImgUrl(EResourceLevel.V, 'icon_hot')}
              alt="hot"
            />
          ) : null}

          {currentRechargeCard === RechargeCard.TOP_UP_BONUS ? (
            <div
              className={cx(
                'absolute bottom-0 rounded-t-full bg-black/30 flex justify-center items-center  font-medium text-center',
                'text-xs mobile:text-sm w-9/12 h-4 mobile:h-6',
                item.indexKey === currentOptIndexKey
                  ? 'text-[var(--grayscale-100)] shadow-[0px_2px_2px_0px_rgba(255,_255,_255,_0.25)_inset,0px_-2px_2px_0px_rgba(0,_0,_0,_0.25)_inset] bgi-[var(--state-warn-dark)]'
                  : 'bgi-text-[var(--transparent-white-30)]'
              )}
            >
              +{formatMoney(item?.rebateAmount)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
