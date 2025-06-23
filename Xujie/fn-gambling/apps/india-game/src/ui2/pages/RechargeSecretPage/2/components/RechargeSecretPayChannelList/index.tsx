import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import React from 'react';
import { Icon } from '@components/Icon';
import useRechargeSecretPageStore from '@libs/mode2/zustand/page/rechargeSecretPageStore';
import { useRechargeSecretPageAction } from '@libs/mode2/action/rechargeSecretPageAction/useRechargeSecretPageAction';
import { handleRechargeSecretPageRechargeChannelChangeAction } from '@libs/mode2/action/actionTypes';
import { PayInboxInfoResult } from '@libs/mode2/external/api/endpoint/wallet/PostPayInboxConfigEndpoint';

/**
 * Evan for [V6] Done
 */
const ActiveCardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant18)]',
        'bgi-border-[var(--base-1-variant1)]'
      )}
    >
      <div>{children}</div>
    </div>
  );
};

/**
 * Evan for [V6] Done
 */
const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant11)]',
        'border-[var(--transparent-white-10)]'
      )}
    >
      <div className={'w-auto h-full'}>{children}</div>
    </div>
  );
};

const payIconMapping: Record<string, string> = {
  tpay_upi: 'ic_upi',
  tpay: 'ic_qrpay',
  paytm: 'ic_paytm_color',
};

/**
 * Evan for [V6] Done
 */
const PayChannelCard = ({ item }: { item: PayInboxInfoResult }) => {
  const { handleRechargeSecretPageClick } = useRechargeSecretPageAction();
  /* 當前選定支付通道 */
  const currentPayChannel = useRechargeSecretPageStore(
    (state) => state.currentPayChannel
  );
  const isActive = item.payName === currentPayChannel.payName;
  const payIcon = payIconMapping[item.payName] || undefined;
  const Wrapper = isActive ? ActiveCardWrapper : CardWrapper;

  return (
    <Wrapper>
      <div
        className={cx(
          'relative',
          'flex justify-center items-center',
          'min-h-[48px]',
          'text-sm bgi-text-[var(--grayscale-100)]'
        )}
        onClick={() => {
          handleRechargeSecretPageClick({
            actionName: handleRechargeSecretPageRechargeChannelChangeAction,
            payload: { item },
          });
        }}
      >
        <div
          className={cx(
            'absolute',
            'left-0 right-0',
            'w-full',
            'flex justify-center items-center gap-3'
          )}
        >
          {payIcon ? (
            <Icon className="w-9 h-9 !max-w-9 !max-h-9" name={`${payIcon}`} />
          ) : null}

          <p>{`${item.displayName}`}</p>
        </div>
        {item.isRecommend ? (
          <div
            className={cx(
              'absolute',
              '-top-1.5 -right-1.5 z-10',
              'w-full',
              'flex items-end justify-end'
            )}
          >
            <Icon
              className={cx(
                'w-6 h-6 p-1',
                'bgi-[var(--base-2-variant8)]',
                'rounded-full border',
                'bgi-border-[var(--base-1-variant1)]'
              )}
              name={'ic_recommend_2'}
            />
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};

export const RechargeSecretPayChannelList = () => {
  const { t } = useTranslation();

  /* 全部支付通道 */
  const channelOptions = useRechargeSecretPageStore(
    (state) => state.channelOptions
  );

  return (
    <div className={'flex flex-col gap-1 adm-space-justify-start px-4'}>
      <div
        className={cx('text-base font-medium bgi-text-[var(--grayscale-100)]')}
      >
        {t('deposit_payment_methods')}
      </div>

      <div className={'grid grid-cols-3 gap-y-3 gap-x-[14px]'}>
        {channelOptions.map((item, index) => (
          <PayChannelCard key={`${item.payName}_${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RechargeSecretPayChannelList;
