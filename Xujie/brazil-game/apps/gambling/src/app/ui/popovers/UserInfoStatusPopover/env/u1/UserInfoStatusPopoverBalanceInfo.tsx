import React, { useEffect } from "react";
import { PageOrModalPathEnum } from "../../../../PageOrModalPathEnum";
import { IUserInfoStatusPopoverBalanceInfoProps } from "../../index";
import { useNavigate } from "react-router";
import { RightOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { formatLocaleMoney } from "../../../../utils/format";
import { PopoverDepositButton } from "../../../../components-bs/Buttons/env/u1/PopoverDepositButton";
import { PopoverWithdrawButton } from "../../../../components-bs/Buttons/env/u1/PopoverWithdrawButton";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { useUserDama } from "../../../../hooks/useUserDama";
import { ProgressBar } from "../../../../components-bs/ProgressBar";
import { environment } from "../../../../../../environments/environment";

const Container = styled.div`
  background: rgb(from var(--primary-assistant) r g b / 20%);
`

export const UserInfoStatusPopoverBalanceInfo = ({
  totalBalanceSheetValue,
  totalReasableValue
}: IUserInfoStatusPopoverBalanceInfoProps) => {
  const navigate = useNavigate();
  const { onClickToWallet } = usePageNavigate();

  const { damaResult } = useUserDama();

  const progressIndicatorStyleMapping = {
    m4: "linear-gradient(90deg,var(--lineary-progress-from),var(--lineary-progress-to))",
    default: "linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))",
  };
  const progressIndicatorStyle = progressIndicatorStyleMapping[environment.mVersion as keyof typeof progressIndicatorStyleMapping] || progressIndicatorStyleMapping.default;


  return (
    <div
      className='flex flex-col flex-none rounded-xl overflow-hidden text-white'
    >
      <div
        className='flex justify-between items-center py-3 px-[14px] text-base bg-[rgba(255,255,255,30%)] rounded-t-xl cursor-pointer'
        onClick={() => onClickToWallet({ 'panelType': 'deposit' })}
      >
        <div>Total Da Conta</div>
        <RightOutlined />
      </div>

      <Container
        className='flex text-sm text-center'
      >
        <div className='w-1/2 px-3 pb-4 pt-2 flex flex-col gap-2'>
          <div className='text-lg'>R$ {formatLocaleMoney(totalBalanceSheetValue)}</div>
          <div >Fundos totais</div>
          <PopoverDepositButton onClick={() => onClickToWallet({ 'panelType': 'deposit' })} />
        </div>
        <div className='w-1/2 px-3 pb-4 pt-2 flex flex-col gap-2'>
          <div className='text-lg'>R$ {formatLocaleMoney(totalReasableValue)}</div>
          <div >Retirável Total</div>
          <PopoverWithdrawButton onClick={() => onClickToWallet({ 'panelType': 'withdraw' })} />
        </div>
      </Container>

      {/*打码进度*/}
      {damaResult.isShowDama ?
        <div
          className={"bg-[rgba(255,255,255,30%)] rounded-b-xl text-xs font-medium px-[24px] py-[16px] flex flex-col gap-y-2"}
        >
          <div className='flex justify-between'>
            <div>Progresso atual de apostas</div>
            <div>{damaResult.progressText ? damaResult.progressText : '0%'}</div>
          </div>
          <ProgressBar
            className='h-6 bg-white mb-3'
            rounded='rounded-xl'
            progress={
              damaResult.progressValue
            }
            progressColor={progressIndicatorStyle}
          >
          </ProgressBar>
        </div>
        : null}
    </div>
  )
}
