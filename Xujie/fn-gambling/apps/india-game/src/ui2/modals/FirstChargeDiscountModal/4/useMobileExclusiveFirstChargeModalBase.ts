import {
  FIRST_CHARGE_MODAL_MAX_COUNT_TIME,
  FirstChargeModalBaseProps,
  LocalFirstChargeData,
} from '@mode2/usecase/useFirstChargeModalBase';
import { useLocation } from 'react-router';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@mode2/zustand/template/modalLayoutStore';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { useCallback, useEffect, useRef } from 'react';
import { usePostPromoteFirstChargeMutation } from '@mode2API/index';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useDeepEffect, useUpdateDeepEffect } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';
import dayjs from '@commonUtils/localizedDayjs';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { SourceFrom } from '@mode2/usecase/announcement/command/HallAdModelCommand';

// const FIRST_CHARGE_MODAL_MAX_WITH_IN = 0; // 30秒內不再顯示
/**
 * Evan for [IN][V6]
 * 支援 WebSocket 消息
 * 支援 popup order 排序顯示
 * 支援 Command Pattern 設計模式
 * 互斥關係 useFirstChargeModalBase
 * 無30秒內不再顯示功能， app start 只顯示一次
 * @param props
 */
export const useMobileExclusiveFirstChargeModalBase = (
  props: FirstChargeModalBaseProps
) => {
  const location = useLocation();
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const offerCountdown =
    props?.offerCountdown || FIRST_CHARGE_MODAL_MAX_COUNT_TIME;

  const firstChargeStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.FIRST_CHARGE
  );

  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );
  const setParameters = useMode2FirstChargeModalStore(
    (state) => state.setParameters
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

  const [postPromoteFirstCharge, { data, isSuccess }] =
    usePostPromoteFirstChargeMutation();

  useEffect(() => {
    console.log('!! parameters isSuccess', isSuccess);

    if (isSuccess && data) {
      console.log('!! parameters', data);
      setParameters(data);
    }
  }, [data, isSuccess]);

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
    setCountDownTime(countdownRef.current);
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

    // const closeTime = localFirstChargeMap?.closeTime || 0;
    // const isWithin30Sec =
    //   Math.abs(currentTime - closeTime) <= FIRST_CHARGE_MODAL_MAX_WITH_IN;
    // // 有顯示過 且 上次關閉到現在沒超過30秒;
    // if (closeTime && isWithin30Sec) {
    //   return false;
    // }

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

  const onFirstChargeShowAction = useCallback(
    (command: HallAdModelCommandTypes) => {
      const userRole = useUserProfileStore.getState().userRole;
      const appStartShownSeveralTimes =
        useMode2FirstChargeModalStore.getState().appStartShownSeveralTimes;

      if (command.from === SourceFrom.WEB_SOCKET) {
        setIsShowFirstChargeDiscountModal(true);
        // 顯示即獲取 parameter
        postPromoteFirstCharge();
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      if (
        appStartShownSeveralTimes < 1 &&
        [UserRoleType.PLAYER, UserRoleType.USER].includes(userRole) &&
        isFirstDeposit
      ) {
        showFirstChargeDiscountPopup().then((isShow) => {
          if (isShow) {
            setIsShowFirstChargeDiscountModal(isShow);
            // 顯示即獲取 parameter
            postPromoteFirstCharge();
            hallAdModelInvoker.removeCache(command.uniqueId);
          } else {
            useModalLayoutStore.getState().verifyNextStep('FirstCharge2');
          }
        });
      } else {
        useModalLayoutStore.getState().verifyNextStep('FirstCharge3');
      }
    },
    [isFirstDeposit]
  );

  useUpdateDeepEffect(() => {
    const location = useLocationStore.getState().location;
    if (
      hallAdModelCommandTypes.type === AnnouncementType.FIRST_CHARGE &&
      location?.pathname === BasePagePathObj.HallPage
    ) {
      onFirstChargeShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};

export default useMobileExclusiveFirstChargeModalBase;
