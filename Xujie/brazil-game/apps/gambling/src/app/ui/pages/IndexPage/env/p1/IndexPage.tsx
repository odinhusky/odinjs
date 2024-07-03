import cx from 'classnames';
// NOTE; https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import {
  GameItem,
  GameTypeSectionList,
} from '../../../../components-bs/GameTypeSection';
import { Input } from '../../../../components-bs/Inputs/Input';
// @ts-ignore
// import { default as data } from "../../components/GameTypeSection/mock/gameList.json";
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { environment } from '../../../../../../environments/environment';
import { PernambucanaAppCarouselContent } from '../../Carousel/env/pernambucana/PernambucanaAppCarouselContent';
import { useClickFavoriteGameItem } from '../../../../hooks/useClickFavoriteGameItem';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { TabItem } from '../../../../components-bs/TabItem/TabItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';
import { twMerge } from 'tailwind-merge';
import AppCarouselItem from './AppCarouselItem';
import { useScrollSelectFixCenter } from '../../../../hooks/useScrollSelectFixCenter';
import { IndexTabs } from './IndexTabs';

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

type IPernambucana777BetIndexPage = {
  allGameList: any;
  label: any;
  activeTab: any;
  setActiveTab: (value: any) => void;
  setViewType: (value: any) => void;
  setSearchInput: (value: any) => void;
  gameList: any;
  showFixForIOSStickTab: boolean;
  scrollToCarousel: () => void;
  onClickFavoriteGameItem: (item: GameItem) => void;
  recentGameList: GameItem[];
};

export const IndexPage = ({
  allGameList,
  label,
  activeTab,
  setActiveTab,
  setViewType,
  setSearchInput,
  gameList,
  showFixForIOSStickTab,
  onClickFavoriteGameItem,
}: IPernambucana777BetIndexPage) => {
  const dispatch = useDispatch();
  const { isDesktop } = useBreakpoint();

  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );

  const isFixedGameTypeTabs = showFixForIOSStickTab && !isDesktop;

  useEffect(() => {
    // 初始化 使用 redux
    if (indexPagecurrentSelectLabel === 'nothing_select') {
      dispatch(gameSlice.actions.setIndexPagecurrentSelectLabel('Todos'));
    }
  }, []);

  useEffect(() => {
    setViewType('');
  }, [activeTab]);

  return (
    <>
      <PageContainer id="app-carousel" className="w-full">
        {/*<PernambucanaAppCarouselContent/>*/}
        <AppCarouselItem />
      </PageContainer>

      <PageContainer>
        <div
          className={twMerge(
            '',
            isDesktop &&
              'p-4 border border-[#2CFD99] bg-[rgba(1,62,66,0.6)] rounded-lg'
          )}
        >
          <section
            className={twMerge(
              'flex flex-row gap-4 justify-between items-center w-full mb-4 z-50',
              'border-b-[rgb(44,253,153)]',
              isDesktop &&
                'px-4 pb-4 border-b border-[var(--main-primary-main)]',
              isFixedGameTypeTabs &&
                'sticky top-0 left-0 right-0 bg-[var(--main)] rounded-b-xl'
            )}
          >
            <IndexTabs label={label} activeTab={activeTab} />
            {isDesktop && (
              <div
                className="shirnk-0"
                onClick={() =>
                  dispatch(appSlice.actions.setShowGameSearchModal(true))
                }
              >
                <Input
                  disable={true}
                  pureContainer={true}
                  className="flex-1 h-10 flex items-center text-white w-[300px]"
                  inputClassName="placeholder:text-white text-[14px]"
                  prefix={
                    <img
                      alt="search"
                      className="w-[18px] h-[18px] mr-2"
                      src={`assets/${environment.uVersion}/icon_24.png`}
                    />
                  }
                  placeholder={'Pesquisar nome do jogo'}
                />
              </div>
            )}
          </section>

          <div>{gameList()}</div>
        </div>
      </PageContainer>
    </>
  );
};
