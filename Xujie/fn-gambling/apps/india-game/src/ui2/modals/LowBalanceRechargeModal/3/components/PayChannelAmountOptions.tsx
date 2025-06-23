import cx from '@commonUtils/cx';
import { formatMoney } from '@mode2/utils';
import { RechargeCard } from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import { PayBrokenOptionsResult } from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import useLowBalanceRechargeModalActions from '@libs/mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { handleLowBalanceRechargeModalAmountOptionsRechargeClickAction } from '@libs/mode2/action/actionTypes';

const PayProductAmountItem = ({
  item,
  className,
  timeLeft,
}: {
  item: PayBrokenOptionsResult;
  className?: string;
  timeLeft: number;
}) => {
  const { t } = useTranslation();
  const { handleLowBalanceRechargeModalClick } =
    useLowBalanceRechargeModalActions();

  const currentRechargeCard = useLowBalanceRechargeModalStore(
    (state) => state.currentRechargeCard
  );

  const rebateAmount = item.rebateAmount;
  const total = item.amount + item.rebateAmount;

  const isBonusMode =
    rebateAmount > 0
      ? currentRechargeCard === RechargeCard.TOP_UP_BONUS ||
        currentRechargeCard === RechargeCard.HIGH_BONUS
      : false;

  const titleClassName = 'text-xs font-medium bgi-text-[var(--base-1-main)]';
  const amountClassName =
    'text-2xl font-bold bgi-text-[var(--base-1-variant1)]';

  return (
    <div
      className={cx(
        'px-4 py-3 box-border',
        'flex flex-col gap-2',
        'border border-[var(--transparent-white-20)] rounded-md',
        className
      )}
    >
      <div
        className={cx(
          'p-1.5 box-border',
          'flex items-center justify-center gap-1.5',
          'bgi-[var(--transparent-gray-20)] rounded-md'
        )}
      >
        <div>
          <p className={cx(titleClassName)}>
            {t('deposit_history_deposit_amount')}
          </p>
          <p className={cx(amountClassName)}>
            {formatMoney({ value: item?.amount, showCurrency: false })}
          </p>
        </div>
        <Icon name="ic_add" className="w-5 h-5" />
        <div>
          <p className={cx(titleClassName)}>
            {t('deposit_history_deposit_bonus')}
          </p>
          <p className={cx(amountClassName)}>
            {formatMoney({ value: rebateAmount, showCurrency: false })}
          </p>
        </div>
        <Icon name="ic_equal" className="w-5 h-5" />
        <div>
          <p className={cx(titleClassName)}>
            {t('deposit_history_deposit_total')}
          </p>
          <p className={cx(amountClassName)}>
            {formatMoney({ value: total, showCurrency: false })}
          </p>
        </div>
      </div>

      <BasePrimaryBtn
        className="h-[60px]"
        children={
          <>
            {isBonusMode ? (
              <p className="text-xs line-through bgi-text-[var(--state-error-variant1)]">
                {formatMoney({ value: rebateAmount })}
              </p>
            ) : null}

            <p className="text-xl font-medium bgi-text-[var(--base-2-variant5)]">
              {formatMoney({ value: item?.amount })}
            </p>
          </>
        }
        onClick={() => {
          handleLowBalanceRechargeModalClick({
            actionName:
              handleLowBalanceRechargeModalAmountOptionsRechargeClickAction,
            payload: { item, timeLeft },
          });
        }}
      />
    </div>
  );
};

export const PayChannelAmountOptions = ({ timeLeft }: { timeLeft: number }) => {
  /* 當前選定支付通道-充值選項 */
  const rechargeOptions = useLowBalanceRechargeModalStore(
    (state) => state.rechargeOptions
  );

  return (
    <div className={cx('select-none', 'flex flex-col gap-3')}>
      {rechargeOptions.slice(0, 2).map((item, index) => {
        return (
          <PayProductAmountItem
            key={`${item.indexKey}${index}`}
            item={item}
            className={cx('', {
              'bgi-[var(--linear-16)]': index === 0,
              'bgi-[var(--linear-14)]': index === 1,
            })}
            timeLeft={timeLeft}
          />
        );
      })}
    </div>
  );
};

export default PayChannelAmountOptions;
