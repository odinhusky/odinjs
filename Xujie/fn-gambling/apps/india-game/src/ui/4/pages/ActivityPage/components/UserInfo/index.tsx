import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Avatar from '@components/Avatar';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { formatMoney } from '@libs/mode2/utils';
import Icon from '@components/Icon';
import useHallPageActions from '@libs/mode2/action/hallPageAction/useHallPageActions';
import { handleHallPageBalanceRightArrowIconClick } from '@libs/mode2/action/hallPageAction/actionType';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import useActivityPageActions from '@libs/mode2/action/activityPageAction/useActivityPageActions';
import { handleVipMyBounusClick } from '@libs/mode2/action/activityPageAction/actionType';

export const UserInfo = () => {
  const playerName = useUserProfileStore((state) => state.playerName);
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const userRole = useUserProfileStore((state) => state.userRole);
  const isGuest = userRole === UserRoleType.GUEST;

  const { handleHallPageClick } = useHallPageActions();
  const { handleActivityPageClick } = useActivityPageActions();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'gap-3 mt-4 mb-9')}>
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
          {isGuest ? 'Guest' : `Player${playerName}`}
        </span>

        <div className={cx(FLEX_ITEMS_CENTER, 'gap-5')}>
          <span
            className={cx(
              'block',
              'bgi-text-[var(--base-1-main)]',
              'text-base font-medium'
            )}
          >
            {isGuest ? formatMoney(0, false) : formatMoney(totalAssets, true)}
          </span>

          <Icon
            name={'ic_arrow_right_2-1'}
            className={cx('w-4 h-4')}
            onClick={() => {
              handleHallPageClick({
                actionName: handleHallPageBalanceRightArrowIconClick,
              });
            }}
          />
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
          <Icon name={'ic_link'} className={cx('w-9 h-9')} />

          <span className={cx('text-base', 'bgi-text-[var(--grayscale-100)]')}>
            My bonus
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
