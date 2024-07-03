import { IUserInfo } from "../../../../../persistant/IUserInfo";
import { AppLocalStorage } from "../../../../../persistant/localstorage";
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey";
import { useDispatch } from "react-redux";
import { appSlice } from "../../../../../reduxStore/appSlice";
import { CocoAvatar } from "../../../../components/Avatar/CocoAvatar";
import { CopyIcon } from "../../../../components-bs/Icons/CopyIcon";
import { SignoutICON } from "../../../../components-bs/Icons/SignoutICON";
import React, { useEffect } from "react";
import { PageOrModalPathEnum } from "../../../../PageOrModalPathEnum";
import CurrentVIPIcon from "../../../../components/CurrentVIPIcon";
import { RightOutlined } from "@ant-design/icons";
import { clampNumber, formatLocaleMoney } from "../../../../utils/format";
import { ProgressBar } from "../../../../components-bs/ProgressBar";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { GetVIPInfoResponse } from "../../../../../external/UserEndpoint";
import styled from "styled-components";
import { CaretRight } from "../u2/components/CaretRight";
import cx from "classnames";
import { useUserDama } from "../../../../hooks/useUserDama";
import { environment } from "apps/gambling/src/environments/environment";

const Container = styled.div`
  background: rgb(from var(--primary-assistant) r g b / 20%);
`

interface IUserInfoStatusPopoverProps {
  userVIPInfo: GetVIPInfoResponse
  totalBalanceSheetValue: number
  totalReasableValue: number
  currentLevel: number
  close: () => void
  totalPrize: number
  bonusAwaitingSettlement: number
  fullWithdrawable: number
}


