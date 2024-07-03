import cx from '../../../../utils/cx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { DragScrollContainer } from '../../../../components/DragScrollContainer';
import {
  gameSlice,
  indexPagecurrentSelectLabel,
} from '../../../../../reduxStore/gameSlice';
import { environment } from '../../../../../../environments/environment';
import React, { useMemo, useState } from 'react';

import { GameProviderTabItem } from './GameProviderTabItem';
import { GameTabItem } from './GameTabItem';
import { useScrollToPartPageTemplate } from '../../../../pageTemplate/hooks/useScrollToPartPageTemplate';
import { useScrollSelectFixCenter } from '../../../../hooks/useScrollSelectFixCenter';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

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
  const { label, typeGameCount } = useSelector(
    (state: RootState) => state.gameList
  );
  const { typeGameList = [], indexPagecurrentSelectLabel } = useSelector(
    (state: any) => state.gameList
  );
  const dispatch = useDispatch();
  const { userFavoriteGameIds } = useSelector(
    (state: RootState) => state.userRecent
  );
  const { showFixForIOSStickTab, scrollToCarousel, scrollToWindowTop } =
    useScrollToPartPageTemplate();
  const gameTypeItems: string[] = useMemo(() => {
    return ['Todos', ...label, 'Favoritos'];
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

  return (
    <div
      className={cx(
        // 'w-full',
        className
      )}
    >
      <div
        className={cx(
          'flex flex-row justify-between items-center w-full',
          'h-8 mobile:h-10 tablet:h-[60px]',
          'mt-2 mobile:mt-3 tablet:mt-6',
          'pb-1 mobile:pb-2 tablet:pb-4'
        )}
      >
        {/* ㄧ級選項 */}
        <DragScrollContainer
          ref={gameTypeScrollWrapperRef}
          className={cx(
            'flex flex-row items-center bg-[var(--grayscale-40)] rounded-xl w-full h-full'
          )}
          focus={{
            index: gameTypeItems.indexOf(indexPagecurrentSelectLabel),
            direction: 'horizontal',
          }}
        >
          {gameTypeItems.map((tab: string, index: number) => {
            const gameCount =
              tab !== 'Favoritos'
                ? typeGameCount[tab]
                : userFavoriteGameIds.length;
            console.log('===>tab', tab);
            return (
              <GameTabItem
                className={cx(
                  'flex-none h-full gap-x-2',
                  'border-[var(--grayscale-70)]',
                  'text-[var(--grayscale-100)]',
                  'active:brightness-75 hover:brightness-125',
                  'py-3 px-2',
                  'text-sm mobile:text-xs',
                  'mobile:py-3 mobile:px-2 mobile:text-sm',
                  'tablet:py-5 tablet:px-3.5 tablet:text-xl'
                )}
                activeClassName={cx(
                  'h-full rounded-[12px] bg-[var(--grayscale-20)]',
                  'border-2',
                  'shadow-[_inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]'
                )}
                iconClassName={cx(
                  'w-4 h-4',
                  'mobile:w-6 mobile:h-6',
                  'tablet:w-8 tablet:h-8'
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
                }}
                icon={`assets/${environment.uVersion}/${
                  environment.mVersion
                }/icon_${tab.toLowerCase()}.png`}
                defIcon={`assets/${environment.uVersion}/${environment.mVersion}/icon_favoritos.png`}
                name={tab}
                count={
                  indexPagecurrentSelectLabel === tab ? ` (${gameCount})` : ''
                }
              />
            );
          })}
        </DragScrollContainer>
        {/* 搜索遊戲 */}
        {props.searchChild}
      </div>

      {/* 二級選項 */}
      {gameProviderItems && (
        <DragScrollContainer
          ref={providerScrollWrapperRef}
          className={cx(
            'flex flex-row items-center bg-[var(--grayscale-40)] rounded-xl w-full',
            'h-8 mobile:h-10 tablet:h-[60px]'
            // 'mt-1 mobile:mt-2 tablet:mt-4',
          )}
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
                  'flex-none h-full gap-x-2',
                  'border-[var(--grayscale-70)]',
                  'text-[var(--grayscale-100)]',
                  'active:brightness-75 hover:brightness-125',
                  'py-3 px-2',
                  'text-sm mobile:text-xs',
                  'mobile:py-3 mobile:px-2 mobile:text-sm',
                  'tablet:py-5 tablet:px-3.5 tablet:text-xl'
                )}
                activeClassName={cx(
                  'h-full rounded-[12px]',
                  'border-2',
                  'shadow-[_inset_4px_4px_4px_0px_rgba(0,_0,_0,_0.2)]'
                )}
                iconClassName={cx('h-4 mobile:h-6 tablet:h-7 desktop')}
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
      )}
    </div>
  );
};
