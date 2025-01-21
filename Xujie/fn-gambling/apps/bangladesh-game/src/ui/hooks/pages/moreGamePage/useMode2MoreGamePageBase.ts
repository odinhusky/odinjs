import { usePostGameSearchMutation } from '@mode2/external/api';
import queryString from 'query-string';
import { useLocation } from 'react-router';

import {
  useMoreGamePageRefsStore,
  useMoreGamePageStoreStore,
} from '@mode2/zustand/page/moreGamePage';
import { useBreakPoint, useDeepEffect } from '@commonUtils/hooks';
import { useEffect, useRef } from 'react';
import useMoreGamePageHeaderSetting from './useMoreGamePageHeaderSetting';
import useMoreGamePageFooterSetting from '@/ui/hooks/pages/moreGamePage/useMoreGamePageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

interface MoreGamePageParams {
  manufacturer: string;
  manufacturerLogoUrl: string;
  type: string;
}

const defaultParams: MoreGamePageParams = {
  manufacturer: '',
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
      return {
        ...defaultParams,
        ...parsedParams,
      } as MoreGamePageParams;
    }
    return defaultParams;
  };
  /**
   * 避免還沒set好之前都是false的情況會直接拿mobile的page size去打API
   * 導致之後breakpoint設定好時,會進到 ”gameSearchResult.length < pageSize“ 判斷中,造成init完就無法再動態載入
   */
  const isBreakPointFlagLoaded = isMobile || isTablet || isDesktop;
  const search = getParams();

  const setManufacturer = useMoreGamePageStoreStore(
    (state) => state.setManufacturer
  );

  const setManufacturerLogoUrl = useMoreGamePageStoreStore(
    (state) => state.setManufacturerLogoUrl
  );

  useEffect(() => {
    if (search.manufacturer) setManufacturer(search.manufacturer);
    if (search.manufacturerLogoUrl)
      setManufacturerLogoUrl(search.manufacturerLogoUrl);
  }, [search.manufacturer, search.manufacturerLogoUrl]);

  const ref = useRef<HTMLDivElement | null>(null);
  const setMoreGamePageContainerRef = useMoreGamePageRefsStore(
    (state) => state.setMoreGamePageContainerRef
  );

  useEffect(() => {
    setMoreGamePageContainerRef(ref);
  }, []);

  const [postGameSearch, { data: gameSearchResult }] =
    usePostGameSearchMutation();

  const setMoreGameList = useMoreGamePageStoreStore(
    (state) => state.setMoreGameList
  );

  const allLoaded = useMoreGamePageStoreStore((state) => state.allLoaded);

  const setAllLoaded = useMoreGamePageStoreStore((state) => state.setAllLoaded);

  const page = useMoreGamePageStoreStore((state) => state.page);

  const setPage = useMoreGamePageStoreStore((state) => state.setPage);

  const pageSize = (isDesktop ? 18 : isTablet ? 12 : 9) * 2;
  const initData = (page: number) => {
    if (allLoaded) return;
    postGameSearch({
      gameName: '',
      gameType: +search.type,
      limit: pageSize,
      manufacturer: search.manufacturer,
      page: page,
    });
  };

  // $ Init API
  useDeepEffect(() => {
    if (isBreakPointFlagLoaded) {
      initData(1);
    }

    return () => {
      setPage(1);
      setMoreGameList([]);
      setAllLoaded(false);
    };
  }, [isBreakPointFlagLoaded]);

  // $ 依照 page 變化打 API
  useEffect(() => {
    if (page >= 2) initData(page);
  }, [page]);

  useDeepEffect(() => {
    if (gameSearchResult && isBreakPointFlagLoaded) {
      if (gameSearchResult.length === 0) {
        setAllLoaded(true);
      } else if (gameSearchResult.length < pageSize) {
        if (page === 1) setMoreGameList(gameSearchResult);
        if (page > 1) setMoreGameList((prev) => [...prev, ...gameSearchResult]);

        setAllLoaded(true);
      } else {
        setMoreGameList((prev) => [...prev, ...gameSearchResult]);
      }
    }
  }, [gameSearchResult, pageSize, isBreakPointFlagLoaded]);

  // ==== MoreGamePage Header Setting
  useMoreGamePageHeaderSetting();

  // ==== MoreGamePage Footer Setting
  useMoreGamePageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useMode2MoreGamePageBase;
