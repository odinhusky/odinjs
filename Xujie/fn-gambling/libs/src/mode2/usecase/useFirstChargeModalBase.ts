import { useCallback, useEffect, useRef, useState } from 'react';
import sdkUtils from '@libs/mode2/utils/sdk';
import dayjs from 'dayjs';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useLocation } from 'react-router-dom';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { useDeepEffect } from '@libs/commonUtils';
import { useReminderModalStore } from '@mode2/zustand/components/reminderModalStore';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';

interface LocalFirstChargeData {
  expTime: number; // 剩餘時間
  closeTime: number; // 記錄上一次關閉彈窗時間
  disableDuration: number; // 紀錄 當天是否在顯示，禁用到多久
}

const MAX_COUNT_TIME = 60 * 60 * 10; // 10h 倒數優惠
const MAX_WITH_IN = 30; // 30秒內不再顯示

const useFirstChargeModalBase = () => {
  const { navToWalletPage } = useNavPageClick();
  const location = useLocation();

  const firstChargeStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.FIRST_CHARGE
  );

  const id = useUserProfileStore((state) => state.id);
  const isFirstDeposit = useUserProfileStore((state) => state.isFirstDeposit);
  const isNotShowToday = useMode2FirstChargeModalStore(
    (state) => state.isNotShowToday
  );
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );

  const setIsShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.setIsShowFirstChargeDiscountModal
  );

  const [countdownTime, setCountDownTime] = useState<number>(0);
  const countdownRef = useRef<number>(0);

  const showFirstChargeDiscountPopup = async () => {
    const isFirstDeposit = useUserProfileStore.getState().isFirstDeposit;

    // 防呆 未登入 不進入判斷邏輯
    if (!sdkUtils.isCurrentLogin() || isFirstDeposit === null) {
      return;
    }

    const value = await firstChargeStore.getItem<string>(id.toString());
    console.log('@@@===> firstChargeStore decrypt', sdkUtils.decrypt(value!));
    const localFirstChargeMap: LocalFirstChargeData = JSON.parse(
      sdkUtils.decrypt(value!) || '{}'
    );

    const currentTime = dayjs().unix();
    // 今天不在顯示，勾選過"今天不顯示"
    if (localFirstChargeMap?.disableDuration || 0 > currentTime) {
      return;
    }

    const closeTime = localFirstChargeMap?.closeTime || 0;
    const isWithin30Sec = Math.abs(currentTime - closeTime) <= MAX_WITH_IN;
    // 有顯示過 且 上次關閉到現在沒超過30秒;
    if (closeTime && isWithin30Sec) {
      return;
    }

    // 首充
    if (isFirstDeposit === true) {
      // 如果有剩餘時間，且 不小於0，如果小於0 則重新計算10小時
      // 本地剩餘時間減去當下時間，剩餘冷卻時間
      const expTime = (localFirstChargeMap?.expTime || 0) - dayjs().unix();
      const remainCountDown = expTime <= 0 ? MAX_COUNT_TIME : expTime;
      countdownRef.current = remainCountDown;
      // 多一層防呆
      setIsShowFirstChargeDiscountModal(true);
    }
  };

  // init 邏輯
  // 增加邏輯，如果當前是註冊獎勵，則不顯示 首次充值優惠彈窗
  useEffect(() => {
    // 登入，並且 是首充 ＆ 在/hall page
    const isShowReminderModal =
      useReminderModalStore.getState().isShowReminderModal;

    if (
      id &&
      location.pathname === BasePagePathObj.HallPage &&
      !isShowReminderModal
    ) {
      showFirstChargeDiscountPopup();
    }

    return () => {
      // 離開，並且彈窗有顯示 ＆ 在/hall page
      const isShowFirstChargeDiscountModal =
        useMode2FirstChargeModalStore.getState().isShowFirstChargeDiscountModal;
      if (
        location.pathname === BasePagePathObj.HallPage &&
        isShowFirstChargeDiscountModal
      ) {
        handleClose();
      }
    };
  }, [isFirstDeposit, location, id]);

  // cool down 邏輯
  useDeepEffect(() => {
    let interval: NodeJS.Timer | null = null;
    setTimeout(() => {
      if (!countdownRef.current || !isShowFirstChargeDiscountModal) return;
      setCountDownTime(countdownRef.current > 0 ? countdownRef.current : 0);
      interval = setInterval(() => {
        setCountDownTime((pre) => (pre > 0 ? pre - 1 : 0));
      }, 1000);
    }, 10);

    return () => {
      interval && clearInterval(interval);
    };
  }, [countdownRef, isShowFirstChargeDiscountModal]);

  const handleClose = useCallback(async () => {
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
  }, [isNotShowToday, countdownTime]);

  const hanldeClick = () => {
    handleClose();
    navToWalletPage();
  };

  return {
    isShowFirstChargeDiscountModal,
    isNotShowToday,
    countdownTime,
    hanldeClick,
    handleClose,
  };
};

export default useFirstChargeModalBase;
