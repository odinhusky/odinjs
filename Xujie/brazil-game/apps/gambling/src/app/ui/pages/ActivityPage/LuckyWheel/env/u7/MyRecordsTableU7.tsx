import cx from 'apps/gambling/src/app/ui/utils/cx';
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from 'apps/gambling/src/app/ui/components-bs/InfiniteTable';
import { GetUserLuckyWheelRecordsResponseData } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';

interface MyRecordsTableU7Props {
  columns: TInfiniteTableColumn<GetUserLuckyWheelRecordsResponseData>[];
  isShow: boolean;
  datasource: GetUserLuckyWheelRecordsResponseData[];
}

export const MyRecordsTableU7 = ({
  columns,
  isShow,
  datasource,
}: MyRecordsTableU7Props) => {
  return (
    <div
      className={cx('w-full', {
        hidden: !isShow,
      })}
    >
      <InfiniteTable
        headerClassName={'h-auto'}
        className=""
        rowKey={['id', 'date', 'level', 'rewardAmount']}
        datasource={datasource}
        columns={columns}
        totalCount={datasource.length}
        tbodyClassName={cx('h-[336px]', 'overflow-y-auto')}
        tbodyTrClassName={cx('border-linear')}
        isShowLastBorder={false}
      />
    </div>
  );
};

export default MyRecordsTableU7;
