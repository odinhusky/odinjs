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
import useMode2RechargeWheelPageStore from '@libs/mode2/zustand/page/rechargeWheelPage';
import { FloatingBubble, FloatingBubbleProps } from 'antd-mobile';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import ActionButton from './components/ActionButton';
import { useLocation } from 'react-router';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';

export const FloatActionButton = () => {
  useFloatActionButtonBase();

  const location = useLocation();

  const { navToRechargeWheelPage } = useNavPageClick();
  const { isDesktop, isMobile } = useBreakPoint();
  const { navToLoginPage } = useNavPageClick();

  const [isExpandActions, setIsExpandActions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 控制動畫狀態

  const fabConfig = useFloatActionButtonListStore((state) => state.fabConfig);

  const isShowDrawerControlBar = useFloatActionButtonListStore(
    (state) => state.isShowDrawerControlBar
  );
  const isOpenDrawer = useFloatActionButtonListStore(
    (state) => state.isOpenDrawer
  );
  const currentCash = useRebateRewardModalStore((state) => state.currentCash);
  const { setIsShowRebateRewardModal } = useRebateRewardModalStore();
  const fabList = useFloatActionButtonListStore((state) => state.fabList);
  const isLogin = useIsLoginStore((state) => state.isLogin);
  const userRole = useUserProfileStore((state) => state.userRole);

  const bottomNavigationElMetrics = useTemplateLayoutStore(
    (state) => state.bottomNavigationElMetrics
  );

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  // 充值輪盤所有等級的剩餘次數物件
  const wheelRemainSpinNumberObj = useMode2RechargeWheelPageStore(
    (state) => state.wheelRemainSpinNumberObj
  );

  const remainSpinNumber = Object.entries(wheelRemainSpinNumberObj).reduce(
    (acc, [, value]) => {
      return (acc += value);
    },
    0
  );

  // 可水平收合的按鈕群組or單一按鈕
  const showButtonGroup = isDesktop && isShowDrawerControlBar;

  // 可展開和收縮的抽屜按鈕
  const showExpandDrawerButton = !isDesktop && isShowDrawerControlBar;

  const moneyBoxBtnItemConfig = {
    icon: 'piggy_bank',
    label: 'MoneyBox',
    type: 'MONEY_BOX',
    isShowRedDot: currentCash > 0,
    onActionClick: () => handleMoneyBoxBtnClick(),
  };

  const rechargeWheelBtnItemConfig = useMemo(
    () => ({
      icon: 'invite_wheel',
      label: 'MoneyBox',
      type: 'MONEY_BOX',
      isShowRedDot: isLogin && remainSpinNumber > 0,
      onActionClick: () => navToRechargeWheelPage(),
    }),
    [remainSpinNumber, isLogin, userRole]
  );

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

    // 插入空白按鈕，為了符合設計墊高一格按鈕的空間
    if (!isDesktop && location.pathname !== BasePagePathObj.WalletPage) {
      fabList.splice(2, 0, {
        label: '',
        type: '',
        icon: '',
        onActionClick: (): void => {
          console.log('empty button');
        },
      });
    }

    return fabList.map((item, index) => {
      return {
        ...item,
        icon: iconMapping[item.type] || '',
      };
    });
  }, [fabList]);

  const totalButtonsAmount = fabItems.length;

  const handleMoneyBoxBtnClick = () => {
    if (isLogin) {
      setIsShowRebateRewardModal(true);
    } else {
      navToLoginPage(52);
    }
  };

  // 展開或收合前要先等動畫播完
  const toggleVisibility = () => {
    setIsAnimating(true);
  };

  // 動畫結束後再切換顯示狀態
  const handleAnimationEnd = () => {
    if (isAnimating) {
      setIsAnimating(false);
      setIsExpandActions(!isExpandActions);
    }
  };

  const renderButtons = () => {
    if (showExpandDrawerButton) {
      const mainButtonItem = {
        icon: 'fab_add',
        type: 'Toggle drawer button',
        label: isExpandActions ? 'Collapse Button' : 'Expand Button',
        onActionClick: () => toggleVisibility(),
        className: 'h-12 w-12',

        // 內部的Inbox item是否有未讀通知
        isShowRedDot: fabItems[1].isShowRedDot && !isExpandActions,
      };

      return (
        <>
          {isExpandActions &&
            fabItems.map((item, index) => {
              return (
                <ActionButton
                  key={item.type + '-' + index}
                  item={{
                    ...item,
                    className: cx('animate__animated', {
                      'animate__bounceOutDown animate__200ms':
                        showExpandDrawerButton && isAnimating,
                      'animate__bounceInUp animate__500ms':
                        showExpandDrawerButton && !isAnimating,
                    }),
                  }}
                  styles={{
                    transition: `all 0.3s ease ${
                      (totalButtonsAmount - index) * 0.1
                    }s `,
                    pointerEvents: isExpandActions ? 'auto' : 'none',
                  }}
                  onAnimationEnd={handleAnimationEnd} //動畫結束事件
                />
              );
            })}

          <ActionButton
            item={mainButtonItem}
            imageClassName={cx('transition-all duration-300 ease-in-out', {
              '-rotate-45': isExpandActions,
            })}
          />
        </>
      );
    }

    return fabItems.map((item, index) => {
      return <ActionButton key={item.type + '-' + index} item={item} />;
    });
  };

  // 輪盤
  const renderRechargeWheelBtn = () => {
    return fabConfig.isShowRechargeWheelBtn ? (
      <ActionButton
        item={{
          ...rechargeWheelBtnItemConfig,
          className: cx('animate__animated', {
            'animate__bounceOutDown animate__200ms':
              showExpandDrawerButton && isAnimating,
            'animate__bounceInUp animate__500ms':
              showExpandDrawerButton && !isAnimating,
          }),
        }}
        imgType={'.gif'}
        styles={{
          transition: `all 0.3s ease ${totalButtonsAmount * 0.1}s`,
        }}
        onAnimationEnd={handleAnimationEnd} //動畫結束事件
      />
    ) : null;
  };

  // 存錢罐通知
  const renderMoneyBoxBtn = () => {
    if (fabConfig.isShowMoneyBoxBtn) {
      return (
        <ActionButton
          item={{
            ...moneyBoxBtnItemConfig,
            className: cx('animate__animated', {
              'animate__bounceOutDown animate__200ms':
                showExpandDrawerButton && isAnimating,
              'animate__bounceInUp animate__500ms':
                showExpandDrawerButton && !isAnimating,
            }),
          }}
          imgType={'.gif'}
          styles={{
            transition: `all 0.3s ease ${totalButtonsAmount * 0.1}s`,
          }}
          onAnimationEnd={handleAnimationEnd} //動畫結束事件
        />
      );
    }
    return null;
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
        className={cx('flex flex-col justify-center gap-1 tablet:gap-2', {
          'h-auto justify-end rounded-full p-1 bgi-[var(--transparent-gray-70)] bg-shadow-[var(--float-button-group-shadow)]':
            (showExpandDrawerButton && isExpandActions) ||
            (isDesktop && fabConfig.isDrawerStyle),
          'grid gap-3': !showExpandDrawerButton,
          'w-auto p-2 items-center': isOpenDrawer,
          'w-0 px-0': !isOpenDrawer,
          'mb-2': showButtonGroup,
          'max-h-[278px] rounded-[20px] flex-wrap': !isDesktop,
          '!w-[116px]': !isDesktop && showExpandDrawerButton && isExpandActions,
        })}
      >
        {renderRechargeWheelBtn()}

        {renderMoneyBoxBtn()}

        {renderButtons()}

        {showButtonGroup ? (
          <div className="place-self-center">
            {' '}
            <BackTopButton className="rounded-full w-12 h-12" />
          </div>
        ) : null}
      </div>

      {/* 觸發紅包雨按鈕 */}
      {isOpenDrawer && <ActivityCenterButton />}
    </FloatWrapper>
  ) : null;
};
