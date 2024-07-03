import React, { useEffect } from 'react';
import { CocoAvatar } from '../../../../components/Avatar/CocoAvatar';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import {
  appSlice,
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../../../reduxStore/appSlice';
import CurrentVIPIcon from '../../../../components/CurrentVIPIcon';
import styled from 'styled-components';
import { CheckInButton } from '../../../../components-bs/Buttons/CheckInButton';
import { DepositButton } from '../../../../components-bs/Buttons/DepositButton2';
import { WithdrawButton } from '../../../../components-bs/Buttons/WithdrawButton';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { PageContainer } from '../../../../components-bs/PageContainer';

import { List } from '../../../../components/List';
import { ListHeader } from '../../../../components/List/ListHeader';
import { ListItem } from '../../../../components/List/ListItem';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { clampNumber, formatLocaleMoney } from '../../../../utils/format';
import { tcx } from '../../../../utils/tcx';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { environment } from '../../../../../../environments/environment';
import { useUserDama } from '../../../../hooks/useUserDama';

const VIPContainer = styled.div`
  border: 2px solid var(--primary-assistant);
  background: linear-gradient(
    180deg,
    var(--background-vip-level-from),
    var(--background-vip-level-to)
  );
`;

interface IBetMyPageProps {
  userVIPInfo?: GetVIPInfoResponse;
  currentLevel: number;
}

const MyPage = ({ userVIPInfo, currentLevel }: IBetMyPageProps) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);
  const dispatch = useDispatch();

  const {
    onClickToCheckInDaily,
    onClickToWallet,
    onClickToGameRecord,
    onClickToSetting,
  } = usePageNavigate();

  const { damaResult } = useUserDama();

  const depositString = `R$ ${formatLocaleMoney(totalBalanceSheetValue)}`;
  const withdrawString = `R$ ${formatLocaleMoney(totalReasableValue)}`;

  const vipDepositString = `${formatLocaleMoney(
    userVIPInfo?.data?.vip_score ? userVIPInfo?.data?.vip_score / 100 : 0
  )} / ${formatLocaleMoney(
    userVIPInfo?.data?.next_level_score
      ? userVIPInfo?.data?.next_level_score / 100
      : 0
  )}`;
  const vipFlowString = `${formatLocaleMoney(
    userVIPInfo?.data?.flow ? userVIPInfo?.data?.flow / 100 : 0
  )} / ${formatLocaleMoney(
    userVIPInfo?.data?.next_level_flow
      ? userVIPInfo?.data?.next_level_flow / 100
      : 0
  )}`;

  const progressIndicatorStyleMapping = {
    m4: 'linear-gradient(90deg,var(--lineary-progress-from),var(--lineary-progress-to))',
    default:
      'linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))',
  };

  const progressIndicatorStyle =
    progressIndicatorStyleMapping[
      environment.mVersion as keyof typeof progressIndicatorStyleMapping
    ] || progressIndicatorStyleMapping.default;

  return (
    <PageContainer className={'!pt-4 pb-[80px]'}>
      <section className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="h-[60px] w-[60px] rounded-[13px] overflow-hidden">
            <CocoAvatar className="h-[60px] w-[60px]" />
          </div>
          <div>
            <div className="text-white text-base">{user.nickname}</div>
            <div className="text-white text-sm flex items-center">
              <span className={'text-[var(--text-tertiary)]'}>
                ID:{user.user_id}
              </span>
              <CopyIcon copyText={user.user_id} />
            </div>
          </div>
        </div>

        <CheckInButton onClick={() => onClickToCheckInDaily()}>
          Check-in
        </CheckInButton>
      </section>

      <section className="flex justify-between text-center mt-[26px] mb-5">
        <div className="w-full flex flex-col gap-3 items-center">
          <div
            className={tcx('text-lg text-white', [
              'text-sm',
              depositString.length > 12 || withdrawString.length > 12,
            ])}
          >
            {depositString}
          </div>
          <div className="text-sm text-white">Fundos totais</div>
          <DepositButton
            className="w-[126px]"
            onClick={() => onClickToWallet({ panelType: 'deposit' })}
          >
            Depósito
          </DepositButton>
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <div
            className={tcx('text-lg text-white', [
              'text-sm',
              depositString.length > 12 || withdrawString.length > 12,
            ])}
          >
            {withdrawString}
          </div>
          <div className="text-sm text-white">Retirável Total</div>
          <WithdrawButton
            className="w-[126px]"
            onClick={() => onClickToWallet({ panelType: 'withdraw' })}
          >
            Retirar
          </WithdrawButton>
        </div>
      </section>

      <VIPContainer className="rounded-xl flex items-center px-[14px] gap-[14px] py-4">
        <div className="w-1/3">
          <CurrentVIPIcon
            className="gap-[10px]"
            level={currentLevel}
            imageClassName="w-[84px]"
            textClassName="text-3xl text-white w-[61px]"
          />
        </div>

        <div className="w-2/3 text-white">
          <div className="mb-1 flex flex-wrap justify-start gap-x-2">
            <div className={'w-full'}>Depósitos totais:</div>
            <div
              className={tcx('w-full text-[var(--text-amount)]', [
                'text-xs',
                vipDepositString.length > 24 || vipFlowString.length > 24,
              ])}
            >
              R$ {vipDepositString}
            </div>
          </div>
          <ProgressBar
            className="h-5 mobile:h-8 bg-white mb-3"
            rounded="rounded-full"
            progress={
              (userVIPInfo?.data?.vip_score || 0) /
              (userVIPInfo?.data?.next_level_score || 1)
            }
            progressColor={progressIndicatorStyle}
          >
            <div className="h-full flex px-3 items-center justify-center">
              <div className="text-xs text-[var(--text-progress)] font-normal">
                Próximo nível{' '}
                {clampNumber(
                  ((userVIPInfo?.data?.vip_score || 0) /
                    (userVIPInfo?.data?.next_level_score || 1)) *
                    100,
                  0,
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          </ProgressBar>

          <div className="mb-1 flex flex-wrap justify-start gap-x-2">
            <div className={'w-full'}>Pontos de apostas:</div>
            <div
              className={tcx('w-full text-[var(--text-amount)]', [
                'text-xs',
                vipDepositString.length > 24 || vipFlowString.length > 24,
              ])}
            >
              R$ {vipFlowString}
            </div>
          </div>
          <ProgressBar
            className="h-5 mobile:h-8 bg-white "
            rounded="rounded-full"
            progress={
              userVIPInfo?.data?.flow_progress
                ? userVIPInfo?.data?.flow_progress / 100
                : 0
            }
            progressColor={progressIndicatorStyle}
          >
            <div className="h-full flex px-3 items-center justify-center font-normal">
              <div className="text-xs text-[var(--text-progress)]">
                Próximo nível{' '}
                {clampNumber(
                  userVIPInfo?.data?.flow_progress || 0,
                  0,
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          </ProgressBar>
        </div>
      </VIPContainer>

      {/*打码进度*/}
      {damaResult.isShowDama ? (
        <List
          className={
            'bg-[var(--white-10)] text-sm font-medium p-4 flex flex-col gap-y-2'
          } /** px-[24px] py-[16px] */
        >
          <div className="flex justify-between">
            <div>Progresso atual de apostas</div>
            <div>
              {damaResult.progressText ? damaResult.progressText : '0%'}
            </div>
          </div>
          <ProgressBar
            className="h-5 mobile:h-8 bg-white mb-3"
            rounded="rounded-full"
            progress={damaResult.progressValue}
            progressColor={progressIndicatorStyle}
          ></ProgressBar>
        </List>
      ) : null}

      <List className={'bg-[var(--white-10)]'}>
        <ListHeader>
          <div className="bg-gradient-to-b from-[var(--lineary-progress-from)] to-[var(--lineary-progress-to)] text-transparent">
            Outras funções
          </div>
        </ListHeader>
        <ListItem
          title={'Registros de cobrança'}
          onClick={() => onClickToWallet({ panelType: 'record' })}
        />
        <ListItem
          title={'Registro do jogo'}
          onClick={() => onClickToGameRecord()}
        />
        <ListItem title={'Configuração'} onClick={() => onClickToSetting()} />
        <ListItem
          isEnd={true}
          title={'Sair'}
          onClick={() => dispatch(appSlice.actions.showMobileLogoutModal(true))}
        />
      </List>
    </PageContainer>
  );
};

export default MyPage;
