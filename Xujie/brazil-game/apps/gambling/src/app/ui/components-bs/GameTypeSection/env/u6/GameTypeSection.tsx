import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { GameItem, IGameTypeSection, IGameTypeSectionList } from '../..';
import { NoData } from '../../../Table/env/u6/NoData';
import { environment } from '../../../../../../environments/environment';
import { CellGameItem } from './CellGameItem';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';
import cx from '../../../../utils/cx';
import React, { useEffect, useState } from 'react';
import { SectionLabel } from './SectionLabel';
import styled from 'styled-components';

export const GameListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 3fr));
  grid-template-rows: repeat(auto-fill, minmax(80px, 3fr));
  gap: 16px;
  margin-top: 8px;
  justify-content: flex-start;

  @media (min-width: 767.1px) {
    grid-template-columns: repeat(5, minmax(100px, 5fr));
    grid-template-rows: repeat(auto-fill, minmax(100px, 5fr));
    margin-top: 16px;
  }

  @media (min-width: 1439.1px) {
    grid-template-columns: repeat(6, minmax(150px, 6fr));
    grid-template-rows: repeat(auto-fill, minmax(150px, 6fr));
    margin-top: 12px;
  }
`;

const FavoriteNoData = () => {
  return (
    <div
      className={cx(
        'w-full text-[var(--grayscale-60)] mt-3',
        ' text-base tablet:text-2xl'
      )}
    >
      <div className={cx()}>
        <div className={cx('flex flex-col items-center')}>
          <img
            className={cx('h-[160px] tablet:h-[200px]')}
            src={`assets/${environment.uVersion}/noData.png`}
            alt={'NoData'}
          />
          <div>{'Nada aqui'}</div>
        </div>
        {/*<div className='text-[var(--secondary-main)] text-center'>*/}
        {/*    {'Clique no coração no canto superior direito do jogo para adicioná-lo à sua coleção!'}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

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
  const firstPageSize: number = 16;
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
      ? `assets/${environment.uVersion}/${
          environment.mVersion
        }/icon_${gameTypeName.toLowerCase()}.png`
      : `assets/shared/${gameTypeName.split('-')[0]}-logo.png`;

  // 初始 isFinalScreen PC & 平板 分頁邏輯
  useEffect(() => {
    setPage(firstPageSize);
  }, [gameTypeName]);

  return (
    <section className={cx('mt-5', { 'flex flex-col': !isLatestItem })}>
      <div className={cx('flex justify-between items-center')}>
        <SectionLabel
          label={gameTypeName}
          className={cx(
            'cursor-default gap-x-2',
            'text-sm font-bold text-[var(--grayscale-100)]',
            'mobile:text-base',
            'tablet:text-2xl'
          )}
          iconClassName={cx(labelIconClassName)}
          iconSrc={labelIconSrc}
        />

        {!isFinalScreen && (
          <button
            className={cx(
              'linear-2-button',
              'flex flex-row justify-center items-center gap-x-2 py-2 px-3',
              'text-[var(--grayscale-100)]',
              'text-sm font-medium',
              'mobile:text-base mobile:px-5'
            )}
            onClick={onClickExpand && onClickExpand}
          >
            {'Ver Tudo'}

            <img
              alt={'arrow-right'}
              className={cx('w-4 h-4 mobile:w-5 mobile:h-5')}
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </button>
        )}
      </div>

      {displayedItems?.length === 0 ? (
        isFavoritos ? (
          <FavoriteNoData />
        ) : (
          <NoData />
        )
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
            'flex flex-col justify-center items-center gap-y-2 mt-4',
            'text-sm text-[var(--grayscale-100)]',
            'mobile:text-[18px] mobile:mt-10'
          )}
        >
          {`Displaying ${showItems.length} of ${displayedItems.length} games`}

          {showItems.length < displayedItems.length && (
            <button
              className={cx(
                'linear-3-button',
                'flex flex-row justify-center items-center gap-x-1 py-2 px-10',
                'text-sm font-medium',
                'mobile:gap-x-2 mobile:text-base mobile:px-[84px]'
              )}
              onClick={() => {
                setPage((prevState) => prevState + loadMorePageSize);
              }}
            >
              {'Ver Mais'}

              <img
                alt={'arrow-down'}
                className={cx('w-4 h-4 mobile:w-5 mobile:h-5')}
                src={`assets/${environment.uVersion}/icon_arrow_down.png`}
              />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
