// # API
import { useGetOtherUserLuckyWheelRecordsQuery } from 'apps/gambling/src/app/external';

import { useEffect, useRef, useState } from 'react';
import useDeepEffect from 'apps/gambling/src/app/ui/hooks/useDeepEffect';

// ? types
import { GetUserLuckyWheelRecordsResponseData } from '../../../endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';

// ^ plugins
import { isArray, isEmpty } from 'lodash';
import getRandomInt from 'apps/gambling/src/app/ui/utils/getRandomInt';
import removeDuplicates from 'apps/gambling/src/app/ui/utils/removeDuplicates';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';

// import { dummyOtherRecords } from "apps/gambling/src/app/ui/pages/ActivityPage/LuckyWheel/dummyData";

export const useLuckyWheelOtherRecordsTransform = () => {
  const otherRecordCache = useRef<
    GetUserLuckyWheelRecordsResponseData[] | null
  >(null);

  const firstShowDataNum = 20;
  const totalTime = 5 * 60 * 1000;
  const updateInterval = 10 * 1000;

  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  // let updateTimes = 0;
  // const maxUpdateTimes = Math.trunc(totalTime / updateInterval);

  // Other Records
  // const { otherRecordData: aaa, refetch: refetchOtherRecords } = useGetOtherUserLuckyWheelRecordsQuery({}, {
  const {
    otherRecordData,
    isSuccess,
    isFetching,
    refetch: refetchOtherRecords,
  } = useGetOtherUserLuckyWheelRecordsQuery(
    {},
    {
      skip: !isLogin,
      selectFromResult: (data) => {
        return {
          ...data,
          otherRecordData: data?.data?.data,
        };
      },
    }
  );

  // let otherRecordData = dummyOtherRecords;

  const [otherRecords, setOtherRecords] = useState<
    GetUserLuckyWheelRecordsResponseData[]
  >([]);

  const handleRefetchTimeout = () => {
    setTimeout(() => {
      // console.log('@@ Refetch喔')
      refetchOtherRecords();
    }, totalTime);
  };

  // 帳號登入的時候重新取得最新的資料並且 Reset
  useEffect(() => {
    if (isLogin) {
      setOtherRecords([]);
      refetchOtherRecords();
    }
  }, [isLogin, refetchOtherRecords]);

  useEffect(() => {
    if (
      (isEmpty(otherRecords) && isSuccess) ||
      (!isEmpty(otherRecords) && isFetching && isSuccess)
    ) {
      // 只要 otherRecordData 變動拿到新資料的隔5分鐘就要再拿一次
      handleRefetchTimeout();
    }
  }, [isSuccess, isFetching, otherRecords]);

  useDeepEffect(() => {
    // 只要 otherRecordData 變動拿到新資料的隔5分鐘就要再拿一次
    // handleRefetchTimeout();

    if (otherRecordData && isArray(otherRecordData)) {
      // console.log('@@ otherRecordData', otherRecordData)
      const otherRecordDataLength = otherRecordData.length; // API 回來的資料，有可能是 refetch 的
      const otherRecordsLength = otherRecords.length; // 要顯示在畫面上的 states 的長度

      // console.log('@@ otherRecordDataLength', otherRecordDataLength)
      // console.log('@@ otherRecordsLength', otherRecordsLength)

      if (otherRecordsLength === 0) {
        // 如果是一開始都是 0 的話，就選20筆更新，之後再每隔一段時間更新一次。未滿20筆就直接加入顯示的陣列中。
        if (otherRecordDataLength === 0) return;

        if (otherRecordDataLength <= firstShowDataNum) {
          // const reverseResult = [...otherRecordData].reverse();
          setOtherRecords([...otherRecordData]);
        } else {
          const firstShowData = otherRecordData.slice(-firstShowDataNum);
          // const firstShowDataReverse = [...firstShowData].reverse();
          const remainData = otherRecordData.slice(
            0,
            otherRecordDataLength - firstShowDataNum
          );
          setOtherRecords([...firstShowData]);
          otherRecordCache.current = remainData;
        }
      } else {
        // 如果顯示的資料長度不是 0 ，代表這次的變動是 refetch 後的結果，更新 cacheData
        if (otherRecordDataLength === 0) return;
        const resRecordCache = otherRecordCache.current
          ? [...otherRecordCache.current]
          : [];

        const removedDuplicatedRemainData = removeDuplicates([
          ...otherRecordData,
          ...resRecordCache,
        ]);

        otherRecordCache.current = removedDuplicatedRemainData;
      }
    }
  }, [otherRecordData]);

  const handleUpdateCacheData = () => {
    console.log('@@ otherRecordCache data', otherRecordCache);
    if (!otherRecordCache.current || otherRecordCache.current.length <= 0)
      return;

    const cacheLength = otherRecordCache.current.length;

    // 取得更新幾筆資料
    const getDataNumber = getRandomInt(1, 4); // 1~3 隨機取整數
    const updateData = otherRecordCache.current.slice(-getDataNumber);
    // const updateDataReverse = [...updateData].reverse();
    const remainData = otherRecordCache.current?.slice(
      0,
      cacheLength - getDataNumber
    );
    setOtherRecords((prev) => [...updateData, ...prev]);

    otherRecordCache.current = remainData;
  };

  useEffect(() => {
    let x = setTimeout(handleUpdateCacheData, updateInterval);

    return () => {
      window.clearTimeout(x);
    };
  }, [otherRecordCache.current]);

  return {
    otherRecords,
    refetchOtherRecords,
  };
};

export default useLuckyWheelOtherRecordsTransform;
