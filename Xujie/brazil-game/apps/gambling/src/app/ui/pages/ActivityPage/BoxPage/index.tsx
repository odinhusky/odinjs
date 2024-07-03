import { BoxPage as U1BoxPage } from './env/u1/BoxPage';
import { BoxPage as U2BoxPage } from './env/u2/BoxPage';
import { BoxPage as U5BoxPage } from './env/u5/BoxPage';
import { BoxPage as U6BoxPage } from './env/u6/BoxPage';
import { BoxPage as P1BoxPage } from './env/p1/BoxPage';
import { BoxPage as U7BoxPage } from './env/u7/BoxPage';
import { renderByUVersion } from '../../../utils/renderByUVersion';
import { IActivityFontConfig } from '../hooks/useActivityFontConfig';
import { usePageNavigate } from '../../../router/hooks/usePageNavigate';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { useEffect } from 'react';
import { environment } from '../../../../../environments/environment';
import useBreakpoint from '../../../pageTemplate/hooks/useBreakpoint';
import { useInviteInCompatible } from '../../../hooks/useInviteInCompatible';
import { useGetBoxInfoQuery } from '../../../../external';
import { ActivityPageRouter } from '../index';
import { useActivityNotice } from '../hooks/useActivityNotice';

export interface IBoxPageProps {
  internalBannerRes: string;
  fontConfig?: IActivityFontConfig;
  isFromActivity: boolean;
}

export const BoxPage = ({
  fontConfig,
  isFromActivity,
}: {
  fontConfig?: IActivityFontConfig;
  isFromActivity: boolean;
}) => {
  const { onClickToActivity, onClickToIndex } = usePageNavigate();

  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const { isMobile, isTablet } = useBreakpoint();

  const bannerName = `internal_event_banner_treasures${
    isMobile ? '_m' : isTablet ? '_t' : ''
  }.png`;
  const internalBannerRes = `assets/${environment.uVersion}/${environment.mVersion}/${bannerName}`;
  const { isShowBoxInvite } = useInviteInCompatible();
  const { data } = useGetBoxInfoQuery(null);
  const { useNoticeRecord } = useActivityNotice();

  // 進到這一頁的都是已經登入
  useEffect(() => {
    useNoticeRecord(ActivityPageRouter.BOX_INVITE_REWARD);
  }, []);

  useEffect(() => {
    if (!isLogin) {
      onClickToActivity();
    }
  }, [isLogin]);

  // 防呆，邀請互斥避免直接從 Router 進入
  // 並且判斷是否登入，直接進入邀請功能頁面或到活動大廳
  useEffect(() => {
    if (isShowBoxInvite !== undefined && !isShowBoxInvite) {
      isFromActivity ? onClickToActivity() : onClickToIndex();
    }
  }, [isShowBoxInvite]);

  // 判斷活動是否關閉
  if (data !== undefined) {
    if (!data.data.enabled) {
      onClickToActivity();
    }
  }

  return renderByUVersion(
    {
      p1: (
        <P1BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
      u1: (
        <U1BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
      u2: (
        <U2BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
      u5: (
        <U5BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
      u6: (
        <U6BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
      u7: (
        <U7BoxPage
          fontConfig={fontConfig}
          internalBannerRes={internalBannerRes}
          isFromActivity={isFromActivity}
        />
      ),
    },
    <U1BoxPage
      fontConfig={fontConfig}
      internalBannerRes={internalBannerRes}
      isFromActivity={isFromActivity}
    />
  );
};
