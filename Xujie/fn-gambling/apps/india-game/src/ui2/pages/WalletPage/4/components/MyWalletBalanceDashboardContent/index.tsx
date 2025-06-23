import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import cx from '@commonUtils/cx';
import { Trans, useTranslation } from 'react-i18next';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import renderI18N from '@commonUtils/renderI18N';
import { I18NContent } from '@mode2/@types/i18nType';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import useBindPlayerPhoneModalStore from '@mode2/zustand/modal/BindPlayerPhoneModal';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import useNavToWalletWithdrawInterceptorForV6 from '@/usecase/useNavToWalletWithdrawInterceptorForV6';
import { hasBindPhoneModalVersionList } from '@libs/constant/versions';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

const depositTips = [
  {
    i18nKey: 'wallet_deposit_tips_list_1',
  },
  {
    i18nKey: 'wallet_deposit_tips_list_2',
  },
];

const withdrawTips = [
  {
    i18nKey: 'wallet_withdraw_tips_list',
  },
];

const TipsCard = ({
  title,
  tips,
}: {
  title: I18NContent;
  tips: I18NContent[];
}) => {
  const { t } = useTranslation();
  return (
    <div className={'flex flex-col gap-1 '}>
      <p className={'bgi-text-[var(--grayscale-100)] font-medium'}>
        {renderI18N(title, t)}
      </p>
      {tips.map((item, index) => {
        return (
          <p
            key={index}
            className={cx({
              'numbered-item': tips.length > 1,
            })}
          >
            {renderI18N(item, t)}
          </p>
        );
      })}
    </div>
  );
};

const WalletBalanceDashboard = () => {
  const { t } = useTranslation();
  const totalAssets = useUserProfileStore((state) => state.totalAssets);
  return (
    <div
      className={cx(
        'w-full h-auto relative flex-1',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 -mb-10 pb-10'
      )}
    >
      <div
        className={cx(
          'absolute max-h-[170px]',
          'top-0 left-0 right-0 bottom-0',
          'flex flex-col justify-center items-center',
          'mx-4'
        )}
      >
        <p className={'text-base font-medium bgi-text-[var(--grayscale-100)]'}>
          {t('wallet_my_balance_text')}
        </p>
        <p
          className={
            'flex items-center text-xl font-medium bgi-text-[var(--base-1-main)]'
          }
        >
          <Trans
            i18nKey={'wallet_my_balance'}
            values={{
              balance: formatMoney({
                value: totalAssets,
                includeDecimal: true,
                showCurrency: false,
              }),
            }}
            components={{
              balanceTab: <span className="text-4xl font-extrabold " />,
            }}
          />
        </p>
      </div>

      <BaseCacheImg
        className={'w-full h-[170px] object-fill'}
        alt={'wallet_background'}
        src={getImgUrl(EResourceLevel.V, 'wallet_background')}
        imgName="wallet_background"
      />
    </div>
  );
};

const WalletTipsContent = () => {
  return (
    <div
      className={cx(
        'flex-1 flex flex-col gap-16',
        'text-sm bgi-text-[var(--base-2-variant2)] mx-[50px] mt-[10%] mb-[15%]'
      )}
    >
      <TipsCard title={{ i18nKey: 'wallet_deposit_tips' }} tips={depositTips} />

      <TipsCard
        title={{ i18nKey: 'wallet_withdraw_tips' }}
        tips={withdrawTips}
      />
    </div>
  );
};

// TODO Evan for [V6] 訪客行為
const WalletNavigationButtons = () => {
  const { t } = useTranslation();
  const setDisplayDashboardType = useWalletPageStore(
    (state) => state.setDisplayDashboardType
  );
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );
  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );
  const userRole = useUserProfileStore((state) => state.userRole);
  const { doBeforeNavigation } = useNavToWalletWithdrawInterceptorForV6();
  return (
    <div
      className={cx(
        'flex-none w-full flex justify-center px-[50px] gap-4',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 fixed bottom-0',
        'px-4 pt-3 pb-5'
        // 'bgi-[var(--base-2-variant5)]'
      )}
    >
      <BaseSecondaryBtn
        className={cx('text-lg w-[166px] h-[46px]')}
        onClick={() => {
          const vVersion = import.meta.env['VITE_V_VERSION'];
          if (
            userRole === UserRoleType.PLAYER &&
            hasBindPhoneModalVersionList.includes(vVersion)
          ) {
            setShowBindPlayerPhoneModal(true);
          } else {
            doBeforeNavigation();
            setDisplayDashboardType(WalletDashboardType.NONE);
            setCurSwitchContentTabId(WalletPageTabType.WITHDRAW);
          }
        }}
        children={t('wallet_withdraw_button')}
      />

      <BasePrimaryBtn
        className={cx('text-lg w-[166px] h-[46px]')}
        onClick={() => {
          setDisplayDashboardType(WalletDashboardType.NONE);
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
        }}
        children={t('wallet_deposit_button')}
      />
    </div>
  );
};

export const MyWalletBalanceDashboardContent = () => {
  return (
    <div className="flex flex-col justify-center items-center pb-[80px]">
      <WalletBalanceDashboard />

      <WalletTipsContent />

      <WalletNavigationButtons />
    </div>
  );
};

export default MyWalletBalanceDashboardContent;
