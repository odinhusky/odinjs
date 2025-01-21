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
            'h-[44px] mobile:h-[60px] rounded-[4px]',
            'flex justify-center items-center  relative cursor-pointer',
            item.indexKey === currentOptIndexKey
              ? 'bgi-[var(--base-1-main)]'
              : 'bgi-[var(--grayscale-30)]'
          )}
          onClick={item.onAction}
        >
          <span>{formatMoney(item?.amount)}</span>

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
                'w-[45px] h-[11px] mobile:w-[72px] mobile:h-[18px]',
                'absolute right-[-3px] top-[2px] mobile:right-[-5px] mobile:top-1',
                'rounded-l-full',
                'bgi-[var(--state-error-main)]',
                'flex justify-center items-center',
                'font-medium text-center',
                'text-xs mobile:text-sm'
              )}
            >
              {item?.rebateAmount}

              {/* 小三角形 */}
              <div
                className={cx(
                  'absolute right-0 bottom-[-2.5px] mobile:-bottom-1',
                  'w-[3px] h-[2.5px] mobile:w-[5px] mobile:h-1',
                  'bgi-[var(--state-error-dark)]'
                )}
                style={{ clipPath: 'polygon(100% 0, 0 100%, 0 0)' }}
              ></div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
