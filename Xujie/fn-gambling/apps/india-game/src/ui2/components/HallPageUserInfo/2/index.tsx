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
  handleHallPageFirstDepositBtnClick,
} from '@mode2/action/actionTypes';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import useNavToWalletWithdrawInterceptorForV6 from '@/usecase/useNavToWalletWithdrawInterceptorForV6';
import { handleMyPageVIPPageBtnClick } from '@mode2/action/actionTypes';
import useMyPageActions from '@libs/mode2/action/myPageAction/useMyPageActions';

export const HallPageUserInfo = () => {
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const userRole = useUserProfileStore((state) => state.userRole);
  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const isGuest = userRole === UserRoleType.GUEST;
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);

  const navToWalletBtnClass = cx(
    FLEX_COL,
    'items-center',
    'gap-[2px]',
    // 'w-[54px]',
    'cursor-pointer'
  );
  const { handleHallPageClick } = useHallPageActions();
  const { handleMyPageClick } = useMyPageActions();
  const { doBeforeNavigation } = useNavToWalletWithdrawInterceptorForV6();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'gap-2.5')}>
      <div
        className={cx('w-16 h-16', 'relative')}
        onClick={() => {
          handleMyPageClick({
            actionName: handleMyPageVIPPageBtnClick,
          });
        }}
      >
        <Avatar isGuest={isGuest} />
      </div>

      <div className={cx('flex-1')}>
        <span
          className={cx(
            'block',
            'bgi-text-[var(--grayscale-100)]',
            'text-base font-medium',
            'break-all',
            'max-w-[144px] tablet:max-w-fit',
            'truncate'
          )}
        >
          {displayUserName}
        </span>

        <div
          className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'cursor-pointer')}
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
              'text-base font-medium',
              'max-w-[116px] tablet:max-w-fit',
              'truncate'
            )}
          >
            {isGuest
              ? formatMoney({ value: 0 })
              : formatMoney({ value: totalAssets, includeDecimal: true })}
          </span>

          <Icon name={'ic_arrow_right_2-1'} className={cx('w-4 h-4')} />
        </div>
      </div>

      <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
        {/* First Deposit */}
        {isFirstDeposit ? (
          <button
            className={cx(navToWalletBtnClass, 'relative')}
            onClick={() => {
              handleHallPageClick({
                actionName: handleHallPageFirstDepositBtnClick,
              });
            }}
          >
            <Icon
              name={'ic_first_deposit_home_icon_2'}
              className={cx('w-auto h-12')}
              ext={'.webp'}
            />
            <div className={cx('absolute -right-2 -top-1')}>
              <Icon
                name={'ic_header_icon_button_hint'}
                className={cx('w-[32px] h-[22px]')}
              />

              <span
                className={cx(
                  'bgi-text-[var(--grayscale-100)] text-xxs',
                  'inline-block',
                  'absolute right-[5px] top-[2px]'
                )}
              >
                +37%
              </span>
            </div>

            {/* // TODO I18N */}
            <span
              className={cx(
                'truncate',
                'text-sm',
                'bgi-text-[var(--grayscale-100)]'
              )}
            >
              First Deposit
            </span>
          </button>
        ) : null}

        {/* Deposit */}
        <button
          className={cx(navToWalletBtnClass)}
          onClick={() => {
            handleHallPageClick({
              actionName: handleHallPageDepositBtnClick,
            });
          }}
        >
          <Icon name={'ic_deposit'} className={cx('w-12 h-12')} />

          {/* // TODO I18N */}
          <span className={cx('text-sm', 'bgi-text-[var(--grayscale-100)]')}>
            Deposit
          </span>
        </button>

        {/* Withdraw */}
        <button
          className={cx(navToWalletBtnClass, 'ml-2')}
          onClick={() => {
            doBeforeNavigation();
            handleHallPageClick({
              actionName: handleHallPageWithdrawBtnClick,
            });
          }}
        >
          <Icon name={'ic_withdraw'} className={cx('w-12 h-12')} />

          {/* // TODO I18N */}
          <span className={cx('text-sm', 'bgi-text-[var(--grayscale-100)]')}>
            Withdraw
          </span>
        </button>
      </div>
    </div>
  );
};

export default HallPageUserInfo;
