import { memo, useEffect, useMemo, useRef, useState } from 'react';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { cx, useBreakPoint } from '@libs/commonUtils';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import useLeaveGameConfirmModalStore from '@libs/mode2/zustand/components/leaveGameConfirmModalStore';
import { useMode2WebviewPageStore } from '@libs/mode2/zustand/page/webviewPageStore';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { FloatingBubble } from 'antd-mobile';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import LowBalanceRescueBoxButton from '@components/LowBalanceRescueBoxButton';
import useLowBalanceRescueBoxModalStore from '@libs/mode2/zustand/modal/LowBalanceRescueBoxModal';

const HeaderDepositButton = memo(
  ({ textClassName }: { textClassName?: string }) => {
    const setIsShowRechargeContent = useMode2WebviewPageStore(
      (state) => state.setIsShowRechargeContent
    );
    const { t } = useTranslation();
    return (
      <BaseSecondaryBtn
        className={cx('w-auto h-auto', '!bg-none')}
        classNameText={cx(FLEX_ITEMS_CENTER)}
        onClick={() => {
          setIsShowRechargeContent(true);
        }}
        children={
          <div className="flex flex-col justify-center items-center">
            <Icon className={cx('w-7 h-7')} name={'ic_deposit'} />
            <span
              className={cx(
                'bgi-text-[var(--grayscale-10)] text-sm font-medium',
                textClassName
              )}
            >
              {t('wallet_nav_deposit')}
            </span>
          </div>
        }
      />
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

// 遊戲頁 - 退出遊戲按鈕
const ExitButton = memo(({ textClassName }: { textClassName?: string }) => {
  const setIsShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.setIsShowRechargeContent
  );
  const isShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.isShowRechargeContent
  );
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  const setIsShowLeaveGameConfirmModal = useLeaveGameConfirmModalStore(
    (state) => state.setIsShowLeaveGameConfirmModal
  );

  const setWebViewPageHeaderShow = useMode2WebviewPageStore(
    (state) => state.setWebViewPageHeaderShow
  );
  return (
    <BaseSecondaryBtn
      className={cx('w-auto h-auto', '!bg-none')}
      classNameText={cx(FLEX_ITEMS_CENTER)}
      onClick={() => {
        setWebViewPageHeaderShow(false);
        const isShowRechargeContent =
          useMode2WebviewPageStore.getState().isShowRechargeContent;
        if (isShowRechargeContent) {
          setIsShowRechargeContent(false);
          finishRecharge();
        } else {
          setIsShowLeaveGameConfirmModal(true);
        }
      }}
      children={
        <div className="flex flex-col justify-center items-center">
          <Icon className={cx('w-7 h-7')} name={'ic_exit'} />
          <span
            className={cx(
              'bgi-text-[var(--grayscale-10)] text-sm font-medium',
              textClassName
            )}
          >
            {isShowRechargeContent ? 'Back' : 'Exit'}
          </span>
        </div>
      }
    />
  );
});

export const WebViewPageHeader = () => {
  const [open, setOpen] = useState(true);
  const isWebViewPageHeaderShow = useMode2WebviewPageStore(
    (state) => state.isWebViewPageHeaderShow
  );
  const { isDesktop } = useBreakPoint();

  const setWebViewPageHeaderShow = useMode2WebviewPageStore(
    (state) => state.setWebViewPageHeaderShow
  );

  useEffect(() => {
    setWebViewPageHeaderShow(open);
    return () => {
      setWebViewPageHeaderShow(true);
    };
  }, [open]);

  const headerElRef = useRef<HTMLDivElement>(null);

  const [headerY, setHeaderY] = useState(0);
  useEffect(() => {
    let frameId: number;
    const trackPosition = () => {
      const el = headerElRef.current;
      if (el) {
        const y = el.getBoundingClientRect().bottom;
        setHeaderY(y);
      }
      frameId = requestAnimationFrame(trackPosition);
    };

    frameId = requestAnimationFrame(trackPosition);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const lowBalanceRewardInfo = useLowBalanceRescueBoxModalStore(
    (state) => state.lowBalanceRewardInfo
  );

  const mainContentElMetrics = useTemplateLayoutStore(
    (state) => state.mainContentElMetrics
  );
  const mainContentWidth = useMemo(() => {
    const width = mainContentElMetrics?.width || 750;
    return width > 750 ? (width - 750) / 2 : 0;
  }, [mainContentElMetrics]);

  return (
    <div>
      <div
        ref={headerElRef}
        className={cx(
          MOBILE_BREAK_POINT_MAX_WIDTH,
          'w-screen',
          'fixed z-40',
          'top-0 left-1/2 -translate-x-1/2',
          'overflow-hidden transition-transform duration-300',
          {
            'translate-y-0': isWebViewPageHeaderShow,
            '-translate-y-[68px]': !isWebViewPageHeaderShow && !isDesktop,
          }
        )}
      >
        <div
          className={cx(
            'border-b bgi-border-[var(--base-2-variant4)]',
            ' pr-6 box-border flex justify-end',
            FLEX_ITEMS_CENTER,
            'gap-2',
            {
              'bgi-[var(--base-2-variant5)]': isDesktop,
              'bgi-[var(--transparent-white-90)]': !isDesktop,
            }
          )}
        >
          <div className={cx('flex items-center gap-4 py-2.5')}>
            {lowBalanceRewardInfo.reward > 0 ? (
              <LowBalanceRescueBoxButton
                isShowText={true}
                iconClassName={'w-7 h-auto'}
                icTipsClassName={'!w-2.5 !h-2.5'}
                textClassName={cx({
                  '!bgi-text-[var(--base-1-variant7)]': isDesktop,
                })}
              />
            ) : null}

            <HeaderDepositButton
              textClassName={cx({
                '!bgi-text-[var(--base-1-variant7)]': isDesktop,
              })}
            />
            <ExitButton
              textClassName={cx({
                '!bgi-text-[var(--base-1-variant7)]': isDesktop,
              })}
            />
          </div>
        </div>
      </div>

      {!isDesktop ? (
        <FloatingBubble
          className={'evan_floating_bubble pb-4 px-2'}
          // axis={isWebViewPageHeaderShow ? undefined : 'x'}
          axis={'x'}
          magnetic={isWebViewPageHeaderShow ? undefined : 'y'}
          style={{
            // '--z-index': '999',
            '--background': 'transparent',
            '--size': 'auto',
            '--border-radius': '0',
            '--initial-position-top': `${headerY}px`,
            '--initial-position-left': `${mainContentWidth + 24}px`,
            '--edge-distance': '0',
          }}
        >
          <Icon
            className={cx('w-auto h-6')}
            name={'ic_collapse_expand'}
            onClick={() => {
              setOpen((prevState) => !prevState);
            }}
          />
        </FloatingBubble>
      ) : null}
    </div>
  );
};

export default WebViewPageHeader;
