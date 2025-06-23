import { useCallback, useEffect, useRef } from 'react';
import sdkUtils from '@libs/mode2/utils/sdk';
import dayjs from '@commonUtils/localizedDayjs';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useDeepEffect } from '@libs/commonUtils';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
// import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { useLocation } from 'react-router';

export interface LocalFirstChargeData {
  expTime: number; // 剩餘時間
  closeTime: number; // 記錄上一次關閉彈窗時間
  disableDuration: number; // 紀錄 當天是否在顯示，禁用到多久
}

export const FIRST_CHARGE_MODAL_MAX_COUNT_TIME = 60 * 60 * 10; // 10h 倒數優惠
const FIRST_CHARGE_MODAL_MAX_WITH_IN = 30; // 30秒內不再顯示

export interface FirstChargeModalBaseProps {
  offerCountdown?: number;
}

const defaultProps: FirstChargeModalBaseProps = {
  offerCountdown: FIRST_CHARGE_MODAL_MAX_COUNT_TIME,
};

/**
 * Evan for [IN][V1,2,3,4,5]
 * [PK][V1,2,3,4]
 * 互斥關係 useMobileExclusiveFirstChargeModalBase
 * @param props
 */
const useFirstChargeModalBase = (
  props: FirstChargeModalBaseProps = defaultProps
) => {
  const location = useLocation();

  const offerCountdown =
    props?.offerCountdown || FIRST_CHARGE_MODAL_MAX_COUNT_TIME;

  const firstChargeStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.FIRST_CHARGE
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );

  const countdownTime = useMode2FirstChargeModalStore(
    (state) => state.countdownTime
  );
  const setCountDownTime = useMode2FirstChargeModalStore(
    (state) => state.setCountDownTime
  );

  const setIsShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.setIsShowFirstChargeDiscountModal
  );

  const countdownRef = useRef<number>(0);

  // init 邏輯
  // 增加邏輯，如果當前是註冊獎勵，則不顯示 首次充值優惠彈窗
  useEffect(() => {
    // 登入，並且 是首充 ＆ 在/hall page

    return () => {
      // 離開，並且彈窗有顯示 ＆ 在/hall page
      const isShowFirstChargeDiscountModal =
        useMode2FirstChargeModalStore.getState().isShowFirstChargeDiscountModal;
      if (
        location?.pathname === BasePagePathObj.HallPage &&
        isShowFirstChargeDiscountModal
      ) {
        handleClose();
      }
    };
  }, [isFirstDeposit, location]);

  // cool down 邏輯
  useDeepEffect(() => {
    let interval: NodeJS.Timer | null = null;
    setTimeout(() => {
      if (!countdownRef.current || !isShowFirstChargeDiscountModal) return;
      setCountDownTime(countdownRef.current > 0 ? countdownRef.current : 0);
      interval = setInterval(() => {
        countdownRef.current =
          countdownRef.current > 0 ? countdownRef.current - 1 : 0;
        setCountDownTime(countdownRef.current);
      }, 1000);
    }, 10);

    return () => {
      interval && clearInterval(interval);
    };
  }, [countdownRef, isShowFirstChargeDiscountModal]);

  const handleClose = useCallback(
    async (isNext: boolean = true) => {
      const isNotShowToday =
        useMode2FirstChargeModalStore.getState().isNotShowToday;

      sdkUtils.playSound();
      setIsShowFirstChargeDiscountModal(false);
      const data: LocalFirstChargeData = {
        expTime: countdownTime + dayjs().unix(),
        closeTime: dayjs().unix(), // 剩餘時間
        disableDuration: isNotShowToday ? dayjs().startOf('day').unix() : 0,
      };

      const userId = useUserProfileStore.getState().id;
      firstChargeStore.setItem(
        userId.toString(),
        sdkUtils.encryption(JSON.stringify(data))
      );
      if (isNext) {
        useModalLayoutStore.getState().verifyNextStep('FirstCharge');
      }
    },
    [countdownTime]
  );

  const showFirstChargeDiscountPopup = async () => {
    const isFirstDeposit = useUserProfileStore.getState().isFirstDeposit;

    // 防呆 未登入 不進入判斷邏輯
    if (!sdkUtils.isCurrentLogin() || isFirstDeposit === null) {
      return false;
    }
    const id = useUserProfileStore.getState().id;
    const value = await firstChargeStore.getItem<string>(id.toString());
    const localFirstChargeMap: LocalFirstChargeData = JSON.parse(
      sdkUtils.decrypt(value!) || '{}'
    );

    const currentTime = dayjs().unix();
    // 今天不在顯示，勾選過"今天不顯示"
    if (localFirstChargeMap?.disableDuration || 0 > currentTime) {
      return false;
    }

    const closeTime = localFirstChargeMap?.closeTime || 0;
    const isWithin30Sec =
      Math.abs(currentTime - closeTime) <= FIRST_CHARGE_MODAL_MAX_WITH_IN;
    // 有顯示過 且 上次關閉到現在沒超過30秒;
    if (closeTime && isWithin30Sec) {
      return false;
    }

    // 首充
    if (isFirstDeposit === true) {
      // 如果有剩餘時間，且 不小於0，如果小於0 則重新計算10小時
      // 本地剩餘時間減去當下時間，剩餘冷卻時間
      const expTime = (localFirstChargeMap?.expTime || 0) - dayjs().unix();
      const remainCountDown = expTime <= 0 ? offerCountdown : expTime;
      countdownRef.current = remainCountDown;
      // 多一層防呆
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const userRole = useUserProfileStore.getState().userRole;
    if (
      [UserRoleType.PLAYER, UserRoleType.USER].includes(userRole) &&
      isFirstDeposit === true
    ) {
      showFirstChargeDiscountPopup().then((isShow) => {
        if (isShow) {
          setIsShowFirstChargeDiscountModal(isShow);
        }
      });
    }
  }, [isFirstDeposit]);
};

export default useFirstChargeModalBase;
