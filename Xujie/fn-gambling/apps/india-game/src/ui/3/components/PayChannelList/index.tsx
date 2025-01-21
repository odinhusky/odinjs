import cx from '@commonUtils/cx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@libs/mode2/components/Icon';
import { useBreakPoint } from '@libs/commonUtils';
import './index.scss';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const PayChannelList = () => {
  const { t } = useTranslation();
  /* 當前充值卡 */
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  /* 全部支付通道 */
  const allPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.allPayChannelActionItems
  );

  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  const { isMobile } = useBreakPoint();
  return (
    <div className={cx('pay-channel-list', 'grid grid-cols-2 gap-2')}>
      {allPayChannelActionItems.map((item, index) => (
        <div
          key={index}
          className={cx(
            'rounded',
            'relative',
            item.payName === currentPayChannel.payName
              ? 'border-channel-active'
              : 'border-[1.5px]  border-[var(--grayscale-40)]'
          )}
        >
          <div
            className={cx(
              'relative',
              'mr-4',
              'w-full min-h-10 h-full',
              'p-2',
              'rounded',
              'gap-2',
              'cursor-pointer',
              item.payName === currentPayChannel.payName
                ? 'bgi-[var(--transparent-white-30)]'
                : ''
            )}
            onClick={() => {
              item.onAction();
            }}
          >
            {item.payName === currentPayChannel.payName ? (
              <div
                className={cx(
                  'absolute right-0 bottom-0 pl-1',
                  'bgi-[var(--base-2-main)]',
                  'rounded-tl-xl'
                )}
              >
                <Icon
                  key={'ic_check'}
                  className="w-5 h-5 mobile:w-6 mobile:h-6"
                  name={'ic_check'}
                  color="var(--grayscale-00)"
                />
              </div>
            ) : null}

            <div className="flex gap-2">
              <div
                className={cx(
                  'text-sm mobile:text-base',
                  item.payName === currentPayChannel.payName
                    ? 'bgi-text-[var(--grayscale-100)]'
                    : 'bgi-text-[var(--grayscale-70)]'
                )}
              >
                {item.displayName}
              </div>
              {item.isRecommend ? (
                <div
                  className={cx(
                    'text-xxs mobile:text-xs',
                    'bgi-text-[var(--grayscale-00)]',
                    'font-medium',
                    ' bgi-[var(--base-2-main)]',
                    'rounded-lg rounded-bl-none',
                    'p-1'
                  )}
                >
                  {t('wallet_deposit_tag_recommend')}
                </div>
              ) : null}
            </div>
            {currentRechargeCard === RechargeCard.TOP_UP_BONUS &&
            (item.payName === currentPayChannel.payName || item.isRecommend) ? (
              <div className="p-[1px] border-rate-active rounded mt-1 inline-block">
                <div className={cx(' rounded px-2 py-1 text-xs')}>
                  {t('wallet_deposit_up_to_bonus', {
                    cashBackRate: item.maxCashBackRate,
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
