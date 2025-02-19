import cx from '@commonUtils/cx';
import { formatMoney, formatNumber } from '@mode2/utils';
import {
  PayOptionItem,
  useWalletPageRechargeContentStore,
} from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

const PlaceholdersItem = () => {
  return (
    <div
      className={cx(
        'flex justify-center items-center rounded-md',
        // 'bgi-[var(--base-2-variant6)]',
        'py-2.5 px-2',
        'font-medium text-xl'
      )}
    >
      <p>{'ㅤ'} </p>
    </div>
  );
};
const PayProductAmountItem = ({ item }: { item: PayOptionItem }) => {
  /* 當前充值選項索引 */
  const currentOptIndexKey = useWalletPageRechargeContentStore(
    (state) => state.currentOptIndexKey
  );

  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  const isBonusMode =
    currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
    currentRechargeCard === RechargeCard.HIGH_BONUS;

  const isActive = item.indexKey === currentOptIndexKey;
  return (
    <div
      className={cx(
        'relative w-full',
        'flex justify-center items-center',
        'cursor-pointer',
        'rounded-md',
        'font-medium bgi-text-[var(--base-1-main)]',
        {
          'bgi-border-[var(--base-1-variant1)] after:rounded-md after:border-[1.5px]':
            isActive,
          'bgi-[var(--base-2-variant4)]': isActive,
          'bgi-[var(--base-2-variant6)]': !isActive,
        }
      )}
      onClick={item.onAction}
    >
      <p
        className={cx(
          'my-2.5 mx-0.5 w-full text-center',
          'text-[clamp(18px,0.5rem,20px)]'
        )}
      >
        {formatMoney(item?.amount)}
      </p>

      {isBonusMode ? (
        <div
          className={cx(
            'absolute -top-2 right-0 z-10',
            'px-2 py-[0.5px] rounded-tl-md rounded-br-md',
            'text-xs bgi-text-[var(--grayscale-100)] font-normal',
            {
              'bgi-[var(--linear-3)]': isActive,
              'bgi-[var(--linear-4)]': !isActive,
            }
          )}
        >
          {`+${formatNumber(item.rebateAmount)}`}
        </div>
      ) : null}
    </div>
  );
};

export const PayChannelAmountOptions = () => {
  /* 當前選定支付通道-充值選項 */
  const currentPayOptionItems = useWalletPageRechargeContentStore(
    (state) => state.currentPayOptionItems
  );

  // /* 當前充值選項索引 */
  // const currentOptIndexKey = useWalletPageRechargeContentStore(
  //   (state) => state.currentOptIndexKey
  // );

  /* 當前充值卡 */
  // const currentRechargeCard = useWalletPageRechargeCardStore(
  //   (state) => state.currentRechargeCard
  // );
  //
  // const isBonusMode =
  //   currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
  //   currentRechargeCard === RechargeCard.HIGH_BONUS;

  const fillCount = Math.max(0, 12 - currentPayOptionItems.length);
  const placeholders = Array(fillCount).fill(null);

  return (
    <div className={cx('select-none', 'grid grid-cols-4 gap-y-3 gap-x-2 py-2')}>
      {currentPayOptionItems.map((item, index) => {
        return (
          <PayProductAmountItem key={`${item.indexKey}${index}`} item={item} />
        );
      })}

      {/* 未滿三行 佔位符 */}
      {placeholders.map((item, index) => {
        return <PlaceholdersItem key={`${index}`} />;
      })}

      {/*{currentPayOptionItems.map((item, index) => (*/}
      {/*  <div*/}
      {/*    key={item.indexKey}*/}
      {/*    className={cx(*/}
      {/*      'relative',*/}
      {/*      'text-sm mobile:text-base font-medium',*/}
      {/*      'h-[52px] mobile:h-16 rounded-lg',*/}
      {/*      'flex justify-center items-center  relative cursor-pointer',*/}
      {/*      {*/}
      {/*        'bgi-[var(--base-3-50)] after:rounded-lg after:border-[2px] bgi-border-[var(--base-3-main)]':*/}
      {/*          item.indexKey === currentOptIndexKey,*/}
      {/*        'bgi-[var(--grayscale-30)]': item.indexKey !== currentOptIndexKey,*/}
      {/*      }*/}
      {/*    )}*/}
      {/*    onClick={item.onAction}*/}
      {/*  >*/}
      {/*    <div*/}
      {/*      className={cx(*/}
      {/*        'h-full w-full flex flex-col justify-center items-center'*/}
      {/*      )}*/}
      {/*    >*/}
      {/*      <div className="h-full content-center">*/}
      {/*        {formatMoney(item?.amount)}*/}
      {/*      </div>*/}
      {/*      <div*/}
      {/*        className={cx(*/}
      {/*          'h-[56%] w-full text-xs mobile:text-sm text-center content-center rounded-b-lg',*/}
      {/*          {*/}
      {/*            'bgi-[var(--base-3-dark)]':*/}
      {/*              item.indexKey === currentOptIndexKey,*/}
      {/*            'bgi-[var(--transparent-white-10)] bgi-text-[var(--grayscale-60)]':*/}
      {/*              item.indexKey !== currentOptIndexKey,*/}
      {/*          }*/}
      {/*        )}*/}
      {/*      >*/}
      {/*        {formatMoney(item?.rebateAmount)}*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    {item.isHot ? (*/}
      {/*      <img*/}
      {/*        className="h-6 w-6 mobile:w-8 mobile:h-8 absolute top-0 left-0"*/}
      {/*        src={getImgUrl(EResourceLevel.V, 'icon_hot')}*/}
      {/*        alt="hot"*/}
      {/*      />*/}
      {/*    ) : null}*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  );
};
