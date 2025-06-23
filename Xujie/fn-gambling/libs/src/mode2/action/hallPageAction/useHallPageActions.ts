import {
  handleBannerClickSwipe,
  handleHallPageDepositBtnClick,
  handleHallPageTabClick,
  handleHallPageWithdrawBtnClick,
  handleMarqueeActionClick,
  handleHallPageBalanceRightArrowIconClick,
  handleHallPageFirstDepositBtnClick,
} from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';
import {
  AnnouncementResult,
  BroadcastItemResult,
} from '@mode2API/endpoint/user/PostHomeEndpoint';
import {
  HallPageTabIDType,
  useMode2HallPageRefsStore,
  useMode2HallPageTabsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useMarqueeBase } from '@mode2/action/hallPageAction/useMarqueeBase';
import {
  AnnouncementScenariosType,
  useAnnouncementActionBase,
} from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useWalletPageStore } from '@libs/mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@libs/mode2/@types/walletDashboardTypes';

export type ActionClickPayloadMap = {
  [handleBannerClickSwipe]: {
    item: AnnouncementResult;
  };
  [handleHallPageTabClick]: { tabId: HallPageTabIDType };
  [handleMarqueeActionClick]: {
    item: BroadcastItemResult;
  };
  [handleHallPageDepositBtnClick]: void;
  [handleHallPageWithdrawBtnClick]: void;
  [handleHallPageBalanceRightArrowIconClick]: void;
  [handleHallPageFirstDepositBtnClick]: void;
};

export interface HandleIndexClickProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useHallPageActions = () => {
  const { onAnnouncementAction } = useAnnouncementActionBase();
  const { onHomeMarqueeAction } = useMarqueeBase();

  const { navToWalletPage } = useNavPageClick();

  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const scrollContentRef = useMode2HallPageRefsStore(
    (state) => state.scrollContentRef
  );

  const setDisplayDashboardType = useWalletPageStore(
    (state) => state.setDisplayDashboardType
  );
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  const setFontColor = useMode2MarqueeListStore((state) => state.setFontColor);

  const startAnimation = () => {
    if (scrollContentRef) {
      const scrollContentElement = scrollContentRef.current;
      if (!scrollContentElement) return;
      scrollContentElement.classList.remove('paused');
      scrollContentElement.style.animation = 'none';
      scrollContentElement.offsetHeight;
      scrollContentElement.style.animation = '';
      scrollContentElement.classList.add('running');
    }
  };

  const updateDimensions = () => {
    if (!scrollContainerRef?.current || !scrollContentRef?.current) return;

    const scrollContainerWidth = scrollContainerRef.current.offsetWidth;
    const scrollContentWidth = scrollContentRef.current.scrollWidth / 2;
    const scrollContentElement = scrollContentRef.current;

    scrollContentElement.style.setProperty(
      '--scroll-content-width',
      `${scrollContentWidth}px`
    );
    scrollContentElement.style.setProperty(
      '--scroll-container-width',
      `${scrollContainerWidth}px`
    );
  };

  const changeColor = (color: string) => {
    setFontColor(color);
  };

  const handleNavToDepositPage = () => {
    setDisplayDashboardType(WalletDashboardType.NONE);
    setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
    navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBannerClickSwipe]: ({ item }) => {
      handleGlobalClick({
        target: handleBannerClickSwipe,
        payload: { item },
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.HOME, {
            type: item.type,
            gameObj: item.gameObj,
            linkUrl: item.linkUrl,
            mataData: item,
          });
        },
      });
    },
    [handleHallPageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleHallPageTabClick,
        payload: { tabId },
        callback: () => {
          setCurTab(tabId);
        },
      });
    },
    [handleMarqueeActionClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMarqueeActionClick,
        payload: { item },
        callback: () => {
          onHomeMarqueeAction(item);
        },
      });
    },
    [handleHallPageBalanceRightArrowIconClick]: () => {
      handleGlobalClick({
        target: handleHallPageBalanceRightArrowIconClick,
        callback: () => {
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          setDisplayDashboardType(WalletDashboardType.BALANCE);
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
        },
      });
    },
    [handleHallPageDepositBtnClick]: () => {
      handleGlobalClick({
        target: handleHallPageDepositBtnClick,
        callback: () => {
          console.log('@@@===> handleHallPageDepositBtnClick');
          handleNavToDepositPage();
        },
      });
    },
    [handleHallPageFirstDepositBtnClick]: () => {
      handleGlobalClick({
        target: handleHallPageFirstDepositBtnClick,
        callback: () => {
          console.log('@@@===> handleHallPageFirstDepositBtnClick');
          handleNavToDepositPage();
        },
      });
    },
    [handleHallPageWithdrawBtnClick]: () => {
      handleGlobalClick({
        target: handleHallPageWithdrawBtnClick,
        callback: () => {
          setDisplayDashboardType(WalletDashboardType.NONE);
          setCurSwitchContentTabId(WalletPageTabType.WITHDRAW);
          navToWalletPage('', { state: { tab: WalletPageTabType.WITHDRAW } });
        },
      });
    },
  };

  const handleHallPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleIndexClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleHallPageClick,
    startAnimation,
    changeColor,
    updateDimensions,
  };
};

export default useHallPageActions;
