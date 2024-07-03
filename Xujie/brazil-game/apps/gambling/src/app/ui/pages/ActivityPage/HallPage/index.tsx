import React, { useEffect, useState } from 'react';
import { environment } from '../../../../../environments/environment';
import { renderByUVersion } from '../../../utils/renderByUVersion';
import { HallPage as U1HallPage } from '../HallPage/env/u1/HallPage';
import { HallPage as U2HallPage } from '../HallPage/env/u2/HallPage';
import { HallPage as P1HallPage } from '../HallPage/env/p1/HallPage';
import { HallPage as U5HallPage } from '../HallPage/env/u5/HallPage';
import { HallPage as U6HallPage } from '../HallPage/env/u6/HallPage';
import { HallPage as U7HallPage } from '../HallPage/env/u7/HallPage';
import { HallPage as U9HallPage } from '../HallPage/env/u9/HallPage';
import { useActivityHall, useActivityHallImpl } from '../hooks/useActivityHall';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import { IActivityPage } from '../index';
import { useDispatch, useSelector } from 'react-redux';
import { appSlice } from '../../../../reduxStore/appSlice';
import { usePageNavigate } from '../../../router/hooks/usePageNavigate';
import { RootState } from '../../../../reduxStore';
import { useActivityNotice } from '../hooks/useActivityNotice';

export type IActivityItem = {
  isShowBadge: boolean;
  isTop: boolean;
  type: string;
  title: string;
  subTitle?: string;
  src: string;
  bgSrc?: string;
  router: string;
};

const ItemActivityResMap: { [key: string]: string } = {
  BOX_INVITE_REWARD: 'event_banner_treasures',
  BET_REWARD: 'event_banner_daily_rebate',
  LOSS_REWARD: 'event_banner_loss_refund',
  INVITE: 'event_banner_convide',
  CHECK_IN: 'event_banner_checkin',
  INITIAL_CHARGE: 'event_banner_primeira_recarga',
  RECHARGE: 'event_banner_cashback',
  LUCKY_WHEEL_REWARD: 'event_banner_fortune_wheel',
};

export interface IHallPage extends IActivityPage {
  isShowRecordButton: boolean;
  onClickToActivity: (queryString?: { category?: string }) => void;
  activityItems: IActivityItem[];
}

export const HallPage = (props: IActivityPage) => {
  const { fontConfig } = props;
  const { activityState } = useActivityHall();
  const { activityStateImpl } = useActivityHallImpl();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [activityItems, setActivityItems] = useState<IActivityItem[]>([]);
  const [activityItemImpl, setActivityItemImpl] = useState<IActivityItem[]>([]);
  const dispatch = useDispatch();
  const { onClickToActivity } = usePageNavigate();
  const { isLogin } = useSelector((state: RootState) => state.app);
  const { noticeState, useNoticeRecord } = useActivityNotice();

  useEffect(() => {
    const items = activityState.activityItems.map((item) => {
      const srcName = ItemActivityResMap[item.type];
      const bannerImg = `${srcName}${
        isMobile ? '_m' : isTablet ? '_t' : ''
      }.png`;
      return {
        isTop: item.isTop,
        isShowBadge: noticeState[item.router],
        type: item.type,
        title: item.title,
        src: `assets/${environment.uVersion}/${environment.mVersion}/${bannerImg}`,
        router: item.router,
      };
    });
    setActivityItems(items);
  }, [activityState]);

  // U9
  useEffect(() => {
    const items = activityStateImpl.activityItems.map((item) => {
      const srcName = ItemActivityResMap[item.type];
      const bannerImg = `${srcName}${
        isMobile ? '_m' : isTablet ? '_t' : ''
      }.png`;
      const bannerImgBg = `${srcName}_bg.png`;
      return {
        isTop: item.isTop,
        isShowBadge: noticeState[item.router],
        type: item.type,
        title: item.title,
        subTitle: item.subTitle,
        src: `assets/${environment.uVersion}/${environment.mVersion}/${bannerImg}`,
        bgSrc: `assets/${environment.uVersion}/${environment.mVersion}/${bannerImgBg}`,
        router: item.router,
      };
    });
    setActivityItemImpl(items);
  }, [activityStateImpl]);

  const handleActivityItemClick = (queryString?: { category?: string }) => {
    isLogin && useNoticeRecord(queryString?.category);
    isLogin
      ? onClickToActivity(queryString)
      : dispatch(appSlice.actions.showLoginDrawerOrModal(true));
  };

  return renderByUVersion(
    {
      u1: (
        <U1HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      u2: (
        <U2HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      p1: (
        <P1HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      u5: (
        <U5HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      u6: (
        <U6HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      u7: (
        <U7HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItems}
        />
      ),
      u9: (
        <U9HallPage
          isShowRecordButton={isLogin}
          fontConfig={fontConfig}
          onClickToActivity={(queryString?: { category?: string }) =>
            handleActivityItemClick(queryString)
          }
          activityItems={activityItemImpl}
        />
      ),
    },
    <U1HallPage
      isShowRecordButton={isLogin}
      fontConfig={fontConfig}
      onClickToActivity={(queryString?: { category?: string }) =>
        handleActivityItemClick(queryString)
      }
      activityItems={activityItems}
    />
  );
};
