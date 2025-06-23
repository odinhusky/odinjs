import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '../../handleGlobalClick';
import {
  handleDepositJackpotWheelModalCloseClick,
  handleDepositJackpotWheelModalShowClick,
  handleDepositJackpotWheelModalSpinBtnClick,
  handleDepositJackpotWheelModalSpinStart,
  handleSwiperActionButtonDepositJackpotWheelClick,
  handleSwiperActionButtonDepositJackpotWheelWithCountDownClick,
  handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick,
  handleDepositJackpotWheelRewardModalSpinCloseBtnClick,
  handleDepositJackpotWheelRewardModalCashCloseBtnClick,
  handleDepositJackpotWheelRewardModalEmptyClick,
  handleDepositJackpotWheelRewardModalGoToDepositBtnClick,
  handleDepositJackpotWheelRewardModalSpinNowBtnClick,
  handleDepositJackpotWheelModalMaskClick,
} from '@mode2/action/actionTypes';
import useDepositJackpotWheelModalStore from '@libs/mode2/zustand/modal/DepositJackpotWheelModal';
import { RefObject } from 'react';
import {
  RECHARGE_ZONE_DEG,
  RECHARGE_ZONE_DEG_OFFSET,
  BASE_ROTATE_DEG,
  LOOP_ANIMATION_OPTIONS,
} from '@libs/constant/wheelConst';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { WalletDashboardType } from '@libs/mode2/@types/walletDashboardTypes';
import { useWalletPageStore } from '@libs/mode2/zustand/page/WalletPage/walletPageStore';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import useModalLayoutStore from '@libs/mode2/zustand/template/modalLayoutStore';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { PrizeWheelType } from '@libs/mode2/@types/prizeWheelType';

type ActionClickPayloadMap = {
  [handleDepositJackpotWheelModalCloseClick]: void;
  [handleDepositJackpotWheelModalShowClick]: void;
  [handleDepositJackpotWheelModalSpinStart]: void;
  [handleDepositJackpotWheelModalSpinBtnClick]: void;
  [handleSwiperActionButtonDepositJackpotWheelClick]: void;
  [handleSwiperActionButtonDepositJackpotWheelWithCountDownClick]: void;
  [handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick]: void;
  [handleDepositJackpotWheelRewardModalSpinCloseBtnClick]: void;
  [handleDepositJackpotWheelRewardModalCashCloseBtnClick]: void;
  [handleDepositJackpotWheelRewardModalEmptyClick]: void;
  [handleDepositJackpotWheelRewardModalGoToDepositBtnClick]: void;
  [handleDepositJackpotWheelRewardModalSpinNowBtnClick]: void;
  [handleDepositJackpotWheelModalMaskClick]: void;
};

export interface HandleDepositJackpotWheelModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useDepositJackpotWheelModalActions = () => {
  const { navToWalletPage } = useNavPageClick();
  const setDisplayDashboardType = useWalletPageStore(
    (state) => state.setDisplayDashboardType
  );

  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  const depositJackpotWheelRemainSpin = useDepositJackpotWheelModalStore(
    (state) => state.depositJackpotWheelRemainSpin
  );

  const spinWheel = useDepositJackpotWheelModalStore(
    (state) => state.spinWheel
  );
  const setShowDepositJackpotWheelModal = useDepositJackpotWheelModalStore(
    (state) => state.setShowDepositJackpotWheelModal
  );
  // 用兩個動畫結束狀態，避免衝突邏輯
  const setSpinAnimationFinish = useDepositJackpotWheelModalStore(
    (state) => state.setSpinAnimationFinish
  );

  const setStartSpinAnimation = useDepositJackpotWheelModalStore(
    (state) => state.setStartSpinAnimation
  );

  const setIsShowDepositJackpotWheelRewardModal =
    useDepositJackpotWheelModalStore(
      (state) => state.setIsShowDepositJackpotWheelRewardModal
    );

  const setPrizeWheelType = useDepositJackpotWheelModalStore(
    (state) => state.setPrizeWheelType
  );

  const refreshDepositJackpotWheel = useDepositJackpotWheelModalStore(
    (state) => state.refreshDepositJackpotWheel
  );

  const showToast = useToastStore((state) => state.showToast);

  const handleCloseModals = () => {
    setIsShowDepositJackpotWheelRewardModal(false);
    setShowDepositJackpotWheelModal(false);
    setPrizeWheelType(PrizeWheelType.NONE);
  };

  const handleNavToDepositPage = () => {
    setDisplayDashboardType(WalletDashboardType.NONE);
    setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
    navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
  };

