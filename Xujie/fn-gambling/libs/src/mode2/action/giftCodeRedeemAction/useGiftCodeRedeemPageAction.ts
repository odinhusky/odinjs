import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleGiftCodeClearInputClick,
  handleGiftCodeInputClick,
  handleGiftCodeRedeemClick,
} from './actionType';
import {
  GiftCodeRedeemScenarios,
  useGiftCodeRedeemStore,
} from '@mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';

type ActionClickPayloadMap = {
  [handleGiftCodeRedeemClick]: {
    scenarios: GiftCodeRedeemScenarios;
    giftCode: string;
  };
  [handleGiftCodeInputClick]: { value: string };
  [handleGiftCodeClearInputClick]: void;
};

export interface HandleGiftCodeRedeemPageActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useGiftCodeRedeemPageAction = () => {
  const setRedeemGiftCodeSubmit = useGiftCodeRedeemStore(
    (state) => state.setRedeemGiftCodeSubmit
  );
  const setGiftCode = useGiftCodeRedeemStore((state) => state.setGiftCode);
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleGiftCodeInputClick]: ({ value }) => {
      handleGlobalClick({
        target: handleGiftCodeInputClick,
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
        callback: () => {
          setRedeemGiftCodeSubmit(scenarios, giftCode);
        },
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
