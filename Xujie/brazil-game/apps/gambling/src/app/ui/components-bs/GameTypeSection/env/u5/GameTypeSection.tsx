import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import cx from 'classnames';

import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { GameItem, IGameTypeSection, IGameTypeSectionList } from '../..';
import { NoData } from '../../../Table/env/u2/NoData';
import { environment } from '../../../../../../environments/environment';
import { CellGameItem, CellLeaderGameItem } from './CellGameItem';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';

const FavoriteNoData = () => {
  return (
    <div className="rounded-lg w-full bg-[var(--grayscale-20)] text-[var(--grayscale-70)] p-2 md:p-5 font-medium text-sm md:text-base lg:text-xl">
      <div className="rounded-lg border border-dashed border-[var(--grayscale-70)] flex flex-col justify-center items-center p-3 md:p-4 lg:p-5">
        <div className="flex flex-col items-center py-[68px] md:py-[94px] lg:py-[154px]">
          <img
            className={'h-[64px] md:h-[104px] lg:h-[120px] mb-2'}
            alt="NoData"
            src={`assets/${environment.uVersion}/noData.png`}
          />
          <div>Nada aqui</div>
        </div>
        <div className="text-[var(--secondary-main)] text-center">
          Clique no coração no canto superior direito do jogo para adicioná-lo à
          sua coleção!
        </div>
      </div>
    </div>
  );
};

// export type GameItem = {
//   name: string;
//   imageURL?: string;
//   gameId?: string;
//   label?: string;
//   type?: string;
//   labelImgUrl?: string
// }

interface LeaderGameItem extends GameItem {
  isLeader: boolean;
  gameTypeName: string;
}

export const U5GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 3fr));
  grid-template-rows: repeat(auto-fill, minmax(80px, 3fr));
  gap: 16px;
  margin-top: 16px;
  justify-content: flex-start;

  @media (min-width: 560px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 3fr));
    grid-template-rows: repeat(auto-fill, minmax(120px, 3fr));
  }

  @media (min-width: 768px) {
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    margin-top: 24px;
  }
`;

export const GameTypeSection = (
  props: IGameTypeSectionList & IGameTypeSection
) => {
  // listSize, loadMore 原本用來限制顯示比數，但現在控制的比數的方式改為頁籤
  const { displayedItems, animating, gameTypeName } = props;
  const { isMobile } = useBreakpoint();
  const { onClickGameItem } = usePageNavigate();

  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );

  const addLeaderDisplayedItems: LeaderGameItem[] = [
    {
      gameTypeName: gameTypeName,
      isLeader: true,
    },
    ...displayedItems,
  ];

  // 依據是否有 maxShowItemNum 來限制顯示的筆數
  const maxShowItemNum = props?.maxShowItemNum ?? 0;
  const endIndex = maxShowItemNum * 2;

  // 需求修改，不分鎖定rows[2]，改鎖定筆數 max[21]，RWD自適應，手機版一率顯示 columns[3]
  // const showItems: LeaderGameItem[] = addLeaderDisplayedItems.slice(0, endIndex);
  const showItems: LeaderGameItem[] = addLeaderDisplayedItems.slice(0, 21);

  return (
    <section
      className={cx({
        'flex flex-col': !props.isLatestItem,
      })}
    >
      {/*{props.gameTypeName === 'null' ? <div></div> :*/}
      {/*  <GameTypeHeader*/}
      {/*    key={props.gameTypeName}*/}
      {/*    // gameTypeName={props.gameTypeName}*/}
      {/*    // count={props.expandCount || props.data?.length}*/}
      {/*    onClick={props.onClickExpand}*/}
      {/*    {...props}*/}
      {/*    // expandedBrand={props.expandedBrand}*/}
      {/*    // setExpandedBrand={props.setExpandedBrand}*/}
      {/*    // isViewAll={props.isViewAll}*/}
      {/*    titleClassName={'text-white font-bold text-sm md:text-lg lg:text-2xl py-2'}*/}
      {/*    buttonClassName={`bg-[var(--secondary-main)] items-center text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]  relative flex flex-row justify-center cursor-pointer  rounded-[100px]`}*/}
      {/*    seeMoreText={<></>*/}
      {/*      // <div className="flex items-center justify-center text-xs md:text-sm lg:text-base p-3 md:py-2.5 md:px-4">*/}
      {/*      //   Ver tudos*/}
      {/*      //   <img src={`assets/${environment.uVersion}/ArrowRight.png`} className="ml-1 w-[16px]"/>*/}
      {/*      // </div>*/}
      {/*    }*/}
      {/*  />*/}
      {/*}*/}
      {displayedItems?.length === 0 ? (
        props.gameTypeName === 'Favoritos' ? (
          <FavoriteNoData />
        ) : (
          <NoData />
        )
      ) : (
        <U5GameList
          className={cx('list', {
            'animate-[gameListShow_0.8s_ease]': animating && isMobile,
            'flex flex-row flex-wrap justify-start items-center': !isMobile,
          })}
        >
          {showItems
            ? showItems.map((item: LeaderGameItem, index: number) => {
                return item.isLeader ? (
                  <CellLeaderGameItem
                    key={index}
                    gameTypeName={item.gameTypeName}
                    onClick={props.onClickExpand}
                    isType={indexPagecurrentSelectLabel !== 'Todos'}
                    style={{ height: 'auto' }}
                  />
                ) : (
                  <CellGameItem
                    key={index}
                    isLock={item.lock === true}
                    gameId={Number(item.gameId)}
                    name={item.name}
                    imageURL={`${environment.s3URLImages}/${item.gameId}-small.png`}
                    onClick={() => onClickGameItem(item)}
                    onClickFavorite={() => props.onClickFavoriteGameItem(item)}
                  />
                );
              })
            : null}
        </U5GameList>
      )}
      {/* 原本有限制筆數現在不用 */}
      {
        // (props.data && listSize < props.data?.length) && props.expandedBrand &&
        //   <div className="flex-1 mt-20 justify-center flex">
        //     <LoadMoreButton onClick={loadMore}/>
        //   </div>
      }
    </section>
  );
};
