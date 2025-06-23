import { useMemo, useState } from 'react';
import { FloatButton } from 'antd';
import cx from '@commonUtils/cx';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { BackTopButton } from '@components/BackTopButton';
import { useBreakPoint } from '@commonUtils/hooks';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { useFloatActionButtonBase } from '@/hooks/components/useFloatActionButtonBase';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import ActivityCenterButton from '@components/ActivityCenterButton';
import { useIsLoginStore } from '@mode2/zustand/loginStore';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import useActivityCenterStore from '@mode2/zustand/components/activityCenterStore';
import ActionButton from './components/ActionButton';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { FloatingBubble, FloatingBubbleProps } from 'antd-mobile';

export const FloatActionButton = () => {
  useFloatActionButtonBase();

  const { isDesktop, isMobile } = useBreakPoint();
  const { navToLoginPage } = useNavPageClick();

  const [isExpandActions, setIsExpandActions] = useState(false);
  const fabConfig = useFloatActionButtonListStore((state) => state.fabConfig);

  const isShowDrawerControlBar = useFloatActionButtonListStore(
    (state) => state.isShowDrawerControlBar
  );
  const isOpenDrawer = useFloatActionButtonListStore(
    (state) => state.isOpenDrawer
  );
  const currentCash = useRebateRewardModalStore((state) => state.currentCash);

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  const { setIsShowRebateRewardModal } = useRebateRewardModalStore();
  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const activeOnHomeList = useActivityCenterStore(
    (state) => state.activeOnHomeList
  );
  const redEnvelopeRainResult = useActivityCenterStore(
    (state) => state.redEnvelopeRainResult
  );

  const shouldShowActivityCenterBtn =
    activeOnHomeList.length > 0 && !redEnvelopeRainResult?.hidden;

  // 可水平收合的按鈕群組or單一按鈕
  const showButtonGroup = isDesktop && isShowDrawerControlBar;

  // 可展開和收縮的抽屜按鈕
  const showExpandDrawerButton = !isDesktop && isShowDrawerControlBar;

  const moneyBoxBtnItemConfig = {
    icon: 'ic_piggy_bank',
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
      navToLoginPage(56);
    }
  };

  /** 計算環形展開按鈕的位置 */
  const calculateExpandBtnPosition = (index: number) => {
    const total = fabItems.length;

    // 起始角度是 90 度 (π/2)
    // 結束角度是 270 度 (3π/2)
    // 總角度範圍是 180 度 (π)
    const startAngle = Math.PI / 2; // 90度
    const angleStep = Math.PI / (total - 1);

    // 計算圓心到圓心的距離
    const MAIN_BUTTON_RADIUS = isMobile ? 1.5 : 2; // 24px -> 1.5rem, 32px -> 2rem
    const SUB_BUTTON_RADIUS = isMobile ? 1.25 : 1.75; // 20px -> 1.25rem, 28px -> 1.75rem
    const EDGE_TO_EDGE_DISTANCE = isMobile ? 1.5 : 2.25; // 24px -> 1.5rem, 36px -> 2.25rem
    const radius =
      EDGE_TO_EDGE_DISTANCE + MAIN_BUTTON_RADIUS + SUB_BUTTON_RADIUS;

    // 計算當前按鈕的角度: 從90度開始,往左遞增
    const angle = startAngle + index * angleStep;

    // 計算從中心點出發到子按鈕的x軸和y軸偏移量
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      transform: `translate(${x}rem, ${-y}rem)`,
    };
  };

  const renderButtons = () => {
    if (showExpandDrawerButton) {
      const mainButtonItem = {
        icon: 'fab_add',
        type: 'Toggle drawer button',
        label: isExpandActions ? 'Collapse Button' : 'Expand Button',
        onActionClick: () => setIsExpandActions(!isExpandActions),
        className: 'h-12 w-12 mobile:h-16 mobile:w-16',

        // 內部的Inbox item是否有未讀通知
        isShowRedDot: fabItems[1].isShowRedDot && !isExpandActions,
      };

      return (
        <>
          {fabItems.map((item, index) => (
            <ActionButton
              key={item.type + '-' + index}
              item={{
                className: 'absolute',
                ...item,
              }}
              styles={{
                opacity: isExpandActions ? 1 : 0,
                transition: `all 0.3s ease ${index * 0.1}s `,
                pointerEvents: isExpandActions ? 'auto' : 'none',
                ...calculateExpandBtnPosition(index),
              }}
            />
          ))}

          {/* 多包一層讓可收合按鈕在展開時自己加上margin(SUB_BUTTON_RADIUS*2 + EDGE_TO_EDGE_DISTANCE)避免擋到下方按鈕 */}
          <div
            className={cx({
              'mb-[64px] mobile:mb-[92px]': isExpandActions,
            })}
          >
            <ActionButton
              item={mainButtonItem}
              imageClassName={cx(
                'transition-transform duration-300 ease-in-out',
                {
                  '-rotate-45': isExpandActions,
                }
              )}
            />
          </div>
        </>
      );
    }

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
      <div
        className={cx(
          'flex flex-col justify-center gap-2 tablet:gap-3 p-2 items-center',
          {
            'w-auto items-end':
              isOpenDrawer &&
              showExpandDrawerButton &&
              shouldShowActivityCenterBtn,
          }
        )}
      >
        {/* 存錢罐通知 */}
        {fabConfig.isShowMoneyBoxBtn && (
          <ActionButton
            item={moneyBoxBtnItemConfig}
            imgType={'.gif'}
            styles={{
              transition: 'all 0.3s ease 0.1s',
              ...(showExpandDrawerButton && isExpandActions
                ? calculateExpandBtnPosition(0)
                : {}),
            }}
          />
        )}

        <div className="flex flex-col gap-1 mobile:gap-2">
          {renderButtons()}
        </div>

        {/* 觸發紅包雨按鈕 */}
        {isOpenDrawer && shouldShowActivityCenterBtn && (
          <ActivityCenterButton />
        )}

        {showButtonGroup ? <BackTopButton /> : null}
      </div>
    </FloatWrapper>
  ) : null;
};

export default FloatActionButton;
