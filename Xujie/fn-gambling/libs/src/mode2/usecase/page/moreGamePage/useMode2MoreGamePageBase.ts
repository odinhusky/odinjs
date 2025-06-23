import { usePostGameSearchMutation } from '@mode2/external/api';
import queryString from 'query-string';
import { useLocation } from 'react-router';

import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';
import {
  useBreakPoint,
  useDeepEffect,
  useUpdateEffect,
} from '@commonUtils/hooks';
import { useEffect, useRef } from 'react';
import useMoreGamePageHeaderSetting from './useMoreGamePageHeaderSetting';
import useMoreGamePageFooterSetting from './useMoreGamePageFooterSetting';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';

interface GetGameListByPageProps {
  page: number;
}

interface MoreGamePageParams {
  manufacturer: string;
  platform: string;
  manufacturerLogoUrl: string;
  type: string;
  platformId?: number;
}

const defaultParams: MoreGamePageParams = {
  manufacturer: '',
  platform: '',
  manufacturerLogoUrl: '',
  type: '',
};

export const useMode2MoreGamePageBase = () => {
  const { isMobile, isTablet, isDesktop } = useBreakPoint();
  const location = useLocation();

  /**
   * 支援  location.state & location.search 兩種寫法
   */
  const getParams = (): MoreGamePageParams => {
    if (location.state) {
      return {
        ...defaultParams,
        ...location.state,
      } as MoreGamePageParams;
    }

    if (location.search) {
      const parsedParams = queryString.parse(location.search);
      // return {
      //   ...defaultParams,
      //   ...parsedParams,
      // } as MoreGamePageParams;

      return {
        ...defaultParams,
        manufacturer: String(parsedParams['manufacturer'] ?? ''),
        platform: String(parsedParams['platform'] ?? ''),
        manufacturerLogoUrl: String(parsedParams['manufacturerLogoUrl'] ?? ''),
        type: String(parsedParams['type'] ?? ''),
        platformId: parsedParams['platformId']
          ? Number(parsedParams['platformId'])
          : undefined,
      };
    }
    return defaultParams;
  };
  /**
   * 避免還沒set好之前都是false的情況會直接拿mobile的page size去打API
   * 導致之後breakpoint設定好時,會進到 ”gameSearchResult.length < pageSize“ 判斷中,造成init完就無法再動態載入
   */
  const isBreakPointFlagLoaded = isMobile || isTablet || isDesktop;
  const search = getParams();

  const activeManufacturer = useMoreGamePageStoreStore(
    (state) => state.activeManufacturer
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

  const ref = useRef<HTMLDivElement | null>(null);
  const setMoreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.setMoreGamePageContainerRef
  );

  const [
    postGameSearch,
    { data: gameSearchResult, isLoading: isPostGameLoading },
  ] = usePostGameSearchMutation();

  const setMoreGameList = useMoreGamePageStoreStore(
    (state) => state.setMoreGameList
  );

  const allLoaded = useMoreGamePageStoreStore((state) => state.allLoaded);

  const setAllLoaded = useMoreGamePageStoreStore((state) => state.setAllLoaded);

  const page = useMoreGamePageStoreStore((state) => state.page);

  const scrollIntersectingCount = useMoreGamePageStoreStore(
    (state) => state.scrollIntersectingCount
  );

  const setPage = useMoreGamePageStoreStore((state) => state.setPage);

  const setIsMoreGameLoading = useMoreGamePageStoreStore(
    (state) => state.setIsMoreGameLoading
  );

  const pageSize = (isDesktop ? 18 : isTablet ? 12 : 9) * 2;

  const getGameByPage = ({ page }: GetGameListByPageProps) => {
    if (allLoaded && page >= 2) return;
    postGameSearch({
      gameName: '',
      gameType: Number(search.type),
      limit: pageSize,
      manufacturer: activeManufacturer,
      page,
    });
  };

  // 設定 ref
  useEffect(() => {
    setMoreGamePageContainerRef(ref);
  }, []);

  // 設定 Loading state
  useEffect(() => {
    setIsMoreGameLoading(isPostGameLoading);
  }, [isPostGameLoading]);

  // 第一次進來透過 router 帶 options，把這個 options 內容是為目前 active 的遊戲廠商
  useEffect(() => {
    if (search.manufacturer) setActiveManufacturer(search.manufacturer);
    if (search.platform) setActivePlatform(search.platform);
    if (search.manufacturerLogoUrl)
      setActiveManufacturerLogoUrl(search.manufacturerLogoUrl);
    if (search.platformId) {
      setActivePlatformId(search.platformId);
    }
    if (search.type) {
      setActivePlatformType(Number(search.type));
    }
  }, [search.platformId, search.manufacturer, search.manufacturerLogoUrl]);

  // 透過 page 以及 activeManufacture activePlatformType pageSize 來控制拿到對應廠商的遊戲列表以及數量
  useEffect(() => {
    if (isBreakPointFlagLoaded && activeManufacturer) {
      getGameByPage({ page: 1 });
    }

    return () => {
      setPage(1);
      setMoreGameList([]);
      setAllLoaded(false);
    };
    // TODO activeManufacturer 應該要換成 activePlatformId 才對，因為 activeManufacturer 是有重複的機會，例如 platformItems 中 name="Red Tiger" 以及 name="Netent"，這兩者的 manufacture 都是 EVORT
  }, [activeManufacturer, isBreakPointFlagLoaded]);

  // 當符合滾動且 allLoad 等於 false，則變動 page state 觸發去拿下一頁的資料，滾動的 actionName 為 => handleMoreGamePageScroll
  useUpdateEffect(() => {
    if (page >= 2 && import.meta.env['VITE_V_VERSION'] !== 'v6') {
      getGameByPage({ page });
    }
  }, [page]);

  // V6 的時候配合無限滾動的 useEffect
  useUpdateEffect(() => {
    const currentPage = useMoreGamePageStoreStore.getState().page;
    const nextPage = currentPage + 1;

    console.log(
      '!! scrollIntersectingCount',
      scrollIntersectingCount,
      currentPage,
      nextPage
    );

    setPage(nextPage);
    getGameByPage({ page: nextPage });
  }, [scrollIntersectingCount]);

  // 針對 API 回來得資料做處理，並且更新 allLoaded 的邏輯
  useDeepEffect(() => {
    if (gameSearchResult && isBreakPointFlagLoaded) {
      if (gameSearchResult.length < pageSize) {
        setAllLoaded(true);
        if (page === 1) {
          setMoreGameList(gameSearchResult);
        }
        if (page > 1) setMoreGameList((prev) => [...prev, ...gameSearchResult]);
      } else {
        setAllLoaded(false);
        setMoreGameList((prev) => [...prev, ...gameSearchResult]);
      }
    }
  }, [gameSearchResult, pageSize, isBreakPointFlagLoaded]);

  // ==== MoreGamePage Header Setting
  useMoreGamePageHeaderSetting();

  // ==== MoreGamePage Footer Setting
  useMoreGamePageFooterSetting();

  // === Page FloatActionButton reset
  // usePageResetFloatActionButton();
  useMode2PageResetFloatActionButton();
};

export default useMode2MoreGamePageBase;
