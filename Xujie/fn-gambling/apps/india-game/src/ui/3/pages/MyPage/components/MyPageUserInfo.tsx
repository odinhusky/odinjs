import { showMyModifyModal } from '@modals/MyModifyModal';
import {
  handleMyPageDepositBtnClick,
  handleMyPageUserInfoCopyIDClick,
  handleMyPageWithdrawBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import MyPageTabButton from '@components/MyPageTabButton';
import { cx } from '@libs/commonUtils';
import Avatar from '@components/Avatar';
import AvatarFrame from '@components/AvatarFrame';
import { XY_CENTER } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';

export const MyPageUserInfo = memo(() => {
  const playerName = useUserProfileStore((state) => state.playerName);
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const id = useUserProfileStore((state) => state.id);
  const { handleMyPageClick } = useMyPageActions();
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-full bgi-[var(--linear-1)] rounded-t-[60px] rounded-b-lg flex items-center justify-center py-2 gap-3">
        <div
          className="w-16 h-16 relative"
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
              'w-[68px] h-[68px] mobile:w-20 mobile:h-20 tablet:w-[81.5px] tablet:h-[81.5px]  max-w-none',
              '-translate-x-2/4 -translate-y-2/4 left-2/4 top-[45%]'
            )}
            alt="Avatar frame image"
          />
        </div>
        <div className="bgi-text-[var(--grayscale-100)] text-sm">
          <div>{playerName}</div>
          <div
            className="flex gap-2 items-center"
            onClick={() => {
              handleMyPageClick({
                actionName: handleMyPageUserInfoCopyIDClick,
              });
            }}
          >
            <div>
              {t('earn_money_ranking_list_table_header_id')}: {id}
            </div>
            <div>
              <Icon className="w-4 h-4" name="ic_copy" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center bgi-text-[var(--base-2-main)] justify-center font-medium text-center gap-1 mt-3">
        <div>{formatMoney(totalAssets, true)}</div>
        <div>{t('account_menu_surplus')}</div>
      </div>

      <div className="flex gap-2 mt-2">
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
