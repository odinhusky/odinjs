import { useTranslation } from 'react-i18next';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import React from 'react';
import { Icon } from '@components/Icon';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import { PayBrokenInfoResult } from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import useLowBalanceRechargeModalActions from '@libs/mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';
import { handleLowBalanceRechargeModalRechargeChannelChangeAction } from '@libs/mode2/action/actionTypes';

const ActiveCardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--linear-4)]',
        'bgi-border-[var(--base-1-variant1)]'
      )}
    >
      <div
        style={{
          backgroundImage: `url(${getImgUrl(
            EResourceLevel.V,
            'payment_methods_focus'
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
        <img
          alt={'check_box'}
          className="absolute right-0 bottom-0 rounded-br-[5px] h-[26px] w-[26px]"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
      </div>
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'relative cursor-pointer',
        'rounded-md border-[1.5px]',
        'bgi-[var(--base-2-variant11)]',
        'bgi-border-[var(--base-2-variant6)]'
      )}
      style={{
        backgroundImage: `url(${getImgUrl(EResourceLevel.V, 'pattern')})`,
        backgroundSize: '100%',
        backgroundPosition: '1rem 1rem',
      }}
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

const PayChannelCard = ({ item }: { item: PayBrokenInfoResult }) => {
  const { handleLowBalanceRechargeModalClick } =
    useLowBalanceRechargeModalActions();

  /* 當前選定支付通道 */
  const currentPayChannel = useLowBalanceRechargeModalStore(
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
          'min-h-10',
          'text-sm bgi-text-[var(--grayscale-100)]'
        )}
        onClick={() => {
          handleLowBalanceRechargeModalClick({
            actionName:
              handleLowBalanceRechargeModalRechargeChannelChangeAction,
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
            <Icon className="w-[26px] h-[26px]" name={`${payIcon}`} />
          ) : null}

          <p className="text-xxs font-medium">{`${item.displayName}`}</p>
        </div>
        {item.isRecommend ? (
          <div
            className={cx(
              'absolute',
              '-top-1 -right-1.5 z-10',
              'w-full',
              'flex items-end justify-end'
            )}
          >
            <Icon
              className={cx(
                'w-[18px] h-[18px] p-0.5',
                'bgi-[var(--base-2-variant8)]',
                'rounded-full border bgi-border-[var(--base-1-variant1)]'
              )}
              name={'ic_recommend_2'}
            />
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
};

export const PayChannelList = () => {
  const { t } = useTranslation();

  /* 全部支付通道 */
  const channelOptions = useLowBalanceRechargeModalStore(
    (state) => state.channelOptions
  );

  return (
    <div className="flex flex-col gap-1 adm-space-justify-start mt-3">
      <div
        className={cx(
          'flex gap-1',
          'text-base font-medium bgi-text-[var(--grayscale-100)]'
        )}
      >
        <p>{t('deposit_payment_methods')}</p>
      </div>

      <div className={'grid grid-cols-3 gap-y-3 gap-x-2'}>
        {channelOptions.map((item, index) => (
          <PayChannelCard key={`${item.payName}_${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PayChannelList;
