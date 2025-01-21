import { showMyModifyModal } from '@modals/MyModifyModal';
import {
  handleMyPageDepositBtnClick,
  handleMyPagePersonalInformationLineBtnClick,
  handleMyPageUserInfoCopyIDClick,
  handleMyPageWithdrawBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { cx } from '@libs/commonUtils';
import Avatar from '@components/Avatar';
import { XY_CENTER } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';
import MyPageTabButton from '@/ui/1/components/MyPageTabButton';
import AvatarFrame from '@components/AvatarFrame';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';

export const MyPageUserInfo = memo(() => {
  const playerName = useUserProfileStore((state) => state.playerName);
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const withdrawLockAssets = useWithdrawStore(
    (state) => state.withdrawLockAssets
  );
  const id = useUserProfileStore((state) => state.id);
  const { handleMyPageClick } = useMyPageActions();
  const { t } = useTranslation();
  return (
    <div
      className="relative flex flex-col gap-2 w-auto !bgi-[var(--linear-4)]
          mobile:mx-0 -mx-4
          mobile:!rounded-lg !rounded-none
          mobile:pt-2 mobile:px-6 mobile:pb-6 pt-2 px-4 pb-6 mb-5
          justify-center items-center"
    >
      <div className="flex gap-4 w-full justify-between items-center">
        <div
          className="w-[60px] h-[60px] mobile:w-[68px] mobile:h-[68px] tablet:w-[70px] tablet:h-[70px] shrink-0 relative cursor-pointer"
          onClick={() => {
            // 修改头像
            showMyModifyModal({
              handleMyPageClick,
            });
          }}
        >
          <Avatar
            className={
              'w-[60px] h-[60px] mobile:w-[68px] mobile:h-[68px] tablet:w-[70px] tablet:h-[70px]'
            }
          />

          <AvatarFrame
            className={cx(
              'absolute',
              XY_CENTER,
              ' w-[72px] h-[72px] mobile:w-20 mobile:h-20 tablet:w-[81.5px] tablet:h-[81.5px] max-w-none'
            )}
            alt="Avatar frame image"
          />
        </div>

        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col text-sm gap-1 w-full bgi-text-[var(--grayscale-00)] font-medium">
            <div>{playerName}</div>
            <div className="flex gap-1">
              <div>
                {t('earn_money_ranking_list_table_header_id')}: {id}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleMyPageClick({
                    actionName: handleMyPageUserInfoCopyIDClick,
                  });
                }}
              >
                <Icon
                  className="w-4 h-4"
                  name="ic_copy"
                  color="var(--grayscale-00)"
                />
              </div>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleMyPageClick({
                actionName: handleMyPagePersonalInformationLineBtnClick,
              });
            }}
          >
            <Icon name={'ic_arrow_right_1'} color={'var(--grayscale-00)'} />
          </div>
        </div>
      </div>

      <div className="w-full border-b border-b-[var(--transparent-gray-20)]" />

      <div className="flex w-full justify-between">
        <div className="w-full bgi-text-[var(--grayscale-00)] text-center">
          <div className="mobile:text-base text-sm font-medium">
            {t('account_menu_surplus')}
          </div>
          <div className="mobile:text-lg text-base font-medium">
            {formatMoney(totalAssets, true)}
          </div>
        </div>

        <div className="w-full bgi-text-[var(--grayscale-00)] text-center">
          <div className="mobile:text-base text-sm font-medium">
            {t('account_menu_withdrawal_limit')}
          </div>
          <div className="mobile:text-lg text-base font-medium">
            {formatMoney(withdrawLockAssets, true)}
          </div>
        </div>
      </div>

      <div
        className="absolute flex gap-2 -bottom-[10%]
            mobile:left-3 mobile:right-3 left-4 right-4 justify-center items-center"
      >
        <MyPageTabButton
          btnText={{ i18nKey: 'wallet_nav_deposit' }}
          iconUrl={'ic_deposit'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageDepositBtnClick,
            });
          }}
        />
        <MyPageTabButton
          btnText={{ i18nKey: 'wallet_nav_withdraw' }}
          iconUrl={'ic_withdraw'}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageWithdrawBtnClick,
            });
          }}
        />
      </div>
    </div>
  );
});

export default MyPageUserInfo;
