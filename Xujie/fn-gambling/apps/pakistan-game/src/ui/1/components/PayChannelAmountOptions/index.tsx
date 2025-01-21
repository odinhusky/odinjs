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
      {currentPayOptionItems.map((item) => (
        <div
          key={item.indexKey}
          className={cx(
            'text-sm mobile:text-base font-medium',
            'h-16 rounded-lg',
            'flex justify-center items-center  relative cursor-pointer',
            item.indexKey === currentOptIndexKey
              ? 'bgi-[var(--base-1-main)]'
              : 'bgi-[var(--grayscale-30)]'
          )}
          onClick={item.onAction}
        >
          <div
            className={cx(
              'z-10',
              currentRechargeCard === RechargeCard.TOP_UP_BONUS ? 'mb-3' : '',
              {
                'bgi-text-[var(--grayscale-00)]':
                  item.indexKey === currentOptIndexKey,
                'bgi-text-[var(--grayscale-50)]':
                  item.indexKey !== currentOptIndexKey,
              }
            )}
          >
            {formatMoney(item?.amount)}
          </div>

          {currentRechargeCard === RechargeCard.TOP_UP_BONUS ? (
            <div
              className={cx(
                'h-2/3',
                'absolute bottom-0 rounded-lg flex justify-end items-end font-medium text-center',
                'text-xs mobile:text-sm w-full',
                item.indexKey === currentOptIndexKey
                  ? 'text-[var(--grayscale-00)] bgi-[var(--state-warn-dark)]'
                  : 'bgi-text-[var(--transparent-white-30)] bgi-[var(--transparent-gray-30)]'
              )}
            >
              <span className="w-full pb-1 mobile:pb-0">
                +{formatMoney(item?.rebateAmount)}
              </span>
            </div>
          ) : null}

          <div
            className={cx(
              'h-2/3 w-full absolute top-0 rounded-lg',
              'rounded-b-[66%]',
              {
                'border-b-[1px] border-[#D9D9D9]':
                  currentRechargeCard === RechargeCard.TOP_UP_BONUS,
                // 'bgi-border-b-[var(--grayscale-30)] ':
                //   currentRechargeCard === RechargeCard.TOP_UP_BONUS,
                'bgi-[var(--base-1-main)]':
                  item.indexKey === currentOptIndexKey,
                'bgi-[var(--grayscale-30)]':
                  item.indexKey !== currentOptIndexKey,
              }
            )}
          />

          {item.isHot ? (
            <img
              className="h-6 w-6 mobile:w-9 mobile:h-9 absolute top-0 left-0"
              src={getImgUrl(EResourceLevel.V, 'icon_hot')}
              alt="hot"
            />
          ) : null}

          <div
            className={
              'absolute w-full h-full rounded-lg bg-shadow-[var(--card-effect)]'
            }
          ></div>
        </div>
      ))}
    </div>
  );
};
