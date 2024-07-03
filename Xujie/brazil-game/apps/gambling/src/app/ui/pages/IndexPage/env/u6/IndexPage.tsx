// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

import React, { useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

import { gameSlice } from '../../../../../reduxStore/gameSlice';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { GameListSection } from '../../../../modals/GameSearchModal/components/GameListSection';
import { environment } from '../../../../../../environments/environment';

import { appSlice } from '../../../../../reduxStore/appSlice';
import AppCarouselItem from './AppCarouselItem';
import { IndexTabs } from './IndexTabs';
import { CellGameItem } from '../../../../components-bs/GameTypeSection/env/u6/CellGameItem';
import cx from '../../../../utils/cx';

type IIndexPage = {
  showFixForIOSStickTab: boolean;
  scrollToCarousel: () => void;
  label: any;
  subGameactiveTab: string;
  setSubGameActiveTab: (value: any) => void;
  setViewType: (value: any) => void;
  gameList: any;
};

export const IndexPage = (props: IIndexPage) => {
  const {
    setViewType,
    gameList,
    showFixForIOSStickTab,
    subGameactiveTab,
    setSubGameActiveTab,
  } = props;
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const dispatch = useDispatch();
  const { onClickGameItem } = usePageNavigate();
  const { userRecentGameList } = useSelector(
    (state: RootState) => state.userRecent
  );
  const { indexPagecurrentSelectLabel } = useSelector(
    (state: RootState) => state.gameList
  );
  const isFixedGameTypeTabs = showFixForIOSStickTab && !isDesktop;

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
          isLock={gameItem.lock === true}
          gameId={Number(gameItem.gameId)}
          imageURL={''}
          name={''}
          isRecent={true}
          className={cx('w-[52px] mobile:w-[112px]')}
          onClick={() => onClickGameItem(gameItem)}
        />
      ));
    } else {
      return <div></div>;
    }
  };

  return (
    <PageContainer id={'index-page'} className="pb-10 mb-0 tablet:pt-2.5">
      {/* 首頁輪播 */}
      <div
        id={'app-carousel'}
        className={cx(
          '-ml-0 -mr-4',
          'mobile:-ml-0 mobile:-mr-8',
          'tablet:-ml-0 tablet:-mr-0'
        )}
      >
        <AppCarouselItem />
      </div>

      {/* 遊戲選項 */}
      {/* ㄧ級選項 + 搜索遊戲 + 二級選項 */}
      <IndexTabs
        className={cx({
          'z-10 sticky top-16 left-0 right-0 pt-1 bg-[var(--grayscale-40)] -mx-8 px-8 my-4 pb-2':
            isFixedGameTypeTabs,
        })}
        subGameactiveTab={subGameactiveTab}
        setSubGameActiveTab={setSubGameActiveTab}
        setViewType={setViewType}
        searchChild={
          !isMobile && (
            <button
              className={cx(
                'home-search-button ml-4',
                'h-full flex justify-center items-center gap-3'
              )}
              onClick={() =>
                dispatch(appSlice.actions.setShowGameSearchModal(true))
              }
            >
              <SearchOutlined
                className={cx(isDesktop ? 'text-[32px]' : 'text-sm')}
              />
              {'Procurar'}
            </button>
          )
        }
      />

      {/* 歷史瀏覽紀錄 */}
      {userRecentGameList.length > 0 && (
        <GameListSection
          className={'flex flex-col w-full mb-0 md:mb-0 lg:mb-0 mt-5'}
          title={
            <div className="flex items-center gap-2">
              <img
                className="w-6 h-6 mobile:w-8 mobile:h-8"
                src={`assets/${environment.uVersion}/icon_recent.png`}
                alt={'icon-recent'}
              />
              <div
                className={cx(
                  ' font-bold text-[var(--grayscale-100)]',
                  'text-sm mobile:text-base tablet:text-xl'
                )}
              >
                {`Recente +${userRecentGameList.length}`}
              </div>
            </div>
          }
          isShowHeader
          headerClassName={cx('mb-0 sm:mb-0 pl-0 py-0')}
          children={recentGameListRender(userRecentGameList)}
          gameListClassName={cx(
            'gap-x-2 pt-2 mobile:pt-3 animate-[recentGameListShow_0.8s_ease]'
          )}
        />
      )}

      {/* 每個選項的渲染 */}
      {gameList()}
    </PageContainer>
  );
};
