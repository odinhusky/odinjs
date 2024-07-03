import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { GameItem, IGameTypeSection, IGameTypeSectionList } from '../..';
import { NoData } from '../../../Table/env/u7/NoData';
import { environment } from '../../../../../../environments/environment';
import { CellGameItem } from './CellGameItem';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';
import cx from '../../../../utils/cx';
import { useEffect, useState } from 'react';
import { SectionLabel } from './SectionLabel';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';

export const GameListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 3fr));
  grid-template-rows: repeat(auto-fill, minmax(80px, 3fr));
  gap: 16px;
  margin-top: 8px;
  justify-content: flex-start;

  @media (min-width: 767.1px) {
    grid-template-columns: repeat(4, minmax(100px, 5fr));
    grid-template-rows: repeat(auto-fill, minmax(100px, 5fr));
    margin-top: 16px;
  }

  @media (min-width: 1439.1px) {
    grid-template-columns: repeat(6, minmax(150px, 6fr));
    grid-template-rows: repeat(auto-fill, minmax(150px, 6fr));
    margin-top: 12px;
  }
`;

export const GameTypeSection = (
  props: IGameTypeSectionList & IGameTypeSection
) => {
  const {
    isLatestItem,
    displayedItems,
    animating,
    gameTypeName,
    subGameActiveTab,
    onClickExpand,
    onClickFavoriteGameItem,
  } = props;

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );

  const { onClickGameItem } = usePageNavigate();
  // 分頁數量控制
  const firstPageSize: number = 18;
  const loadMorePageSize: number = 28;
  const [page, setPage] = useState<number>(firstPageSize);

  // 是否為一級選項
  const isGameTypeGroup: boolean = indexPagecurrentSelectLabel === 'Todos';
  // 是否為我的收藏
  const isFavoritos: boolean = gameTypeName === 'Favoritos';
  // 是否為選取遊戲類型 + 遊戲廠商
  const isFinalScreen =
    (!isGameTypeGroup && subGameActiveTab?.toLowerCase() != 'all') ||
    isFavoritos;
  const isSlotsGame: boolean = gameTypeName === 'Slots';
  const slotsMaxSize: number = isDesktop ? 24 : isTablet ? 25 : 18;
  const otherMaxSize: number = isDesktop ? 6 : isTablet ? 5 : 3;

  // 依照不同情境顯示的 item 及 數量
  const showItems: GameItem[] = !isFinalScreen
    ? displayedItems.slice(0, isSlotsGame ? slotsMaxSize : otherMaxSize)
    : isFinalScreen && !isMobile
    ? displayedItems.slice(0, page)
    : displayedItems;

  const labelIconClassName: string = isGameTypeGroup
    ? 'h-6 mobile:h-6 tablet:h-8'
    : 'h-6 mobile:h-8 tablet:h-9';

  const labelIconSrc: string =
    isGameTypeGroup || isFavoritos
      ? `assets/${environment.uVersion}/icon_${gameTypeName.toLowerCase()}.png`
      : `assets/shared/${gameTypeName.split('-')[0]}-logo.png`;

  // 初始 isFinalScreen PC & 平板 分頁邏輯
  useEffect(() => {
    setPage(firstPageSize);
  }, [gameTypeName]);
  const { onClickToGameHall } = usePageNavigate();
  const location = useLocation();
  return (
    <section className={cx('mt-5', { 'flex flex-col': !isLatestItem })}>
      <div className={cx('flex justify-between items-center')}>
        <SectionLabel label={gameTypeName} />

        {!isFinalScreen && (
          <div className="border-stroke-popup rounded-[4px]">
            <button
              className={cx(
                'btn-todos text-[var(--grayscale-100)]',
                'py-1.5 px-2',
                'text-xs font-medium'
              )}
              onClick={() => {
                //點擊展開按鈕，從首頁跳到游戲大廳
                if (location.pathname === PageOrModalPathEnum.IndexPage) {
                  const res = onClickToGameHall();
                  res && onClickExpand?.();
                } else {
                  onClickExpand?.();
                }
                window.scrollTo({
                  top:0,
                  left:0,
                })
              }}
            >
              {'Ver todos'} ({displayedItems.length})
            </button>
          </div>
        )}
      </div>

      {displayedItems?.length === 0 ? (
        <NoData className="pt-12" />
      ) : (
        <GameListContainer
          id={gameTypeName}
          className={cx(
            // 'list', // TODO check
            // 'home-game-section-container',
            { 'animate-[gameListShow_0.8s_ease]': animating && isMobile },
            { 'flex flex-row flex-wrap justify-start items-center': !isMobile }
          )}
        >
          {showItems.map((item: GameItem, index: number) => {
            return (
              <CellGameItem
                key={index}
                isLock={item.lock === true}
                gameId={Number(item.gameId)}
                name={item.name}
                imageURL={`${environment.s3URLImages}/${item.gameId}-small.png`}
                onClick={() => onClickGameItem(item)}
                onClickFavorite={() => onClickFavoriteGameItem(item)}
              />
            );
          })}
        </GameListContainer>
      )}

      {isFinalScreen && !isMobile && (
        <div
          className={cx(
            'flex flex-col justify-center items-center gap-y-2 mt-3 tablet:mt-8 mobile:mt-5',
            'text-sm text-[var(--grayscale-100)]'
          )}
        >
          {`Displaying ${showItems.length} of ${displayedItems.length} games`}

          {showItems.length < displayedItems.length && (
            <div className="border-stroke-popup rounded-[4px]">
              <button
                className={cx(
                  'btn-todos-main',
                  'py-1.5 px-2',
                  'text-xs font-medium'
                )}
                onClick={() => {
                  setPage((prevState) => prevState + loadMorePageSize);
                }}
              >
                {'Ver Mais'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
