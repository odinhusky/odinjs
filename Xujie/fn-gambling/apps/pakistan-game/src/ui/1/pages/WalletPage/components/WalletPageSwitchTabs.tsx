import cx from '@commonUtils/cx';
import {
  useWalletPageSwitchTabsActionsStore,
  useWalletPageSwitchTabsStore,
} from '@/zustand/page/walletPageStore';
import { useTranslation } from 'react-i18next';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@libs/mode2/components/Icon';

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
    <div className="">
      <div className="p-1 box-border flex bgi-[var(--grayscale-10)] rounded-xl">
        {walletSwitchTabList.map((item, idx) => {
          return (
            <div
              key={item.id}
              className={cx('h-10 flex-1', 'flex justify-center items-center', {
                'bgi-[var(--grayscale-00)] rounded-lg shadow-[2px_4px_4px_0px_rgba(0,0,0,0.12)]':
                  item.id === curSwitchContentTabId,
              })}
              onClick={() => {
                walletSwitchTabListActions[idx]();
              }}
            >
              <Icon
                className="w-6 h-6 mr-1"
                name={item.url}
                color={
                  item.id === curSwitchContentTabId
                    ? 'var(--base-1-main)'
                    : 'var(--grayscale-50)'
                }
              />
              <div
                className={cx('text-base tablet:text-lg font-semibold', {
                  'bgi-text-[var(--base-1-main)]':
                    item.id === curSwitchContentTabId,
                })}
              >
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
