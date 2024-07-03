// # API
import {
  useGetLuckyWheelLuckyValueDetailQuery,
} from "apps/gambling/src/app/external";

import { useState } from "react";
import useDeepEffect from "apps/gambling/src/app/ui/hooks/useDeepEffect";

// ? types
import { GetLuckyWheelLuckyValueDetailResponseData } from "../../../endpoint/activity/luckyWheel/GetLuckyWheelLuckyValueDetailEndpoint";

// ^ plugins
import { isEmpty } from "lodash";

export const useLuckyWheelLuckyValueDetailTransform = () => {

  // User Records(My Records)
  const { luckyValueDetailData } = useGetLuckyWheelLuckyValueDetailQuery({}, {
    refetchOnMountOrArgChange: true,
    selectFromResult: (data) => {
      return {
        ...data,
        luckyValueDetailData: data?.data?.data
      }
    }
  });

  const [luckyValueDetail, setLuckyValueDetail] = useState<GetLuckyWheelLuckyValueDetailResponseData>({});

  useDeepEffect(() => {
    if(luckyValueDetailData && !isEmpty(luckyValueDetailData)) {
      // console.log('@@ luckyValueDetailData', luckyValueDetailData)
      setLuckyValueDetail(luckyValueDetailData);
    }
  }, [luckyValueDetailData]);

  return {
    luckyValueDetail
  }
};

export default useLuckyWheelLuckyValueDetailTransform;