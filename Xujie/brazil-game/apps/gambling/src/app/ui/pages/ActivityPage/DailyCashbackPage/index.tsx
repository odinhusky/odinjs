import { IDalyCashbackState, useDalyCashback } from "../hooks/useDalyCashback";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePageNavigate } from "../../../router/hooks/usePageNavigate";
import { renderByUVersion } from "../../../utils/renderByUVersion";
import { DailyCashbackPage as U1DailyCashbackPage } from "../DailyCashbackPage/env/u1/DailyCashbackPage";
import { DailyCashbackPage as U2DailyCashbackPage } from "../DailyCashbackPage/env/u2/DailyCashbackPage";
import { DailyCashbackPage as P1DailyCashbackPage } from "../DailyCashbackPage/env/p1/DailyCashbackPage";
import { DailyCashbackPage as U5DailyCashbackPage } from "../DailyCashbackPage/env/u5/DailyCashbackPage";
import { DailyCashbackPage as U6DailyCashbackPage } from "../DailyCashbackPage/env/u6/DailyCashbackPage";
import { DailyCashbackPage as U9DailyCashbackPage } from "../DailyCashbackPage/env/u9/DailyCashbackPage";
import { environment } from "../../../../../environments/environment";
import useBreakpoint from "../../../pageTemplate/hooks/useBreakpoint";
import { NavigateFunction } from "react-router/dist/lib/hooks";
import { PageOrModalPathEnum } from "../../../PageOrModalPathEnum";
import { IActivityRedeemState, useActivityRedeem } from "../hooks/useActivityRedeem";
import { notification } from "antd";
import { ActivityRedeemableModal } from "../../../modals/ActivityRedeemableModal";
import { IActivityPage } from "../index";
import { useSelector } from "react-redux";
import { RootState } from "../../../../reduxStore";
import { useActivityNotice } from "../hooks/useActivityNotice";
import { ActivityPageRouter } from "../index";

export interface IDailyCashbackPage extends IActivityPage {
  dalyCashbackData: IDalyCashbackState;
  redeemState?: IActivityRedeemState;
  onRefreshDalyCashback?: () => void,
  onClickToActivity: (queryString?: { 'category'?: string }) => void;
  onClickRedeemable: () => void;
  navigate: NavigateFunction;
  internalBannerRes: string;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}


export const DailyCashbackPage = (props: IActivityPage) => {
  const { fontConfig } = props;
  const { onClickToActivity } = usePageNavigate();
  const { dalyCashbackState, useRefreshDalyCashback } = useDalyCashback()
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { activityRedeemState, useRedeem } = useActivityRedeem();
  const [dalyCashbackData, setDalyCashbackData] = useState<IDalyCashbackState>({
    bannerTitle: "",
    isEnabled: false,
    yesterdayBets: "",
    todayBonus: "",
    description: "",
    tableHeads: [],
    tableBody: [],
    isRedeemable: false,
  })
  const bannerName = `internal_event_banner_daily_rebate_genie${isMobile ? '_m' : isTablet ? '_t' : ''}.png`
  const internalBannerRes = `assets/${environment.uVersion}/${environment.mVersion}/${bannerName}`;
  const [api, contextHolder] = notification.useNotification();
  const [openRedeemableModal, setOpenRedeemableModal] = useState(false);
  const { isLogin } = useSelector((state: RootState) => state.app);

  const { useNoticeRecord } = useActivityNotice();

  // 進到這一頁的都是已經登入
  useEffect(() => {
    useNoticeRecord(ActivityPageRouter.DAILY_CASHBACK);
  }, []);

  useEffect(() => {
    if (!isLogin) {
      navigate(PageOrModalPathEnum.ActivityHallPage);
      return;
    }
    if (dalyCashbackState) {
      // 透過 Router 直接進入該頁面，且活動已經結束，直接導航到活動大廳
      // 這裡可能未登入狀態直接使用 navigate
      if (!dalyCashbackState.isEnabled) {
        navigate(PageOrModalPathEnum.ActivityHallPage);
        return
      }
      setDalyCashbackData(dalyCashbackState);
    }
  }, [dalyCashbackState, isLogin])

  const handleRedeemable = () => {
    setDalyCashbackData({
      ...dalyCashbackData,
      isRedeemable: false
    });
    useRedeem("BET_REWARD");
  }

  return (<div>
    {contextHolder}
    {
      renderByUVersion({
        "u1": (
          <U1DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
        "u2": (
          <U2DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
        "p1": (
          <P1DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
        "u5": (
          <U5DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
        "u6": (
          <U6DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
        "u9": (
          <U9DailyCashbackPage
            dalyCashbackData={dalyCashbackData}
            redeemState={activityRedeemState}
            onRefreshDalyCashback={() => {
              useRefreshDalyCashback();
            }}
            onClickToActivity={onClickToActivity}
            onClickRedeemable={() => {
              setOpenRedeemableModal(true)
            }}
            navigate={navigate}
            internalBannerRes={internalBannerRes}
            isDesktop={isDesktop}
            isTablet={isTablet}
            isMobile={isMobile}
            fontConfig={fontConfig}
          />
        ),
      }, (
        <U1DailyCashbackPage
          dalyCashbackData={dalyCashbackData}
          redeemState={activityRedeemState}
          onRefreshDalyCashback={() => {
            useRefreshDalyCashback();
          }}
          onClickToActivity={onClickToActivity}
          onClickRedeemable={() => {
            setOpenRedeemableModal(true)
          }}
          navigate={navigate}
          internalBannerRes={internalBannerRes}
          isDesktop={isDesktop}
          isTablet={isTablet}
          isMobile={isMobile}
          fontConfig={fontConfig}
        />
      ))
    }

    {
      openRedeemableModal ? (
        <ActivityRedeemableModal
          redeemableAmount={`${dalyCashbackData.todayBonus}`}
          title={'Parabéns por ganhar o'}
          submitText={'Claro'}
          onClick={() => {
            handleRedeemable();
            setOpenRedeemableModal(false);
          }}
          onCloseClick={() => {
            setOpenRedeemableModal(false);
          }}
        />
      ) : null
    }


  </div>
  )
}