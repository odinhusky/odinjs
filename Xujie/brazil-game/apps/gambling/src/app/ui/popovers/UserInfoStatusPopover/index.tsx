import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../PageOrModalPathEnum';
import { useSelector, useDispatch } from 'react-redux';

import {
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../reduxStore/appSlice';
import { useLazyGetPunchInConfigQuery } from '../../../external';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { RootState } from '../../../reduxStore';
import { AppLocalStorage } from '../../../persistant/localstorage';
import { environment } from '../../../../environments/environment';
import { UserInfoStatusPopoverContainer as PPopoverContainer } from './env/p1/UserInfoStatusPopoverContainer';
import { UserInfoStatusPopoverContainer as CocoPopoverContainer } from './env/u1/UserInfoStatusPopoverContainer';
import { UserInfoStatusPopoverContainer as WildPopoverContainer } from './env/wild/UserInfoStatusPopoverContainer';
import { UserInfoStatusPopoverContainer as RioPopoverContainer } from './env/u2/UserInfoStatusPopoverContainer';
import { UserInfoStatusPopoverContainer as U5PopoverContainer } from './env/u5/UserInfoStatusPopoverContainer';
import { UserInfoStatusPopoverContainer as U6PopoverContainer } from './env/u6/UserInfoStatusPopoverContainer';
import U7PopoverContainer from './env/u7/U7UserInfoStatusPopoverContainer';

import { UserInfoStatusPopoverVIPInfo as CocoVIPInfo } from './env/u1/UserInfoStatusPopoverVIPInfo';
import { UserInfoStatusPopoverVIPInfo as WildVIPInfo } from './env/wild/UserInfoStatusPopoverVIPInfo';
import { renderByUVersion } from '../../utils/renderByUVersion';
import { UserInfoStatusPopoverBalanceInfo as CocoBalanceInfo } from './env/u1/UserInfoStatusPopoverBalanceInfo';
import { UserInfoStatusPopoverBalanceInfo as WildBalanceInfo } from './env/wild/UserInfoStatusPopoverBalanceInfo';
import { UserInfoStatusPopoverInviteInfo as CocoInviteInfo } from './env/u1/UserInfoStatusPopoverInviteInfo';
import { UserInfoStatusPopoverInviteInfo as WildInviteInfo } from './env/wild/UserInfoStatusPopoverInviteInfo';
import { UserInfoStatusPopoverNavigator as CocoNavigator } from './env/u1/UserInfoStatusPopoverNavigator';
import { UserInfoStatusPopoverNavigator as WildNavigator } from './env/wild/UserInfoStatusPopoverNavigator';
import { UserINfoStatusPopoverUserInfo as CocoUserInfo } from './env/u1/UserINfoStatusPopoverUserInfo';
import { UserInfoStatusPopover as RioUserInfoStatusPopover } from './env/u2';
import { UserInfoStatusPopover as U5UserInfoStatusPopover } from './env/u5';
import { UserInfoStatusPopover as U6UserInfoStatusPopover } from './env/u6';
import U7UserInfoStatusPopover from './env/u7';

import { uiSlice } from '../../../reduxStore/uiSlice';
import { UserInfoStatusPopoverContent as PUserInfoStatusPopoverContent } from './env/p1/UserInfoStatusPopoverContent';

import { AppLocalStorageKey } from '../../../persistant/AppLocalStorageKey';
import { useLocalstorageGetUserVIPInfo } from '../../hooks/useLocalstorageGetUserVIPInfo';
import { useInviteReward } from '../../hooks/useInviteReward';
import { GetVIPInfoResponse } from '../../../external/UserEndpoint';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import cx from '../../utils/cx';

const PopoverContainer = renderByUVersion(
  {
    wild777bet: WildPopoverContainer,
    p1: PPopoverContainer,
    u1: CocoPopoverContainer,
    u2: RioPopoverContainer,
    u5: U5PopoverContainer,
    u6: U6PopoverContainer,
    u7: U7PopoverContainer,
    // }, PernambucanaPopoverContainer)
  },
  CocoPopoverContainer
);

export interface IUserInfoStatusPopoverVIPInfoProps {
  currentLevel: number;
  userVIPInfo?: GetVIPInfoResponse;
}

export interface IUserInfoStatusPopoverBalanceInfoProps {
  totalBalanceSheetValue: number;
  totalReasableValue: number;
}

export interface IUserInfoStatusPopoverInviteInfoProps {
  totalPrize: number;
  bonusAwaitingSettlement: number;
  fullWithdrawable: number;
}

export interface IUserInfoStatusPopoverNavigatorProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const VIPBorderStyleContainer = styled.div`
  padding: 1.5vw 30px;
  //background: rgba(255,255,255,.1);
  //border-radius: 10px;
  //border: 1px solid rgba(255,255,255,.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  //margin-bottom: 15px;
`;

const increment = (target: number) => keyframes`
  from {
    width: 0%;
  }
  to {
    width: ${target}%;
  }
`;

const Progress = styled.div<{ progress: number }>`
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  //background-image: linear-gradient(45deg, #C2F00D 100%, #FFFF00 0%);
  background: url('assets/${environment.uVersion}/process_bar_web_account.png')
    center center no-repeat;
  height: inherit;
  animation: ${(props) => increment(props.progress)} 0.5s linear forwards;
`;

export const ProgressBar1 = ({
  progress,
  currentLevel,
  userVIPInfo,
}: {
  progress: number;
  currentLevel: number;
  userVIPInfo: GetVIPInfoResponse | undefined;
}) => {
  return (
    <div
      className={
        'relative mr-5 h-[30px] w-[310px] flex-auto rounded-3xl bg-assistant leading-[30px]'
      }
    >
      <Progress progress={progress > 1 ? 100 : progress * 100} />
      <span className="absolute right-4 top-0 text-medium">
        VIP {currentLevel + 1}
      </span>
      <span className="absolute text-center top-0 left-4 right-4 text-medium">
        {progress > 1 ? '100' : (progress * 100).toFixed(2)}%
      </span>
      <span className="absolute left-4 top-0 text-medium pr-4">
        VIP {currentLevel}
      </span>
      <span className="text-sm text-main-primary-main">Depósitos totais:</span>
      <span className="text-sm mr-6 text-white">
        R${' '}
        {userVIPInfo?.data?.vip_score ? userVIPInfo?.data?.vip_score / 100 : 0}{' '}
        /
        <span className="mr-6 text-main-primary-main">
          {' '}
          {userVIPInfo?.data?.next_level_score
            ? userVIPInfo?.data?.next_level_score / 100
            : 0}
        </span>
      </span>
      {/*<span className="text-medium" style={{ background: 'linear-gradient(45deg, #FFA500, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>*/}
      {/*<span className="text-[#ffffff]">*/}
      {/*Pontos de apostas:R${' '}*/}
      {/*  {userVIPInfo?.data?.vip_score ? Math.floor(userVIPInfo?.data?.vip_score / 100) : 0}*/}
      {/*</span>*/}
    </div>
  );
};

export const ProgressBar2 = ({
  progress,
  currentLevel,
  userVIPInfo,
}: {
  progress: number;
  currentLevel: number;
  userVIPInfo: GetVIPInfoResponse | undefined;
}) => {
  return (
    <div
      className={
        'relative mr-5 h-[30px] w-[310px] flex-auto rounded-3xl bg-assistant leading-[30px]'
      }
    >
      <Progress progress={progress > 1 ? 100 : progress * 100} />
      <span className="absolute right-4 top-0 text-medium">
        VIP {currentLevel + 1}
      </span>
      <span className="absolute text-center top-0 left-4 right-4 text-medium">
        {progress > 1 ? '100' : (progress * 100).toFixed(2)}%
      </span>
      <span className="absolute left-4 top-0 text-medium pr-4">
        VIP {currentLevel}
      </span>
      {/*<span className="text-medium pr-4" style={{ background: 'linear-gradient(45deg, #FFA500, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>*/}
      <span className="text-sm text-main-primary-main">Pontos de apostas:</span>
      <span className="mr-6 text-white">
        R$ {userVIPInfo?.data?.flow ? userVIPInfo?.data?.flow / 100 : 0} /
        <span className="mr-6 text-main-primary-main">
          {' '}
          {userVIPInfo?.data?.next_level_flow
            ? userVIPInfo?.data?.next_level_flow / 100
            : 0}
        </span>
      </span>

      {/*<span className="text-medium pr-4" style={{ background: 'linear-gradient(45deg, #FFA500, #FFFFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>*/}
      {/*  <span className="mr-6 text-[#ffffff]">*/}
      {/*  Depósitos totais:R${' '}*/}
      {/*    {userVIPInfo?.data?.flow*/}
      {/*        ? userVIPInfo?.data?.flow / 100*/}
      {/*        : 0}*/}
      {/*</span>*/}
    </div>
  );
};

export const VIPContainer = styled.div`
  background: var(--varient);
  background-size: 100% 100%;
  border: 1px solid var(--main-primary-main);
  border-radius: 10px;
  padding: 1px;
  height: 230px;
`;

export const ContaContainer = styled.div`
  background: var(--varient);
  background-size: 100% 100%;
  border: 1px solid var(--main-primary-main);
  border-radius: 10px;
  padding: 1px;
  height: 145px;
`;

export const OtherContainer = styled.div`
  background: var(--varient);
  background-size: 100% 100%;
  border: 1px solid var(--main-primary-main);
  border-radius: 10px;
`;

type IUserInfoStatusPopover = {
  close: () => void;
  className: string;
};
export const UserInfoStatusPopover = (props: IUserInfoStatusPopover) => {
  const navigate = useNavigate();

  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);
  const { totalPrize, bonusAwaitingSettlement, fullWithdrawable } =
    useInviteReward();

  // console.log("inviteInfo", inviteInfo);
  // console.log("inviteUnsettle", inviteUnsettle);

  const [triggerGetSignConfig, { data: signInConfig }] =
    useLazyGetPunchInConfigQuery();

  // const [triggerGetUserVIPInfo, { data: userVIPInfo }] = useGetVIPInfoMutation();
  const { userVIPInfo } = useLocalstorageGetUserVIPInfo();

  useEffect(() => {
    const token = AppLocalStorage.getItem(AppLocalStorageKey.token);
    if (token && token !== '' && token !== 'undefined') {
      triggerGetSignConfig(null);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const token = AppLocalStorage.getItem(AppLocalStorageKey.token) || '';
      triggerGetSignConfig(null);
    };
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, []);

  const vip_level = useSelector((state: RootState) => state.app?.vip_level);
  // console.log("vip_level", vip_level);

  const [currentLevel, setCurrentLevel] = useState(vip_level);
  // console.log("user", user);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(appSlice.actions.setUserStore({
    //   ...userData,
    //   userinfo: {
    //     vip_level,
    //   }
    // });
    //

    // dispatch(appSlice.actions.setUserStore({
    //   ...userData,
    //   userinfo: {
    //     vip_level
    //   }
    // } as any));
    if (!signInConfig) return;
    // dispatch(appSlice.actions.setUserVIPLevel(signInConfig?.data?.vipLevel))

    setCurrentLevel(vip_level);
  }, [signInConfig]);

  // useEffect(() => {
  //   const close = () => props.close();
  //   window.addEventListener("scroll", close);
  //
  //   return () => {
  //     window.removeEventListener("scroll", close);
  //   }
  // }, []);

  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );

  return (
    <div
      className={cx(
        'z-[1000] fixed left-0 top-0 right-0 bottom-0',
        FLEX_CENTER,
        'flex-col',
        'w-full h-full',
        {
          'z-[1002]': environment.uVersion === 'u7',
        }
      )}
      onClick={(event) => {
        props.close();
      }}
    >
      <PopoverContainer
        onMouseLeave={() => {
          console.log('mouseOverDesktopHeader', openUserInfoStatusPopover);
          if (openUserInfoStatusPopover) {
            dispatch(
              uiSlice.actions.setUserInfoStatusPopover(
                !openUserInfoStatusPopover
              )
            );
          }
        }}
        className={props.className}
      >
        {renderByUVersion(
          {
            wild777bet: (
              <>
                <WildVIPInfo
                  userVIPInfo={userVIPInfo}
                  currentLevel={currentLevel}
                />
                <WildBalanceInfo
                  totalBalanceSheetValue={totalBalanceSheetValue}
                  totalReasableValue={totalReasableValue}
                />
                <WildInviteInfo
                  totalPrize={totalPrize}
                  bonusAwaitingSettlement={bonusAwaitingSettlement}
                  fullWithdrawable={fullWithdrawable}
                />
                <WildNavigator
                  onClick={() => navigate(PageOrModalPathEnum.SettingPage)}
                >
                  <div className={'flex flex-row items-center'}>
                    <img
                      className="w-[26px] h-[26px] mr-2"
                      alt="arrow"
                      src={`assets/${environment.uVersion}/ic_account_edit.png`}
                    />
                    <span>Modificar dados</span>
                  </div>
                </WildNavigator>
                <WildNavigator
                  onClick={() => navigate(PageOrModalPathEnum.GameRecordPage)}
                >
                  <div className={'flex flex-row items-center'}>
                    <img
                      className="w-[26px] h-[26px] mr-2"
                      alt="arrow"
                      src={`assets/${environment.uVersion}/ic_account_record.png`}
                    />
                    <span>Registro do jogo</span>
                  </div>
                </WildNavigator>
              </>
            ),
            u1: (
              <>
                <CocoUserInfo />
                <CocoVIPInfo
                  userVIPInfo={userVIPInfo}
                  currentLevel={currentLevel}
                />
                <CocoBalanceInfo
                  totalBalanceSheetValue={totalBalanceSheetValue}
                  totalReasableValue={totalReasableValue}
                />
                <CocoInviteInfo
                  totalPrize={totalPrize}
                  bonusAwaitingSettlement={bonusAwaitingSettlement}
                  fullWithdrawable={fullWithdrawable}
                />
                <CocoNavigator
                  onClick={() => navigate(PageOrModalPathEnum.GameRecordPage)}
                >
                  <div>Registro Do Jogo</div>
                </CocoNavigator>
                <CocoNavigator
                  onClick={() => navigate(PageOrModalPathEnum.SettingPage)}
                >
                  <div>Modificar Dados</div>
                </CocoNavigator>
              </>
            ),
            u2: (
              <RioUserInfoStatusPopover
                userVIPInfo={userVIPInfo}
                close={props.close}
                currentLevel={currentLevel}
                totalBalanceSheetValue={totalBalanceSheetValue}
                totalReasableValue={totalReasableValue}
                totalPrize={totalPrize}
                bonusAwaitingSettlement={bonusAwaitingSettlement}
                fullWithdrawable={fullWithdrawable}
              />
            ),
            p1: (
              <PUserInfoStatusPopoverContent
                userVIPInfo={userVIPInfo}
                close={props.close}
                currentLevel={currentLevel}
                totalBalanceSheetValue={totalBalanceSheetValue}
                totalReasableValue={totalReasableValue}
                totalPrize={totalPrize}
                bonusAwaitingSettlement={bonusAwaitingSettlement}
                fullWithdrawable={fullWithdrawable}
              />
            ),
            u5: (
              <U5UserInfoStatusPopover
                userVIPInfo={userVIPInfo}
                close={props.close}
                currentLevel={currentLevel}
                totalBalanceSheetValue={totalBalanceSheetValue}
                totalReasableValue={totalReasableValue}
                totalPrize={totalPrize}
                bonusAwaitingSettlement={bonusAwaitingSettlement}
                fullWithdrawable={fullWithdrawable}
              />
            ),
            u6: (
              <U6UserInfoStatusPopover
                userVIPInfo={userVIPInfo}
                currentLevel={currentLevel}
                close={props.close}
                totalBalanceSheetValue={totalBalanceSheetValue}
                totalReasableValue={totalReasableValue}
                totalPrize={totalPrize}
                bonusAwaitingSettlement={bonusAwaitingSettlement}
                fullWithdrawable={fullWithdrawable}
              />
            ),
            u7: (
              <U7UserInfoStatusPopover
                userVIPInfo={userVIPInfo}
                currentLevel={currentLevel}
                onClose={props.close}
                totalBalanceSheetValue={totalBalanceSheetValue}
                totalReasableValue={totalReasableValue}
                totalPrize={totalPrize}
                bonusAwaitingSettlement={bonusAwaitingSettlement}
                fullWithdrawable={fullWithdrawable}
              />
            ),
          },
          <>
            <CocoUserInfo />
            <CocoVIPInfo
              userVIPInfo={userVIPInfo}
              currentLevel={currentLevel}
            />
            <CocoBalanceInfo
              totalBalanceSheetValue={totalBalanceSheetValue}
              totalReasableValue={totalReasableValue}
            />
            <CocoInviteInfo
              totalPrize={totalPrize}
              bonusAwaitingSettlement={bonusAwaitingSettlement}
              fullWithdrawable={fullWithdrawable}
            />
            <CocoNavigator
              onClick={() => navigate(PageOrModalPathEnum.GameRecordPage)}
            >
              <div>Registro Do Jogo</div>
            </CocoNavigator>
            <CocoNavigator
              onClick={() => navigate(PageOrModalPathEnum.SettingPage)}
            >
              <div>Modificar Dados</div>
            </CocoNavigator>
          </>
        )}
      </PopoverContainer>
    </div>
  );
};
