import { SharePosterType } from '@libs/mode2/zustand/page/sharePageStore';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useAccountPageAction from '@libs/mode2/action/accountPageAction/useAccountPageAction';
import {
  handleAccountPageShowBindPlayerPhoneModalClick,
  handleAccountPageShowModalClick,
} from '@mode2/action/actionTypes';
import { AccountPageModalTitleTypes } from '@libs/mode2/zustand/page/accountPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import useHallPageActions from '@libs/mode2/action/hallPageAction/useHallPageActions';
import {
  handleHallPageDepositBtnClick,
  handleHallPageWithdrawBtnClick,
} from '@mode2/action/actionTypes';
import sdkUtils from '@libs/mode2/utils/sdk';
import { KYC_BOTH_STATE } from '@libs/constant/KYC';
import { MissionActionType } from './types';

export const useHandleGoActionEventHandlers = () => {
  const {
    navToGiftCodeRedeemPage,
    navToSharePage,
    navToWalletGuidePage,
    navToBindKYCPage,
    navToHallPage,
  } = useNavPageClick();

  const { handleAccountPageClick } = useAccountPageAction();
  const { handleHallPageClick } = useHallPageActions();

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const isBankFirstBind = useUserProfileStore((state) => state.isBankFirstBind);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const hasSetPassword = useUserProfileStore((state) => state.hasSetPassword); // 是否設置過密碼
  const bindReferralCode = useUserProfileStore(
    (state) => state.bindReferralCode
  ); // 是否綁定過邀請碼

  // 綁定手機
  const bindPhone = () => {
    if (realPhone) {
      console.log('已經綁定手機號碼，無需再次綁定');
      return;
    }

    handleAccountPageClick({
      actionName: handleAccountPageShowBindPlayerPhoneModalClick,
    });
  };

  const handleGoActionEventHandlers: Record<
    MissionActionType,
    () => Promise<void>
  > = {
    // 綁定手機
    [MissionActionType.BindPhone]: async () => {
      bindPhone();
    },

    /**
     * 首次充值 - TO - 錢包頁面
     * 1 是否綁定過手機號碼
     * 2 是否首次充值
     * @returns
     */
    [MissionActionType.FirstSuccessDeposit]: async () => {
      console.log('首次充值', isFirstDeposit, realPhone);
      bindPhone();

      if (!isFirstDeposit) {
        console.log('已經首次充值過，無需再次充值');
        return;
      }

      handleHallPageClick({
        actionName: handleHallPageDepositBtnClick,
      });
    },

    /**
     * 首次提現
     * 1 是否綁定過手機號
     * 2 是否綁定過銀行卡 navToBindKYCPage
     * 3 是否首次提現
     * @returns
     */

    [MissionActionType.FirstSuccessWithdrawal]: async () => {
      bindPhone();

      if (realPhone && isBankFirstBind) {
        navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
        return;
      }

      // TODO 是否首次提現判別條件待確認
      // if (withdrawTimes > 1) {
      //   console.log('已經首次提現過，無需再次提現');
      //   return;
      // }

      handleHallPageClick({
        actionName: handleHallPageWithdrawBtnClick,
      });
    },

    /**
     * 首次綁定銀行卡 - TO - 銀行卡綁定頁面
     * 1 是否已綁定過手機號
     * 2 是否綁定過銀行卡
     */

    [MissionActionType.BindBankCard]: async () => {
      console.log('綁定銀行卡', isBankFirstBind);
      bindPhone();

      if (!isBankFirstBind) {
        console.log('已經綁定過銀行卡，無需再次綁定');
        return;
      }

      if (realPhone && isBankFirstBind) {
        navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
        return;
      }
    },

    // 設定登入密碼
    [MissionActionType.SetupLoginPassword]: async () => {
      if (hasSetPassword) {
        console.log('已經設置過密碼，無需再次設置');
        return;
      }

      handleAccountPageClick({
        actionName: handleAccountPageShowModalClick,
        payload: { value: AccountPageModalTitleTypes.PASSWORD },
      });
    },

    /**
     * 下載安裝並登入APP - TO - 外部分享頁面
     * 如果在android apk 內 sdkUtils.isInNative()
     */

    [MissionActionType.LoginOfficialApp]: async () => {
      if (sdkUtils.isInNative()) {
        console.log('apk內不顯示');
        return;
      } else {
        handleGlobalClick({
          target: 'handleGlobalClickSharePop',
          callback: () => {
            sdkUtils.downloadApp();
          },
        });
      }
    },

    // 綁定邀請碼
    [MissionActionType.BindInviteCode]: async () => {
      if (bindReferralCode) {
        console.log('已經綁定邀請碼，無需再次綁定');
        return;
      }

      handleAccountPageClick({
        actionName: handleAccountPageShowModalClick,
        payload: { value: AccountPageModalTitleTypes.INVITE_CODE },
      });
    },

    // 充值教學
    [MissionActionType.FinishDepositTutorial]: async () => {
      navToWalletGuidePage();
    },

    // 兌換優惠碼
    [MissionActionType.RedeemCouponCode]: async () => {
      navToGiftCodeRedeemPage();
    },

    // 分享邀請鏈結 - TO - 國際俱樂部邀請海報
    [MissionActionType.ShareReferralLink]: async () => {
      navToSharePage('', { state: { tab: SharePosterType.SHARETEAMCLUB } });
    },

    // 每日任務action go 都去首頁
    [MissionActionType.NAVTOHALL]: async () => {
      navToHallPage();
    },

    // 無行為
    [MissionActionType.NOTHING]: async () => {
      console.log('nothing');
    },
  };

  const handleEvent = async (rawType: MissionActionType) => {
    const handler = handleGoActionEventHandlers[rawType];
    if (handler) {
      try {
        await handler();
      } catch (error) {
        console.error('[handleEvent] error', error);
      }
    } else {
      console.warn('[handleEvent] No handler found for', rawType);
    }
  };

  return { handleEvent };
};
