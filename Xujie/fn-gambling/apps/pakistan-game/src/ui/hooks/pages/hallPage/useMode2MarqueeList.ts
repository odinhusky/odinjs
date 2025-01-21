import { useDeepEffect } from '@commonUtils/hooks';
import useHallPageActions from '@mode2/action/hallPageAction/useHallPageActions';
import {
  BroadcastItem,
  useMode2HallPageRefsStore,
  useMode2MarqueeActionsStore,
  useMode2MarqueeListStore,
} from '@mode2/zustand/page/hallPageStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { useEffect, useRef } from 'react';
import { getRandomColor } from './data/marQueueListColors';
import { isArray, isEmpty, isNil } from 'lodash';
import { BroadcastItemResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { handleMarqueeActionClick } from '@mode2/action/hallPageAction/actionType';

export const useMode2MarqueeList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { startAnimation, changeColor, updateDimensions, handleHallPageClick } =
    useHallPageActions();

  const broadcastItems = usePlatformNotifyStore(
    (state) => state.broadcastItems
  );

  const setMarqueeList = useMode2MarqueeListStore(
    (state) => state.setMarqueeList
  );

  const setMarqueeActionList = useMode2MarqueeActionsStore(
    (state) => state.setMarqueeActionList
  );

  const scrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.scrollContainerRef
  );

  const scrollContentRef = useMode2HallPageRefsStore(
    (state) => state.scrollContentRef
  );

  const setScrollContainerRef = useMode2HallPageRefsStore(
    (state) => state.setScrollContainerRef
  );

  const setScrollContentRef = useMode2HallPageRefsStore(
    (state) => state.setScrollContentRef
  );

  // 設定 Ref
  useEffect(() => {
    setScrollContainerRef(containerRef);
    setScrollContentRef(contentRef);
  }, []);

  // 跑馬燈換顏色
  useEffect(() => {
    updateDimensions();
    startAnimation();
    const timerId = setInterval(() => {
      changeColor(getRandomColor());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [scrollContainerRef?.current, scrollContentRef?.current]);

  useDeepEffect(() => {
    // 過濾出跑馬燈用的資料
    // const itemList = (homeInfo.broadcastJson as BroadcastItemResult[]) || [];

    if (isNil(broadcastItems)) return;

    let list: BroadcastItem[] = [];
    let actionList: (() => void)[] = [];

    if (broadcastItems && isArray(broadcastItems) && !isEmpty(broadcastItems)) {
      const cloneBannerList = broadcastItems.map(
        (item: BroadcastItemResult) => {
          return {
            ...item,
          };
        }
      );

      list = cloneBannerList;

      actionList = cloneBannerList.map((item) => () => {
        handleHallPageClick({
          actionName: handleMarqueeActionClick,
          payload: {
            item,
          },
        });
      });
    }
    
    setMarqueeList(list);
    setMarqueeActionList(actionList);
  }, [broadcastItems]);
};

export default useMode2MarqueeList;
