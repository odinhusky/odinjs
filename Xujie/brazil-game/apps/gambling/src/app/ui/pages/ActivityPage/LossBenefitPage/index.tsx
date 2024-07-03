import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import { ILossBenefitState, useLossBenefit } from '../hooks/useLossBenefit';
import { usePageNavigate } from '../../../router/hooks/usePageNavigate';
import { environment } from '../../../../../environments/environment';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { LossBenefitPage as U1LossBenefitPage } from '../LossBenefitPage/env/u1/LossBenefitPage';
import { LossBenefitPage as U2LossBenefitPage } from '../LossBenefitPage/env/u2/LossBenefitPage';
import { LossBenefitPage as P1LossBenefitPage } from '../LossBenefitPage/env/p1/LossBenefitPage';
import { LossBenefitPage as U5LossBenefitPage } from '../LossBenefitPage/env/u5/LossBenefitPage';
import { LossBenefitPage as U6LossBenefitPage } from '../LossBenefitPage/env/u6/LossBenefitPage';
import { LossBenefitPage as U7LossBenefitPage } from '../LossBenefitPage/env/u7/LossBenefitPage';
import { LossBenefitPage as U9LossBenefitPage } from '../LossBenefitPage/env/u9/LossBenefitPage';
import { renderByUVersion } from '../../../utils/renderByUVersion';
import { PageOrModalPathEnum } from '../../../PageOrModalPathEnum';
import {
  IActivityRedeemState,
  useActivityRedeem,
} from '../hooks/useActivityRedeem';
import { ActivityRedeemableModal } from '../../../modals/ActivityRedeemableModal';
import { IActivityPage } from '../index';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { useActivityNotice } from '../hooks/useActivityNotice';
import { ActivityPageRouter } from '../index';

export interface ILossBenefitPage extends IActivityPage {
  lossBenefitData: ILossBenefitState;
  redeemState?: IActivityRedeemState;
  onRefreshLossBenefit?: () => void;
  onClickToActivity: (queryString?: { category?: string }) => void;
  onClickRedeemable: () => void;
  navigate: NavigateFunction;
  internalBannerRes: string;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

export const LossBenefitPage = (props: IActivityPage) => {
  const { fontConfig } = props;
  const { lossBenefitState, useRefreshLossBenefit } = useLossBenefit();
  const { onClickToActivity } = usePageNavigate();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [lossBenefitData, setLossBenefitData] = useState<ILossBenefitState>({
    bannerTitle: '',
    isEnabled: true,
    yesterdayLoss: '',
    todayBonus: '',
    description: '',
    tableHeads: [],
    tableBody: [],
    isRedeemable: false,
  });

  const bannerName = `internal_event_banner_loss_refund_genie${isMobile ? '_m' : isTablet ? '_t' : ''
    }.png`;
  const internalBannerRes = `assets/${environment.uVersion}/${environment.mVersion}/${bannerName}`;
  const [openRedeemableModal, setOpenRedeemableModal] = useState(false);
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const { activityRedeemState, useRedeem } = useActivityRedeem();
  const { useNoticeRecord } = useActivityNotice();

  // 進到這一頁的都是已經登入
  useEffect(() => {
    useNoticeRecord(ActivityPageRouter.LOSS_RELIEF);
  }, []);

  useEffect(() => {
    if (!isLogin) {
      navigate(PageOrModalPathEnum.ActivityHallPage);
      return;
    }

    if (lossBenefitState) {
      // 透過 Router 直接進入該頁面，且活動已經結束，直接導航到活動大廳
      // 這裡可能未登入狀態直接使用 navigate
      if (!lossBenefitState.isEnabled) {
        navigate(PageOrModalPathEnum.ActivityHallPage);
        return;
      }
      setLossBenefitData(lossBenefitState);
    }
  }, [lossBenefitState, isLogin]);

  const handleRedeemable = () => {
    setLossBenefitData({
      ...lossBenefitData,
      isRedeemable: false,
    });
    useRedeem('LOSS_REWARD');
  };

  return (
    <div>
      {renderByUVersion(
        {
          u1: (
            <U1LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          u2: (
            <U2LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          p1: (
            <P1LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          u5: (
            <U5LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          u6: (
            <U6LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          u7: (
            <U7LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
          u9: (
            <U9LossBenefitPage
              lossBenefitData={lossBenefitData}
              redeemState={activityRedeemState}
              onRefreshLossBenefit={() => {
                useRefreshLossBenefit();
              }}
              onClickToActivity={onClickToActivity}
              onClickRedeemable={() => {
                setOpenRedeemableModal(true);
              }}
              navigate={navigate}
              internalBannerRes={internalBannerRes}
              isDesktop={isDesktop}
              isTablet={isTablet}
              isMobile={isMobile}
              fontConfig={fontConfig}
            />
          ),
        },
        <U1LossBenefitPage
          lossBenefitData={lossBenefitData}
          redeemState={activityRedeemState}
          onRefreshLossBenefit={() => {
            useRefreshLossBenefit();
          }}
          onClickToActivity={onClickToActivity}
          onClickRedeemable={() => {
            setOpenRedeemableModal(true);
          }}
          navigate={navigate}
          internalBannerRes={internalBannerRes}
          isDesktop={isDesktop}
          isTablet={isTablet}
          isMobile={isMobile}
          fontConfig={fontConfig}
        />
      )}

      {openRedeemableModal && (
        <ActivityRedeemableModal
          redeemableAmount={`${lossBenefitData.todayBonus}`}
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
      )}
    </div>
  );
};
