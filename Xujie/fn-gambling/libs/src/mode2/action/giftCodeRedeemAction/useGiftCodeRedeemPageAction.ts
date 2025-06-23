import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleGiftCodeClearInputClick,
  handleGiftCodeInputClick,
  handleGiftCodeRedeemClick,
  handleGiftCodeShowRedeemResultModal,
} from '@mode2/action/actionTypes';
import {
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';

type ActionClickPayloadMap = {
  [handleGiftCodeRedeemClick]: {
    scenarios: GiftCodeRedeemScenarios;
    giftCode: string;
  };
  [handleGiftCodeInputClick]: { value: string };
  [handleGiftCodeClearInputClick]: void;
  [handleGiftCodeShowRedeemResultModal]: { value: boolean };
};

export interface HandleGiftCodeRedeemPageActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useGiftCodeRedeemPageAction = () => {
  const setRedeemGiftCodeSubmit = useGiftCodeRedeemStore(
    (state) => state.setRedeemGiftCodeSubmit
  );
  const setGiftRedeemFinish = useGiftCodeRedeemStore(
    (state) => state.setGiftRedeemFinish
  );
  const setShowRedeemResultModal = useGiftCodeRedeemStore(
    (state) => state.setShowRedeemResultModal
  );
  const setErrorMessage = useGiftCodeRedeemStore(
    (state) => state.setErrorMessage
  );
  const setGiftCode = useGiftCodeRedeemStore((state) => state.setGiftCode);
  const userRole = useUserProfileStore((state) => state.userRole);
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const realPhone = useUserProfileStore((state) => state.realPhone);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleGiftCodeInputClick]: ({ value }) => {
      handleGlobalClick({
        target: handleGiftCodeInputClick,
        payload: { value },
        callback: () => {
          setGiftCode(value);
        },
      });
    },
    [handleGiftCodeClearInputClick]: () => {
      handleGlobalClick({
        target: handleGiftCodeClearInputClick,
        callback: () => {
          setGiftCode('');
        },
      });
    },
    [handleGiftCodeRedeemClick]: ({ scenarios, giftCode }) => {
      handleGlobalClick({
        target: handleGiftCodeRedeemClick,
        payload: { scenarios, giftCode },
        callback: () => {
          /**
           * 要成為 User 才能使用優惠碼（包含免費優惠碼）
           * 若是 Player 輸入優惠碼點擊 Confirm 會先提示充值
           * Player去充值後再返回輸入優惠碼 會再跳出註冊手機號
           */
          if (userRole !== UserRoleType.USER) {
            if (!isFirstDeposit) {
              setErrorMessage('Deposit required to use the code');
            }
            if (!realPhone) {
              setErrorMessage('Bind Mobile Number First');
            }
            setShowRedeemResultModal(true);
            return;
          }

          setRedeemGiftCodeSubmit(scenarios, giftCode);
          setGiftRedeemFinish(true);
        },
      });
    },
    [handleGiftCodeShowRedeemResultModal]: ({ value }) => {
      handleGlobalClick({
        target: handleGiftCodeShowRedeemResultModal,
        callback: () => {
          setShowRedeemResultModal(value);
        },
        debounceTimer: 300,
      });
    },
  };

  const handleGiftCodeRedeemPageClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleGiftCodeRedeemPageActionProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleGiftCodeRedeemPageClick,
  };
};

export default useGiftCodeRedeemPageAction;
