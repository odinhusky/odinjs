import { useTranslation } from 'react-i18next';
import {
  PayChannelItem,
  useWalletPageRechargeContentStore,
} from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import StarMark from '@components/StarMark';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import React from 'react';
import { Icon } from '@components/Icon';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageUseGuideActionClick } from '@mode2/action/actionTypes';

/**
 * Evan for [V6] Done
 */
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
          className="absolute right-0 bottom-0 rounded-br-[5px] h-8 w-8"
          src={getImgUrl(EResourceLevel.V, 'check_box')}
        />
      </div>
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

/**
 * Evan for [V6] Done
 */
const PayChannelCard = ({ item }: { item: PayChannelItem }) => {
  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
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
          'min-h-[56px]',
          'text-sm bgi-text-[var(--grayscale-100)]'
        )}
        onClick={item.onAction}
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

/**
 * Evan for [V6] In progress
 */
const HowToUseItem = () => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { t } = useTranslation();
  return (
    <CardWrapper>
      <div
        className={cx(
          'relative',
          'min-h-[56px]',
          'flex justify-center items-center',
          'text-sm text-nowrap bgi-text-[var(--grayscale-100)]'
        )}
        onClick={() => {
          handleWalletPageBaseClick({
            actionName: handleWalletPageUseGuideActionClick,
          });
        }}
      >
        {/* TODO Evan 觀賞教學獎勵 */}
        <p className={'mr-1'}>{t('watch_learn_page_title')}</p>

        {/* <div
          className={'h-[27px] w-[56px] absolute -top-3 -right-6 text-center'}
          style={{
            backgroundImage: `url(${getImgUrl(
              EResourceLevel.V,
              'how_to_use_tooltip'
            )})`,
            backgroundSize: '100%',
          }}
        >
          {'2'}
        </div> */}
        <Icon className={'w-5 h-5'} name={'ic_double_arrow_right'} />
      </div>
    </CardWrapper>
  );
};

/**
 * Evan for [V6] Done
 */
export const PayChannelList = () => {
  const { t } = useTranslation();

  /* 全部支付通道 */
  const allPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.allPayChannelActionItems
  );

  return (
    <div className="flex flex-col gap-1 adm-space-justify-start">
      <div
        className={cx(
          'flex gap-1',
          'text-base font-medium bgi-text-[var(--grayscale-100)]'
        )}
      >
        <p>{t('deposit_payment_methods')}</p>
        <StarMark className={'!bgi-text-[var(--base-1-main)]'} />
      </div>

      <div className={'grid grid-cols-3 gap-y-3 gap-x-2 py-2'}>
        {allPayChannelActionItems.map((item, index) => (
          <PayChannelCard key={`${item.payName}_${index}`} item={item} />
        ))}

        <HowToUseItem />
      </div>
    </div>
  );
};

export default PayChannelList;
