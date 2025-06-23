import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { cx } from '@libs/commonUtils';
import { useRecordPageHeaderTabsStore } from '@libs/mode2/zustand/page/recordPageStore';
import { ITableColumn } from '@components/Table';
import {
  FundDetailItemResult,
  FundDetailType,
} from '@libs/mode2/external/api/endpoint/record/PostFundDetailEndpoint';
import { EResourceLevel, formatDate, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { usePostFundDetailMutation } from '@libs/mode2/external/api';
import Icon from '@components/Icon';
import { useRecordState } from '../../RecordStateMapping';
import { Fragment, useEffect, useRef, useState } from 'react';
import ModeTable, { useTable } from '@libs/mode2/components/Table';
import NoData from '@components/NoData';
import TableSkeleton from '@components/TableSkeleton';

const Detail = () => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const { getRecordStateValue } = useRecordState();
  const recordPageDeatilTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.recordPageDeatilTabIndex
  );

  const setRecordPageDeatilTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.setRecordPageDeatilTabIndex
  );

  const tabList = [
    FundDetailType.ALL,
    FundDetailType.INCOME,
    FundDetailType.EXPENSE,
  ];

  const { t } = useTranslation();

  const [trigger] = usePostFundDetailMutation();
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    type: recordPageDeatilTabIndex,
  });

  const { isLoading, dataSource, fetchData, resetDataSource } = useTable(
    async (params) => {
      const result = await trigger(params).unwrap();
      return result;
    },
    { searchData: params }
  );

  const columns: ITableColumn<FundDetailItemResult>[] = [
    {
      title: t('wallet_detail_table_column_type'),
      className: '',
      dataIndex: 'timestamp',
      render: (record) => {
        return (
          <div
            className={cx(
              'text-xs font-medium bgi-text-[var(--base-2-variant2)]',
              FLEX_COL,
              'items-start gap-1'
            )}
          >
            <div>{getRecordStateValue(record.operate)}</div>
            <div>{formatDate(record.timestamp, 'YYYY-MM-DD HH:mm:ss')}</div>
          </div>
        );
      },
    },

    {
      title: t('wallet_detail_table_column_change'),
      dataIndex: 'isAssetIncreasing',
      render: (record, index) => {
        return (
          <div className="text-sm font-medium">
            <div className="flex items-center gap-1">
              <Icon name="ic_coin" className="w-5 h-5" />
              <div
                className={cx({
                  'bgi-text-[var(--state-error-main)]':
                    record.isAssetIncreasing,
                  'bgi-text-[var(--state-success-main)]':
                    !record.isAssetIncreasing,
                })}
              >
                {record.isAssetIncreasing ? '+' : ''}
                {record.changeAmount}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      title: t('wallet_detail_table_column_balance'),
      className: '',
      dataIndex: 'afterBalance',
      render: (record) => {
        return (
          <div
            className={cx(
              'text-sm font-medium text-right bgi-text-[var(--grayscale-100)]'
            )}
          >
            {record.afterBalance}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    return () => {
      setRecordPageDeatilTabIndex(FundDetailType.ALL);
    };
  }, []);

  return (
    <>
      <div
        className={cx(
          'mb-0.5 sticky',
          FLEX_ITEMS_CENTER,
          'justify-around',
          'bgi-text-[var(--grayscale-100)]'
        )}
      >
        {tabList.map((item, index) => {
          const isLastItem = index === tabList.length - 1;
          return (
            <Fragment key={index}>
              <div
                key={index}
                className={cx(
                  'pb-3 text-base font-medium',
                  'box-border border-b border-transparent cursor-pointer',
                  {
                    'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                      item === recordPageDeatilTabIndex,
                  }
                )}
                onClick={() => {
                  setTimeout(() => {
                    tbodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 50);
                  setRecordPageDeatilTabIndex(item);
                  setParams({ ...params, type: item });
                  resetDataSource(); // 重置 dataSource
                }}
              >
                <div>{item}</div>
              </div>
              {!isLastItem && (
                <img
                  src={getImgUrl(EResourceLevel.ICONS, 'divider')}
                  alt="separator"
                  className="w-1.5 h-5"
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* 表格 */}
      <ModeTable
        fetchData={fetchData}
        isLoading={isLoading}
        skeleton={
          <TableSkeleton
            length={columns.length}
            key={params.page + params.type + columns.length}
          />
        }
        tbodyRef={tbodyRef}
        isShowThead={true}
        classNames={{
          table: '!rounded-none',
          thead: '!bgi-[var(--base-2-variant6)] !border-none',
          theadTr:
            '!py-1 text-xs font-medium !bgi-text-[var(--base-2-variant2)]',
          theadTth:
            ' !w-1/3 first:!w-2/5 first:!ml-14 !justify-start last:!justify-end',
          tbody: 'h-[660px]',
          tbodyTr:
            '!h-[72px] !px-3 border-b border-[var(--transparent-white-10)]',
          tbodyTd:
            'flex flex-col !text-sm text-wrap !w-1/3 first:!w-2/5 first:text-left even:!ml-9 !items-start last:!items-end !bgi-text-[var(--grayscale-100)]',
        }}
        columns={columns}
        dataSource={dataSource || []}
        rowKey="timestamp"
        noData={
          <NoData
            styles={{
              container: 'mt-56',
            }}
          />
        }
      />
    </>
  );
};
export default Detail;
