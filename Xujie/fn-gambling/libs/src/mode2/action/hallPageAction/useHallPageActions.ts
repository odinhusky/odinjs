import {
  handleBannerClickSwipe,
  handleHallPageTabClick,
  handleMarqueeActionClick,
} from './actionType';

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

export type ActionClickPayloadMap = {
  [handleBannerClickSwipe]: {
    item: AnnouncementResult;
  };
  [handleHallPageTabClick]: { tabId: HallPageTabIDType };
  [handleMarqueeActionClick]: {
    item: BroadcastItemResult;
  };
};

export interface HandleIndexClickProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useHallPageActions = () => {
  const { onAnnouncementAction } = useAnnouncementActionBase();
  const { onHomeMarqueeAction } = useMarqueeBase();

  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const scrollContentRef = useMode2HallPageRefsStore(
    (state) => state.scrollContentRef
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

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBannerClickSwipe]: ({ item }) => {
      handleGlobalClick({
        target: handleBannerClickSwipe,
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.HOME, {
            type: item.type,
            gameObj: item.gameObj,
            linkUrl: item.linkUrl,
          });
        },
      });
    },
    [handleHallPageTabClick]: ({ tabId }) => {
      handleGlobalClick({
        target: handleHallPageTabClick,
        callback: () => {
          setCurTab(tabId);
        },
      });
    },
    [handleMarqueeActionClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMarqueeActionClick,
        callback: () => {
          onHomeMarqueeAction(item);
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
