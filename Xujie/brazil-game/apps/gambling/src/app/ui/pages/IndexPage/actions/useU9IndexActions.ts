import { usePageNavigate } from '../../../router/hooks/usePageNavigate';
import handleGlobalClick from '../../../utils/handleGlobalClick';
import {
  actionType,
  handleChangeGameType,
  handleCheckInBannerClick,
  handleDepositCashbackBannerClick,
  handleDownloadClick,
  handleFirstDepositBannerClick,
  handleInviteBannerClick,
  handleVIPBannerClick,
} from './actionsType';

export type ActionObjType = {
  [key in actionType]: (arg?: any) => void;
};

export const useU9IndexActions = () => {
  const {
    onClickToFirstDeposit,
    onClickToDepositCashback,
    onClickToInvite,
    onClickToVipGrade,
    onClickToCheckInDaily,
  } = usePageNavigate();

  const actionObj: ActionObjType = {
    [handleFirstDepositBannerClick]: () => {
      handleGlobalClick({
        target: handleFirstDepositBannerClick,
        callback: () => {
          onClickToFirstDeposit();
        },
      });
    },
    [handleDepositCashbackBannerClick]: () => {
      handleGlobalClick({
        target: handleDepositCashbackBannerClick,
        callback: () => {
          onClickToDepositCashback();
        },
      });
    },
    [handleInviteBannerClick]: () => {
      handleGlobalClick({
        target: handleInviteBannerClick,
        callback: () => {
          onClickToInvite();
        },
      });
    },
    [handleVIPBannerClick]: () => {
      handleGlobalClick({
        target: handleVIPBannerClick,
        callback: () => {
          onClickToVipGrade();
        },
      });
    },
    [handleCheckInBannerClick]: () => {
      handleGlobalClick({
        target: handleCheckInBannerClick,
        callback: () => {
          onClickToCheckInDaily();
        },
      });
    },
    [handleChangeGameType]: ({
      type,
      setActiveTab,
    }: {
      type: string;
      setActiveTab: <T>(arg?: T) => void;
    }) => {
      handleGlobalClick({
        target: handleChangeGameType,
        callback: () => {
          setActiveTab(type);
        },
      });
    },
    [handleDownloadClick]: () => {
      handleGlobalClick({
        target: handleDownloadClick,
        callback: () => {
          console.log('handleDownloadClick');
        },
      });
    },
  };

  return {
    actionObj,
  };
};

export default useU9IndexActions;
