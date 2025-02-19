import { Mode2GameListConfig } from '@mode2/zustand/page/hallPageStore';
import GameItem from '@components/GameItem';
import GameSupplierItem from '@components/GameSupplierItem';
import GameItemLandscape from '@components/GameItemLandscape';
import cx from '@commonUtils/cx';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { useBreakPoint, useObserverElementMetrics } from '@libs/commonUtils';
import { remToPx } from '@libs/constant/style';

import {
  casinoGameImgAspectClassMode3,
  normalGameImgAspectClassMode3,
} from '@constant/gameItemRatio';

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

  /**
   * 根據當前遊戲列表渲染不同的遊戲項目元件
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

    return (
      <div
        className={cx('grid gap-4', gridContainerClass)}
        style={{
          paddingBottom: props.isLastConfig
            ? `${(itemHeight * 3) / remToPx}rem`
            : 0,
        }}
      >
        {data.map((item: GameListItemResult, index: number) => (
          <div ref={index === 0 ? elementRef : null}>
            {renderGameItemComponent(item, props, index)}
          </div>
        ))}
      </div>
    );
  };

  return <div className={cx('mb-4 mobile:mb-5')}>{renderGrid()}</div>;
};

export default GameList;
