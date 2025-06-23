import React, { useCallback, useMemo } from 'react';
import './index.scss';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';

import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import { FloatingBubble, FloatingBubbleProps } from 'antd-mobile';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import {
  RankingPageTabs,
  useRankingPageStore,
} from '@mode2/zustand/page/RankingPage/rankingPageStore';
import { handleFloatActionButtonActionClick } from '@mode2/action/actionTypes';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import ActivityCenterButton from '@components/ActivityCenterButton';
import useActivityCenterStore from '@libs/mode2/zustand/components/activityCenterStore';

export const FloatActionButton = () => {
  useFloatActionButtonBase();
  const { navToRankingPage } = useNavPageClick();
  const location = useLocationStore((state) => state.location);
  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const isOpenDrawer = useFloatActionButtonListStore(
    (state) => state.isOpenDrawer
  );
  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const mainContentElMetrics = useTemplateLayoutStore(
    (state) => state.mainContentElMetrics
  );

  const activeOnHomeList = useActivityCenterStore(
    (state) => state.activeOnHomeList
  );
  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );

  const shouldShowActivityCenterBtn =
    activeOnHomeList.length > 0 && !redEnvelopeRainResult?.hidden;

  const liveChatObj = fabList.find(
    (item) => item.type === ServicesTypeResult.LIVE_CHAT
  );
  const isDisplay = useMemo(() => {
    return location?.pathname === BasePagePathObj.HallPage;
  }, [location]);

  const headerHeight = useMemo(() => {
    const height = headerElMetrics?.height || 86;
    return height + 8;
  }, [headerElMetrics]);

  const bottomNavHeight = useMemo(() => {
    const height = bottomNavigationElMetrics?.height || 100;
    return height + 8;
  }, [bottomNavigationElMetrics]);

  const mainContentWidth = useMemo(() => {
    const width = mainContentElMetrics?.width || 750;
    return width > 750 ? (width - 750) / 2 : 0;
  }, [mainContentElMetrics]);

  const floatWrapperProps = useCallback(
    (offset: number = 1) => {
      return {
        axis: 'xy',
        magnetic: 'x',
        style: {
          position: 'relative',
          zIndex: 100,
          '--initial-position-bottom': `${bottomNavHeight + offset}px`,
          '--initial-position-right': `${mainContentWidth + 16}px`,
          '--background': 'transparent',
          // edge-distance 是 padding，可以依照 padding 的規則設定
          // '--edge-distance': `${headerHeight}px 16px ${bottomNavHeight}px 16px`,
          '--edge-distance': `${headerHeight}px ${
            mainContentWidth + 16
          }px ${bottomNavHeight}px ${mainContentWidth + 16}px`,
        },
        className: 'float-action-button',
      } as FloatingBubbleProps;
    },
    [headerElMetrics, bottomNavigationElMetrics]
  );

  const floatingButtons = useMemo(() => {
    const liveChatBtn = {
      name: 'liveChatBtn',
      isShow: true,
      onClick: () => {
        liveChatObj?.onActionClick();
      },
      children: (
        <BaseCacheImg
          className={'w-[80px] h-[80px]'}
          alt={'live_chat'}
          src={getImgUrl(EResourceLevel.V, 'float_1')}
          imgName="float_1"
        />
      ),
    };

    const rankingBtn = {
      name: 'rankingBtn',
      isShow: true,
      onClick: () => {
        handleGlobalClick({
          target: handleFloatActionButtonActionClick,
          callback: () => {
            useRankingPageStore
              .getState()
              .setRankingPageTab(RankingPageTabs.MAIN);
            navToRankingPage('', { state: { tab: RankingPageTabs.MAIN } });
          },
        });
      },
      children: (
        <BaseCacheImg
          className={'w-[80px] h-[80px]'}
          alt={'live_chat'}
          src={getImgUrl(EResourceLevel.V, 'float_2')}
          imgName="float_2"
        />
      ),
    };

    /*/!* 觸發紅包雨按鈕 *!/*/
    const activityCenterBtn = {
      name: 'activity_center',
      isShow: isOpenDrawer && shouldShowActivityCenterBtn,
      onClick: undefined,
      children: <ActivityCenterButton className="" />,
    };

    // return [activityCenterBtn, liveChatBtn, rankingBtn];
    return [activityCenterBtn, liveChatBtn];
  }, [liveChatObj, isOpenDrawer, shouldShowActivityCenterBtn]);

  return isDisplay ? (
    <>
      {floatingButtons
        .filter((item) => item.isShow !== false)
        .slice()
        .reverse()
        .map((item, index) => {
          return (
            <FloatingBubble
              key={`${item.name} - ${index}`}
              // 多加 80 為了空出一個位子  <SwiperActionButton>
              {...floatWrapperProps((index + 1) * 80 + 20)}
              onClick={item.onClick}
            >
              {item.children}
            </FloatingBubble>
          );
        })}
    </>
  ) : null;
};

export default FloatActionButton;
