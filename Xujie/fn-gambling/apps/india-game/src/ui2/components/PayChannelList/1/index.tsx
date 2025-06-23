import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import './index.scss';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
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
    <div className={cx('pay-channel-list', 'grid grid-cols-2 gap-2')}>
      {allPayChannelActionItems.map((item, index) => {
        const isActive = item.payName === currentPayChannel.payName;

        return (
          <div
            key={index}
            className={cx(
              'rounded',
              'relative',
              isActive
                ? 'border-channel-active'
                : 'border-[1.5px]  border-[var(--grayscale-40)]'
            )}
          >
            <div
              className={cx(
                'relative',
                'mr-4',
                'w-full h-12 mobile:h-[60px]',
                'p-2',
                'rounded',
                FLEX_ITEMS_CENTER,
                'gap-2',
                'cursor-pointer',
                isActive ? 'bgi-[var(--transparent-white-30)]' : ''
              )}
              onClick={() => {
                item.onAction();
              }}
            >
              <div
                className={cx(
                  isActive ? 'bgi-[var(--base-1-main)]' : 'border',
                  'rounded-full',
                  'w-4 h-4 mobile:w-[18px] mobile:h-[18px]'
                )}
              >
                {isActive ? (
                  <Icon
                    className={'w-4 h-4 mobile:w-4.5 mobile:h-4.5'}
                    key={'ic_check'}
                    name={'ic_check'}
                    color="var(--grayscale-100)"
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <div
                  className={cx(
                    'text-sm mobile:text-base',
                    isActive
                      ? 'bgi-text-[var(--grayscale-100)]'
                      : 'bgi-text-[var(--grayscale-70)]'
                  )}
                >
                  {item.displayName}
                </div>

                {currentRechargeCard === RechargeCard.TOP_UP_BONUS &&
                (isActive || item.isRecommend) ? (
                  <div className=" rounded inline-block">
                    <div
                      className={cx(
                        'rounded',
                        'text-xs mobile:text-sm',
                        'bgi-text-[var(--linear-4)]'
                      )}
                    >
                      {t('wallet_deposit_up_to_bonus', {
                        cashBackRate: item.maxCashBackRate,
                      })}
                    </div>
                  </div>
                ) : null}

                {item.isRecommend ? (
                  <div className="absolute top-0 right-0 rounded-bl-full">
                    <div
                      className={cx(
                        'text-xxs mobile:text-xs',
                        'bgi-text-[var(--grayscale-100)]',
                        'font-medium text-center',
                        'bgi-[var(--base-1-main)]',
                        'w-[77px] h-5 mobile:w-[97px] mobile:h-6',
                        'p-1'
                      )}
                      style={{
                        borderTopRightRadius: '4px',
                        borderBottomLeftRadius: '35px',
                      }}
                    >
                      {t('wallet_deposit_tag_recommend')}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
