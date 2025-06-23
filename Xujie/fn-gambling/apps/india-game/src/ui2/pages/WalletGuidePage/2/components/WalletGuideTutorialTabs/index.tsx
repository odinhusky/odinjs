import React from 'react';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';
import useWalletGuidePageActions from '@mode2/action/walletGuidePageAction/useWalletGuidePageAction';
import { handleWalletGuidePageTabSelected } from '@mode2/action/actionTypes';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';
import cx from '@commonUtils/cx';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

export const WalletGuideTutorialTabs = () => {
  const currentTutorialsTab = useWalletGuidePageStore(
    (state) => state.currentTutorialsTab
  );
  const { handleWalletGuidePageClick } = useWalletGuidePageActions();
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        // 'bg-blue-500',
        'flex justify-between items-center',
        'py-2.5 gap-4',
        'text-center text-base font-medium bgi-text-[var(--grayscale-100)]'
      )}
    >
      <div
        className={cx('cursor-pointer w-full', {
          'bgi-text-[var(--base-1-main)] border-b-[2px] bgi-border-b-[var(--base-1-main)]':
            currentTutorialsTab === WalletGuideTutorialsType.VIDEO,
        })}
        onClick={() => {
          handleWalletGuidePageClick({
            actionName: handleWalletGuidePageTabSelected,
            payload: { tab: WalletGuideTutorialsType.VIDEO },
          });
        }}
      >
        <p className="my-2.5">
          {renderI18N({ i18nKey: 'watch_learn_view_video_tutorials_page' }, t)}
        </p>
      </div>

      <img
        className="h-5 w-[5px]"
        alt={'tab_bar_divider'}
        src={getImgUrl(EResourceLevel.V, 'tab_bar_divider')}
      />

      <div
        className={cx('cursor-pointer w-full', {
          'bgi-text-[var(--base-1-main)] border-b-[2px] bgi-border-b-[var(--base-1-main)]':
            currentTutorialsTab === WalletGuideTutorialsType.GRAPHIC,
        })}
        onClick={() => {
          handleWalletGuidePageClick({
            actionName: handleWalletGuidePageTabSelected,
            payload: { tab: WalletGuideTutorialsType.GRAPHIC },
          });
        }}
      >
        <p className="my-2.5">
          {renderI18N({ i18nKey: 'watch_learn_view_graphic_tutorial_page' }, t)}
        </p>
      </div>
    </div>
  );
};

export default WalletGuideTutorialTabs;
