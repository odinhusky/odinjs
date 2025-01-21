import { ReactNode } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils/img';
import Table, { ITableColumn } from '@components/Table';
import cx from '@commonUtils/cx';
import { formatMoney } from '@mode2/utils';

export const Detail = () => {
  const detailColumns: ITableColumn<{
    time: string;
    type: number;
    total: number;
  }>[] = [
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (record, indexRow) => {
        return `Level ${record.type}`;
      },
    },
    {
      title: 'Total Commission',
      dataIndex: 'total',
      render: (v) => {
        return formatMoney(v.total);
      },
    },
  ];
  const detailData = [
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 1,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
    {
      time: '{dd.mm.yyyy}{hh:mm}',
      type: 2,
      total: 100000000,
    },
  ];
  return (
    <PopPage>
      <div className="detail">
        <div className="title">
          Detail
          <img
            src={getImgUrl(EResourceLevel.V, 'icon_cross')}
            className={cx('icon-close')}
            alt="close"
          />
        </div>

        <Table
          columns={detailColumns}
          dataSource={detailData}
          rowKey={'time'}
          pageSize={10}
        />
      </div>
    </PopPage>
  );
};

const PopPage = ({ children }: { children?: ReactNode }) => {
  return <div className="pop">{children}</div>;
};
