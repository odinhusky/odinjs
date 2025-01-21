import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import Icon from '@libs/mode2/components/Icon';
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

  return (
    <div className={cx('grid grid-cols-2 gap-2')}>
      {allPayChannelActionItems.map((item, index) => (
        <div
          key={index}
          className={cx(
            'rounded-lg relative',
            item.payName === currentPayChannel.payName
              ? 'bgi-border-[var(--base-3-main)] after:rounded-lg after:border-2'
              : 'bgi-[var(--transparent-white-10)]'
          )}
        >
          <div
            className={cx(
              ' w-full min-h-10 h-full p-2',
              'relative flex justify-start items-center rounded gap-2 cursor-pointer',
              {
                'rounded-lg  h-auto w-auto bgi-[var(--base-3-50)]':
                  item.payName === currentPayChannel.payName,
              }
            )}
            onClick={() => {
              item.onAction();
            }}
          >
            {item.payName === currentPayChannel.payName ? (
              <div className="absolute w-6 h-5  bottom-0 right-0 bgi-[var(--base-3-main)] rounded-tl-lg rounded-br-lg">
                <Icon className="h-full m-auto" name="ic_check" />
              </div>
            ) : null}

            <div className={cx('flex flex-col h-full')}>
              <div
                className={cx(
                  'flex flex-col gap-2 text-sm',
                  item.payName === currentPayChannel.payName
                    ? 'bgi-text-[var(--grayscale-100)]'
                    : 'bgi-text-[var(--grayscale-70)]'
                )}
              >
                <div className="flex gap-2">
                  {item.displayName}
                  {item.isRecommend ? (
                    <div className="bgi-[var(--base-1-main)] bgi-text-[var(--grayscale-100)] text-xxxs py-1 px-2 rounded-full font-medium">
                      {t('wallet_deposit_tag_recommend')}
                    </div>
                  ) : null}
                </div>

                {currentRechargeCard === RechargeCard.TOP_UP_BONUS &&
                (item.isRecommend ||
                  item.payName === currentPayChannel.payName) ? (
                  <div
                    className={cx(
                      'text-xs w-fit',
                      'py-1 px-2',
                      'rounded !bgi-[var(--base-2-main)] bgi-text-[var(--grayscale-100)] after:rounded'
                    )}
                  >
                    {t('wallet_deposit_up_to_bonus', {
                      cashBackRate: item.maxCashBackRate,
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
