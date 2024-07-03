import { TInfiniteTableColumn } from '../../../../components-bs/InfiniteTable';
import { GetUserLuckyWheelRecordsResponseData } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';
import useLuckyWheelOtherRecordsTransform from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelOtherRecordsTransform';
import { renderByUVersion } from '../../../../utils/renderByUVersion';

import OtherRecordsTableP1 from '../env/p1/OtherRecordsTableP1';
import OtherRecordsTableU1 from '../env/u1/OtherRecordsTableU1';
import OtherRecordsTableU2 from '../env/u2/OtherRecordsTableU2';
import OtherRecordsTableU5 from '../env/u5/OtherRecordsTableU5';
import OtherRecordsTableU6 from '../env/u6/OtherRecordsTableU6';
import OtherRecordsTableU7 from '../env/u7/OtherRecordsTableU7';

interface OtherRecordsTableProps {
  columns: TInfiniteTableColumn<GetUserLuckyWheelRecordsResponseData>[];
  isShow: boolean;
}

export const OtherRecordsTable = (props: OtherRecordsTableProps) => {
  const { otherRecords } = useLuckyWheelOtherRecordsTransform();

  return renderByUVersion(
    {
      p1: <OtherRecordsTableP1 {...props} datasource={otherRecords} />,
      u1: <OtherRecordsTableU1 {...props} datasource={otherRecords} />,
      u2: <OtherRecordsTableU2 {...props} datasource={otherRecords} />,
      u5: <OtherRecordsTableU5 {...props} datasource={otherRecords} />,
      u6: <OtherRecordsTableU6 {...props} datasource={otherRecords} />,
      u7: <OtherRecordsTableU7 {...props} datasource={otherRecords} />,
    },
    <OtherRecordsTableU1 {...props} datasource={otherRecords} />
  );
};

export default OtherRecordsTable;
