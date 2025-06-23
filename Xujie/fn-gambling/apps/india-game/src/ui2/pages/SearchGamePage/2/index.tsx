import Input from '@mode2/components/Input';
import useSearchGameHeaderOverride from './hooks/useSearchGameHeaderOverride';
import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { useGameListStore } from '@libs/mode2/zustand/gameListStore';
import NoData from '@components/NoData';
import GameItem from '@components/GameItem';
import { normalGameImgAspectClassMode3 } from '@libs/constant/gameItemRatio';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { SearchCondition, filterGameByName } from './filterGameItem';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import SearchGamePageScrollTopBtn from './components/SearchGamePageScrollTopBtn';
import useSearchGamePageStore from '@mode2/zustand/page/SearchGamePage/searchGamePageStore';

const columnCount = 3;
const columnGap = 16;
const itemPadding = 44; // 和原本 px-[44px] 對齊

export const SearchGamePage = () => {
  useSearchGameHeaderOverride();

  const currentPxTimes = useTemplateLayoutStore(
    (state) => state.currentPxTimes
  );

  const allGameListFromPostGameAllEndpoint = useGameListStore(
    (state) => state.allGameListFromPostGameAllEndpoint
  );

  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const gridRef = useRef<Grid>(null);

  const setSearchGamePageGridContainerRef = useSearchGamePageStore(
    (state) => state.setSearchGamePageGridContainerRef
  );

  // 計算何時顯示 scrollToTop
  const setIsShowSearchGamePageScrollTopBtn = useSearchGamePageStore(
    (state) => state.setIsShowSearchGamePageScrollTopBtn
  );

  const debouncedScrollHandler = useMemo(() => {
    return debounce((scrollTop: number, targetScrollHeight: number) => {
      const shouldShow = scrollTop >= targetScrollHeight;
      setIsShowSearchGamePageScrollTopBtn(shouldShow); // 不管原本是 true 還是 false，都重新 set
    }, 200);
  }, []);

  // 根據不同裝置定義的col數量平分寬度後,再透過統一的寬高比計算高度維持圖片比例
  const normalGameImgAspectClass = `${normalGameImgAspectClassMode3} object-contain`;

  // 為了防止左右的滾動事件
  useEffect(() => {
    console.log('SearchGamePage mounted');
    document.body.style.overflowX = 'hidden'; // 比 class 更直接
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  // 建立 debounced function（用 useMemo 確保只建立一次）
  const debouncedSetValue = useMemo(() => {
    return debounce((val: string) => {
      setDebouncedValue(val.trim());
    }, 500);
  }, []);

  // 設定 ref
  useEffect(() => {
    setSearchGamePageGridContainerRef(gridRef);
  }, []);

  useEffect(() => {
    debouncedSetValue(inputValue);
    return () => {
      debouncedSetValue.cancel(); // 清除 debounce 計時器
    };
  }, [inputValue, debouncedSetValue]);

  const filteredGameList = useMemo(() => {
    if (!debouncedValue) return allGameListFromPostGameAllEndpoint || [];

    return filterGameByName(
      allGameListFromPostGameAllEndpoint || [],
      debouncedValue,
      [SearchCondition.FuzzyPrecise]
    );
  }, [debouncedValue, allGameListFromPostGameAllEndpoint]);

  return (
    <div className="w-full px-4 relative">
      <div
        className={cx(
          'w-full',
          'bgi-[var(--base-2-variant5)]',
          'absolute top-0 left-0 z-[5]'
        )}
      >
        {/* 搜尋框 */}
        <div className={cx('w-full', 'h-10')}>
          <Input
            type="en_alnum_with_space"
            maxLength={32}
            styles={{
              inputPrefix: '!bgi-border-[var(----transparent-white-10)]',
              containerDiv:
                '!py-[10px] !px-3 !bgi-[var(--base-2-variant6)] !rounded-md',
              inputBox: 'h-[20px]',
              input: cx('type2'),
            }}
            placeholder={{
              // TODO Odin I18N
              i18nKey: 'Find your favorite game',
            }}
            suffix={
              <div className={cx('phone-prefix text-sm', FLEX_ITEMS_CENTER)}>
                <Icon name="ic_search_white" className="w-6 h-6" />
              </div>
            }
            onChange={(value) => {
              setInputValue(value);
            }}
            value={inputValue}
          />
        </div>

        <div
          className={cx('mt-3', 'hidden', {
            block: debouncedValue && filteredGameList.length > 0,
          })}
        >
          <span className="text-sm bgi-text-[var(--grayscale-100)]">
            Search results for the term “
            <span className="bgi-text-[var(--base-1-main)]">
              {debouncedValue}
            </span>
            ” are:
          </span>
        </div>
      </div>

      {/* 顯示的內容 */}
      <div
        className={cx('overflow-y-auto', 'relative')}
        style={{
          // Input + hint text + spacing
          paddingTop: `${(40 + 21 + 12) * currentPxTimes}px`,
          height: `calc(100vh - ${
            // header + page padding-bottom
            (80 + 12) * currentPxTimes
          }px)`,
        }}
      >
        {/* ScrollToTop Button */}
        <SearchGamePageScrollTopBtn />

        <div
          className={cx('mt-[78.5px] hidden', {
            block: debouncedValue && filteredGameList.length === 0,
          })}
        >
          <NoData />
        </div>

        {/* <div className="w-full odin h-fit" > */}
        {debouncedValue && filteredGameList.length > 0 && (
          <div className="mt-2 h-full" style={{ flex: 1 }}>
            <AutoSizer>
              {({ width, height }) => {
                const gridWidth = width - itemPadding * currentPxTimes * 2;

                const itemWidth =
                  (gridWidth - columnGap * currentPxTimes * (columnCount - 1)) /
                  columnCount;

                const itemHeight =
                  Math.floor(itemWidth * 1.523) + columnGap * currentPxTimes; // 根據 aspectRatio + 文字高度

                const rowCount = Math.ceil(
                  filteredGameList.length / columnCount
                );

                return (
                  <Grid
                    ref={gridRef}
                    columnCount={columnCount}
                    columnWidth={itemWidth}
                    height={height}
                    rowCount={rowCount}
                    rowHeight={itemHeight}
                    width={width}
                    onScroll={({ scrollTop }) => {
                      const targetScrollHeight = itemHeight * 4;
                      debouncedScrollHandler(scrollTop, targetScrollHeight);
                    }}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const index = rowIndex * columnCount + columnIndex;
                      const item = filteredGameList[index];
                      const paddingX =
                        (width -
                          (columnCount * itemWidth +
                            columnGap * currentPxTimes * (columnCount - 1))) /
                        2;

                      const customLeft = `${
                        columnIndex * (itemWidth + columnGap * currentPxTimes) +
                        paddingX
                      }px`;

                      if (!item) return null;
                      return (
                        <div
                          data-width={width}
                          data-item-width={itemWidth}
                          data-grid-width={gridWidth}
                          style={{ ...style, left: customLeft }}
                        >
                          <GameItem
                            key={`${item.gameId}-${item.name}`}
                            item={item}
                            showGameName
                            isShowHoverMask
                            imageClassName={normalGameImgAspectClass}
                          />
                        </div>
                      );
                    }}
                  </Grid>
                );
              }}
            </AutoSizer>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchGamePage;
