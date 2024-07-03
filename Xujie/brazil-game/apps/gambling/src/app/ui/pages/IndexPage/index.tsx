// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../pageTemplate/hooks/useBreakpoint';
import {
  GameItem,
  GameTypeSectionList,
} from '../../components-bs/GameTypeSection';
// import { default as data } from "../../components/GameTypeSection/mock/gameList.json";
import React, { useEffect, useState } from 'react';
import { environment } from '../../../../environments/environment';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { gameSlice } from '../../../reduxStore/gameSlice';
import { PageOrModalPathEnum } from '../../PageOrModalPathEnum';
import { useSearchGames } from '../../hooks/useSearchGames';

import { renderByUVersion } from '../../utils/renderByUVersion';
import { useScrollToPartPageTemplate } from '../../pageTemplate/hooks/useScrollToPartPageTemplate';
import { useClickFavoriteGameItem } from '../../hooks/useClickFavoriteGameItem';
import { DragScrollContainer } from '../../components/DragScrollContainer';
import { SubTabItem } from '../../components-bs/TabItem/env/u5/TabItem';

import { IndexPage as WIndexPage } from './env/wild/IndexPage';
import { IndexPage as CIndexPage } from './env/u1/IndexPage';
import { IndexPage as RIndexPage } from './env/u2/IndexPage';
import { IndexPage as PIndexPage } from './env/p1/IndexPage';
import { IndexPage as U5IndexPage } from './env/u5/IndexPage';
import { IndexPage as U6IndexPage } from './env/u6/IndexPage';
import { IndexPage as U7IndexPage } from './env/u7/IndexPage';
import U9IndexPage from './env/u9/U9IndexPage';
import { RootState } from '../../../reduxStore';