export const UserInfoStatusPopoverContent = ({
  close,
  currentLevel,
  userVIPInfo,
  totalBalanceSheetValue,
  totalReasableValue,
  totalPrize,
  bonusAwaitingSettlement,
  fullWithdrawable
}: IUserInfoStatusPopoverProps) => {

  const {
    onClickToVipGrade,
    onClickToWallet,
    onClickToInvite,
    onClickToSetting,
    onClickToGameRecord,
    onClickToPrivacyAgreement,
    onClickToCompanyProfile
  } = usePageNavigate();

  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo) ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "") : {};
  const dispatch = useDispatch();

  const vipScore = userVIPInfo?.data?.vip_score || 0
  const nextLevelScore = userVIPInfo?.data?.next_level_score || 1
  const flowProgress = userVIPInfo?.data?.flow_progress || 0
  const flow = userVIPInfo?.data?.flow || 0
  const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0

  const depositPercent = ((vipScore / nextLevelScore) * 100)

  const setOpenLogoutPopover = (show: boolean) => {
    dispatch(appSlice.actions.showMobileLogoutModal(show))
  }

  const { damaResult } = useUserDama();

  const progressIndicatorStyleMapping = {
    m4: "linear-gradient(90deg,var(--lineary-progress-from),var(--lineary-progress-to))",
    default: "linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))",
  };

  const progressIndicatorStyle = progressIndicatorStyleMapping[environment.mVersion as keyof typeof progressIndicatorStyleMapping] || progressIndicatorStyleMapping.default;


  const vipDepositString = `R$ ${formatLocaleMoney(vipScore ? vipScore / 100 : 0)}/R$ ${formatLocaleMoney(nextLevelScore ? nextLevelScore / 100 : 0)}`;
  const vipFlowString = `R$ ${formatLocaleMoney(flow ? flow / 100 : 0)}/R$ ${formatLocaleMoney(nextLevelFlow ? nextLevelFlow / 100 : 0)}`;

  return (
    <div className='h-full text-sm p-5 text-white overflow-y-scroll'>

      {/*使用者資訊*/}
      <div className='flex justify-between items-center mb-3'>
        <div className='flex gap-3'>
          <div className='rounded-[11px] overflow-hidden w-[50px] h-[50px]'>
            <CocoAvatar className='w-[50px] h-[50px]' />
          </div>
          <div className='flex flex-col justify-between text-[var(--text-tertiary)]'>
            <div className='text-xl text-white'>{user.nickname}</div>
            <div
              className='flex gap-2 text-lg items-center text-[#FDEF70]'
              onClick={(e) => e.stopPropagation()}
            >
              <div>ID:{user.user_id}</div>
              <CopyIcon copyText={user.user_id} />
            </div>
          </div>
        </div>

        <a onClick={() => {
          close();
          setOpenLogoutPopover(true)
        }}>
          <SignoutICON />
        </a>
      </div>


      {/*VIP INFO*/}
      <div
        className='w-full border-2 border-[#85F1F8] bg-gradient-to-b from-[#23898D] to-[#196366] rounded-lg px-3 pt-2 pb-4 cursor-pointer'
        onClick={() => {
          close();
          onClickToVipGrade();
        }}
      >
        <div className='flex items-center text-white justify-between'>
          <CurrentVIPIcon
            className='flex-row justify-start gap-3'
            imageClassName='w-[54px]'
            textClassName='w-[53px]'
            level={currentLevel}
          />
          <RightOutlined />
        </div>

        <div className='flex flex-col gap-2 text-xs'>
          <div className='mt-2 flex flex-col gap-2'>
            <div className='flex justify-between'>
              <div className='text-white'>Próximo nível: {clampNumber(depositPercent, 0, 100).toFixed(0)}%</div>
              <div className='text-[#FDEF70]'>Depósitos totais:
                R$ {formatLocaleMoney(vipScore ? vipScore / 100 : 0)}</div>
            </div>
            <ProgressBar
              className={cx(
                'bg-white',
                vipDepositString.length > 45 ? 'h-10' : vipDepositString.length > 30 ? 'h-8' : 'h-6')}
              rounded='rounded-full'
              progress={vipScore / nextLevelScore}
              progressColor='linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))'
            >
              <div className='flex justify-between px-4 h-full items-center text-[#6A3C12]'>
                <div>VIP{currentLevel}</div>
                <div className={'text-xs text-center px-1'}>{vipDepositString}</div>
                <div>VIP{currentLevel + 1}</div>
              </div>
            </ProgressBar>
          </div>

          <div className='mt-2 flex flex-col gap-2'>
            <div className='flex justify-between'>
              <div className='text-white'>Próximo nível: {clampNumber(flowProgress, 0, 100).toFixed(0)}%</div>
              <div className='text-[#FDEF70]'>Pontos de apostas: R$ {formatLocaleMoney(flow ? flow / 100 : 0)}</div>
            </div>
            <ProgressBar
              className={cx(
                'bg-white',
                vipFlowString.length > 45 ? 'h-10' : vipFlowString.length > 30 ? 'h-8' : 'h-6')}
              rounded='rounded-full'
              progress={flowProgress / 100}
              progressColor='linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))'
            >
              <div className='flex justify-between px-4 h-full items-center text-[#6A3C12]'>
                <div>VIP{currentLevel}</div>
                <div className={'text-xs text-center px-1'}>{vipFlowString}</div>
                <div>VIP{currentLevel + 1}</div>
              </div>
            </ProgressBar>
          </div>
        </div>
      </div>

      {/*帳戶資訊*/}
      <div className="flex flex-col flex-none mt-3 rounded-b-lg overflow-hidden">
        <div
          className="bg-[var(--white-30)] flex justify-between items-center text-white px-[14px] py-3 rounded-t-lg"
        >
          <div className="text-base font-medium">Total Da Conta</div>

          <RightOutlined onClick={() => {
            close();
            onClickToWallet({ "panelType": "deposit" });
          }} />
        </div>
        <div
          className="bg-[rgba(161,193,255,0.2)] px-3 py-4 flex justify-between text-white gap-6"
        >
          <div className="flex flex-col justify-between items-center w-1/2 gap-2">
            <div className="font-medium text-base">R$ {formatLocaleMoney(totalBalanceSheetValue)}</div>
            <div className="font-medium text-sm">Fundos totais</div>
            <button className="w-full py-[10px] rounded-lg bg-gradient-to-r from-[#FF7373] to-[#9E21FF]"
              onClick={() => onClickToWallet({ "panelType": "deposit" })}>Depósito
            </button>
          </div>

          <div className="flex flex-col justify-between items-center w-1/2 gap-2">
            <div className="font-medium text-base">R$ {formatLocaleMoney(totalReasableValue)}</div>
            <div className="font-medium text-sm">Retirável Total</div>
            <button className="w-full py-[10px] rounded-lg bg-gradient-to-r from-[#FFA775] to-[#FF2121]"
              onClick={() => onClickToWallet({ "panelType": "withdraw" })}>Retirar
            </button>
          </div>
        </div>

        {/*打码进度*/}
        {damaResult.isShowDama ?
          <div className='rounded-b-lg bg-[var(--white-30)] px-3 py-4 flex flex-col justify-between text-white'/**p-4 rounded-2xl bg-[var(--grayscale-20)]  */>
            <div className="w-full flex justify-between items-center">
              <div className="text-white">Próximo
                Progresso atual de apostas
              </div>
            </div>
            <ProgressBar
              className={cx('bg-white mt-2',
                vipFlowString.length > 45 ? 'h-12' : vipFlowString.length > 26 ? 'h-8' : 'h-6',
              )}
              rounded="rounded-xl"
              progress={damaResult.progressValue}
              progressColor="linear-gradient(180deg,#FBFF3F,#FEC600)"
            >
              <div
                className="h-full flex px-3 items-center justify-center text-[#6A3C12] font-normal"
              >
                <div className={'text-xs text-center px-1'}>{damaResult.progressText ? damaResult.progressText : '0%'}</div>
              </div>
            </ProgressBar>

          </div>
          : null}

      </div>

      {/*邀請分數資訊*/}
      <div
        className='rounded-xl text-white mt-3'
      >
        <div
          className='flex justify-between items-center py-3 px-[14px] text-base bg-[var(--white-30)] rounded-t-xl cursor-pointer'
          onClick={() => {
            close();
            onClickToInvite();
          }}
        >
          <div>Conta Promovida</div>
          <RightOutlined />
        </div>
        <div
          className='rounded-b-xl flex text-xs text-center py-3 gap-2 bg-[rgba(161,193,255,0.2)] px-2'
        >
          <div className='w-1/3'>
            <div className='text-base'>R$ {formatLocaleMoney(totalPrize)}</div>
            <div>Prêmio total</div>
          </div>
          <div className='w-1/3'>
            <div className='text-base'>R$ {formatLocaleMoney(bonusAwaitingSettlement)}</div>
            <div>Bônus aguardando liquidação</div>
          </div>
          <div className='w-1/3'>
            <div className='text-base'>R$ {formatLocaleMoney(fullWithdrawable)}</div>
            <div>Bônus já liquidados</div>
          </div>
        </div>
      </div>

      {/*導航區塊*/}
      <button
        className='w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-5 rounded-lg bg-[rgba(161,193,255,0.2)]'
        onClick={() => {
          close();
          onClickToSetting();
        }}
      >
        <div>Modificar informações</div>
        <CaretRight />
      </button>
      <button
        className='w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg bg-[rgba(161,193,255,0.2)]'
        onClick={() => {
          close();
          onClickToGameRecord();
        }}
      >
        <div>Recorde de apostas</div>
        <CaretRight />
      </button>
      <button
        className='w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg bg-[rgba(161,193,255,0.2)]'
        onClick={() => {
          close();
          onClickToPrivacyAgreement();
        }}
      >
        <div>Política de Privacidade</div>
        <CaretRight />
      </button>

      <button
        className='w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg bg-[rgba(161,193,255,0.2)]'
        onClick={() => {
          close();
          onClickToCompanyProfile();
        }}
      >
        <div>Sobre Nós</div>
        <CaretRight />
      </button>


    </div>
  )
}
