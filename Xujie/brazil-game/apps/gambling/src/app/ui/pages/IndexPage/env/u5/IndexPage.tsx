import cx from 'classnames';
// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

// import { SearchOutlined } from "@ant-design/icons";
// import {Input} from "../../../../components-bs/Inputs/Input";
// import {useNavigate} from "react-router";
import React, { useEffect, useRef } from 'react';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

import { gameSlice } from '../../../../../reduxStore/gameSlice';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { tcx } from '../../../../utils/tcx';
import { RecentGameItem } from '../../../../components-bs/RecentGameListItem';
import { GameListSection } from '../../../../modals/GameSearchModal/components/GameListSection';
import { environment } from '../../../../../../environments/environment';
import { IndexTabs } from './IndexTabs';
import AppCarouselItem from './AppCarouselItem';
import { IconTooltip } from '../../../../../ui/components/Tooltips/IconTooltip';

import { isEmpty } from 'lodash';

export type TTotalFavoriteLocalState = {
  local: { [key: number]: number[] };
  localArr: {
    [key: number]: {
      gameId: number;
      name: string;
      img: string;
      label: string;
      type: string;
    }[];
  };
};

type IIndexPage = {
  subGameMenu: any;
  allGameList: any;
  // label: any;
  // activeTab: any;
  setViewType: (value: any) => void;
  setSearchInput: (value: any) => void;
  gameList: any;
  showFixForIOSStickTab: boolean;
  scrollToCarousel: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
  recentGameList: GameItem[];
  setMaxShowItemNum: (value: any) => void;
};

interface ItemFlex {
  [key: number]: number;
}

