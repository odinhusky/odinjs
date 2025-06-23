import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, XY_CENTER } from '@libs/constant/style';
import { handleRechargeWheelTabClick } from '@mode2/action/actionTypes';
import useRechargeWheelAction from '@libs/mode2/action/rechargeWheel/useRechargeWheelAction';
import Icon from '@components/Icon';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { Trans } from 'react-i18next';

interface RechargeWheelTabProps {
  index: number;
  id?: string;
  value: number | string;
  type: RechargeWheelType;
  isLocked: boolean;
  remainNum: number;
  isActive: boolean;
}

export const RechargeWheelTab = ({
  index,
  type,
  value,
  isLocked,
  remainNum,
  isActive,
}: RechargeWheelTabProps) => {
  const { handleRechargeWheelClick } = useRechargeWheelAction();

  const isCurrentWheelSlowSpin = useMode2RechargeWheelPageStore(
    (state) => state.isCurrentWheelSlowSpin
  );

  return (
    <button
      className={cx(
        'flex-1 min-h-[96px]',
        'relative z-[1]',
        'border-[2px] bgi-border-[var(--base-1-40)]',
        {
          'border-l-0': index === 0,
          'border-r-0': index === 3,
          'rounded-tl-[16px]': index !== 0,
          'rounded-tr-[16px] ': index !== 3,
          'bgi-[var(--base-2-variant11)] bg-shadow-[var(--recharge-wheel-tab-inset-shadow)]':
            isLocked || !isActive,
          'bgi-[var(--base-2-variant16)] z-[2] border-b-0 bgi-border-[var(--base-1-variant6)]':
            isActive && !isLocked,
        },
        'after-rounded-lg',
        'p-[2px] py-2',
        FLEX_CENTER,
        'flex-col',
        'gap-1'
      )}
      onClick={() => {
        if (isCurrentWheelSlowSpin) {
          handleRechargeWheelClick({
            actionName: handleRechargeWheelTabClick,
            payload: { type, isLocked },
          });
        }
      }}
    >
      {/* Active 時的光源 */}
      {isActive && !isLocked ? (
        <img
          src={getImgUrl(EResourceLevel.V, 'bg_active_tab_light')}
          alt={'Active background_image'}
          className={cx(
            'w-full',
            'block',
            'absolute top-0 left-0 z-[2]',
            'rotate-180'
          )}
        />
      ) : null}

      {/* 左邊接縫處 */}
      <div
        className={cx(
          'w-[6px] h-3',
          'bg-[var(--base-2-variant16)]',
          'absolute bottom-[1px] left-[-6px]',
          'border-0 outline-0',
          {
            hidden: !isActive || index === 0,
          }
        )}
      >
        <div
          className={cx(
            'w-full h-full',
            'rounded-br-[6px]',
            'bgi-[var(--base-2-variant11)]',
            'border-[2px] bgi-border-[var(--base-1-variant6)]',
            'border-l-0 border-t-0'
          )}
        ></div>
      </div>

      {/* 右邊接縫處 */}
      <div
        className={cx(
          'w-[6px] h-3',
          'bg-[var(--base-2-variant16)]',
          'absolute bottom-[1px] right-[-6px]',
          'border-0 outline-0',
          {
            hidden: !isActive || index === 3,
          }
        )}
      >
        <div
          className={cx(
            'w-full h-full',
            'rounded-bl-[6px]',
            'bgi-[var(--base-2-variant11)]',
            'border-[2px] bgi-border-[var(--base-1-variant6)]',
            'border-r-0 border-t-0'
          )}
        ></div>
      </div>

      {/* 剩餘次數 */}
      {!isLocked ? (
        <div
          className={cx(
            'w-5 h-5',
            'absolute top-0 -right-2.5 z-[2]',
            'bgi-[var(--base-2-variant3)]',
            'rounded-full'
          )}
        >
          <span
            className={cx(
              'block',
              'absolute z-[1]',
              XY_CENTER,
              'bgi-text-[var(--grayscale-100)]',
              'text-xs font-bold'
            )}
          >
            {/* {remainNum >= 10 ? '9+' : remainNum} */}
            {remainNum}
          </span>
        </div>
      ) : null}

      <div className={cx('relative')}>
        {/* 輪盤小圖 */}
        <img
          src={getImgUrl(EResourceLevel.V, `${type}_wheel_s`)}
          alt={`${type} wheel icon`}
          className={cx('w-12', 'block', {
            'opacity-50': isLocked,
            'opacity-100': !isLocked,
          })}
        />

        {/* 鎖定圖片 */}
        {isLocked ? (
          <Icon
            name="ic_lock_1"
            className={cx('w-4 h-4', 'absolute ', XY_CENTER)}
          />
        ) : null}
      </div>

      {/* 內文 */}
      <div
        className={cx(
          FLEX_CENTER,
          'flex-col',
          'text-xs',
          'bgi-text-[var(--grayscale-100)]'
        )}
      >
        {type === 'supreme' ? (
          <div className={cx('w-full')}>
            <Trans
              i18nKey="deposit_wheel_supreme_wheel"
              components={{
                divTag: <div className={cx(FLEX_CENTER)} />,
              }}
            />
          </div>
        ) : (
          <div className={cx('w-full')}>
            {/* <div>{capitalize(type)}</div> */}
            <div>
              <Trans
                i18nKey="deposit_wheel_prize"
                values={{
                  prize: formatMoney({ value: Number(value) }),
                }}
                components={{
                  divTag: <div className={cx(FLEX_CENTER, 'break-normal')} />,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default RechargeWheelTab;
