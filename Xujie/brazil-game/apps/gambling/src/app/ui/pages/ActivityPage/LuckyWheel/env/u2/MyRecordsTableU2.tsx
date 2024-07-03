import cx from 'apps/gambling/src/app/ui/utils/cx';
import {
  InfiniteTable,
  TInfiniteTableColumn,
} from 'apps/gambling/src/app/ui/components-bs/InfiniteTable';
import { GetUserLuckyWheelRecordsResponseData } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/GetUserLuckyWheelRecordsEndpoint';
import { noDataImgClassU2, noDataTbodyClassU2 } from '../../luckyWheelStyle';

interface MyRecordsTableU2Props {
  columns: TInfiniteTableColumn<GetUserLuckyWheelRecordsResponseData>[];
  isShow: boolean;
  datasource: GetUserLuckyWheelRecordsResponseData[];
}

export const MyRecordsTableU2 = ({
  columns,
  isShow,
  datasource,
}: MyRecordsTableU2Props) => {
  return (
    <div
      className={cx('w-full', {
        hidden: !isShow,
      })}
    >
      <InfiniteTable
        className=""
        rowKey={['id', 'date', 'level', 'rewardAmount']}
        datasource={datasource}
        columns={columns}
        totalCount={datasource.length}
        tbodyClassName={cx(
          'h-[336px]',
          'overflow-y-auto',
          'bg-[var(--grayscale-20)]',
          `${datasource.length === 0 ? noDataTbodyClassU2 : ''}`
        )}
        tbodyTrClassName={cx('border-linear')}
        noDataImgClass={noDataImgClassU2}
        isShowLastBorder={false}
      />
    </div>
  );
};

export default MyRecordsTableU2;
