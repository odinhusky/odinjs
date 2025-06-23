import cx from '@commonUtils/cx';
import { formatMoney } from '@mode2/utils';
import { RechargeCard } from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import { PayBrokenOptionsResult } from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import { handleLowBalanceRechargeModalRechargeOptionChangeAction } from '@libs/mode2/action/actionTypes';
import useLowBalanceRechargeModalActions from '@libs/mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';

const PayProductAmountItem = ({ item }: { item: PayBrokenOptionsResult }) => {
  const { handleLowBalanceRechargeModalClick } =
    useLowBalanceRechargeModalActions();

  /* 當前充值選項索引 */
  const currentRecharge = useLowBalanceRechargeModalStore(
    (state) => state.currentRecharge
  );

  const currentRechargeCard = useLowBalanceRechargeModalStore(
    (state) => state.currentRechargeCard
  );

  const rebateAmount = item.rebateAmount;

  const isBonusMode =
    rebateAmount > 0
      ? currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
        currentRechargeCard === RechargeCard.HIGH_BONUS
      : false;

  const isActive = item.id === currentRecharge.id;

  return (
    <div
      className={cx(
        'relative w-full',
        'flex justify-center items-center',
        'cursor-pointer',
        'rounded-md',
        'font-medium bgi-text-[var(--base-1-main)]',
        {
          'bgi-border-[var(--base-1-variant1)]': isActive,
          'bgi-[var(--base-2-variant4)]': isActive,
          'bgi-[var(--base-2-variant6)]': !isActive,
        }
      )}
      onClick={() => {
        handleLowBalanceRechargeModalClick({
          actionName: handleLowBalanceRechargeModalRechargeOptionChangeAction,
          payload: { item },
        });
      }}
    >
      <p
        className={cx(
          'mx-0.5 w-full h-[60px] flex justify-center items-center text-center',
          'text-[clamp(24px,0.5rem,26px)]'
        )}
      >
        {formatMoney({ value: item?.amount })}
      </p>

      {isBonusMode ? (
        <div
          className={cx(
            'absolute -top-2 right-0 z-10',
            'px-2 py-[0.5px] rounded-tl-[9px] rounded-br-[9px]',
            'text-base bgi-text-[var(--grayscale-100)] font-normal',
            {
              'bgi-[var(--linear-3)]': isActive,
              'bgi-[var(--linear-4)]': !isActive,
            }
          )}
        >
          {`+${formatMoney({
            value: rebateAmount,
            showCurrency: false,
            includeDecimal: false,
          })}`}
        </div>
      ) : null}
    </div>
  );
};

export const PayChannelAmountOptions = () => {
  /* 當前選定支付通道-充值選項 */
  const rechargeOptions = useLowBalanceRechargeModalStore(
    (state) => state.rechargeOptions
  );

  return (
    <div>
      {/* <div className="text-left text-base font-medium my-3">
        {t('earn_subordinate_data_item_deposit_amount')}
      </div> */}
      <div className={cx('select-none', 'flex flex-col gap-6')}>
        {rechargeOptions.map((item, index) => {
          return (
            <PayProductAmountItem
              key={`${item.indexKey}${index}`}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PayChannelAmountOptions;
