import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Avatar from '@components/Avatar';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { formatMoney } from '@libs/mode2/utils';
import Icon from '@components/Icon';
import useHallPageActions from '@libs/mode2/action/hallPageAction/useHallPageActions';
import {
  handleHallPageBalanceRightArrowIconClick,
  handleHallPageDepositBtnClick,
  handleHallPageWithdrawBtnClick,
} from '@libs/mode2/action/hallPageAction/actionType';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';

export const HallPageUserInfo = () => {
  const playerName = useUserProfileStore((state) => state.playerName);
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const userRole = useUserProfileStore((state) => state.userRole);
  const isGuest = userRole === UserRoleType.GUEST;

  const navToWalletBtnClass = cx(
    FLEX_COL,
    'items-center',
    'gap-[2px]',
    'w-[54px]',
    'cursor-pointer'
  );
  const { handleHallPageClick } = useHallPageActions();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'gap-3')}>
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
        className={cx(FLEX_ITEMS_CENTER, 'gap-4')}
        onClick={() => {
          handleHallPageClick({
            actionName: handleHallPageDepositBtnClick,
          });
        }}
      >
        <div className={cx(navToWalletBtnClass)}>
          <Icon name={'ic_deposit'} className={cx('w-10 h-10')} />

          <span className={cx('text-xs', 'bgi-text-[var(--grayscale-100)]')}>
            Deposit
          </span>
        </div>

        <div
          className={cx(navToWalletBtnClass)}
          onClick={() => {
            handleHallPageClick({
              actionName: handleHallPageWithdrawBtnClick,
            });
          }}
        >
          <Icon name={'ic_withdraw'} className={cx('w-10 h-10')} />

          <span className={cx('text-xs', 'bgi-text-[var(--grayscale-100)]')}>
            Withdraw
          </span>
        </div>
      </div>
    </div>
  );
};

export default HallPageUserInfo;
