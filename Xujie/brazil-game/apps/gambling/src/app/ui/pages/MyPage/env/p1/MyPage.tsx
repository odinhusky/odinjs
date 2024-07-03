import React, { useEffect } from 'react';
import { Avatar } from '../../../../components/Avatar';
import { AvatarAccountInfo } from '../../../../components/AvatarAccountInfo';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { environment } from '../../../../../../environments/environment';
import { MessageCountBadge } from '../../../../components/MessageCountBadge';
import { RightOutlined } from '@ant-design/icons';
import {
  appSlice,
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../../../reduxStore/appSlice';
import { VIPBorderStyleContainer } from '../../index';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import styled, { keyframes } from 'styled-components';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import CurrentVIPIcon from '../../../../components/CurrentVIPIcon';
import { clampNumber, formatLocaleMoney } from '../../../../utils/format';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import cx from 'classnames';
import { useUserDama } from '../../../../hooks/useUserDama';

const ListItemContainer = styled.div`
  background: var(--varient);
  border: 1px solid var(--main-primary-main);
  background-size: 100% 100%;
  border-radius: 10px;
  padding: 1px;
  height: 49px;
  margin-top: 10px;
`;

const MyPageButtonD = styled.button`
  background-image: url('assets/${environment.uVersion}/btn_green05.png');
  background-size: 100% 100%;
  padding: 4px 31px;
  text-shadow: 0 1px 2px #036a02;
`;

const MyPageButtonW = styled.button`
  //background: none;
  //border-radius: 0.2rem;
  background-image: url('assets/${environment.uVersion}/btn_yellow05.png'); /* 设置背景图像的路径 */
  background-size: 100% 100%;
  //box-shadow: 0 0.04rem #036a02, inset 0 0.02rem 0.06rem rgba(255,255,255,.5);

  padding: 4px 40px;
  text-shadow: 0 1px 2px #036a02;
`;

const DepositAndWithdrawalContainer = styled.div`
  background-color: var(--varient);
  border: 1px solid var(--main-primary-main);
  background-size: 100% 100%;
  border-radius: 10px;
  padding: 1px;
  height: 110px;
  margin-top: 10px;
`;

const VIPContainer = styled.div`
  background-color: var(--varient);
  border: 1px solid var(--main-primary-main);
  background-size: 100% 100%;
  border-radius: 10px;
  padding: 1px;
  height: 200px;
`;

const ListItem = styled.button.attrs((props) => ({
  className: 'text-lg w-full',
}))<{
  last?: boolean;
  first?: boolean;
  // expand?: boolean;
  bottomBorder?: boolean;
}>`
  ${(props) =>
    props.first &&
    `
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  `};

  ${(props) =>
    props.last &&
    `
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  `};

  //box-shadow: inset 0 0 36px 5px rgba(255,255,255,.11) !important;
  border-bottom: ${(props) =>
    props.bottomBorder ? '1px rgba(255,255,255,0.2) solid' : 'none'};

  padding: 10px 12px;
  text-align: left;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const increment = (target: number) => keyframes`
  from {
    width: 0%;
  }
  to {
    width: ${target}%;
  }
`;

interface IPernambucana777BetMyPageProps {
  userVIPInfo?: GetVIPInfoResponse;
  currentLevel: number;
}

const MyPage = ({
  userVIPInfo,
  currentLevel,
}: IPernambucana777BetMyPageProps) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  // const messageCount = useSelector(
  //   (state: RootState) => state.app.messageCount
  // );
  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    onClickToWallet,
    onClickToVipGrade,
    onClickToGameRecord,
    onClickToSetting,
    onClickToNotification,
  } = usePageNavigate();

  const { damaResult } = useUserDama();

  const progressIndicatorStyleMapping = {
    m4: 'linear-gradient(90deg,var(--lineary-progress-from),var(--lineary-progress-to))',
    default:
      'linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))',
  };

  const progressIndicatorStyle =
    progressIndicatorStyleMapping[
      environment.mVersion as keyof typeof progressIndicatorStyleMapping
    ] || progressIndicatorStyleMapping.default;

  const depositString = `R$ ${formatLocaleMoney(totalBalanceSheetValue)}`;
  const withdrawString = `R$ ${formatLocaleMoney(totalReasableValue)}`;

  const vipDepositString = `R$ ${formatLocaleMoney(
    userVIPInfo?.data?.vip_score ? userVIPInfo?.data?.vip_score / 100 : 0
  )} / R$ ${formatLocaleMoney(
    userVIPInfo?.data?.next_level_score
      ? userVIPInfo?.data?.next_level_score / 100
      : 0
  )}`;
  const vipFlowString = `R$ ${formatLocaleMoney(
    userVIPInfo?.data?.flow ? userVIPInfo?.data?.flow / 100 : 0
  )} / R$ ${formatLocaleMoney(
    userVIPInfo?.data?.next_level_flow
      ? userVIPInfo?.data?.next_level_flow / 100
      : 0
  )}`;

  return (
    <PageContainer>
      <div className="p-4 rounded-lg bg-[#047A70] border-[2px] border-[#85F1F8]">
        <section className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <Avatar className="rounded-lg h-[50px] w-[50px]" />
            <div className="flex flex-col justify-between">
              <div className="text-white text-base">{user.nickname}</div>
              <div className="text-white text-sm flex items-center gap-1">
                <span className={'text-[#FDEF70]'}>ID:{user.user_id}</span>
                <CopyIcon copyText={user.user_id} className="text-[#FDEF70]" />
              </div>
            </div>
          </div>

          <button className="relative" onClick={onClickToNotification}>
            <img
              alt={'message'}
              className="w-[32px] h-[32px]"
              src={`assets/${environment.uVersion}/ic_notification.png`}
            />
          </button>
        </section>

        <div className="mt-3 px-3 pt-2 pb-4 bg-gradient-to-b from-[#23898D] to-[#196366] border-[2px] rounded-lg border-[#85F1F8]">
          <div className="flex justify-between items-center">
            <CurrentVIPIcon
              className="gap-[10px] flex-row w-[135px]"
              level={currentLevel}
              imageClassName="w-[64px]"
              textClassName="w-[61px]"
            />

            <RightOutlined
              style={{ fontSize: 25, color: 'white', fontWeight: 1000 }}
              onClick={() => onClickToVipGrade()}
            />
          </div>

          <div className="w-full flex justify-between items-center mt-2">
            <div className="text-white">
              Próximo nível:{' '}
              {clampNumber(
                ((userVIPInfo?.data?.vip_score || 0) /
                  (userVIPInfo?.data?.next_level_score || 1)) *
                  100,
                0,
                100
              ).toFixed(0)}
              %
            </div>

            <div className="text-[#FDEF70]">
              Depósitos totais: R${' '}
              {formatLocaleMoney(
                userVIPInfo?.data?.vip_score
                  ? userVIPInfo?.data?.vip_score / 100
                  : 0
              )}
            </div>
          </div>

          <ProgressBar
            className={cx(
              'bg-white mt-2',
              vipDepositString.length > 45
                ? 'h-12'
                : vipDepositString.length > 26
                ? 'h-8'
                : 'h-6'
            )}
            rounded="rounded-xl"
            progress={
              (userVIPInfo?.data?.vip_score || 0) /
              (userVIPInfo?.data?.next_level_score || 1)
            }
            progressColor="linear-gradient(180deg,#FBFF3F,#FEC600)"
          >
            <div className="h-full flex px-3 items-center justify-between text-[#6A3C12] font-normal">
              <div>VIP{currentLevel}</div>
              <div className={'text-xs text-center px-1'}>
                {vipDepositString}
              </div>
              <div>VIP{currentLevel + 1}</div>
            </div>
          </ProgressBar>

          <div className="w-full flex justify-between items-center mt-2">
            <div className="text-white">
              Próximo nível:{' '}
              {clampNumber(
                userVIPInfo?.data?.flow_progress || 0,
                0,
                100
              ).toFixed(0)}
              %
            </div>

            <div className="text-[#FDEF70]">
              Pontos de apostas: R${' '}
              {formatLocaleMoney(
                userVIPInfo?.data?.flow ? userVIPInfo?.data?.flow / 100 : 0
              )}
            </div>
          </div>

          <ProgressBar
            className={cx(
              'bg-white mt-2',
              vipFlowString.length > 45
                ? 'h-12'
                : vipFlowString.length > 26
                ? 'h-8'
                : 'h-6'
            )}
            rounded="rounded-xl"
            progress={
              userVIPInfo?.data?.flow_progress
                ? userVIPInfo?.data?.flow_progress / 100
                : 0
            }
            progressColor="linear-gradient(180deg,#FBFF3F,#FEC600)"
          >
            <div className="h-full flex px-3 items-center justify-between text-[#6A3C12] font-normal">
              <div>VIP{currentLevel}</div>
              <div className={'text-xs text-center px-1'}>{vipFlowString}</div>
              <div>VIP{currentLevel + 1}</div>
            </div>
          </ProgressBar>
        </div>

        <div className="flex flex-col flex-none mt-3 rounded-b-lg overflow-hidden">
          <div className="bg-[var(--white-30)] flex justify-between items-center text-white px-[14px] py-3 rounded-t-lg">
            <div className="text-base font-medium">Total Da Conta</div>

            <RightOutlined
              style={{ fontSize: 20, color: 'white', fontWeight: 1000 }}
              onClick={() => onClickToWallet({ panelType: 'deposit' })}
            />
          </div>
          <div className="bg-[rgba(161,193,255,0.2)] px-3 py-4 flex justify-between text-white gap-6">
            <div className="flex flex-col justify-between items-center w-1/2 gap-2">
              <div className="font-medium text-base">{depositString}</div>
              <div className="font-medium text-sm">Fundos totais</div>
              <button
                className="w-full py-[10px] rounded-lg bg-gradient-to-r from-[#FF7373] to-[#9E21FF]"
                onClick={() => onClickToWallet({ panelType: 'deposit' })}
              >
                Depósito
              </button>
            </div>

            <div className="flex flex-col justify-between items-center w-1/2 gap-2">
              <div className="font-medium text-base">{withdrawString}</div>
              <div className="font-medium text-sm">Retirável Total</div>
              <button
                className="w-full py-[10px] rounded-lg bg-gradient-to-r from-[#FFA775] to-[#FF2121]"
                onClick={() => onClickToWallet({ panelType: 'withdraw' })}
              >
                Retirar
              </button>
            </div>
          </div>

          {/*打码进度*/}
          {damaResult.isShowDama ? (
            <div
              className="rounded-b-lg bg-[var(--white-30)] px-3 py-4 flex flex-col justify-between text-white" /**p-4 rounded-2xl bg-[var(--grayscale-20)]  */
            >
              <div className="w-full flex justify-between items-center">
                <div className="text-white">
                  Próximo Progresso atual de apostas
                </div>
              </div>
              <ProgressBar
                className={cx(
                  'bg-white mt-2',
                  vipFlowString.length > 45
                    ? 'h-12'
                    : vipFlowString.length > 26
                    ? 'h-8'
                    : 'h-6'
                )}
                rounded="rounded-xl"
                progress={damaResult.progressValue}
                progressColor="linear-gradient(180deg,#FBFF3F,#FEC600)"
              >
                <div className="h-full flex px-3 items-center justify-center text-[#6A3C12] font-normal">
                  <div className={'text-xs text-center px-1'}>
                    {damaResult.progressText ? damaResult.progressText : '0%'}
                  </div>
                </div>
              </ProgressBar>
            </div>
          ) : null}
        </div>

        <div
          className="mt-2 bg-[rgba(161,193,255,0.2)] rounded-lg px-[14px] py-3 flex justify-between text-base font-medium text-white items-center"
          onClick={() => onClickToWallet({ panelType: 'record' })}
        >
          <div>Registros de cobrança</div>
          <RightOutlined
            style={{ fontSize: 25, color: 'white', fontWeight: 1000 }}
          />
        </div>

        <div
          className="mt-2 bg-[rgba(161,193,255,0.2)] rounded-lg px-[14px] py-3 flex justify-between text-base font-medium text-white items-center"
          onClick={() => onClickToGameRecord()}
        >
          <div>Registro do jogo</div>
          <RightOutlined
            style={{ fontSize: 25, color: 'white', fontWeight: 1000 }}
          />
        </div>

        <div
          className="mt-2 bg-[rgba(161,193,255,0.2)] rounded-lg px-[14px] py-3 flex justify-between text-base font-medium text-white items-center"
          onClick={() => onClickToSetting()}
        >
          <div>Configuração</div>
          <RightOutlined
            style={{ fontSize: 25, color: 'white', fontWeight: 1000 }}
          />
        </div>

        <div
          className="mt-2 bg-[rgba(161,193,255,0.2)] rounded-lg px-[14px] py-3 flex justify-between text-base font-medium text-white items-center"
          onClick={() => dispatch(appSlice.actions.showMobileLogoutModal(true))}
        >
          <div>Sair</div>
          <RightOutlined
            style={{ fontSize: 25, color: 'white', fontWeight: 1000 }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default MyPage;
