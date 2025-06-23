import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, XY_CENTER } from '@libs/constant/style';
import { handleRechargeWheelTabClick } from '@mode2/action/actionTypes';
import useRechargeWheelAction from '@libs/mode2/action/rechargeWheel/useRechargeWheelAction';
import Icon from '@components/Icon';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import capitalize from 'lodash/capitalize';
import { Trans } from 'react-i18next';

interface RechargeWheelTabProps {
  id?: string;
  value: number | string;
  type: RechargeWheelType;
  isLocked: boolean;
  remainNum: number;
  isActive: boolean;
}

export const RechargeWheelTab = ({
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
        'flex-auto',
        'relative',
        'w-[77px]',
        'rounded-lg',
        'after-rounded-lg',
        {
          'bgi-[var(--base-1-50)]': isLocked || !isActive,
          'bgi-[var(--base-1-main)]': isActive && !isLocked,
        },
        'bgi-border-[var(--base-1-light)]',
        'p-[2px]',
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
      <div className={cx('relative')}>
        {/* 輪盤小圖 */}
        <img
          src={getImgUrl(EResourceLevel.V, `${type}_wheel_s`)}
          alt={`${type} wheel icon`}
          className={cx('w-5', 'block', {
            'opacity-50': isLocked || !isActive,
            'opacity-100': isActive && !isLocked,
          })}
        />

        {/* 鎖定圖片 */}
        {isLocked ? (
          <Icon
            name="ic_lock"
            className={cx('w-4 h-4', 'absolute ', XY_CENTER)}
          />
        ) : null}
      </div>

      {/* 剩餘次數 */}
      {!isActive && remainNum > 0 ? (
        <div className={cx('w-[14px]', 'absolute top-1 right-2 z-[1]')}>
          <img
            src={getImgUrl(EResourceLevel.V, 'ic_red_dot')}
            alt="Red dot hint image"
            className={cx('w-[14px] h-[14px]')}
          />

          <span
            className={cx(
              'block',
              'absolute z-[1]',
              XY_CENTER,
              'bgi-text-[var(--grayscale-100)]',
              'text-xxxs'
            )}
          >
            {remainNum >= 10 ? '9+' : remainNum}
          </span>
        </div>
      ) : null}

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
            <div>{capitalize(type)}</div>
            <div>
              <Trans
                i18nKey="deposit_wheel_prize"
                values={{
                  value: formatMoney({ value: Number(value) }),
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
