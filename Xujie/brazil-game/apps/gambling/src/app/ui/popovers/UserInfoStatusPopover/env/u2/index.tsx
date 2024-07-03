import { environment } from '../../../../../../environments/environment';
import { Avatar } from '../../../../components/Avatar';
import { IUserInfo } from '../../../../../persistant/IUserInfo';
import { AppLocalStorage } from '../../../../../persistant/localstorage';
import { AppLocalStorageKey } from '../../../../../persistant/AppLocalStorageKey';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { useDispatch } from 'react-redux';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { formatLocaleMoney } from '../../../../utils/format';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { CaretRight } from './components/CaretRight';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';
import { useUserDama } from '../../../../hooks/useUserDama';

interface IUserInfoStatusPopoverProps {
  userVIPInfo: GetVIPInfoResponse;
  totalBalanceSheetValue: number;
  totalReasableValue: number;
  currentLevel: number;
  close: () => void;
  totalPrize: number;
  bonusAwaitingSettlement: number;
  fullWithdrawable: number;
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
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};

  const {
    onClickToWallet,
    onClickToInvite,
    onClickToSetting,
    onClickToGameRecord,
    onClickToPrivacyAgreement,
    onClickToCompanyProfile,
  } = usePageNavigate();

  const dispatch = useDispatch();

  const setOpenLogoutPopover = (show: boolean) => {
    dispatch(appSlice.actions.showMobileLogoutModal(show));
  };

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
    <div className="relative flex flex-col h-full text-sm">
      <div className="h-full overflow-y-scroll p-5 mb-20">
        <div className="relative">
          <img
            alt="close"
            className="absolute left-0 top-0 h-10 w-10 cursor-pointer"
            src={`assets/${environment.uVersion}/XCircle.png`}
            onClick={() => {
              close();
            }}
          />
        </div>

        {/*頭像與個人資訊*/}
        <div className="flex flex-col items-center">
          <div className="relative border rounded-lg border-white">
            <Avatar className="rounded-lg w-20 h-20" />
            <div className="absolute bottom-0 left-[50%] translate-x-[-50%] translate-y-[50%] text-white text-xs font-bold w-16 rounded-[10px] py-[2px] text-center bg-[var(--primary-main)] border border-white">
              LV{currentLevel}
            </div>
          </div>
          <div className="mt-[22px] text-xl font-medium text-white">
            {user.nickname}
          </div>
          <div className="mt-2 flex gap-1 text-white text-lg">
            <div>ID: {user.user_id}</div>
            <CopyIcon
              copyText={user.user_id}
              icon={
                <img
                  alt="cooy"
                  className="w-6 h-6"
                  src={`assets/${environment.uVersion}/icon=copy.png`}
                />
              }
            />
          </div>
        </div>

        {/*VIP 資訊*/}
        <div className="flex justify-between text-sm mt-5 items-end">
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
          className="h-11 py-[10px] px-5 mt-2 text-white text-base bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={depositPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />
        <div className="flex justify-between text-sm mt-5 items-end">
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
          className="h-11 py-[10px] px-5 mt-2 text-white text-base bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
          progress={flowPercent}
          progressClassName="bg-[var(--grayscale-50)]"
        />

        {/*帳戶資訊*/}
        <div className="font-medium text-[var(--secondary-main)] text-sm mt-5">
          Total Da Conta
        </div>
        <div className="mt-2 p-5 flex gap-5 shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] bg-[var(--grayscale-30)] rounded-lg border border-[var(--grayscale-30)]">
          <div className="w-1/2 flex flex-col items-center text-center justify-between">
            <div className="text-white text-base font-medium">
              R$ {formatLocaleMoney(totalBalanceSheetValue)}
            </div>
            <div className="text-sm text-[var(--grayscale-70)] mt-2">
              Balanço Total
            </div>
            <button
              className="mt-5 py-[6px] w-full text-lg text-white font-medium rounded-full bg-[#EA7F00] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
              onClick={() => {
                close();
                onClickToWallet({ panelType: 'deposit' });
              }}
            >
              Depósito
            </button>
          </div>
          <div className="w-1/2 flex flex-col items-center text-center justify-between">
            <div className="text-white text-base font-medium">
              R$ {formatLocaleMoney(totalReasableValue)}
            </div>
            <div className="text-sm text-[var(--grayscale-70)] mt-2">
              Retirável Total
            </div>
            <button
              className="mt-5 py-[6px] w-full text-lg text-white font-medium rounded-full bg-[#0077CE] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]"
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
            <div className="text-sm font-medium text-[var(--secondary-main)]">
              <div>Progresso atual de apostas</div>
            </div>
            <ProgressBar
              className="h-11 py-[10px] px-5 mt-2 text-white text-base bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
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
          <div className="text-sm font-medium text-[var(--secondary-main)]">
            Conta Promovida
          </div>
          <CaretRight color="#10B98F" />
        </div>
        <div className="mt-2 w-full rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] bg-[var(--grayscale-30)]">
          <div className="flex justify-between px-5 py-[10px] border-b border-[var(--grayscale-40)]">
            <div className="text-[var(--grayscale-70)]">Prêmio total</div>
            <div className="text-white font-medium">
              R$ {formatLocaleMoney(totalPrize)}
            </div>
          </div>
          <div className="flex justify-between px-5 py-[10px] border-b border-[var(--grayscale-40)]">
            <div className="text-[var(--grayscale-70)]">
              Bônus aguardando liquidação
            </div>
            <div className="text-white font-medium">
              R$ {formatLocaleMoney(bonusAwaitingSettlement)}
            </div>
          </div>
          <div className="flex justify-between px-5 py-[10px]">
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
          className="w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-5 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToSetting();
          }}
        >
          <div>Modificar informações</div>
          <CaretRight />
        </button>
        <button
          className="w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToGameRecord();
          }}
        >
          <div>Recorde de apostas</div>
          <CaretRight />
        </button>
        <button
          className="w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToPrivacyAgreement();
          }}
        >
          <div>Política de Privacidade</div>
          <CaretRight />
        </button>

        <button
          className="w-full flex justify-between items-center text-sm text-white px-5 py-[14px] font-medium mt-3 rounded-lg border border-[var(--grayscale-30)] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--grayscale-30)]"
          onClick={() => {
            close();
            onClickToCompanyProfile();
          }}
        >
          <div>Sobre Nós</div>
          <CaretRight />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <button
          className="flex gap-2 w-full justify-center items-center rounded-[20px] py-[6px] shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] bg-[var(--secondary-main)]"
          onClick={() => {
            close();
            setOpenLogoutPopover(true);
          }}
        >
          <div className="text-white text-lg font-medium">Sair</div>
          <img
            alt="signOut"
            className="w-6 h-6"
            src={`assets/${environment.uVersion}/icon=sign-out.png`}
          />
        </button>
      </div>
    </div>
  );
};