  const handleWheelSpinAnimation = ({
    ref,
    selectedIdx,
    rouletteRotateOffset,
  }: {
    ref: RefObject<HTMLDivElement>;
    selectedIdx: number;
    rouletteRotateOffset: number;
  }) => {
    setSpinAnimationFinish(false);
    const additionalDeg =
      90 + (selectedIdx * -RECHARGE_ZONE_DEG + -RECHARGE_ZONE_DEG_OFFSET);
    const totalDeg = BASE_ROTATE_DEG + additionalDeg;
    const loopAnimation = [
      { transform: `rotate(${rouletteRotateOffset}deg)` },
      { transform: `rotate(${totalDeg + rouletteRotateOffset}deg)` },
    ];
    if (ref.current) {
      const animation = ref.current.animate(loopAnimation, {
        ...LOOP_ANIMATION_OPTIONS,
        duration: 5000,
      });

      animation.onfinish = () => {
        if (ref.current) {
          // 結束後設定在停止的地方
          ref.current.style.transform = `rotate(${
            totalDeg + rouletteRotateOffset
          }deg)`;

          setSpinAnimationFinish(true);
        }
      };
    }
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleDepositJackpotWheelModalShowClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelModalShowClick,
        callback: () => {
          setShowDepositJackpotWheelModal(true);
        },
      });
    },
    [handleDepositJackpotWheelModalCloseClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelModalCloseClick,
        callback: () => {
          setShowDepositJackpotWheelModal(false);
          setSpinAnimationFinish(false);
          setStartSpinAnimation(false);
          useModalLayoutStore
            .getState()
            .verifyNextStep('handleDepositJackpotWheelModalCloseClick');
        },
      });
    },
    [handleDepositJackpotWheelModalSpinStart]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelModalSpinStart,
        callback: () => {
          if (depositJackpotWheelRemainSpin > 0) {
            spinWheel();
          }
        },
      });
    },
    [handleDepositJackpotWheelModalSpinBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelModalSpinBtnClick,
        callback: () => {
          if (depositJackpotWheelRemainSpin > 0) {
            spinWheel();
          } else {
            setDisplayDashboardType(WalletDashboardType.NONE);
            setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
            navToWalletPage('', {
              state: { tab: WalletPageTabType.DEPOSIT },
            });
            setShowDepositJackpotWheelModal(false);
          }
        },
        debounceTimer: 500,
      });
    },
    [handleSwiperActionButtonDepositJackpotWheelClick]: () => {
      handleGlobalClick({
        target: handleSwiperActionButtonDepositJackpotWheelClick,
        callback: () => {
          setShowDepositJackpotWheelModal(true);
        },
      });
    },
    [handleSwiperActionButtonDepositJackpotWheelWithCountDownClick]: () => {
      handleGlobalClick({
        target: handleSwiperActionButtonDepositJackpotWheelWithCountDownClick,
        callback: () => {
          setShowDepositJackpotWheelModal(true);
        },
      });
    },
    [handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalDoubleBonusCloseBtnClick,
        callback: () => {
          handleCloseModals();
          useModalLayoutStore
            .getState()
            .verifyNextStep(
              'DepositJackpotWheelRewardModal Double Deposit Bonus'
            );
          refreshDepositJackpotWheel();
        },
      });
    },
    [handleDepositJackpotWheelRewardModalSpinCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalSpinCloseBtnClick,
        callback: () => {
          handleCloseModals();
          useModalLayoutStore
            .getState()
            .verifyNextStep('DepositJackpotWheelRewardModal Spin');
          refreshDepositJackpotWheel();
        },
      });
    },
    [handleDepositJackpotWheelRewardModalCashCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalCashCloseBtnClick,
        callback: () => {
          handleCloseModals();
          useModalLayoutStore
            .getState()
            .verifyNextStep('DepositJackpotWheelRewardModal Cash');

          showToast('Reward received!');
          refreshDepositJackpotWheel();
        },
      });
    },
    [handleDepositJackpotWheelRewardModalEmptyClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalEmptyClick,
        callback: () => {},
      });
    },
    [handleDepositJackpotWheelRewardModalGoToDepositBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalGoToDepositBtnClick,
        callback: () => {
          handleCloseModals();
          handleNavToDepositPage();
        },
      });
    },
    [handleDepositJackpotWheelRewardModalSpinNowBtnClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelRewardModalSpinNowBtnClick,
        callback: () => {
          setIsShowDepositJackpotWheelRewardModal(false);
          setPrizeWheelType(PrizeWheelType.NONE);
          refreshDepositJackpotWheel();
          useModalLayoutStore
            .getState()
            .verifyNextStep('DepositJackpotWheelRewardModal spin now btn');

          setShowDepositJackpotWheelModal(true);
        },
      });
    },
    [handleDepositJackpotWheelModalMaskClick]: () => {
      handleGlobalClick({
        target: handleDepositJackpotWheelModalMaskClick,
        callback: () => {
          if (
            useDepositJackpotWheelModalStore.getState()
              .depositJackpotWheelRemainSpin <= 0
          ) {
            handleCloseModals();
            handleNavToDepositPage();
          }
        },
      });
    },
  };

  const handleDepositJackpotWheelModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleDepositJackpotWheelModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleDepositJackpotWheelModalClick,
    handleWheelSpinAnimation,
  };
};
