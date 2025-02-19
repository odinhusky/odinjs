import { FloatButton } from 'antd';
import cx from '@commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import useFloatActionButtonAction from '@mode2/action/components/floatActionButton/useFloatActionButtonAction';
import { handleFABDrawerActionClick } from '@mode2/action/components/floatActionButton/acitonType';
import { BackTopButton } from '@components/BackTopButton';

import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useMemo } from 'react';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import { useBreakPoint } from '@libs/commonUtils';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import ActivityCenterButton from '@components/ActivityCenterButton';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { FloatingBubble, FloatingBubbleProps } from 'antd-mobile';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import ActionButton from './components/ActionButton';

export const FloatActionButton = () => {
  useFloatActionButtonBase();
  const { isDesktop, isMobile } = useBreakPoint();
  const { navToLoginPage } = useNavPageClick();

  const fabConfig = useFloatActionButtonListStore((state) => state.fabConfig);

  const isShowDrawerControlBar = useFloatActionButtonListStore(
    (state) => state.isShowDrawerControlBar
  );
  const isOpenDrawer = useFloatActionButtonListStore(
    (state) => state.isOpenDrawer
  );

  const { handleFloatActionButtonClick } = useFloatActionButtonAction();

  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const currentCash = useRebateRewardModalStore((state) => state.currentCash);
  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );
  const isLogin = useIsLoginStore((state) => state.isLogin);

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const moneyBoxBtnItemConfig = {
    icon: 'piggy_bank',
    label: 'MoneyBox',
    type: 'MONEY_BOX',
    isShowRedDot: currentCash > 0,
    onActionClick: () => handleMoneyBoxBtnClick(),
  };

  const iconMapping: Record<ServicesTypeResult | string, string> = {
    IN_BOX: 'fab_inbox',
    [ServicesTypeResult.WHATS_APP]: 'fab_whatsapp',
    [ServicesTypeResult.INSTAGRAM]: 'fab_instagram',
    [ServicesTypeResult.TELEGRAM]: 'fab_telegram',
    [ServicesTypeResult.LIVE_CHAT]: 'fab_livechat',
    [ServicesTypeResult.YOUTUBE]: 'fab_youtube',
    [ServicesTypeResult.FACEBOOK]: 'fab_facebook',
    [ServicesTypeResult.TIKTOK]: 'fab_tiktok',
    [ServicesTypeResult.TWITTER]: 'fab_twitter',
    [ServicesTypeResult.UNKNOWN]: '',
  };

  const fabItems = useMemo(() => {
    if (!fabList.length) return [];

    if (fabList.length > 1) {
      const specifiedOrder = [
        ServicesTypeResult.LIVE_CHAT,
        'IN_BOX',
        ServicesTypeResult.WHATS_APP,
        ServicesTypeResult.TELEGRAM,
        ServicesTypeResult.INSTAGRAM,
        ServicesTypeResult.YOUTUBE,
      ];

      fabList.sort((a, b) => {
        const indexA = specifiedOrder.indexOf(a.type);
        const indexB = specifiedOrder.indexOf(b.type);

        return indexA - indexB;
      });
    }

    return fabList.map((item) => {
      return {
        ...item,
        icon: iconMapping[item.type] || '',
      };
    });
  }, [fabList]);

  const handleMoneyBoxBtnClick = () => {
    if (isLogin) {
      setIsShowRebateRewardModal(true);
    } else {
      navToLoginPage(62);
    }
  };

  const renderButtons = () => {
    return fabItems.map((item, index) => {
      return <ActionButton key={item.type + '-' + index} item={item} />;
    });
  };

  // 替換浮動的按鈕實作(antd-mobile 的 FloatingBubble)
  const FloatWrapper: React.ElementType =
    fabConfig.isDraggable && isMobile ? FloatingBubble : FloatButton.Group;

  const FloatWrapperProps = useMemo(
    () =>
      fabConfig.isDraggable && isMobile
        ? ({
            axis: 'xy',
            magnetic: 'x',
            style: {
              position: 'relative',
              zIndex: 10,
              '--initial-position-bottom': `${
                (bottomNavigationElMetrics?.height || 0) + 16
              }px`,
              '--initial-position-right': '16px',
              '--background': 'transparent',

              // edge-distance 是 padding，可以依照 padding 的規則設定
              '--edge-distance': `${
                (headerElMetrics?.height || 0) + 16
              }px 16px ${(bottomNavigationElMetrics?.height || 0) + 16}px 16px`,
            },
          } as FloatingBubbleProps)
        : ({
            rootClassName: '',
            className: cx(
              'w-auto end-0 bottom-[68px] mobile:bottom-[76px] shadow-none flex items-end flex-col mr-2'
            ),
            shape: 'square',
          } as React.ComponentProps<typeof FloatButton.Group>),
    [
      headerElMetrics?.height,
      bottomNavigationElMetrics?.height,
      fabConfig.isDraggable,
      isMobile,
    ]
  );

  return fabConfig.isFeatureSupport ? (
    <FloatWrapper {...FloatWrapperProps}>
      <div className={'flex flex-row justify-center items-center'}>
        {/* 桌面版水平收合按鈕 */}
        {isShowDrawerControlBar && !isDesktop ? (
          <img
            alt={isOpenDrawer ? 'Close Drawer' : 'Open Drawer'}
            className={cx('w-4', 'object-contain cursor-pointer')}
            src={getImgUrl(
              EResourceLevel.V,
              isOpenDrawer ? 'icon_float_close' : 'icon_float_open'
            )}
            onClick={() => {
              handleFloatActionButtonClick({
                actionName: handleFABDrawerActionClick,
              });
            }}
          />
        ) : null}

        <div
          className={cx(
            'flex flex-col justify-center gap-2 tablet:gap-3 p-2',
            'rounded-l-lg',
            isOpenDrawer ? 'w-auto px-2 items-center' : 'w-0 px-0',
            isShowDrawerControlBar && !isDesktop
              ? 'bgi-[var(--transparent-gray-70)]'
              : ''
          )}
        >
          {/* 存錢罐通知 */}
          {fabConfig.isShowMoneyBoxBtn && (
            <ActionButton item={moneyBoxBtnItemConfig} imgType={'.gif'} />
          )}

          {renderButtons()}

          {isShowDrawerControlBar ? <BackTopButton /> : null}
        </div>
      </div>
      {/* 觸發紅包雨按鈕 */}
      {isOpenDrawer && <ActivityCenterButton className="p-2" />}
    </FloatWrapper>
  ) : null;
};
