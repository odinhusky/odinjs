// # API
import { useGetUserLuckyWheelRecordsQuery } from 'apps/gambling/src/app/external';

import { useEffect, useState } from 'react';
import useDeepEffect from 'apps/gambling/src/app/ui/hooks/useDeepEffect';

// ? types
import { GetUserLuckyWheelRecordsResponseData } from '../../../endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';

// ^ plugins
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';

export const useLuckyWheelUserRecordsTransform = () => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  // User Records(My Records)
  const { userRecordData, refetch: refetchUserRecords } =
    useGetUserLuckyWheelRecordsQuery(
      {},
      {
        skip: !isLogin,
        refetchOnMountOrArgChange: true,
        selectFromResult: (data) => {
          return {
            ...data,
            userRecordData: data?.data?.data,
          };
        },
      }
    );

  const [userRecords, setUserRecords] = useState<
    GetUserLuckyWheelRecordsResponseData[]
  >([]);

  useEffect(() => {
    if (isLogin) {
      refetchUserRecords();
    }
  }, [isLogin, refetchUserRecords]);

  useDeepEffect(() => {
    if (userRecordData) {
      console.log('@@ userRecordData', userRecordData);
      const result = [...userRecordData].reverse();
      setUserRecords(result);
    }
  }, [userRecordData]);

  return {
    userRecords,
    refetchUserRecords,
  };
};

export default useLuckyWheelUserRecordsTransform;
