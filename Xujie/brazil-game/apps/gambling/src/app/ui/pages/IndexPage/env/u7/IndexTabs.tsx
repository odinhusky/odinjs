import cx from '../../../../utils/cx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { environment } from '../../../../../../environments/environment';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { GameProviderTabItem } from './GameProviderTabItem';
import { GameTabItem } from './GameTabItem';
import { useScrollToPartPageTemplate } from '../../../../pageTemplate/hooks/useScrollToPartPageTemplate';
import { useScrollSelectFixCenter } from '../../../../hooks/useScrollSelectFixCenter';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { U7WidthContainer } from '../../../../components-bs/PageContainer/env/u7/PageContainer';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { useLocation } from 'react-router';

type TIndexTabs = {
  setViewType: (value: any) => void;
  className?: string;
  subGameactiveTab: string;
  setSubGameActiveTab: (value: any) => void;
  searchChild?: React.ReactNode;
};

export const IndexTabs = (props: TIndexTabs) => {
  const { className, setViewType, subGameactiveTab, setSubGameActiveTab } =
    props;

  const label = useSelector((state: RootState) => state.gameList.label);
  const typeGameList =
    useSelector((state: any) => state.gameList.typeGameList) || [];
  const indexPagecurrentSelectLabel = useSelector(
    (state: any) => state.gameList.indexPagecurrentSelectLabel
  );

  const dispatch = useDispatch();

  const { showFixForIOSStickTab, scrollToCarousel, scrollToWindowTop } =
    useScrollToPartPageTemplate();
  const gameTypeItems: string[] = useMemo(() => {
    return ['Todos', ...label, 'Favoritos', 'Registro'];
  }, [label]);

  const [selectedGameType, setSelectedGameType] = useState<number>(0);
  const { scrollWrapperRef: gameTypeScrollWrapperRef } =
    useScrollSelectFixCenter(selectedGameType, false);

  const [selectedProvider, setSelectedProvider] = useState<number>(0);
  const { scrollWrapperRef: providerScrollWrapperRef } =
    useScrollSelectFixCenter(selectedProvider, false);
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  const scrollToTopOffsetY: number = isTablet ? 120 : isMobile ? 120 : 0;

  const gameProviderItems: string[] | null = useMemo(() => {
    const data =
      typeGameList !== undefined &&
      typeGameList.filter(
        (i: any) => i.gameType === indexPagecurrentSelectLabel
      )[0]?.data;
    if (!data) {
      // 遊戲之外的東西不會有二級選項
      return null;
    }
    const subList: string[] = data.reduce(
      (acc: string[], current: { [key: string]: string }) => {
        acc.push(current.subGameType);
        return acc;
      },
      [] as string[]
    );
    return ['All', ...subList];
  }, [indexPagecurrentSelectLabel]);

  const handleSelected = (type: string, level: number) => {
    if (level === 1) {
      const index = gameTypeItems.indexOf(type);
      setSelectedGameType(index);
    } else {
      const index = gameProviderItems?.indexOf(type);
      index && setSelectedProvider(index);
    }
  };
  const { onClickToGameHall } = usePageNavigate();
  const location = useLocation();
  return (
    <div className={className}>
      {/* ㄧ級選項 */}
      {/* --transparent-black-60 */}
      <U7WidthContainer className="bg-[var(--transparent-black-90)]">
        <DragScrollContainer
          ref={gameTypeScrollWrapperRef}
          className={cx('flex items-center')}
          focus={{
            index: gameTypeItems.indexOf(indexPagecurrentSelectLabel),
            direction: 'horizontal',
          }}
        >
          {gameTypeItems.map((tab: string, index: number) => {
            return (
              <GameTabItem
                key={index}
                className={cx(
                  'text-sm text-[var(--grayscale-80)] px-8 py-3 font-medium',
                  'active:brightness-75 hover:brightness-125'
                )}
                activeClassName={cx(
                  'font-bold text-linear border-b-2  border-[var(--grayscale-80)]'
                )}
                isActive={indexPagecurrentSelectLabel === tab}
                onClick={() => {                  
                  dispatch(
                    gameSlice.actions.setIndexPagecurrentSelectLabel(
                      tab as indexPagecurrentSelectLabel
                    )
                  );
                  setViewType('');
                  scrollToCarousel(scrollToTopOffsetY);
                  handleSelected(tab, 1);
                  if (location.pathname === PageOrModalPathEnum.IndexPage) {
                    // 從首頁跳到游戲大廳
                    onClickToGameHall();
                  }
                }}
                icon={`assets/${
                  environment.uVersion
                }/icon_${tab.toLowerCase()}.png`}
                defIcon={`assets/${environment.uVersion}/icon_favoritos.png`}
                name={tab}
                count={''}
              />
            );
          })}
        </DragScrollContainer>
      </U7WidthContainer>

      {/* 二級選項 */}
      {gameProviderItems && (
        <U7WidthContainer className="bg-[var(--transparent-black-40)]">
          <DragScrollContainer
            ref={providerScrollWrapperRef}
            className={cx('flex flex-row items-center w-full')}
            focus={{
              index: gameProviderItems?.indexOf(subGameactiveTab),
              direction: 'horizontal',
            }}
          >
            {gameProviderItems.map((tab: string, index: number) => {
              return (
                <GameProviderTabItem
                  name={tab}
                  className={cx(
                    'px-16 py-2.5 text-sm text-[var(--grayscale-80)] whitespace-nowrap'
                  )}
                  activeClassName={cx(
                    'bg-game-bar border-b-2 border-[var(--transparent-white-40)]'
                  )}
                  iconClassName={cx(
                    'h-4 mobile:h-6 tablet:h-7 desktop w-auto max-w-none'
                  )}
                  isActive={subGameactiveTab === tab}
                  onClick={() => {
                    setViewType('');
                    setSubGameActiveTab(tab);
                    scrollToCarousel(scrollToTopOffsetY);
                    handleSelected(tab, 2);
                  }}
                  icon={`assets/shared/${tab.split('-')[0]}-logo.png`}
                />
              );
            })}
          </DragScrollContainer>
        </U7WidthContainer>
      )}
    </div>
  );
};
