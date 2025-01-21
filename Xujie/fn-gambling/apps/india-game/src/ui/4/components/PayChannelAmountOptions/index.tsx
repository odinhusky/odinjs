import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

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
            'relative',
            'text-sm mobile:text-base font-medium',
            'h-[52px] mobile:h-16 rounded-lg',
            'flex justify-center items-center  relative cursor-pointer',
            {
              'bgi-[var(--base-3-50)] after:rounded-lg after:border-[2px] bgi-border-[var(--base-3-main)]':
                item.indexKey === currentOptIndexKey,
              'bgi-[var(--grayscale-30)]': item.indexKey !== currentOptIndexKey,
            }
          )}
          onClick={item.onAction}
        >
          <div
            className={cx(
              'h-full w-full flex flex-col justify-center items-center'
            )}
          >
            <div className="h-full content-center">
              {formatMoney(item?.amount)}
            </div>

            {currentRechargeCard === RechargeCard.TOP_UP_BONUS &&
            item.indexKey === currentOptIndexKey ? (
              <div className="bgi-[var(--base-3-dark)] h-[56%] w-full text-xs mobile:text-sm text-center content-center">
                +{formatMoney(item?.rebateAmount)}
              </div>
            ) : null}
          </div>

          {item.isHot ? (
            <img
              className="h-6 w-6 mobile:w-8 mobile:h-8 absolute top-0 left-0"
              src={getImgUrl(EResourceLevel.V, 'icon_hot')}
              alt="hot"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