export const MobileGameNumber = 15;
export const DesktopGameNumber = 30;
export interface IndexPageProps {
  from?: PageOrModalPathEnum.GameHallPage | PageOrModalPathEnum.IndexPage;
}
export const IndexPage = (props: IndexPageProps) => {
  const dispatch = useDispatch();
  const hotBrandGameList =
    useSelector((state: any) => state.gameList.hotBrandGameList) || [];
  const allGameList =
    useSelector((state: any) => state.gameList.allGameList) || [];
  const typeGameList =
    useSelector((state: any) => state.gameList.typeGameList) || [];
  const label = useSelector((state: any) => state.gameList.label);
  const indexPagecurrentSelectLabel = useSelector(
    (state: any) => state.gameList.indexPagecurrentSelectLabel
  );
  const userFavoriteGameList = useSelector(
    (state: RootState) => state.userRecent.userFavoriteGameList
  );
  const userRecentGameList = useSelector(
    (state: RootState) => state.userRecent.userRecentGameList
  );

  const [activeTab, setActiveTab] = useState('Todos');
  const [subGameactiveTab, setSubGameActiveTab] = useState('All');
  const [expandedBrand, setExpandedBrand] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { searchResults, handleSearchGames } = useSearchGames(searchInput);
  const [maxShowItemNum, setMaxShowItemNum] = useState(0);

  const { onClickFavoriteGameItem } = useClickFavoriteGameItem();
  const navigate = useNavigate();

  useEffect(() => {
    handleSearchGames(searchInput);
  }, [searchInput]);

  // Render Todos 一開始的內容
  const renderHotBrandGameList = () => {
    return (
      hotBrandGameList !== undefined &&
      hotBrandGameList.map((i: any, index: number) => {
        const typeGame =
          typeGameList.filter((item: any) => item.gameType === i.gameType)[0] ||
          {};
        const expandCount = typeGame.data?.reduce(
          (acc: number, current: any) => acc + current.games.length,
          0
        );

        return (
          <GameTypeSectionList
            labelImgUrl={`assets/${environment.uVersion}/shared/${
              subGameactiveTab.split('-')[0]
            }-logo.png`}
            key={index}
            onClickFavoriteGameItem={onClickFavoriteGameItem}
            hotGames={true}
            isLatestItem={hotBrandGameList.length - 1 === index}
            gameTypeName={i.gameType}
            data={i.data.games}
            onClickExpand={() => {
              setActiveTab(i.gameType);
              return dispatch(
                gameSlice.actions.setIndexPagecurrentSelectLabel(i.gameType)
              );
            }}
            expandCount={expandCount}
            maxShowItemNum={maxShowItemNum}
            subGameActiveTab={subGameactiveTab}
          />
        );
      })
    );
  };
  const { showFixForIOSStickTab, scrollToCarousel, scrollToWindowTop } =
    useScrollToPartPageTemplate();

  // Render 點選其他分類以及其他子分類的內容(透過isLimited來決定要不要限制內容是否只要兩行顯示)
  const renderTypeGameList = (isLimited = true) => {
    let list: { subGameType: string; games: GameItem[] }[] = [];
    if (
      indexPagecurrentSelectLabel === 'Favoritos' ||
      activeTab === 'Favoritos'
    ) {
      // 改用 redux userRecent
      list = [{ subGameType: 'Favoritos', games: userFavoriteGameList }];
    } else if (
      indexPagecurrentSelectLabel === 'Registro' ||
      activeTab === 'Registro'
    ) {
      list = [{ subGameType: 'Registro', games: userRecentGameList }];
    } else {
      // 未使用 redux 因此去 componet status去找
      if (indexPagecurrentSelectLabel === 'nothing_select') {
        const data =
          typeGameList !== undefined &&
          typeGameList.filter((i: any) => i.gameType === activeTab)[0]?.data;
        list =
          expandedBrand !== ''
            ? data.filter((i: any) => i.subGameType === expandedBrand)
            : data;
      } else {
        const data =
          typeGameList !== undefined &&
          typeGameList.filter(
            (i: any) => i.gameType === indexPagecurrentSelectLabel
          )[0]?.data;
        list =
          expandedBrand !== ''
            ? data.filter((i: any) => i.subGameType === expandedBrand)
            : data;
      }
    }
    // 大部分版本 因為沒有二級選項可以用  subGameactiveTab 永遠都會是 All
    // 因此這部分不會一直被執行 filter
    if (subGameactiveTab !== 'All') {
      // eslint-disable-next-line array-callback-return
      const findedList = list.filter((item) => {
        if (item.subGameType === subGameactiveTab) {
          return item;
        }
      });
      list = findedList;
    }
    return (
      <div>
        {list?.map(({ subGameType, games }: any, index: number) => {
          return (
            <GameTypeSectionList
              labelImgUrl={`assets/${environment.uVersion}/shared/${
                subGameactiveTab.split('-')[0]
              }-logo.png`}
              key={index}
              onClickFavoriteGameItem={onClickFavoriteGameItem}
              isLatestItem={list.length - 1 === index}
              gameTypeName={subGameType}
              data={games}
              onClickExpand={() => {
                // 改變顯示的內容
                setExpandedBrand(subGameType);
                // 讓 tabs 的 active 改變
                setSubGameActiveTab(subGameType);
                scrollToCarousel();
              }}
              isViewAll={['Favoritos'].includes(subGameType)}
              expandedBrand={expandedBrand}
              setExpandedBrand={setExpandedBrand}
              maxShowItemNum={isLimited ? maxShowItemNum : 0}
              subGameActiveTab={subGameactiveTab}
            />
          );
        })}
      </div>
    );
  };
  const gameList = () => {
    if (searchInput !== '') {
      return searchResults.length > 0 ? (
        <GameTypeSectionList
          labelImgUrl={`assets/${environment.uVersion}/shared/${
            subGameactiveTab.split('-')[0]
          }-logo.png`}
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          isLatestItem={true}
          gameTypeName={'null'}
          data={searchResults}
          onClickExpand={() => {
            navigate(PageOrModalPathEnum.IndexSlotPage);
            scrollToWindowTop();
          }}
          maxShowItemNum={maxShowItemNum}
          subGameActiveTab={subGameactiveTab}
        />
      ) : (
        <></>
      );
    } else {
      // 未使用 redux 因此去 componet status去找
      if (indexPagecurrentSelectLabel === 'nothing_select') {
        if (activeTab === 'Todos' || activeTab === 'Salão') {
          return renderHotBrandGameList();
        } else if (activeTab !== 'Todos' && subGameactiveTab === 'All') {
          return renderTypeGameList();
        } else if (activeTab !== 'Todos' && subGameactiveTab !== 'All') {
          return renderTypeGameList(false);
        }
        // return (activeTab === "Todos" || activeTab === "Salão") ? renderHotBrandGameList() : renderTypeGameList()
      } else {
        if (
          indexPagecurrentSelectLabel === 'Todos' ||
          indexPagecurrentSelectLabel === 'Salão'
        ) {
          return renderHotBrandGameList();
        } else if (
          indexPagecurrentSelectLabel !== 'Todos' &&
          subGameactiveTab === 'All'
        ) {
          return renderTypeGameList();
        } else if (
          indexPagecurrentSelectLabel !== 'Todos' &&
          subGameactiveTab !== 'All'
        ) {
          return renderTypeGameList(false);
        }
        // return (indexPagecurrentSelectLabel === "Todos" || indexPagecurrentSelectLabel === "Salão") ? renderHotBrandGameList() : renderTypeGameList()
      }
    }
  };
  const subGameMenu = () => {
    let subGameMenuList: string[] = [];
    const data =
      typeGameList !== undefined &&
      typeGameList.filter(
        (i: any) => i.gameType === indexPagecurrentSelectLabel
      )[0]?.data;
    if (!data) {
      // 遊戲之外的東西不會有二級選項
      return null;
    }
    subGameMenuList = data.reduce(
      (acc: string[], current: { [key: string]: string }) => {
        acc.push(current.subGameType);
        return acc;
      },
      [] as string[]
    );
    return (
      <DragScrollContainer className="flex flex-row items-center bg-[var(--grayscale-20)] rounded-[100px] mt-3 md:mt-4 lg:mt-5">
        <div className="w-full flex flex-row rounded-[100px] p-1.5 lg:p-0">
          {['All', ...subGameMenuList].map((tab: string, index: number) => {
            return (
              <SubTabItem
                active={subGameactiveTab === tab}
                onClick={() => {
                  setExpandedBrand('');
                  setSubGameActiveTab(tab);
                }}
                name={tab}
                imgUrl={`assets/${environment.uVersion}/shared/${
                  tab.split('-')[0]
                }-logo.png`}
              />
            );
          })}
        </div>
      </DragScrollContainer>
    );
  };

  useEffect(() => {
    // 第二層子遊戲選單 切換遊戲大類 必須重置回ＡＬＬ
    setSubGameActiveTab('All');
    gameList();
  }, [indexPagecurrentSelectLabel]);

  useEffect(() => {
    gameList();
  }, [activeTab]);

  return renderByUVersion(
    {
      wild777bet: (
        <WIndexPage
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          allGameList={allGameList}
          label={label}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setViewType={setExpandedBrand}
          setSearchInput={setSearchInput}
          gameList={gameList}
          recentGameList={userRecentGameList}
        />
      ),
      p1: (
        <PIndexPage
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          allGameList={allGameList}
          label={label}
          activeTab={indexPagecurrentSelectLabel}
          setActiveTab={setActiveTab}
          setViewType={setExpandedBrand}
          setSearchInput={setSearchInput}
          gameList={gameList}
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          recentGameList={userRecentGameList}
        />
      ),
      u1: (
        <CIndexPage
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          allGameList={allGameList}
          label={label}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setViewType={setExpandedBrand}
          setSearchInput={setSearchInput}
          gameList={gameList}
          recentGameList={userRecentGameList}
        />
      ),
      u2: (
        <RIndexPage
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          allGameList={allGameList}
          label={label}
          activeTab={indexPagecurrentSelectLabel}
          setViewType={setExpandedBrand}
          setSearchInput={setSearchInput}
          subGameMenu={subGameMenu}
          gameList={gameList}
          recentGameList={userRecentGameList}
        />
      ),
      u5: (
        <U5IndexPage
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          allGameList={allGameList}
          // label={label}
          // activeTab={indexPagecurrentSelectLabel}
          setViewType={setExpandedBrand}
          setSearchInput={setSearchInput}
          subGameMenu={subGameMenu}
          gameList={gameList}
          recentGameList={userRecentGameList}
          setMaxShowItemNum={setMaxShowItemNum}
        />
      ),
      u6: (
        <U6IndexPage
          // subGameMenu={subGameMenu}
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          label={label}
          setViewType={setExpandedBrand}
          gameList={gameList}
          subGameactiveTab={subGameactiveTab}
          setSubGameActiveTab={setSubGameActiveTab}
          // recentGameList={userRecentGameList}
        />
      ),
      u7: (
        <U7IndexPage
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          label={label}
          setViewType={setExpandedBrand}
          gameList={gameList}
          subGameactiveTab={subGameactiveTab}
          setSubGameActiveTab={setSubGameActiveTab}
          {...props}
        />
      ),
      u9: (
        <U9IndexPage
          // subGameMenu={subGameMenu}
          showFixForIOSStickTab={showFixForIOSStickTab}
          scrollToCarousel={scrollToCarousel}
          label={label}
          setViewType={setExpandedBrand}
          gameList={gameList}
          subGameactiveTab={subGameactiveTab}
          setSubGameActiveTab={setSubGameActiveTab}
          {...props}
          // recentGameList={userRecentGameList}
        />
      ),
    },
    <CIndexPage
      onClickFavoriteGameItem={onClickFavoriteGameItem}
      showFixForIOSStickTab={showFixForIOSStickTab}
      scrollToCarousel={scrollToCarousel}
      allGameList={allGameList}
      label={label}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setViewType={setExpandedBrand}
      setSearchInput={setSearchInput}
      gameList={gameList}
      recentGameList={userRecentGameList}
    />
  );
};
