import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { cx } from '@libs/commonUtils';
import NoData from '@components/NoData';
import {
  RecordPageDeatilTabs,
  useRecordPageHeaderTabsStore,
} from '@libs/mode2/zustand/page/recordPageStore';
import Table, { ITableColumn } from '@components/Table';
import {
  FundDetailItemResult,
  FundDetailType,
} from '@libs/mode2/external/api/endpoint/record/PostFundDetailEndpoint';
import {
  EResourceLevel,
  formatDate,
  formatNumber,
  getImgUrl,
} from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { usePostFundDetailMutation } from '@libs/mode2/external/api';
import Icon from '@components/Icon';
import { useRecordState } from '../../RecordStateMapping';
import { Fragment, useEffect } from 'react';

// TODO Ronan
// TODO i18n
// TODO api & action
const Detail = () => {
  const { getRecordStateValue } = useRecordState();
  const recordPageDeatilTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.recordPageDeatilTabIndex
  );

  const setRecordPageDeatilTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.setRecordPageDeatilTabIndex
  );

  const tabList = [
    RecordPageDeatilTabs.ALL,
    RecordPageDeatilTabs.INCOMES,
    RecordPageDeatilTabs.EXPENSE,
  ];

  const { t } = useTranslation();
  const columns: ITableColumn<FundDetailItemResult>[] = [
    {
      title: t('earn_money_team_data_popup_detail_table_header_type'),
      dataIndex: 'timestamp',
      render: (record) => {
        return (
          <div
            className={cx(
              'text-xs font-medium bgi-text-[var(--base-2-variant1)]',
              FLEX_COL,
              'items-start gap-1'
            )}
          >
            <div>{getRecordStateValue(record.operate)}</div>
            <div>{formatDate(record.timestamp, 'YYYY-MM-DD hh:mm:ss')}</div>
          </div>
        );
      },
    },

    {
      title: t('Change TODO'),
      dataIndex: 'isAssetIncreasing',
      render: (record) => {
        return (
          <div className="text-sm font-medium ">
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
                {record.isAssetIncreasing ? '+' : '-'}
                {record.beforeBalance} {`TODO`}
              </div>
            </div>
            <div className="mt-1 text-xs font-medium flex items-center gap-1">
              <span className="bgi-text-[var(--base-2-variant1)]">Bonus:</span>
              <span
                className={cx({
                  'bgi-text-[var(--state-error-main)]':
                    record.isAssetIncreasing,
                  'bgi-text-[var(--state-success-main)]':
                    !record.isAssetIncreasing,
                })}
              >
                +{30}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      title: t('Balance TODO'),
      dataIndex: 'afterBalance',
      render: (record) => {
        return (
          <div className={cx('text-sm font-medium')}>
            {formatNumber(record.afterBalance, true)}
          </div>
        );
      },
    },
  ];

  const [trigger, { data }] = usePostFundDetailMutation();

  useEffect(() => {
    trigger({ type: FundDetailType.EXPENSE, limit: 30, page: 1 });
  }, []);

  console.log('@@===> usePostFundDetailMutation', data);

  return (
    <>
      <div
        className={cx(
          'mb-0.5',
          FLEX_ITEMS_CENTER,
          'justify-around',
          'bgi-text-[var(--grayscale-100)]'
        )}
      >
        {tabList.map((item, index) => {
          const isLastItem = index === tabList.length - 1;
          return (
            <Fragment>
              <div
                key={index}
                className={cx(
                  'pb-3 text-base font-medium ',
                  'box-border border-b border-transparent cursor-pointer',
                  {
                    'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                      item === recordPageDeatilTabIndex,
                  }
                )}
                onClick={() => {
                  setRecordPageDeatilTabIndex(item);
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
      <Table
        classNames={{
          table: '!rounded-none',
          thead: '!bgi-[var(--base-2-variant6)] !border-none',
          theadTr:
            '!py-1 text-xs font-medium !bgi-text-[var(--base-2-variant1)]',
          tbody: 'max-h-[620px]',
          tbodyTr: '!h-[52px] border-b border-[var(--transparent-white-10)]',
          tbodyTd: 'flex flex-col !text-sm !bgi-text-[var(--grayscale-100)]',
        }}
        columns={columns}
        dataSource={data || []}
        rowKey="timestamp"
        noData={
          <NoData
            text={t('earn_money_team_data_popup_detail_no_data')}
            styles={{
              container: 'mt-28',
            }}
          />
        }
      />
    </>
  );
};
export default Detail;
