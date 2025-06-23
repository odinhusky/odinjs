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
    <div className="tab-box">
      <div className="tab-list">
        {walletSwitchTabList.map((item, idx) => {
          return (
            <div
              key={item.id}
              className={cx(
                'tab-item',
                item.id === curSwitchContentTabId ? 'active' : ''
              )}
              onClick={() => {
                walletSwitchTabListActions[idx]();
              }}
            >
              <Icon
                className="w-6 h-6"
                name={
                  item.id === curSwitchContentTabId ? item.urlActive : item.url
                }
              />
              <div className="text-base tablet:text-lg font-semibold">
                {renderI18N(item.label, t)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletPageSwitchTabs;
