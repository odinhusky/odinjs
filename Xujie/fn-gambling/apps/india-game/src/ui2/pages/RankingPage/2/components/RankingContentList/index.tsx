import { cx } from '@libs/commonUtils';
import RankingContentListUnit from '../RankingContentListUnit';
import { FLEX_COL } from '@libs/constant/style';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { formatMoney } from '@libs/mode2/utils';
import { generateIsRiseProp } from '../RankingContentSummaryTop3Section';
import { useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { RankingInfoResult } from '@libs/mode2/external/api/endpoint/ranking/PostRankingOngoingEndpoint';

export const RankingContentList = () => {
  const rankingSummaryPeriodsActiveTab = useRankingPageStore(
    (state) => state.rankingSummaryPeriodsActiveTab
  );

  const otherRankings = useRankingPageStore(
    (state) => state.mainContentRankingData.otherRankings
  );

  const listContainerRef = useRef<HTMLDivElement>(null);
  const getRemPx = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [rankingSummaryPeriodsActiveTab]);

  const pageSize = 20;
  const [data, setData] = useState<RankingInfoResult[]>(
    new Array(pageSize).fill({} as RankingInfoResult)
  );

  useEffect(() => {
    if (otherRankings.length) {
      const newArr = new Array(otherRankings.length).fill(
        {} as RankingInfoResult
      );
      const insertList = otherRankings.slice(0, pageSize);
      newArr.splice(0, pageSize, ...insertList);
      setData(newArr);
    } else {
      setData([]);
    }
  }, [otherRankings, rankingSummaryPeriodsActiveTab]);

  const isItemLoaded = (index: number) => {
    const isFalse = [undefined, null, ''].includes(data[index]?.playerName);
    return index < data.length && !isFalse;
  };

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setData((prev) => {
          const next = [...prev];
          for (let idx = startIndex; idx <= stopIndex; idx++) {
            next[idx] = otherRankings[idx];
          }
          return next;
        });
        resolve();
      }, 10);
    });
  };

  const remPxRef = useRef(getRemPx());

  // 初始化监听 window resize，实时更新 rem 对应的 px
  useEffect(() => {
    const handleResize = () => {
      remPxRef.current = getRemPx();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const remToPx = (rem: number) => rem * remPxRef.current;

  // const remToPx = (rem: number) =>
  //   rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

  return (
    <div
      ref={listContainerRef}
      className={cx(
        'w-full',
        'h-[500px]',
        'overflow-y-auto',
        'bgi-[var(--base-2-variant13)]',
        'px-4 py-2',
        FLEX_COL,
        'gap-[6px]'
      )}
    >
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={data.length}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                key={remPxRef.current} // 每當 rem 改變時重新掛載 List
                className=""
                height={height}
                width={width}
                itemCount={data.length}
                itemSize={() => remToPx(4.375)} // 默认是 px, 480下，item高度64px+間距6px = 70px = 4.375rem
                itemData={data}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {({
                  index,
                  style,
                  data,
                }: {
                  index: number;
                  style: React.CSSProperties;
                  data: RankingInfoResult[];
                }) => {
                  const item = data[index];

                  const loading = [undefined, null, ''].includes(
                    data[index]?.playerName
                  );

                  // console.log('@@===> dataLength', data.length, item, loading);

                  return (
                    <div style={style} className={cx()}>
                      <RankingContentListUnit
                        key={item?.playerName + item?.currentRanking}
                        uniqueKey={item?.playerName + item?.currentRanking}
                        ranking={item?.currentRanking}
                        reward={item?.rewardRate}
                        totalBets={formatMoney({
                          value: item?.betAmount || 0,
                        })}
                        playerName={item?.playerName}
                        avatarId={item?.avatarId}
                        {...generateIsRiseProp(
                          item?.currentRanking,
                          item?.lastRanking
                        )}
                        loading={loading}
                      />
                    </div>
                  );
                }}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};

export default RankingContentList;
