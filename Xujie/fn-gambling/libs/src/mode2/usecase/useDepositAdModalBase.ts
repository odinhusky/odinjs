import { useLocation } from 'react-router';
import { useDepositAdvertisementStore } from '../zustand/components/depositAdvertisementStore';
import { useUserProfileStore } from '../zustand/user/userProfileStore';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { BasePagePathObj } from '../routerTypes/types';

const useDepositAdModalBase = () => {
  const {
    currentUserId,
    isShowDepositAdvertisementModal,
    setShowDepositAdvertisementModal,
    showCount,
    maxShowCount,
    lastShowTime,
    resetDepositAdvertiseData,
    activityEndTime,
    setCurrentUserId,
    cacheDepositAdvertiseData,
  } = useDepositAdvertisementStore();

  const [countDownTime, setCountDownTime] = useState<number>();

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (isShowDepositAdvertisementModal) {
      const remainTime = activityEndTime - dayjs().unix();
      setCountDownTime(remainTime > 0 ? remainTime : 0);
      timer = setInterval(() => {
        setCountDownTime((pre) =>
          pre === undefined ? remainTime : pre > 0 ? pre - 1 : 0
        );
      }, 1000);
    } else {
      cacheDepositAdvertiseData();
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [isShowDepositAdvertisementModal]);
  useEffect(() => {
    if (countDownTime === 0) {
      setShowDepositAdvertisementModal(false);
    }
  }, [countDownTime]);
  const isLowBalance = useUserProfileStore((state) => state.isLowBalance);
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);

  const location = useLocation();
  const userId = useUserProfileStore((state) => state.id);
  const lastApiUpdateTime = useUserProfileStore(
    (state) => state.lastApiUpdateTime
  );
  const isNeedShowModal = useMemo(() => {
    return (
      // 只顯示在首頁,第一次顯示後，只要關閉彈窗後每5分鐘彈出一次，两小时最多顯示三次
      location.pathname === BasePagePathObj.HallPage &&
      currentUserId &&
      (showCount === 0 ||
        (showCount < maxShowCount
          ? lastShowTime < dayjs().subtract(5, 'm').unix()
          : lastShowTime < dayjs().subtract(2, 'h').unix()))
    );
  }, [
    lastShowTime,
    location,
    maxShowCount,
    showCount,
    currentUserId,
    lastApiUpdateTime,
  ]);

  const lastApiUpdateOver10Sec = useMemo(
    () =>
      // 距离上次余额刷新超过10s
      !!lastApiUpdateTime &&
      lastApiUpdateTime < dayjs().subtract(10, 's').unix(),
    [lastApiUpdateTime, location.pathname]
  );
  useEffect(() => {
    if (isNeedShowModal && lastApiUpdateOver10Sec) {
      refreshUserData();
    }
  }, [isNeedShowModal, lastApiUpdateOver10Sec]);

  useEffect(() => {
    console.log('@@useDepositAdModalBase===>', {
      currentUserId,
      isNeedShowModal,
      isLowBalance,
      showCount,
      activityEndTime,
      lastShowTime: dayjs(lastShowTime * 1000).format('HH:mm:ss'),
      isShowDepositAdvertisementModal,
    });
    if (!isNeedShowModal) return;

    if (isLowBalance === true) {
      setShowDepositAdvertisementModal(true);
    } else if (isLowBalance === false) {
      setShowDepositAdvertisementModal(false);

      resetDepositAdvertiseData();
    }
  }, [isLowBalance, isNeedShowModal]);

  useEffect(() => {
    if (!userId && currentUserId) {
      // 用户退出登录 缓存数据

      cacheDepositAdvertiseData();
      setCurrentUserId(0);
    }
    if (userId && !currentUserId) {
      // 用户登录
      setCurrentUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    //卸载页面 缓存数据
    window.addEventListener('beforeunload', cacheDepositAdvertiseData);
    return () => {
      window.removeEventListener('beforeunload', cacheDepositAdvertiseData);
    };
  }, []);
  return {
    countDownTime: countDownTime || 0,
    isShowDepositAdvertisementModal,
  };
};
export default useDepositAdModalBase;
