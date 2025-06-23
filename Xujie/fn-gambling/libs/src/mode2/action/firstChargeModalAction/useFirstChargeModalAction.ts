import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleFirstChargeModalClose,
  handleFirstChargeModalNotShowTodayClick,
  handleFirstChargeModalSelectedProductClick,
  handleFirstChargeModalToWalletClick,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { LocalFirstChargeData } from '@libs/mode2/usecase/useFirstChargeModalBase';
import { useMode2FirstChargeModalStore } from '@libs/mode2/zustand/components/firstChargeStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import dayjs from '@commonUtils/localizedDayjs';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import HallAdModelInvoker from '@libs/mode2/usecase/announcement/command/HallAdModelInvoker';
import { useWalletPageStore } from '@libs/mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@libs/mode2/@types/walletDashboardTypes';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

type ActionClickPayloadMap = {
  [handleFirstChargeModalClose]: void;
  [handleFirstChargeModalNotShowTodayClick]: { value: boolean };
  [handleFirstChargeModalToWalletClick]: void;
  [handleFirstChargeModalSelectedProductClick]: { amount: number };
};

export interface HandleFirstChargeModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useFirstChargeModalAction = () => {
  const { navToWalletPage } = useNavPageClick();

  const setIsNotShowToday = useMode2FirstChargeModalStore(
    (state) => state.setIsNotShowToday
  );

  const setIsShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.setIsShowFirstChargeDiscountModal
  );

  const firstChargeStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.FIRST_CHARGE
  );

  const handleClose = async (isNext: boolean = true) => {
    useMode2FirstChargeModalStore.getState().updateAppStartShownSeveralTimes();
    const countdownTime =
      useMode2FirstChargeModalStore.getState().countdownTime;
    const isNotShowToday =
      useMode2FirstChargeModalStore.getState().isNotShowToday;
    const userId = useUserProfileStore.getState().id;

    setIsShowFirstChargeDiscountModal(false);
    const data: LocalFirstChargeData = {
      expTime: countdownTime + dayjs().unix(),
      closeTime: dayjs().unix(), // 剩餘時間
      disableDuration: isNotShowToday ? dayjs().startOf('day').unix() : 0,
    };

    firstChargeStore.setItem(
      userId.toString(),
      sdkUtils.encryption(JSON.stringify(data))
    );
    if (isNext) {
      HallAdModelInvoker.executeNext('19');
    }
  };

  const handleClick = () => {
    handleClose(false);
    useWalletPageStore
      .getState()
      .setDisplayDashboardType(WalletDashboardType.NONE);
    useWalletPageSwitchContentTabsStore
      .getState()
      .setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
    navToWalletPage('', {
      state: { tab: WalletPageTabType.DEPOSIT },
    });
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFirstChargeModalClose]: () => {
      handleGlobalClick({
        target: handleFirstChargeModalClose,
        callback: () => {
          handleClose();
        },
      });
    },
    [handleFirstChargeModalNotShowTodayClick]: ({ value }) => {
      handleGlobalClick({
        target: handleFirstChargeModalNotShowTodayClick,
        payload: { value },
        callback: () => {
          setIsNotShowToday(value);
        },
      });
    },
    [handleFirstChargeModalToWalletClick]: () => {
      handleGlobalClick({
        target: handleFirstChargeModalToWalletClick,
        callback: () => {
          handleClick();
        },
      });
    },
    [handleFirstChargeModalSelectedProductClick]: ({ amount }) => {
      handleGlobalClick({
        target: handleFirstChargeModalSelectedProductClick,
        payload: { amount },
        callback: () => {
          console.log(
            '@@@===>evan.handleFirstChargeModalSelectedProductClick',
            amount
          );
          useWalletPageRechargeContentStore
            .getState()
            .setPresetSelectionProductAmount(amount);
          handleClick();
        },
      });
    },
  };

  const handleFirstChargeModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleFirstChargeModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFirstChargeModalClick,
  };
};

export default useFirstChargeModalAction;
