// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

import React, { HTMLAttributes, ReactNode, useEffect } from 'react';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

import { gameSlice } from '../../../../../reduxStore/gameSlice';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { environment } from '../../../../../../environments/environment';

import AppCarouselItem from './AppCarouselItem';
import { IndexTabs } from './IndexTabs';
import { CellGameItem } from '../../../../components-bs/GameTypeSection/env/u7/CellGameItem';
import cx from '../../../../utils/cx';
import { IndexPageProps } from '../..';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { BackNavigation } from '../../../../components-bs/BackNavigation/BackNavigation';
import { AddToMobileShortcut } from '../../../../popovers/AddToMobileShortcut/env/u7';
import useShowShortcut from '../../../../popovers/AddToMobileShortcut/hooks/useShowShortcut';
import { U7WidthContainer } from '../../../../components-bs/PageContainer/env/u7/PageContainer';
import { tcx } from '../../../../utils/tcx';
import { useLocation } from 'react-router';
type IIndexPage = {
  showFixForIOSStickTab: boolean;
  scrollToCarousel: () => void;
  label: any;
  subGameactiveTab: string;
  setSubGameActiveTab: (value: any) => void;
  setViewType: (value: any) => void;
  gameList: any;
} & IndexPageProps;

export const IndexPage = (props: IIndexPage) => {
  const {
    setViewType,
    gameList,
    showFixForIOSStickTab,
    subGameactiveTab,
    setSubGameActiveTab,
    from = PageOrModalPathEnum.IndexPage,
  } = props;
  const isFromGameHallPage = from === PageOrModalPathEnum.GameHallPage;
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const dispatch = useDispatch();
  const { onClickToIndex, onClickGameItem } = usePageNavigate();

  const userRecentGameList = useSelector(
    (state: RootState) => state.userRecent.userRecentGameList
  );
  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  useEffect(() => {
    // 初始化 使用 redux
    if (indexPagecurrentSelectLabel === 'nothing_select') {
      dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel('Todos'));
    }
  });

  const recentGameListRender = (recentGameList: GameItem[]) => {
    if (recentGameList.length > 0) {
      return recentGameList.map((gameItem) => (
        <CellGameItem
          gameId={Number(gameItem.gameId)}
          isLock={gameItem.lock === true}
          imageURL={''}
          name={gameItem.name}
          isRecent={true}
          className={cx('w-[52px] mobile:w-[112px]')}
          onClick={() => onClickGameItem(gameItem)}
        />
      ));
    } else {
      return <div></div>;
    }
  };

  const isShowShortcut = useShowShortcut();
  useEffect(() => {
    if (isFromGameHallPage) return;
    dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel('Todos'));
  }, []);
  return (
    <div
      id={'index-page'}
      className={tcx(['pt-16', isShowShortcut && !isDesktop])}
      style={{
        backgroundImage: `url(assets/${environment.uVersion}/${environment.mVersion}/home_background.png)`,
        backgroundSize: '100% auto',
      }}
    >
      <div className="sticky z-[1001] mobile:top-16 top-[59px]">
        {isFromGameHallPage && (
          // --transparent-black-70
          <U7WidthContainer className="bg-[var(--transparent-black-90)]">
            <BackNavigation
              className="!px-0"
              style={{
                background: 'none',
                width: `auto`,
                marginLeft: 0,
              }}
              onClick={() => {
                onClickToIndex();
              }}
            />
          </U7WidthContainer>
        )}
        {/* 遊戲選項 */}
        {/* ㄧ級選項 + 搜索遊戲 + 二級選項 */}
        {/*  登入 or PC 才顯示  */}
        {(isDesktop || (!isDesktop && isLogin && isFromGameHallPage)) && (
          <IndexTabs
            subGameactiveTab={subGameactiveTab}
            setSubGameActiveTab={setSubGameActiveTab}
            setViewType={setViewType}
          />
        )}
      </div>

      <PageContainer>
        {/* 添加到桌面-通知 */}
        {isShowShortcut && isDesktop && (
          <AddToMobileShortcut className="mt-3 mb-5" />
        )}

        {/* 首頁輪播 */}
        {!isFromGameHallPage && (
          <div id={'app-carousel'}>
            <AppCarouselItem />
          </div>
        )}

        {/* 歷史瀏覽紀錄 */}
        {/* {userRecentGameList.length > 0 && (
          <GameListSection
            className={"flex flex-col w-full mb-0 md:mb-0 lg:mb-0 mt-5"}
            title={
              <div className="flex items-center gap-2">
                <div
                  className={cx(
                    "text-linear font-bold",
                    "text-lg"
                  )}
                >
                  {`Recente +${userRecentGameList.length}`}
                </div>
              </div>
            }
            isShowHeader
            headerClassName={cx("mb-0 sm:mb-0 pl-0 py-0")}
            children={recentGameListRender(userRecentGameList)}
            gameListClassName={cx(
              "gap-x-2 pt-2 mobile:pt-3 animate-[recentGameListShow_0.8s_ease] p-2.5 -m-2.5 mt-0"
            )}
          />
        )} */}

        {/* 每個選項的渲染 */}
        {gameList()}
      </PageContainer>
    </div>
  );
};
