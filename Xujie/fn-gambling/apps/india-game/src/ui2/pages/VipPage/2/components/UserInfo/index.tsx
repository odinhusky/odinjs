import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Avatar from '@components/Avatar';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { formatMoney } from '@libs/mode2/utils';
import Icon from '@components/Icon';
import useHallPageActions from '@libs/mode2/action/hallPageAction/useHallPageActions';
import { handleHallPageBalanceRightArrowIconClick } from '@mode2/action/actionTypes';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import useActivityPageActions from '@libs/mode2/action/activityPageAction/useActivityPageActions';
import { handleVipMyBounusClick } from '@mode2/action/actionTypes';

export const UserInfo = () => {
  const { handleHallPageClick } = useHallPageActions();
  const { handleActivityPageClick } = useActivityPageActions();

  const { totalAssets, userRole, displayUserName } = useUserProfileStore(
    (state) => ({
      totalAssets: state.totalAssets,
      userRole: state.userRole,
      displayUserName: state.displayUserName,
    })
  );

  const isGuest = userRole === UserRoleType.GUEST;

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'gap-3 mt-4 mb-5')}>
      <div className={cx('w-16 h-16', 'relative')}>
        <Avatar isGuest={isGuest} />
      </div>

      <div className={cx('flex-1')}>
        <span
          className={cx(
            'block',
            'bgi-text-[var(--grayscale-100)]',
            'text-base font-medium',
            'break-all'
          )}
        >
          {displayUserName}
        </span>

        <div
          className={cx(FLEX_ITEMS_CENTER, 'gap-5')}
          onClick={() => {
            handleHallPageClick({
              actionName: handleHallPageBalanceRightArrowIconClick,
            });
          }}
        >
          <span
            className={cx(
              'block',
              'bgi-text-[var(--base-1-main)]',
              'text-base font-medium'
            )}
          >
            {isGuest
              ? formatMoney({ value: 0 })
              : formatMoney({ value: totalAssets, includeDecimal: true })}
          </span>

          <Icon name={'ic_arrow_right_2-1'} className={cx('w-4 h-4')} />
        </div>
      </div>

      <div
        className={cx(FLEX_ITEMS_CENTER, 'cursor-pointer')}
        onClick={() => {
          handleActivityPageClick({
            actionName: handleVipMyBounusClick,
          });
        }}
      >
        <div className={cx(FLEX_COL, 'items-center')}>
          <Icon name={'ic_my_bonus'} className={cx('w-9 h-9')} />

          <span className={cx('text-base', 'bgi-text-[var(--grayscale-100)]')}>
            My bonus
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
