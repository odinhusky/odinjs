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
import { CaretRight } from '../../../../popovers/UserInfoStatusPopover/env/u2/components/CaretRight';
import { useInviteReward } from '../../../../hooks/useInviteReward';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { useUserDama } from '../../../../hooks/useUserDama';
import { useEffect } from 'react';

interface IMyPageProps {
  userVIPInfo: GetVIPInfoResponse;
  currentLevel: number;
}

export const MyPage = ({ userVIPInfo, currentLevel }: IMyPageProps) => {
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  const totalBalanceSheetValue = useSelector(totalBalanceSheetSelector);
  const totalReasableValue = useSelector(totalReasableSelector);

  const { totalPrize, bonusAwaitingSettlement, fullWithdrawable } =
    useInviteReward();

  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );

  const dispatch = useDispatch();

  const {
    onClickToWallet,
    onClickToInvite,
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

  const depositPercent = vipScore / nextLevelScore;
  const flowPercent = flow / nextLevelFlow;

  return (
    <PageContainer className="bg-[var(--grayscale-10)] pb-0">
      <div className="relative w-full overflow-y-scroll text-white pb-10">
        {/*通知Icon*/}
        <div
          className="absolute top-0 right-0 shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)] flex items-center justify-center w-12 h-12 rounded-[100px]"
          onClick={onClickToNotification}
        >
          <div className="relative">
            <img
              alt="notification"
              className="w-8 h-8"
              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_notification.png`}
            />
            {messageCount !== 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 rounded-full flex justify-center items-center w-5 h-5 text-center">
                {messageCount}
              </div>
            )}
          </div>
        </div>

        {/*頭像與個人資訊*/}
        <div className="flex flex-col items-center">
          <div className="relative border rounded-lg border-white">
            <Avatar className="rounded-lg w-20 h-20" />
            <div className="absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] text-white text-xs font-bold w-16 rounded-[10px] py-[2px] text-center bg-[var(--primary-main)] border border-white">
              LV{currentLevel}
            </div>
          </div>
          <div className="mt-[22px] text-sm font-medium text-white">
            {user.nickname}
          </div>
          <div className="mt-2 flex gap-1 text-white text-sm">
            <div>ID: {user.user_id}</div>
            <CopyIcon
              copyText={user.user_id}
              icon={
                <img
                  alt="cooy"
                  className="w-5 h-5"
                  src={`assets/${environment.uVersion}/icon=copy.png`}
                />
              }
            />
          </div>
        </div>

        {/*VIP 資訊*/}
        <div className="flex justify-between text-xs mt-5 items-end">
          <div className="font-medium text-[var(--secondary-main)] flex-1">
            Valor total da recarga
          </div>
          <div className="text-white">
            R$ {formatLocaleMoney(vipScore / 100)}
            <span className="text-[var(--grayscale-50)]">
              /R$ {formatLocaleMoney(nextLevelScore / 100)}
            </span>
          </div>
        </div>
        <ProgressBar
          className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={depositPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />
        <div className="flex justify-between text-xs mt-5 items-end">
          <div className="font-medium text-[var(--secondary-main)] flex-1">
            Número total de apostas
          </div>
          <div className="text-white">
            R$ {formatLocaleMoney(flow / 100)}
            <span className="text-[var(--grayscale-50)]">
              /R$ {formatLocaleMoney(nextLevelFlow / 100)}
            </span>
          </div>
        </div>
        <ProgressBar
          className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={flowPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />

        {/*帳戶資訊*/}
        <div className="font-medium text-[var(--secondary-main)] text-xs mt-5">
          Total Da Conta
        </div>
        <div className="mt-2 p-5 flex gap-5 shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] bg-[var(--grayscale-30)] rounded-lg border border-[var(--grayscale-30)]">
          <div className="w-1/2 flex flex-col items-center text-center justify-between">
            <div className="text-white text-sm font-medium">
              R$ {formatLocaleMoney(totalBalanceSheetValue)}
            </div>
            <div className="text-xs text-[var(--grayscale-70)] mt-2">
              Balanço Total
            </div>
            <button
              className="mt-5 py-[6px] w-full text-sm text-white font-medium rounded-full bg-[#EA7F00] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
              onClick={() => {
                close();
                onClickToWallet({ panelType: 'deposit' });
              }}
            >
              Depósito
            </button>
          </div>
          <div className="w-1/2 flex flex-col items-center text-center justify-between">
            <div className="text-white text-sm font-medium">
              R$ {formatLocaleMoney(totalReasableValue)}
            </div>
            <div className="text-xs text-[var(--grayscale-70)] mt-2">
              Retirável Total
            </div>
            <button
              className="mt-5 py-[6px] w-full text-sm text-white font-medium rounded-full bg-[#0077CE] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
              onClick={() => {
                close();
                onClickToWallet({ panelType: 'withdraw' });
              }}
            >
              Retirar
            </button>
          </div>
        </div>

        {/*打码进度*/}
        {damaResult.isShowDama ? (
          <div className="font-medium text-[var(--secondary-main)] text-xs mt-2">
            <div className="text-xs font-medium text-[var(--secondary-main)]">
              <div>Progresso atual de apostas</div>
            </div>
            <ProgressBar
              className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
              progressClassName="bg-[var(--grayscale-50)]"
              progress={damaResult.progressValue}
              progressColor={progressIndicatorStyle}
            ></ProgressBar>
          </div>
        ) : null}

        {/*邀請分數資訊*/}
        <div
          className="flex items-center mt-5 cursor-pointer"
          onClick={() => {
            close();
            onClickToInvite();
          }}
        >
          <div className="text-xs font-medium text-[var(--secondary-main)]">
            Conta Promovida
          </div>
          <CaretRight color="#10B98F" />
        </div>
        <div className="mt-2 w-full rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] bg-[var(--grayscale-30)]">
          <div className="flex justify-between px-3 py-3 border-b border-[var(--grayscale-40)]">
            <div className="text-[var(--grayscale-70)]">Prêmio total</div>
            <div className="text-white font-medium">
              R$ {formatLocaleMoney(totalPrize)}
            </div>
          </div>
          <div className="flex justify-between px-3 py-3 border-b border-[var(--grayscale-40)]">
            <div className="text-[var(--grayscale-70)]">
              Bônus aguardando liquidação
            </div>
            <div className="text-white font-medium">
              R$ {formatLocaleMoney(bonusAwaitingSettlement)}
            </div>
          </div>
          <div className="flex justify-between px-3 py-3">
            <div className="text-[var(--grayscale-70)]">
              Bônus já liquidados
            </div>
            <div className="text-white font-medium">
              R$ {formatLocaleMoney(fullWithdrawable)}
            </div>
          </div>
        </div>

        {/*導航區塊*/}
        <button
          className="w-full flex justify-between items-center text-xs text-white px-5 py-[14px] font-medium mt-5 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToSetting();
          }}
        >
          <div>Modificar informações</div>
          <CaretRight />
        </button>
        <button
          className="w-full flex justify-between items-center text-xs text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToGameRecord();
          }}
        >
          <div>Recorde de apostas</div>
          <CaretRight />
        </button>
        <button
          className="w-full flex justify-between items-center text-xs text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToPrivacyAgreement();
          }}
        >
          <div>Política de Privacidade</div>
          <CaretRight />
        </button>

        <button
          className="w-full flex justify-between items-center text-xs text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToCompanyProfile();
          }}
        >
          <div>Sobre Nós</div>
          <CaretRight />
        </button>

        <button
          className="my-5 w-full py-[10px] text-white text-sm font-medium flex items-center justify-center gap-2 bg-[var(--secondary-main)] rounded-[20px] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
          onClick={() => dispatch(appSlice.actions.showMobileLogoutModal(true))}
        >
          <div>Sair</div>
          <img
            alt="signOut"
            className="w-5 h-5"
            src={`assets/${environment.uVersion}/icon=sign-out.png`}
          />
        </button>
      </div>
    </PageContainer>
  );
};
