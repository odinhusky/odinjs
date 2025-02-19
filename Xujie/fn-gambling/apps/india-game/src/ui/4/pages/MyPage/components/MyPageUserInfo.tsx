import {
  handleMyPageDepositBtnClick,
  handleMyPageWithdrawBtnClick,
} from '@mode2/action/myPageAction/acitonType';
import useMyPageActions from '@mode2/action/myPageAction/useMyPageActions';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { formatMoney } from '@mode2/utils';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import Avatar from '@components/Avatar';
import Icon from '@components/Icon';
import renderI18N from '@libs/commonUtils/renderI18N';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import RedDot from '@components/RedDot';
import { showMyModifyModal } from '@modals/MyModifyModal';

export const MyPageUserInfo = memo(() => {
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const level = useUserProfileStore((state) => state.level);
  const id = useUserProfileStore((state) => state.id);
  const { handleMyPageClick } = useMyPageActions();
  const { t } = useTranslation();

  const iconClassName = 'w-[54px] h-[42px] mb-0.5';
  const iconTextClassName =
    'text-xxs font-medium bgi-text-[var(--grayscale-100)]';

  return (
    <div className="flex">
      <div className="w-full flex items-center gap-3">
        <div
          className="relative bgi-border-[var(--base-1-variant4)] cursor-pointer rounded-full flex-shrink-0"
          onClick={() => {
            // 修改头像
            showMyModifyModal({
              handleMyPageClick,
            });
          }}
        >
          <Avatar className={'w-[72px] h-[72px] z-10 relative'} isShowVIP={false} />
          <Icon
            className="w-[22px] h-[22px] absolute bottom-1 right-0 z-20"
            name="ic_update"
          />
          {/* TODO Ronan TODO Evan check 紅點顯示邏輯 */}
          <RedDot className="absolute top-0 right-1 z-10" />
        </div>
        <div className="bgi-text-[var(--grayscale-100)] text-sm">
          <div className="text-xl mb-0.5 font-medium flex items-center">
            <div className="w-24 truncate">Player{id}</div>
            <div className={cx(FLEX_CENTER, 'gap-0.5')}>
              <Icon name={`vip_rank_${level}`} className="w-[26px] h-5" />
              <Icon name={`ic_vip_level_${level}`} className="w-[41px] h-3" />
            </div>
          </div>
          <div className="text-lg text-center px-7 py-0.5 inline-block font-medium bgi-text-[var(--base-1-main)] bgi-[var(--transparent-white-10)] rounded-full">
            {/* TODO Ronan UI未帶货币符号 */}
            {formatMoney(totalAssets, true)}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <div
          className={cx(FLEX_CENTER, 'flex-col cursor-pointer')}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageDepositBtnClick,
            });
          }}
        >
          <Icon name="ic_my_deposit" className={cx(iconClassName)} />
          <span className={cx(iconTextClassName)}>
            {renderI18N({ i18nKey: 'wallet_nav_deposit' }, t)}
          </span>
        </div>
        <div
          className={cx(FLEX_CENTER, 'flex-col cursor-pointer')}
          onClick={() => {
            handleMyPageClick({
              actionName: handleMyPageWithdrawBtnClick,
            });
          }}
        >
          <Icon name="ic_my_withdraw" className={cx(iconClassName)} />
          <span className={iconTextClassName}>
            {renderI18N({ i18nKey: 'wallet_nav_withdraw' }, t)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default MyPageUserInfo;
