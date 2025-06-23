import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import useRechargeSecretPageStore from '@libs/mode2/zustand/page/rechargeSecretPageStore';
import { useRechargeSecretPageAction } from '@libs/mode2/action/rechargeSecretPageAction/useRechargeSecretPageAction';
import { handleRechargeSecretPageRechargeOptionChangeAction } from '@libs/mode2/action/actionTypes';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { RechargeCard } from '@libs/mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import { PayInboxOptionsResult } from '@libs/mode2/external/api/endpoint/wallet/PostPayInboxConfigEndpoint';

/**
 * Evan for [V6] Done
 */
const PayProductAmountItem = ({ item }: { item: PayInboxOptionsResult }) => {
  const { handleRechargeSecretPageClick } = useRechargeSecretPageAction();

  /* 當前充值選項索引 */
  const currentRecharge = useRechargeSecretPageStore(
    (state) => state.currentRecharge
  );

  const currentRechargeCard = useRechargeSecretPageStore(
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
        'relative w-full h-16',
        'flex justify-center items-center',
        'cursor-pointer',
        'rounded-md',
        {
          'bgi-[var(--base-1-variant7)] bgi-border-[var(--base-1-variant1)]':
            isActive,
          'bgi-[var(--base-2-variant11)] border border-[var(--transparent-white-10)]':
            !isActive,
        }
      )}
      onClick={() => {
        handleRechargeSecretPageClick({
          actionName: handleRechargeSecretPageRechargeOptionChangeAction,
          payload: { item },
        });
      }}
    >
      <p
        className={cx('mt-3 w-full text-center text-xl font-medium', {
          'bgi-text-[var(--grayscale-100)]': isActive,
          'bgi-text-[var(--base-2-variant4)]': !isActive,
        })}
      >
        {formatMoney({ value: item?.amount })}
      </p>

      {isBonusMode ? (
        <div
          className={cx(
            'absolute -top-[14px] -right-1 z-10',
            'h-9 w-auto',
            'flex items-center'
          )}
        >
          <BaseCacheImg
            src={getImgUrl(
              EResourceLevel.V,
              isActive ? 'secret_bonus_amount_1' : 'secret_bonus_amount_2'
            )}
            alt="bonus"
            className="w-full h-full"
          />
          <span
            className={cx(
              'text-xs bgi-text-[var(--grayscale-100)] font-normal',
              'absolute top-1/2 -translate-y-1/3  left-1/3 -translate-x-1/3'
            )}
          >
            +
            {formatMoney({
              value: rebateAmount,
              showCurrency: false,
              includeDecimal: false,
            })}
          </span>
        </div>
      ) : null}

      {isActive ? (
        <BaseCacheImg
          alt={'check_box'}
          className="absolute right-0 bottom-0 rounded-br-[5px] h-8 w-8"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
      ) : null}
    </div>
  );
};

export const RechargeSecretProductOptions = () => {
  /* 當前選定支付通道-充值選項 */
  const rechargeOptions = useRechargeSecretPageStore(
    (state) => state.rechargeOptions
  );

  return (
    <div className={'px-4'}>
      <div
        className={cx(
          'flex gap-1',
          'text-base font-medium bgi-text-[var(--grayscale-100)]'
        )}
      >
        {'Deposit Amount'}
      </div>

      <div className={cx('select-none', 'grid grid-cols-3 gap-3 pt-4')}>
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
export default RechargeSecretProductOptions;
