import { TInfiniteTableColumn } from '../../../../components-bs/InfiniteTable';
import { GetUserLuckyWheelRecordsResponseData } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';
import useLuckyWheelUserRecordsTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelUserRecordsTransform';
import { isArray } from 'lodash';
import { renderByUVersion } from '../../../../utils/renderByUVersion';

import MyRecordsTableP1 from '../env/p1/MyRecordsTableP1';
import MyRecordsTableU1 from '../env/u1/MyRecordsTableU1';
import MyRecordsTableU2 from '../env/u2/MyRecordsTableU2';
import MyRecordsTableU5 from '../env/u5/MyRecordsTableU5';
import MyRecordsTableU6 from '../env/u6/MyRecordsTableU6';

import { useEffect, useState } from 'react';
import useDeepEffect from '../../../../hooks/useDeepEffect';
import { useLuckyWheelCtx } from '../LuckyWheelContext';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';

interface MyRecordsTableProps {
  columns: TInfiniteTableColumn<GetUserLuckyWheelRecordsResponseData>[];
  isShow: boolean;
}

export const MyRecordsTable = (props: MyRecordsTableProps) => {
  const [dataSource, setDataSource] = useState<
    GetUserLuckyWheelRecordsResponseData[]
  >([]);

  const { userRecords } = useLuckyWheelUserRecordsTransform();
  const { isAnimatingObj } = useLuckyWheelCtx();

  useDeepEffect(() => {
    // 如果有任何一個輪盤正在轉動，就先不更新，直到都沒在轉動才更新剛剛拿到的資料
    const shouldNOTSetDataSource = Object.values(isAnimatingObj).includes(true);

    if (!shouldNOTSetDataSource) {
      // 反轉陣列
      const userRecordsReverse =
        isArray(userRecords) && userRecords.length > 0
          ? [...userRecords].reverse()
          : userRecords;

      setDataSource(userRecordsReverse);
    }
  }, [userRecords, isAnimatingObj]);

  return renderByUVersion(
    {
      p1: <MyRecordsTableP1 {...props} datasource={dataSource} />,
      u1: <MyRecordsTableU1 {...props} datasource={dataSource} />,
      u2: <MyRecordsTableU2 {...props} datasource={dataSource} />,
      u5: <MyRecordsTableU5 {...props} datasource={dataSource} />,
      u6: <MyRecordsTableU6 {...props} datasource={dataSource} />,
    },
    <MyRecordsTableU1 {...props} datasource={dataSource} />
  );
};

export default MyRecordsTable;
