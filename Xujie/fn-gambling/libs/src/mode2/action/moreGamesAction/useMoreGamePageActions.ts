import {
  handleMoreGamePageHorizonTabClick,
  handleMoreGamePageScroll,
  handleMoreGamePageVerticalSupplierTabClick,
  handleMoreGamePageScrollToTopButtonClick,
} from '@mode2/action/actionTypes';

import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import handleGlobalScroll from '../handleGlobalScroll';
import handleGlobalClick from '../handleGlobalClick';
import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';
import isNumber from 'lodash/isNumber';
import { MoreGamePageTabType } from '@libs/mode2/@types/moreGamePageTabType';

export type ActionClickPayloadMap = {
  [handleMoreGamePageScroll]: void;
  [handleMoreGamePageHorizonTabClick]: { tabName: MoreGamePageTabType };
  [handleMoreGamePageVerticalSupplierTabClick]: { item: GameListItemResult };
  [handleMoreGamePageScrollToTopButtonClick]: void;
};

export interface HandleMoreGamePageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useMoreGamePageActions = () => {
  const allLoaded = useMoreGamePageStoreStore((state) => state.allLoaded);

  const moreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.moreGamePageContainerRef
  );

  const page = useMoreGamePageStoreStore((state) => state.page);

  const setPage = useMoreGamePageStoreStore((state) => state.setPage);
  const setActiveHorizonTab = useMoreGamePageStoreStore(
    (state) => state.setActiveHorizonTab
  );

  const setActiveManufacturer = useMoreGamePageStoreStore(
    (state) => state.setActiveManufacturer
  );

  const setActivePlatform = useMoreGamePageStoreStore(
    (state) => state.setActivePlatform
  );

  const setActiveManufacturerLogoUrl = useMoreGamePageStoreStore(
    (state) => state.setActiveManufacturerLogoUrl
  );

  const setActivePlatformId = useMoreGamePageStoreStore(
    (state) => state.setActivePlatformId
  );

  const setActivePlatformType = useMoreGamePageStoreStore(
    (state) => state.setActivePlatformType
  );

  const setAllLoaded = useMoreGamePageStoreStore((state) => state.setAllLoaded);

  const handleScroll = () => {
    if (allLoaded || moreGamePageContainerRef === null) return;
    if (
      moreGamePageContainerRef.current &&
      moreGamePageContainerRef.current.scrollTop +
        moreGamePageContainerRef.current.clientHeight >=
        moreGamePageContainerRef.current.scrollHeight
    ) {
      setPage(page + 1);
    }
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleMoreGamePageScroll]: () => {
      handleGlobalScroll({
        target: handleMoreGamePageScroll,
        callback: () => {
          handleScroll();
        },
      });
    },
    [handleMoreGamePageHorizonTabClick]: ({ tabName }) => {
      handleGlobalClick({
        target: handleMoreGamePageHorizonTabClick,
        payload: { tabName },
        callback: () => {
          if (tabName) setActiveHorizonTab(tabName);
        },
      });
    },
    [handleMoreGamePageVerticalSupplierTabClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMoreGamePageVerticalSupplierTabClick,
        payload: { item },
        callback: () => {
          if (item.manufacturer) {
            setActiveManufacturer(item.manufacturer);
            setActivePlatform(item.manufacturer);
          }
          if (item.manufacturerLogoUrl)
            setActiveManufacturerLogoUrl(item.manufacturerLogoUrl);
          if (item.platformId) {
            setActivePlatformId(item.platformId);
          }
          if (isNumber(item.type)) {
            setActivePlatformType(Number(item.type));
          }
          setAllLoaded(false);
          setPage(1);
        },
      });
    },
    [handleMoreGamePageScrollToTopButtonClick]: () => {
      handleGlobalClick({
        target: handleMoreGamePageScrollToTopButtonClick,
        callback: () => {
          if (moreGamePageContainerRef && moreGamePageContainerRef?.current) {
            moreGamePageContainerRef?.current?.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        },
      });
    },
  };

  const handleMoreGamePageAction = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMoreGamePageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleMoreGamePageAction,
  };
};

export default useMoreGamePageActions;
