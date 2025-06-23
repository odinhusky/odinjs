import {
  Mode2GameListConfig,
  useMode2HallPageDownloadBannerStore,
  useMode2HallPageGameListStore,
} from '@mode2/zustand/page/hallPageStore';
import GameItem from '@components/GameItem';
import GameItemLandscape from '@components/GameItemLandscape';
import cx from '@commonUtils/cx';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { useDeepEffect, useObserverElementMetrics } from '@libs/commonUtils';

import {
  casinoGameImgAspectClassMode3,
  normalGameImgAspectClassMode3,
} from '@constant/gameItemRatio';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import GameSupplierItem from '@components/GameSupplierItem';

export const GameList = (props: Mode2GameListConfig) => {
  const data = props.list;

  const gridCol = 'grid-cols-3';
  const gridColException = 'grid-cols-1';

  const casinoGameImgAspectClass = casinoGameImgAspectClassMode3; // 344x134(480px)
  const normalGameImgAspectClass = normalGameImgAspectClassMode3; // 109.33x153(480px)

  const gridContainerClass = props.isException ? gridColException : gridCol;
  const gameItemAspectClass = props.isException
    ? casinoGameImgAspectClass
    : normalGameImgAspectClass;

  const { elementRef, elementMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const setHallGameItemElMetrics = useMode2HallPageGameListStore(
    (state) => state.setHallGameItemElMetrics
  );

  const currentPxTimes = useTemplateLayoutStore(
    (state) => state.currentPxTimes
  );

  const shouldShowDownloadBanner = useMode2HallPageDownloadBannerStore(
    (state) => state.shouldShowDownloadBanner
  );

  useDeepEffect(() => {
    setHallGameItemElMetrics(elementRef, elementMetrics);
  }, [elementMetrics]);

  /**
   * 根據當前遊戲列表渲染不同的遊戲項目元件
   *
   *
   * @param item 遊戲項目資料
   * @param props 遊戲列表設定
   * @returns
   * - 遊戲供應商item -> GameSupplierItem
   * - 一般直向Game Item -> GameItem
   * - 橫向Game Item -> GameItemLandscape
   */
  const renderGameItemComponent = (
    item: GameListItemResult,
    props: Mode2GameListConfig,
    index: number
  ) => {
    const Component = props.isSupplierGameList
      ? GameSupplierItem
      : props.isException
      ? GameItemLandscape
      : GameItem;

    return (
      <Component
        key={index}
        item={item}
        showGameName={!!props.showGameName}
        isShowHoverMask={props.isShowHoverMask}
        imageClassName={gameItemAspectClass}
      />
    );
  };

  /** 直接展開的遊戲列表 */
  const renderGrid = (): JSX.Element => {
    const itemHeight = elementMetrics.height;
    const headerHeight = headerElMetrics.height;
    const bottomNavigationHeight = bottomNavigationElMetrics.height;
    const totalHeight =
      itemHeight * 0.8 +
      headerHeight +
      bottomNavigationHeight +
      (shouldShowDownloadBanner ? 50 * currentPxTimes : 0);

    return (
      <div
        className={cx('grid gap-4', gridContainerClass)}
        style={{
          paddingBottom: props.isLastConfig
            ? `calc(100vh - ${totalHeight - 10}px)`
            : 0,
        }}
      >
        {data.map((item: GameListItemResult, index: number) => (
          <div
            key={`GameItem - ${item.gameId} - ${item.gameName} - ${item.name} - ${item.manufacturer}`}
            ref={index === 0 ? elementRef : null}
          >
            {renderGameItemComponent(item, props, index)}
          </div>
        ))}
      </div>
    );
  };

  return <div className={cx('mb-4 mobile:mb-5')}>{renderGrid()}</div>;
};

export default GameList;
