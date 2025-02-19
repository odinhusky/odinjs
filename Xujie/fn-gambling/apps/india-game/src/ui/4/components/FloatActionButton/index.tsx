import { useCallback, useMemo } from 'react';
import './index.scss';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';

import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import { FloatingBubble, FloatingBubbleProps } from 'antd-mobile';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

export const FloatActionButton = () => {
  useFloatActionButtonBase();
  const location = useLocationStore((state) => state.location);
  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  // const iconMapping: Record<ServicesTypeResult | string, string> = {
  //   IN_BOX: 'fab_inbox',
  //   [ServicesTypeResult.WHATS_APP]: 'fab_whatsapp',
  //   [ServicesTypeResult.INSTAGRAM]: 'fab_instagram',
  //   [ServicesTypeResult.TELEGRAM]: 'fab_telegram',
  //   [ServicesTypeResult.LIVE_CHAT]: 'fab_livechat',
  //   [ServicesTypeResult.YOUTUBE]: 'fab_youtube',
  //   [ServicesTypeResult.FACEBOOK]: 'fab_facebook',
  //   [ServicesTypeResult.TIKTOK]: 'fab_tiktok',
  //   [ServicesTypeResult.TWITTER]: 'fab_twitter',
  //   [ServicesTypeResult.UNKNOWN]: '',
  // };

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

  const floatWrapperProps = useCallback(
    (offset: number = 1) => {
      return {
        axis: 'xy',
        magnetic: 'x',
        style: {
          position: 'relative',
          zIndex: 100,
          '--initial-position-bottom': `${bottomNavHeight + offset}px`,
          '--initial-position-right': '16px',
          '--background': 'transparent',
          // edge-distance 是 padding，可以依照 padding 的規則設定
          '--edge-distance': `${headerHeight}px 16px ${bottomNavHeight}px 16px`,
        },
        className: 'float-action-button',
      } as FloatingBubbleProps;
    },
    [headerElMetrics, bottomNavigationElMetrics]
  );

  return isDisplay ? (
    <>
      {liveChatObj && (
        <FloatingBubble
          {...floatWrapperProps()}
          onClick={liveChatObj.onActionClick}
        >
          <img
            className={'w-[80px] h-[80px]'}
            alt={'live_chat'}
            src={getImgUrl(EResourceLevel.V, 'float_1')}
          />
        </FloatingBubble>
      )}

      {/*<FloatingBubble {...floatWrapperProps(80 + 28)}>*/}
      {/*  <div*/}
      {/*    className={cx('flex flex-col justify-center gap-1 tablet:gap-2', {})}*/}
      {/*  >*/}
      {/*    {'TODO 排行榜'}*/}
      {/*  </div>*/}
      {/*</FloatingBubble>*/}
    </>
  ) : null;
};
