import cx from '@commonUtils/cx';
import Icon from '@libs/mode2/components/Icon';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const PayChannelList = () => {
  /* 全部支付通道 */
  const allPayChannelActionItems = useWalletPageRechargeContentStore(
    (state) => state.allPayChannelActionItems
  );

  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  return (
    <div className={cx('grid grid-cols-1 gap-2', 'mobile:grid-cols-2')}>
      {allPayChannelActionItems.map((item, index) => (
        <div
          key={index}
          className={cx(
            'rounded p-px relative',
            item.payName === currentPayChannel.payName
              ? 'bgi-[var(--base-2-main)]'
              : 'bgi-[var(--grayscale-30)]'
          )}
        >
          <div
            className={cx(
              'mr-4 w-full min-h-10 h-full p-2',
              'flex justify-start items-center rounded gap-2 cursor-pointer',
              item.payName === currentPayChannel.payName
                ? 'bgi-[var(--grayscale-50)]'
                : 'bgi-[var(--bg-main)] tablet:bgi-[var(--grayscale-20)]'
            )}
            onClick={() => {
              item.onAction();
            }}
          >
            <div
              className={cx(
                'rounded-full',
                'w-6 h-6 aspect-square',
                item.payName === currentPayChannel.payName
                  ? ''
                  : 'border-solid border border-[var(--grayscale-70)]'
              )}
            >
              {item.payName === currentPayChannel.payName ? (
                <Icon
                  key={'ic_check'}
                  className={cx(
                    'w-full h-full p-0.5 aspect-square',
                    'bgi-[var(--base-2-main)]',
                    'border-solid rounded-full'
                  )}
                  name="ic_check"
                />
              ) : null}
            </div>

            <div className={'flex flex-col'}>
              <div
                className={cx(
                  'bgi-text-[var(--grayscale-70)] text-sm',
                  item.payName === currentPayChannel.payName
                    ? 'bgi-text-[var(--grayscale-100)]'
                    : ''
                )}
              >
                {item.displayName}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