export const IndexPage = ({
  subGameMenu,
  allGameList,
  // label,
  // activeTab,
  setViewType,
  setSearchInput,
  gameList,
  scrollToCarousel,
  showFixForIOSStickTab,
  onClickFavoriteGameItem,
  recentGameList,
  setMaxShowItemNum,
}: IIndexPage) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  const { onClickToSearch, onClickGameItem } = usePageNavigate();

  useEffect(() => {
    // 初始化 使用 redux
    if (indexPagecurrentSelectLabel === 'nothing_select') {
      dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel('Todos'));
    }
  });

  // useEffect(() => {
  //   setViewType('')
  // }, [activeTab]);

  const handleToSearchPage = () => {
    if (isLogin) {
      onClickToSearch();
    }
  };

  const DesktopXPadding = '!pl-12 !pr-[90px]';
  // const iconsMap: { [key: string]: string } = {
  //   "Todos": todos,
  //   "Viver": viver,
  //   "Vivo": vivo,
  //   "Slots": slots,
  //   "Fishing": fishing,
  //   "Favoritos": favorite,
  //   "Recente": recent
  // }
  const recentGameListRender = (recentGameList: GameItem[]) => {
    if (!isEmpty(recentGameList)) {
      return (
        <>
          {/* 第一個時間icon的空格，不包在裡面 IconTooltip 無法被 DragScrollContainer認識給予寬度 */}
          <IconTooltip
            id={`recent-games-tooltip-start`}
            content=""
            className="cursor-default"
            icon={
              <>
                <div
                  className="
                  w-[40px] h-[40px] 
                  md:w-[48px] md:h-[48px] 
                  lg:w-[64px] lg:h-[64px] 
                  rounded-2xl
                  bg-[var(--grayscale-20)] 
                  flex justify-center items-center
                  mr-2
                "
                >
                  <img
                    className="w-[21px] h-[21px]"
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_recent.png`}
                    alt="Recent Image"
                  />
                </div>
              </>
            }
          />

          {/* 最近瀏覽的遊戲 */}
          {recentGameList.map((gameItem) => (
            <IconTooltip
              key={gameItem.gameId}
              tooltipStyle={{
                background: 'var(--grayscale-40)',
                borderRadius: '8px',
                padding: '4px 8px',
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                wordWrap: 'break-word',
              }}
              id={`recent-games-tooltip-${gameItem.gameId}`}
              place="top"
              icon={
                <>
                  <RecentGameItem
                    className="
                          w-[40px] h-[40px] 
                          md:w-[48px] md:h-[48px] 
                          lg:w-[64px] lg:h-[64px]
                          hover:scale-[1.125]
                          mr-2
                        "
                    imgClassName="
                          rounded-lg
                          hover:blur-[0px] group-hover:blur-[0px] hover:brightness-[1] group-hover:brightness-[1]
                          active:blur-[0px] group-active:blur-[0px] active:brightness-[1] group-active:brightness-[1]
                        "
                    isShowHoverBtn={false}
                    gameId={Number(gameItem.gameId)}
                    onClick={() => onClickGameItem(gameItem)}
                  />
                </>
              }
              content={`${gameItem.name}`}
            />
          ))}
        </>
      );
    } else {
      return <></>;
    }
  };

  const indexPagecurrentSelectLabel = useSelector(
    (state: any) => state.gameList.indexPagecurrentSelectLabel
  );
  const isFixedGameTypeTabs = showFixForIOSStickTab && !isDesktop;

  // # 計算單一 row 最多顯示幾筆遊戲
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ITEM_WIDTH = 120;
  const ITEM_GAP = 16;
  // 不同的個數的最大展延px數
  const ITEM_FLEX: ItemFlex = {
    2: 67.5,
    3: 35,
    4: 33.75,
    5: 27,
    6: 22.5,
    7: 20,
    8: 16.75,
    9: 14.8,
    10: 15,
    11: 12.27,
    12: 11.25,
    13: 10,
    14: 9.5,
    15: 9,
    16: 8.1,
    17: 7.9,
    18: 7.4,
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          // console.log('@@ Width changed:', entry.contentRect.width);
          const containerWidth = entry.contentRect.width;
          const maxItemNum = Math.floor(containerWidth / ITEM_WIDTH);
          const maxGapNum = (maxItemNum - 1) * ITEM_GAP; // 所有 gap 總和
          const appendix = ITEM_FLEX[maxItemNum] ?? 0; // 補數 for 單一遊戲最大寬高計算
          const minTotal = maxGapNum + maxItemNum * ITEM_WIDTH;
          const maxTotal = maxGapNum + maxItemNum * (ITEM_WIDTH + appendix);
          let shouldShowItemsNum =
            containerWidth >= minTotal && containerWidth < maxTotal
              ? maxItemNum
              : maxItemNum >= 13
              ? maxItemNum - 2
              : maxItemNum - 1;

          // console.log('@@ containerWidth', containerWidth)
          // 根據實際狀況調整 Start
          const screenWidth = window.innerWidth;
          if (containerWidth >= 2760 && containerWidth <= 2839)
            shouldShowItemsNum = 20;
          if (containerWidth >= 2640 && containerWidth <= 2703)
            shouldShowItemsNum = 19;
          if (containerWidth >= 2520 && containerWidth <= 2567)
            shouldShowItemsNum = 18;
          if (containerWidth >= 2400 && containerWidth <= 2431)
            shouldShowItemsNum = 17;
          if (containerWidth >= 2280 && containerWidth <= 2295)
            shouldShowItemsNum = 16;
          if (containerWidth >= 2024 && containerWidth <= 2039)
            shouldShowItemsNum = 15;
          if (containerWidth >= 1888 && containerWidth <= 1919)
            shouldShowItemsNum = 14;
          if (containerWidth >= 1752 && containerWidth <= 1799)
            shouldShowItemsNum = 13;
          if (containerWidth >= 1616 && containerWidth <= 1679)
            shouldShowItemsNum = 12;
          if (containerWidth >= 1440 && containerWidth <= 1479)
            shouldShowItemsNum = 10;
          if (containerWidth >= 1320 && containerWidth <= 1343)
            shouldShowItemsNum = 9;
          if (containerWidth >= 1200 && containerWidth <= 1207)
            shouldShowItemsNum = 8;
          if (screenWidth < 560) shouldShowItemsNum = 3;
          // 根據實際狀況調整 End

          setMaxShowItemNum(shouldShowItemsNum);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <PageContainer className="pb-0 lg:max-w-full">
      <div id={'app-carousel'} ref={containerRef} className="">
        <AppCarouselItem />
      </div>

      <div
        className={cx('z-[2] pt-3 md:pt-6', {
          'sticky top-0 left-0 right-0': isFixedGameTypeTabs,
        })}
      >
        {/* 第一層 tab - 遊戲分類 */}
        <div
          id={'index-tabs'}
          className={'flex flex-row justify-between items-center'}
        >
          <IndexTabs
            // label={label}
            // activeTab={activeTab}
            setViewType={setViewType}
          />

          {/* 原先的搜尋框 */}
          {/* {isDesktop && (
          <div className="ml-4 shirnk-0 grow-0 basis-[200px] min-w-[200px]"
               onClick={() => dispatch(appSlice.actions.setShowGameSearchModal(true))}
          >
            <Input
              disable={true}
              pureContainer={true}
              className={cx(
                "p-2.5 text-sm rounded-lg h-[40px] flex items-center",
                "!border-[var(--grayscale-30)] bg-[var(--grayscale-10)]"
              )}
              inputClassName={"text-sm placeholder:text-[var(--grayscale-70)] placeholder:text-sm placeholder:items-center"}
              placeholder={"Procurar"}
              prefix={<SearchOutlined className={cx("text-lg mr-1", "text-[var(--grayscale-70]")}/>}
            />
          </div>
          )} */}
        </div>

        {/* 第二層 tabs - 遊戲廠商 */}
        {subGameMenu()}
      </div>

      {/* 歷史瀏覽紀錄 */}
      {recentGameList.length > 0 ? (
        <div className={cx('overflow-hidden pt-3.5 md:-mb-0.5 lg:pb-0.5')}>
          <GameListSection
            className="mb-0 md:mb-0 lg:mb-0 pl-0 px-0"
            title=""
            // title={(
            //   <div className='flex items-center gap-2 font-bold'>
            //     {
            //       (
            //         <img className='w-6 h-6'
            //              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_recent.png`}
            //              alt="recentIcon"/>
            //       )
            //     }
            //     <div className='text-xl text-white'>Recente</div>
            //     <div className='text-sm text-[var(--secondary-assistant)]'>+{recentGameList.length}</div>
            //   </div>
            // )}
            isShowHeader={false}
            children={recentGameListRender(recentGameList)}
            gameListClassName={tcx(
              'animate-[recentGameListShow_0.8s_ease] py-1.5'
            )}
          />
        </div>
      ) : null}

      <div
        id={'game-list'}
        className={cx('pb-16 pt-0 lg:max-w-full', {
          'mt-4 lg:mt-5': indexPagecurrentSelectLabel === 'Favoritos',
        })}
      >
        {/* 每個選項的渲染 */}
        {gameList()}
      </div>
    </PageContainer>
  );
};
