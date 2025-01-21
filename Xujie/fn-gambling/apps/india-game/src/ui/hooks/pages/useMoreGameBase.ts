import { useBreakPoint } from '@libs/commonUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { usePostGameSearchMutation } from '@mode2API/index';

export type TMoreGameProps = { Manufacturer: string; Type: string };

export const useMoreGameBase = (props: TMoreGameProps) => {
  const { isTablet, isDesktop } = useBreakPoint();
  const [data, setData] = useState<GameListItemResult[]>([]);
  const [page, setPage] = useState<number>(1);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerGameSearch, { data: gameSearchResult }] =
    usePostGameSearchMutation();
  const pageSize = (isDesktop ? 18 : isTablet ? 12 : 9) * 2;

  const initData = (page: number) => {
    if (allLoaded) return;
    triggerGameSearch({
      gameName: '',
      gameType: +props.Type,
      limit: pageSize,
      manufacturer: props.Manufacturer,
      page: page,
    });
  };

  useEffect(() => {
    if (gameSearchResult) {
      if (gameSearchResult.length > 0) {
        setData((prevData) => [...prevData, ...gameSearchResult]);
        if (
          gameSearchResult.length < pageSize ||
          gameSearchResult.length === 0
        ) {
          setAllLoaded(true);
        }
      }
    }
  }, [gameSearchResult, page, pageSize]);

  const handleScroll = useCallback(() => {
    if (allLoaded) return;
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
    ) {
      initData(page + 1);
      setPage(page + 1);
    }
  }, [allLoaded, page]);

  useEffect(() => {
    setPage(1);
    setAllLoaded(false);
    initData(1);
  }, []);

  return {
    data,
    containerRef,
    handleScroll,
  };
};
