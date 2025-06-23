import {
  handleMyPageDepositBtnClick,
  handleMyPageMyInfoActionClick,
  handleMyPageWithdrawBtnClick,
} from '@mode2/action/actionTypes';
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
import { AccountPageTypes } from '@libs/mode2/zustand/page/accountPageStore';
import useNavToWalletWithdrawInterceptorForV6 from '@/usecase/useNavToWalletWithdrawInterceptorForV6';

export const MyPageUserInfo = memo(() => {
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  const level = useUserProfileStore((state) => state.level);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const hasSetPassword = useUserProfileStore((state) => state.hasSetPassword);
  const bindReferralCode = useUserProfileStore(
    (state) => state.bindReferralCode
  );
  const { handleMyPageClick } = useMyPageActions();
  const { t } = useTranslation();

  const { displayUserName } = useUserProfileStore((state) => ({
    displayUserName: state.displayUserName,
  }));

  const iconClassName = 'h-[48px] w-auto';
  const iconTextClassName =
    'text-sm font-medium bgi-text-[var(--grayscale-100)]';

  const { doBeforeNavigation } = useNavToWalletWithdrawInterceptorForV6();

  return (
    <div className="flex">
      <div
        className="w-full flex items-center gap-3"
        onClick={() => {
          handleMyPageClick({
            actionName: handleMyPageMyInfoActionClick,
            payload: { value: AccountPageTypes.MYINFO },
          });
        }}
      >
        <div className="relative bgi-border-[var(--base-1-variant4)] cursor-pointer rounded-full flex-shrink-0">
          <Avatar
            rootClassName={'!w-[72px] !h-[72px]'}
            className={'!w-[72px] !h-[72px] z-10 relative'}
            isShowVIP={false}
          />
          <Icon
            className="w-[22px] h-[22px] absolute -bottom-0.5 right-0 z-20"
            name="ic_update"
          />
          {!realPhone || !hasSetPassword || !bindReferralCode ? (
            <RedDot className="absolute top-0 right-1 z-10" />
          ) : null}
        </div>
        <div className="bgi-text-[var(--grayscale-100)] text-sm">
          <div className="text-xl mb-0.5 font-medium flex items-center gap-2">
            <div className="max-w-24 truncate">{displayUserName}</div>
            <div className={cx(FLEX_CENTER, 'gap-0.5')}>
              <Icon name={`vip_rank_${level}`} className="w-[26px] h-5" />
              <Icon name={`ic_vip_level_${level}`} className="w-[41px] h-3" />
            </div>
          </div>
          <div className="text-lg text-center px-7 py-0.5 inline-block font-medium bgi-text-[var(--base-1-main)] bgi-[var(--transparent-white-10)] rounded-full">
            {formatMoney({
              value: totalAssets,
              includeDecimal: true,
              showCurrency: false,
            })}
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
          <Icon
            name="ic_my_deposit"
            className={iconClassName}
            imgClassName={cx(iconClassName)}
          />
          <span className={cx(iconTextClassName)}>
            {renderI18N({ i18nKey: 'wallet_nav_deposit' }, t)}
          </span>
        </div>
        <div
          className={cx(FLEX_CENTER, 'flex-col cursor-pointer')}
          onClick={() => {
            doBeforeNavigation();
            handleMyPageClick({
              actionName: handleMyPageWithdrawBtnClick,
            });
          }}
        >
          <Icon
            name="ic_my_withdraw"
            className={iconClassName}
            imgClassName={cx(iconClassName)}
          />
          <span className={iconTextClassName}>
            {renderI18N({ i18nKey: 'wallet_nav_withdraw' }, t)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default MyPageUserInfo;
