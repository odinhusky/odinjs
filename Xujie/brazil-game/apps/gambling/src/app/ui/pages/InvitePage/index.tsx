// NOTE; https://www.npmjs.com/package/react-multi-carousel
import styled from 'styled-components';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { HowToInviteTabSection } from './HowToInviteTabSection';
import { InviteRecordInfoTabSection } from './InviteRecordInfoTabSection/index';
import {
  useLazyGetInviteRewardDataQuery,
  useLazyGetUnsettleInviteRewardDataQuery,
} from '../../../external';
import { useAllowLoginRouterRules } from '../../router/hooks/useAllowLoginRouterRules';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore';
import { usePageNavigate } from '../../router/hooks/usePageNavigate';
import { InvitePage as U1InvitePage } from './env/u1/InvitePage';
import { InvitePage as P1InvitePage } from './env/p1/InvitePage';
import { InvitePage as U2InvitePage } from './env/u2/InvitePage';
import { InvitePage as WInvitePage } from './env/wild/InvitePage';
import { InvitePage as U5InvitePage } from './env/u5/InvitePage';
import { InvitePage as U6InvitePage } from './env/u6/InvitePage';
import { InvitePage as U7InvitePage } from './env/u7/InvitePage';
import { renderByUVersion } from '../../utils/renderByUVersion';
import { useInviteInCompatible } from '../../hooks/useInviteInCompatible';
import { useLocation, useNavigate } from 'react-router';
import { formatLocaleMoney } from '../../utils/format';

export const QuestionContainer = styled.div`
  padding: 2vw 3vw;
  //background: rgba(9,11,15,.6);
  //border-radius: 20px;
  margin: 20px 0;
`;

export interface IPanelMode {
  panelMode: 'howto' | 'daily';
  setPanelMode: React.Dispatch<React.SetStateAction<'howto' | 'daily'>>;
  level1RechargeData: Level1RechargeData;
}

export type IInvitePage = {
  isFromActivity: boolean;
  children: ReactNode;
} & IPanelMode;

export type IInviteActivityPage = {
  isFromActivity: boolean;
};

export type Level1RechargeData = {
  isAvgAmountShow: boolean;
  avgAmountText: string;
  isShowDividends: boolean;
  dividendsText: string;
};

export const InvitePage = (props: IInviteActivityPage) => {
  useAllowLoginRouterRules();
  const location = useLocation();
  const navigate = useNavigate();
  const { onClickToIndex, onClickToActivity } = usePageNavigate();
  const [panelMode, setPanelMode] = useState<IPanelMode['panelMode']>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('panelMode') as IPanelMode['panelMode']) || 'howto';
  });

  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const { isShowBoxInvite } = useInviteInCompatible();
  const [
    triggerGetInviteReward,
    { currentData: inviteInfo, isFetching: isInviteInfoFetching },
  ] = useLazyGetInviteRewardDataQuery({
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const [
    triggerGetUnsettleInviteReward,
    { currentData: inviteUnsettle, isFetching: isInviteUnsettleFetching },
  ] = useLazyGetUnsettleInviteRewardDataQuery({
    pollingInterval: 0,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isLogin) {
      triggerGetInviteReward({});
      triggerGetUnsettleInviteReward({});
    }
  }, []);

  // 是否顯示平均值
  const level1RechargeData: Level1RechargeData = useMemo(() => {
    const respData = inviteInfo?.data;
    if (!respData) {
      return {
        isAvgAmountShow: false,
        avgAmountText: '',
        isShowDividends: false,
        dividendsText: '',
      };
    }

    const isAvgAmountShow = respData.recharge1AvgAmount !== null;
    const recharge1AvgAmount = respData.recharge1AvgAmount || 0;
    const isShowDividends = respData.proxyType === 1;
    const level1Reward = respData.rewd1Reward || 0;
    const result = {
      isAvgAmountShow: isAvgAmountShow,
      avgAmountText: isAvgAmountShow
        ? `Média de depósito: R$ ${formatLocaleMoney(recharge1AvgAmount / 100)}`
        : '',
      isShowDividends: isShowDividends,
      dividendsText: isShowDividends
        ? `Dividends: R$ ${formatLocaleMoney(level1Reward)}`
        : '',
    };
    return result;
  }, [inviteInfo]);

  // 防呆，邀請互斥避免直接從 Router 進入
  // 並且判斷是否登入，直接進入寶箱活動或到活動大廳
  useEffect(() => {
    if (isShowBoxInvite) {
      props.isFromActivity ? onClickToActivity() : onClickToIndex();
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set('panelMode', panelMode);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [isShowBoxInvite, panelMode]);

  // NOTE: window focus change
  useEffect(() => {
    const handler = () => {
      triggerGetInviteReward({});
      triggerGetUnsettleInviteReward({});
    };
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, []);

  const TabContent = useCallback(() => {
    return panelMode === 'howto' ? (
      <HowToInviteTabSection
        inviteUrl={inviteInfo?.data?.inviteUrl || ''}
        panelMode={panelMode}
        setPanelMode={setPanelMode}
        level1RechargeData={level1RechargeData}
      />
    ) : (
      inviteInfo !== undefined && inviteUnsettle !== undefined && (
        <InviteRecordInfoTabSection
          inviteInfo={inviteInfo}
          inviteUnsettle={inviteUnsettle}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          level1RechargeData={level1RechargeData}
        />
      )
    );
  }, [panelMode, inviteUnsettle, inviteInfo]);
  return renderByUVersion(
    {
      p1: (
        <P1InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      u1: (
        <U1InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      wild777bet: (
        <WInvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      u2: (
        <U2InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      u5: (
        <U5InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      u6: (
        <U6InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
      u7: (
        <U7InvitePage
          isFromActivity={props.isFromActivity}
          level1RechargeData={level1RechargeData}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
          children={<TabContent />}
        />
      ),
    },
    <P1InvitePage
      isFromActivity={props.isFromActivity}
      level1RechargeData={level1RechargeData}
      panelMode={panelMode}
      setPanelMode={setPanelMode}
      children={<TabContent />}
    />
  );
};
