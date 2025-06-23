import cx from '@commonUtils/cx';
import {
  useWalletPageSwitchTabsActionsStore,
  useWalletPageSwitchTabsStore,
} from '@/zustand/page/walletPageStore';
import { useTranslation } from 'react-i18next';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@components/Icon';

export const WalletPageSwitchTabs = () => {
  const { t } = useTranslation();
  const walletSwitchTabList = useWalletPageSwitchTabsStore(
    (state) => state.walletSwitchTabList
  );
  const walletSwitchTabListActions = useWalletPageSwitchTabsActionsStore(
    (state) => state.walletSwitchTabListActions
  );

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  return (
    <div className="mt-0 mobile:mt-3 tablet:mt-4 flex justify-start bgi-text-[var(--transparent-white-20)] cursor-pointer">
      {walletSwitchTabList.map((item, idx) => {
        return (
          <div
            key={item.id}
            className={cx('flex gap-1 py-3 px-6', {
              'bgi-text-[var(--grayscale-100)]':
                item.id === curSwitchContentTabId,
              'bgi-[var(--grayscale-20)]': item.id === curSwitchContentTabId,
              'rounded-t-lg': item.id === curSwitchContentTabId,
            })}
            onClick={() => {
              walletSwitchTabListActions[idx]();
            }}
          >
            <Icon
              className="w-6 h-6"
              name={item.url}
              color={
                item.id === curSwitchContentTabId
                  ? 'var(--grayscale-100)'
                  : 'var(--transparent-white-20)'
              }
            />
            <div className="text-base tablet:text-lg font-semibold">
              {renderI18N(item.label, t)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WalletPageSwitchTabs;
