import cx from 'classnames';
// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

import { Input } from '../../../../components-bs/Inputs/Input';
import { useNavigate } from 'react-router';

import React, { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';

import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { GameItem } from '../../../../components-bs/GameTypeSection';
import { tcx } from '../../../../utils/tcx';
import { RecentGameItem } from '../../../../components-bs/RecentGameListItem';
import { GameListSection } from '../../../../modals/GameSearchModal/components/GameListSection';
import { environment } from '../../../../../../environments/environment';

import { appSlice } from '../../../../../reduxStore/appSlice';
import { U2IndexTabs } from './IndexTabs';
import AppCarouselItem from './AppCarouselItem';

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

type ICoco777betIndexPage = {
  subGameMenu: any;
  allGameList: any;
  label: any;
  activeTab: any;
  setViewType: (value: any) => void;
  setSearchInput: (value: any) => void;
  gameList: any;
  showFixForIOSStickTab: boolean;
  scrollToCarousel: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
  recentGameList: GameItem[];
};

export const IndexPage = ({
  subGameMenu,
  allGameList,
  label,
  activeTab,
  setViewType,
  setSearchInput,
  gameList,
  scrollToCarousel,
  showFixForIOSStickTab,
  onClickFavoriteGameItem,
  recentGameList,
}: ICoco777betIndexPage) => {
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

  useEffect(() => {
    setViewType('');
  }, [activeTab]);

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
    if (recentGameList.length > 0) {
      return (
        <>
          {recentGameList.map((gameItem) => (
            <RecentGameItem
              key={gameItem.gameId}
              className="mr-4"
              gameId={Number(gameItem.gameId)}
              onClick={() => onClickGameItem(gameItem)}
            />
          ))}
        </>
      );
    } else {
      return <div></div>;
    }
  };

  const indexPagecurrentSelectLabel = useSelector(
    (state: any) => state.gameList.indexPagecurrentSelectLabel
  );
  const isFixedGameTypeTabs = showFixForIOSStickTab && !isDesktop;

  return (
    <>
      <PageContainer id={'app-carousel'} className="pb-0">
        <AppCarouselItem />
      </PageContainer>

      <PageContainer
        className={cx('z-[2]', 'py-3 md:py-8 lg:py-5', {
          'sticky top-0 left-0 right-0 ': isFixedGameTypeTabs,
        })}
      >
        <div className={'flex flex-row justify-between items-center w-full'}>
          <U2IndexTabs
            label={label}
            activeTab={activeTab}
            setViewType={setViewType}
          />
          {isDesktop && (
            <div
              className="ml-4 shirnk-0 grow-0 basis-[200px] min-w-[200px]"
              onClick={() =>
                dispatch(appSlice.actions.setShowGameSearchModal(true))
              }
            >
              <Input
                disable={true}
                pureContainer={true}
                className={cx(
                  'p-2.5 text-sm rounded-lg h-[40px] flex items-center',
                  '!border-[var(--grayscale-30)] bg-[var(--grayscale-10)]'
                )}
                inputClassName={
                  'text-sm placeholder:text-[var(--grayscale-70)] placeholder:text-sm placeholder:items-center'
                }
                placeholder={'Procurar'}
                prefix={
                  <SearchOutlined
                    className={cx('text-lg mr-1', 'text-[var(--grayscale-70]')}
                  />
                }
              />
            </div>
          )}
        </div>
        {/* 二級選項 */}
        {subGameMenu()}
      </PageContainer>
      {recentGameList.length > 0 && (
        <PageContainer className={cx('overflow-hidden py-0')}>
          <GameListSection
            className="mb-0 md:mb-0 lg:mb-0 pl-0 px-0"
            title={
              <div className="flex items-center gap-2 font-bold">
                {
                  <img
                    className="w-6 h-6"
                    src={`assets/${environment.uVersion}/${environment.mVersion}/icon_recent.png`}
                    alt="recentIcon"
                  />
                }
                <div className="text-sm sm:text-base lg:text-xl text-white">
                  Recente
                </div>
                <div className="text-sm text-[var(--secondary-assistant)]">
                  +{recentGameList.length}
                </div>
              </div>
            }
            isShowHeader
            headerClassName={tcx('mb-0 sm:mb-0 pl-0 py-0', ['py-0', isMobile])}
            children={recentGameListRender(recentGameList)}
            gameListClassName={tcx(
              'py-[20px] animate-[recentGameListShow_0.8s_ease]',
              ['py-0 pt-2', isMobile]
            )}
          />
        </PageContainer>
      )}

      <PageContainer className={cx('pb-16 pt-0')}>
        {/* 每個選項的渲染 */}
        {gameList()}
      </PageContainer>
    </>
  );
};
