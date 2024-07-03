import { environment } from "../../../../../../environments/environment"
import { Avatar } from "../../../../components/Avatar"
import { IUserInfo } from "../../../../../persistant/IUserInfo"
import { AppLocalStorage } from "../../../../../persistant/localstorage"
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey"
import { CopyIcon } from "../../../../components-bs/Icons/CopyIcon"
import { useDispatch } from "react-redux"
import { appSlice } from "../../../../../reduxStore/appSlice"
import { formatLocaleMoney } from "../../../../utils/format"
import { ProgressBar } from "../../../../components-bs/ProgressBar"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { GetVIPInfoResponse } from "../../../../../external/UserEndpoint"
import { ReactNode, useEffect } from "react"
import { useUserDama } from "../../../../hooks/useUserDama"

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
const MyButton = ({
  onClick,
  className,
  children,
}: {
  onClick: () => void
  className: string
  children: ReactNode
}) => {
  return (
    <button
      className={`flex justify-center items-center text-sm text-white font-extrabold linear-2-button ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export const UserInfoStatusPopover = ({
  close,
  currentLevel,
  userVIPInfo,
  totalBalanceSheetValue,
  totalReasableValue,
  totalPrize,
  bonusAwaitingSettlement,
  fullWithdrawable,
}: IUserInfoStatusPopoverProps) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "")
    : {}

  const {
    onClickToWallet,
    onClickToInvite,
    onClickToSetting,
    onClickToGameRecord,
    onClickToPrivacyAgreement,
    onClickToCompanyProfile,
  } = usePageNavigate()

  const dispatch = useDispatch()

  const { damaResult } = useUserDama();

  const progressIndicatorStyleMapping = {
    m4: "linear-gradient(90deg,var(--lineary-progress-from),var(--lineary-progress-to))",
    default: "linear-gradient(180deg,var(--lineary-progress-from),var(--lineary-progress-to))",
  };

  const progressIndicatorStyle = progressIndicatorStyleMapping[environment.mVersion as keyof typeof progressIndicatorStyleMapping] || progressIndicatorStyleMapping.default;

  const vipScore = userVIPInfo?.data?.vip_score || 0
  const nextLevelScore = userVIPInfo?.data?.next_level_score || 1
  const flow = userVIPInfo?.data?.flow || 0
  const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0

  const depositPercent = vipScore / nextLevelScore
  const flowPercent = flow / nextLevelFlow

  return (
    <div className="relative w-full text-white px-4 py-8">
      {/*頭像與個人資訊*/}
      <div className="flex justify-between items-center p-4 rounded-2xl bg-[var(--grayscale-20)]">
        <div className="flex items-center">
          <Avatar className="rounded-full w-14 h-14" />
          <div className="ml-3 text-base leading-6 font-bold">
            <div>{user.nickname}</div>
            <div className="mt-2 flex items-center">
              <div>ID: {user.user_id}</div>
              <CopyIcon
                copyText={user.user_id}
                icon={
                  <img
                    alt="cooy"
                    className="w-5 h-5"
                    src={`assets/${environment.uVersion}/icon_copy.png`}
                  />
                }
              />
            </div>
          </div>
        </div>
        <img
          className="w-14 h-14"
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${currentLevel}.png`}
          alt="VIP"
        />
      </div>

      {/*VIP 資訊*/}
      <div className="p-4 rounded-2xl bg-[var(--grayscale-20)] mt-2">
        <div className="flex justify-between items-center text-sm font-bold">
          <div>Valor total da recarga</div>
          <div>
            R$ {formatLocaleMoney(vipScore / 100)}
            <span>/R$ {formatLocaleMoney(nextLevelScore / 100)}</span>
          </div>
        </div>
        <ProgressBar
          className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={depositPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />
        <div className="flex justify-between items-center text-sm mt-5  font-bold">
          <div>Número total de apostas</div>
          <div>
            R$ {formatLocaleMoney(flow / 100)}
            <span>/R$ {formatLocaleMoney(nextLevelFlow / 100)}</span>
          </div>
        </div>
        <ProgressBar
          className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={flowPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />
      </div>

      {/*帳戶資訊*/}
      <div className="p-4 rounded-2xl bg-[var(--grayscale-20)] mt-2">
        <div className="text-base leading-6 font-bold text-center">
          Total Da Conta
        </div>
        <div className="p-3 flex justify-between bg-[var(--grayscale-30)] rounded-2xl mt-4 gap-5">
          <div className="flex flex-col items-center font-bold flex-1">
            <div className="text-base leading-6">
              R$ {formatLocaleMoney(totalBalanceSheetValue)}
            </div>
            <div className="mt-3 text-sm leading-5 text-[var(--grayscale-80)]">
              Balanço Total
            </div>
            <MyButton
              className="mt-3 w-full h-9"
              onClick={() => {
                close()
                onClickToWallet({ panelType: "deposit" })
              }}
            >
              Depósito
            </MyButton>
          </div>
          <div className="flex flex-col items-center font-bold flex-1">
            <div className="text-base leading-6">
              R$ {formatLocaleMoney(totalReasableValue)}
            </div>
            <div className="mt-3 text-sm leading-5 text-[var(--grayscale-80)]">
              Retirável Total
            </div>
            <MyButton
              className="mt-3 w-full h-9"
              onClick={() => {
                close()
                onClickToWallet({ panelType: "withdraw" })
              }}
            >
              Retirar
            </MyButton>
          </div>
        </div>

        {/*打码进度*/}
        {damaResult.isShowDama ?
          <div className='mt-3'/**p-4 rounded-2xl bg-[var(--grayscale-20)]  */>
            <div className='flex justify-between items-center text-sm font-bold'>
              <div>Progresso atual de apostas</div>
            </div>
            <ProgressBar
              className='h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]'
              progressClassName='bg-[var(--grayscale-50)]'
              progress={
                damaResult.progressValue
              }
              progressColor={progressIndicatorStyle}
            >
            </ProgressBar>

          </div>
          : null}

      </div>

      {/*邀請分數資訊*/}
      <div
        className="p-4 rounded-2xl bg-[var(--grayscale-20)] mt-2"
        onClick={() => {
          close()
          onClickToInvite()
        }}
      >
        <div className="text-base leading-6 font-bold text-center">
          Conta Promovida
        </div>
        <div className="p-3 flex justify-between items-center bg-[var(--grayscale-30)] rounded-lg mt-3 font-bold text-sm cursor-pointer">
          <span className="text-[var(--grayscale-80)]">Prêmio total</span>
          <span>R$ {formatLocaleMoney(totalPrize)}</span>
        </div>
        <div className="p-3 flex justify-between items-center bg-[var(--grayscale-30)] rounded-lg mt-3 font-bold text-sm cursor-pointer">
          <span className="text-[var(--grayscale-80)]">
            Bônus aguardando liquidação
          </span>
          <span>R$ {formatLocaleMoney(bonusAwaitingSettlement)}</span>
        </div>
        <div className="p-3 flex justify-between items-center bg-[var(--grayscale-30)] rounded-lg mt-3 font-bold text-sm cursor-pointer">
          <span className="text-[var(--grayscale-80)]">
            Bônus já liquidados
          </span>
          <span>R$ {formatLocaleMoney(fullWithdrawable)}</span>
        </div>
      </div>

      {/*導航區塊*/}
      <div className="p-4 rounded-2xl bg-[var(--grayscale-20)] mt-2">
        <MyButton
          className="mb-4 w-full h-9"
          onClick={() => {
            close()
            onClickToSetting()
          }}
        >
          Modificar informações
        </MyButton>
        <MyButton
          className="mb-4 w-full h-9"
          onClick={() => {
            close()
            onClickToGameRecord()
          }}
        >
          Recorde de apostas
        </MyButton>
        <MyButton
          className="mb-4 w-full h-9"
          onClick={() => {
            close()
            onClickToPrivacyAgreement()
          }}
        >
          Política de Privacidade
        </MyButton>

        <MyButton
          className="mb-4 w-full h-9"
          onClick={() => {
            close()
            onClickToCompanyProfile()
          }}
        >
          Sobre Nós
        </MyButton>
        <button
          className="w-full h-10 flex items-center justify-center rounded-[100px] border-[1.5px] border-[var(--white-70)]"
          onClick={() => dispatch(appSlice.actions.showMobileLogoutModal(true))}
        >
          <img
            alt="signOut"
            className="w-5 h-5 mr-2"
            src={`assets/${environment.uVersion}/icon_sign-out.png`}
          />
          <div className="text-[var(--white-70)]">Sair</div>
        </button>
      </div>
    </div>
  )
}
