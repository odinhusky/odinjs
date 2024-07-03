import { environment } from '../../../../../../environments/environment';
import { useDispatch, useSelector } from 'react-redux';
import {
  appSlice,
  totalBalanceSheetSelector,
  totalReasableSelector,
} from '../../../../../reduxStore/appSlice';
import { RootState } from '../../../../../reduxStore';
import { Avatar } from '../../../../components/Avatar';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { formatLocaleMoney } from '../../../../utils/format';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { useInviteReward } from '../../../../hooks/useInviteReward';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { ReactNode } from 'react';
import { tcx } from '../../../../utils/tcx';
import { uiSlice } from 'apps/gambling/src/app/reduxStore/uiSlice';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';
import { useUserDama } from '../../../../hooks/useUserDama';

interface IMyPageProps {
  userVIPInfo: GetVIPInfoResponse;
  currentLevel: number;
  className?: string;
  onClose?: () => void;
  showClose?: boolean;

  totalBalanceSheetValue: number;
  totalReasableValue: number;
  totalPrize: number;
  bonusAwaitingSettlement: number;
  fullWithdrawable: number;
}

const MyButton = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className: string;
  children: ReactNode;
}) => {
  return (
    <button
      className={`relative flex justify-center items-center text-sm font-medium rounded-lg w-full ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

/**
 * 进度条
 */
const ProgressBarBase = ({
  // title,
  percent,
}: // progress,
// length,
{
  // title: any
  percent: number;
  // progress: number
  // length: number
}) => {
  // const percent = progress / length;

  return (
    <div className="text-sm font-medium space-y-2">
      <ProgressBar
        className="h-4 text-[var(--grayscale-70)] bg-transparent font-normal gap-4"
        progressClassName="bg-[var(--grayscale-50)] h-full p-1"
        progressColor="var(--linear-4-main)"
        percentClassName="w-auto"
        barClassName="shadow-none"
        progress={percent}
      />
    </div>
  );
};

/**
 * vip进度条
 */
const VipProgressBar = ({
  title,
  progress,
  length,
}: {
  title: string;
  progress: number;
  length: number;
}) => {
  const percent = progress / length;
  const rFront =
    percent < 1
      ? { color: 'var(--grayscale-70)' }
      : {
          'background-image': 'var(--linear-4-main)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
        };

  return (
    <div className="text-sm font-medium space-y-2">
      <div className="flex justify-between items-start mobile:items-center flex-col mobile:flex-row max-mobile:space-y-1">
        <div className="text-[var(--text-icon-body)]">{title}</div>
        <div>
          <span style={rFront}>R$ {formatLocaleMoney(progress / 100)}</span>
          <span className="text-[var(--text-icon-body)]">
            /R$ {formatLocaleMoney(length / 100)}
          </span>
        </div>
      </div>
      <ProgressBarBase percent={percent}></ProgressBarBase>
      {/* <ProgressBar
        className="h-4 text-[var(--grayscale-70)] bg-transparent font-normal gap-4"
        progressClassName='bg-[var(--grayscale-50)] h-full p-1'
        progressColor="var(--linear-4-main)"
        percentClassName="w-auto"
        barClassName='shadow-none'
        progress={percent}
      /> */}
    </div>
  );
};

/**
 * 充值按钮
 */
const RechargeButton = ({
  onClick,
  className,
  totalValue,
  titleName,
  children,
}: {
  onClick: () => void;
  className: string;
  totalValue: number;
  titleName: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-1 justify-between w-full flex-row mobile:flex-col gap-3 mobile:gap-4">
      <div className="flex justify-between flex-col mobile:gap-1 min-w-[164px] text-left mobile:text-center">
        <div className="text-base font-medium">
          R$ {formatLocaleMoney(totalValue)}
        </div>
        <div className="text-sm text-[var(--grayscale-70)]">{titleName}</div>
      </div>
      <button
        className={`w-full h-9 py-2 text-sm font-bold rounded-lg ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

export const MyPage = ({
  userVIPInfo,
  currentLevel,
  className,
  onClose,
  showClose,

  totalBalanceSheetValue,
  totalReasableValue,
  totalPrize,
  bonusAwaitingSettlement,
  fullWithdrawable,
}: IMyPageProps) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  // const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector)
  // const totalReasableValue = useSelector(totalReasableSelector)

  // const { totalPrize, bonusAwaitingSettlement, fullWithdrawable } =
  //   useInviteReward()

  // const { messageCount } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch();

  const {
    onClickToWallet,
    onClickToInvite,
    onClickToBoxInvite,
    onClickToSetting,
    onClickToGameRecord,
    onClickToPrivacyAgreement,
    onClickToNotification,
    onClickToCompanyProfile,
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

  const vipScore = userVIPInfo?.data?.vip_score || 0;
  const nextLevelScore = userVIPInfo?.data?.next_level_score || 1;
  const flow = userVIPInfo?.data?.flow || 0;
  const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0;

  const { isDesktop, isTablet } = useBreakpoint();

  const { isShowBoxInvite } = useInviteInCompatible();
  // click
  const toInvite = isShowBoxInvite ? onClickToBoxInvite : onClickToInvite;

  return (
    <div
      className={
        tcx(
          `
        relative m-auto text-[var(--grayscale-100)]
        w-full py-4 px-5 mobile:py-8 mobile:px-9 tablet:p-6
        space-y-4 mobile:space-y-5`,
          className
        ) /** rounded-xl bg-[var(--grayscale-25)] */
      }
    >
      {/*頭像與個人資訊*/}
      <div className="relative flex justify-left items-center">
        <div className="relative flex items-center text-center w-[72px] h-[72px] mobile:w-24 mobile:h-24 tablet:w-40 tablet:h-40">
          <Avatar className="rounded-full w-full h-full" />
          <div
            className="
              absolute right-0 bottom-0 rounded-full text-center flex justify-center items-center
              border-2 tablet:border-4 border-[var(--grayscale-25)] bg-linear-3-light-hover 
              w-8 h-8 mobile:w-10 mobile:h-10 tablet:w-16 tablet:h-16"
          >
            <img
              className="w-7 mobile:w-8 tablet:w-12"
              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${currentLevel}.png`}
              alt="VIP"
            />
          </div>
        </div>

        <div className="ml-5">
          <div className="text-base mobile:text-lg font-medium">
            ID: {user.user_id}
          </div>
          <div className="flex items-center">
            <div className="text-sm mobile:text-base">LV:{currentLevel}</div>
            <CopyIcon
              copyText={user.user_id}
              icon={
                <img
                  alt="cooy"
                  className="w-5 h-5 ml-1"
                  src={`assets/${environment.uVersion}/icon_copy.png`}
                />
              }
            />
          </div>
        </div>

        {showClose ? (
          <button className=" absolute right-0 top-0 h-7" onClick={onClose}>
            <img
              className="h-full"
              src={`assets/${environment.uVersion}/icon_close.png`}
              alt="close"
            ></img>
          </button>
        ) : null}
      </div>

      {/*VIP 資訊*/}
      <div className="space-y-5">
        <VipProgressBar
          title="Valor total da recarga"
          progress={vipScore}
          length={nextLevelScore}
        ></VipProgressBar>
        <VipProgressBar
          title="Número total de apostas"
          progress={flow}
          length={nextLevelFlow}
        ></VipProgressBar>
      </div>

      {/*帳戶資訊*/}
      <div className="p-4 border-2 border-[var(--grayscale-70)] rounded-xl space-y-4 text-center">
        <MyButton className="px-4 py-2 bg-[var(--grayscale-40)] cursor-default text-base">
          <div className="relative w-full flex justify-start items-center">
            <span>Valor total da recarga</span>
          </div>
        </MyButton>

        <div className="flex justify-between flex-col mobile:flex-row items-center gap-3 mobile:gap-4">
          <RechargeButton
            className="linear-1-button"
            onClick={() => {
              onClose && onClose();
              onClickToWallet({ panelType: 'deposit' });
            }}
            totalValue={totalBalanceSheetValue}
            titleName="Balanço Total"
          >
            Depósito
          </RechargeButton>

          <RechargeButton
            className="linear-2-button"
            onClick={() => {
              onClose && onClose();
              onClickToWallet({ panelType: 'withdraw' });
            }}
            totalValue={totalReasableValue}
            titleName="Retirável Total"
          >
            Retirar
          </RechargeButton>
        </div>
      </div>

      {/*打码进度*/}
      {damaResult.isShowDama ? (
        <div className="p-4 border-2 border-[var(--grayscale-70)] rounded-xl space-y-4 text-center">
          <div className="flex justify-between items-start mobile:items-center flex-col mobile:flex-row max-mobile:space-y-1">
            <div className="text-[var(--text-icon-body)]">
              Progresso atual de apostas
            </div>
          </div>
          <ProgressBarBase percent={damaResult.progressValue}></ProgressBarBase>
        </div>
      ) : null}

      {/*邀請分數資訊*/}
      <div
        className="p-4 border-2 border-[var(--grayscale-70)] rounded-xl space-y-4 cursor-pointer"
        onClick={() => {
          onClose && onClose();
          toInvite();
        }}
      >
        <MyButton className="px-4 py-2 bg-[var(--grayscale-40)] text-base">
          <div className="relative w-full flex justify-start items-center">
            <span>Conta Promovida</span>
            <img
              className="absolute right-0 h-5"
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </div>
        </MyButton>

        <div className="space-y-3 text-sm">
          <div className="relative w-full py-1 mobile:py-2 flex justify-between items-center">
            <span className="text-[var(--grayscale-90)]">Prêmio total</span>
            <span>R$ {formatLocaleMoney(totalPrize)}</span>
            <span className="absolute bottom-0 w-full border-[0.5px] border-[var(--grayscale-50)]"></span>
          </div>
          <div className="relative w-full py-1 mobile:py-2 flex justify-between items-center">
            <span className="text-[var(--grayscale-90)]">
              Bônus aguardando liquidação
            </span>
            <span>R$ {formatLocaleMoney(bonusAwaitingSettlement)}</span>
            <span className="absolute bottom-0 w-full border-[0.5px] border-[var(--grayscale-50)]"></span>
          </div>
          <div className="relative w-full py-1 mobile:py-2 flex justify-between items-center">
            <span className="text-[var(--grayscale-90)]">
              Bônus já liquidados
            </span>
            <span>R$ {formatLocaleMoney(fullWithdrawable)}</span>
          </div>
        </div>
      </div>

      {/*導航區塊*/}
      <div className="space-y-3">
        <MyButton
          className="px-4 py-2 bg-[var(--grayscale-40)]"
          onClick={() => {
            onClose && onClose();
            onClickToSetting();
          }}
        >
          <div className="relative w-full flex justify-start items-center">
            <img
              className="h-6 mr-2"
              src={`assets/${environment.uVersion}/icon_user_info.png`}
              alt="user_info"
            />
            <span>Modificar informações</span>
            <img
              className="absolute right-0 h-5"
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </div>
        </MyButton>
        <MyButton
          className="px-4 py-2 bg-[var(--grayscale-40)]"
          onClick={() => {
            onClose && onClose();
            onClickToGameRecord();
          }}
        >
          <div className="relative w-full flex justify-start items-center">
            <img
              className="h-6 mr-2"
              src={`assets/${environment.uVersion}/icon_betting_record.png`}
              alt="user_info"
            />
            <span>Recorde de apostas</span>
            <img
              className="absolute right-0 h-5"
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </div>
        </MyButton>
        <MyButton
          className="px-4 py-2 bg-[var(--grayscale-40)]"
          onClick={() => {
            onClose && onClose();
            onClickToPrivacyAgreement();
          }}
        >
          <div className="relative w-full flex justify-start items-center">
            <img
              className="h-6 mr-2"
              src={`assets/${environment.uVersion}/icon_privacy_policy.png`}
              alt="user_info"
            />
            <span>Política de Privacidade</span>
            <img
              className="absolute right-0 h-5"
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </div>
        </MyButton>
        <MyButton
          className="px-4 py-2 bg-[var(--grayscale-40)]"
          onClick={() => {
            onClose && onClose();
            onClickToCompanyProfile();
          }}
        >
          <div className="relative w-full flex justify-start items-center">
            <img
              className="h-6 mr-2"
              src={`assets/${environment.uVersion}/icon_sobre_nos.png`}
              alt="user_info"
            />
            <span>Sobre Nós</span>
            <img
              className="absolute right-0 h-5"
              src={`assets/${environment.uVersion}/icon=arrow-right.png`}
            />
          </div>
        </MyButton>

        <MyButton
          className="px-4 pt-2 pb-3 border-2 border-[var(--grayscale-70)]"
          onClick={() => dispatch(appSlice.actions.showMobileLogoutModal(true))}
        >
          Sair
          <img
            alt="signOut"
            className="ml-2 w-5 h-5"
            src={`assets/${environment.uVersion}/icon_sign-out.png`}
          />
        </MyButton>
      </div>
    </div>
  );
};
