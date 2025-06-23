import { Fragment } from 'react';
import { cx } from '@libs/commonUtils';
import {
  FLEX_ITEMS_CENTER,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@constant/style';
import { Icon } from '@components/Icon';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';
import { formatDate, formatMoney } from '@mode2/utils';
import dayjs from '@commonUtils/localizedDayjs';
import { useTranslation } from 'react-i18next';
import useTaskRewardsRecordContentBase from '@mode2/usecase/page/activityRecordPage/useTaskRewardsRecordContentBase';
import { useTaskRewardsRecordContentStore } from '@mode2/zustand/components/taskRewardsRecordContentStore';
import renderI18N from '@libs/commonUtils/renderI18N';
import useActivityRecordPageActions from '@mode2/action/activityRecordPageAction/useActivityRecordPageActions';
import { handleActivityRecordPageTaskPeriodTabsClick } from '@mode2/action/actionTypes';
import Table, { ITableColumn } from '@components/Table';

import NoData from '@components/NoData';
import { MissionHistoryInfoResult } from '@mode2API/endpoint/mission/PostMissionHistoryEndpoint';

const TaskRewardsRecordTabs = () => {
  const { t } = useTranslation();
  const periodTabs = useTaskRewardsRecordContentStore(
    (state) => state.periodTabs
  );
  const currentTab = useTaskRewardsRecordContentStore(
    (state) => state.currentTab
  );

  const { handleActivityRecordPageClick } = useActivityRecordPageActions();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'justify-around')}>
      {periodTabs.map((item, index) => {
        const isLastItem = index === periodTabs.length - 1;

        return (
          <Fragment key={index}>
            <div
              key={index}
              className={cx(
                'text-center',
                'py-2.5 text-base font-medium ',
                'box-border border-b border-transparent cursor-pointer',
                {
                  'bgi-text-[var(--base-1-main)] border-[var(--base-1-main)]':
                    item.period === currentTab.period,
                  'bgi-text-[var(--grayscale-100)]':
                    item.period !== currentTab.period,
                }
              )}
              onClick={() => {
                handleActivityRecordPageClick({
                  actionName: handleActivityRecordPageTaskPeriodTabsClick,
                  payload: { tab: item },
                });
              }}
            >
              <div>{renderI18N(item, t)}</div>
            </div>
            {!isLastItem && <Icon className="w-1.5 h-5" name={'divider'} />}
          </Fragment>
        );
      })}
    </div>
  );
};

const TaskRewardsRecordPeriodInto = () => {
  const { t } = useTranslation();

  const currentTab = useTaskRewardsRecordContentStore(
    (state) => state.currentTab
  );

  const totalAmount = useTaskRewardsRecordContentStore(
    (state) => state.totalAmount
  );
  const getDateRange = (daysAgo: number) => {
    const startDate = daysAgo
      ? dayjs().subtract(daysAgo, 'day').unix()
      : dayjs().unix();
    const endDate = dayjs().unix();

    return (
      <div className="flex items-center gap-1">
        <span>{formatDate(startDate, 'YYYY-MM-DD')}</span>
        <span>to</span>
        <span>{formatDate(endDate, 'YYYY-MM-DD')}</span>
      </div>
    );
  };
  return (
    <div
      className={cx(
        'mt-2 text-sm',
        FLEX_ITEMS_CENTER,
        'justify-between',
        'bgi-text-[var(--base-2-variant1)]'
      )}
    >
      <div>{getDateRange(currentTab.daysAgo)}</div>

      <div>
        {t('Total amount')}:{formatMoney({ value: totalAmount })}
      </div>
    </div>
  );
};

const TaskRewardsRecordTable = () => {
  const { t } = useTranslation();
  const rewardList = useTaskRewardsRecordContentStore(
    (state) => state.rewardList
  );

  const columns: ITableColumn<MissionHistoryInfoResult>[] = [
    {
      title: t('Time'),
      dataIndex: 'claimTime',
      render: (record) => {
        return (
          <div className="w-full items-start text-start">
            <div>{formatDate(record.claimTime, 'YYYY-MM-DD')}</div>
            <div>{formatDate(record.claimTime, 'HH:mm:ss')}</div>
          </div>
        );
      },
    },

    {
      title: t('Mission'),
      dataIndex: 'title',
      render: (record) => {
        return (
          <div className="text-start">
            <div className={'w-full text-wrap text-start'}>{record.title}</div>
            <div>Source: {record.source}</div>
          </div>
        );
      },
    },
    {
      title: t('Reward Amount'),
      dataIndex: 'rewardAmount',
      render: (record) => {
        return (
          <div className="w-full items-end text-end">
            <div className={'bgi-text-[var(--grayscale-100)] text-base'}>
              {formatMoney({
                value: record.rewardAmount,
                includeDecimal: true,
              })}
            </div>
            <div>{record.claimWay}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={cx('bgi-text-[var(--base-2-variant1)]', 'mt-2')}>
      <div className="flex flex-col "></div>
      <Table
        isShowThead={true}
        classNames={{
          table: cx('w-full !text-xs'),
          tbodyTr:
            '!h-full !border-b !bgi-border-b-[var(--transparent-gray-10)]',
          tbodyTd: 'flex flex-col !items-start !w-full odd:px-2.5 py-6 w-full h-full text-wrap',
          theadTth: 'bgi-text-[var(--base-2-variant1)] h-10',
        }}
        columns={columns}
        dataSource={rewardList}
        rowKey={'indexKey'}
        noData={
          <NoData
            styles={{
              container: 'mt-[11.53125rem]',
            }}
          />
        }
      />
    </div>
  );
};

// TODO Evan
export const TaskRewardsRecordContent = () => {
  useTaskRewardsRecordContentBase();
  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 -mb-4',
        'bgi-[var(--background-light)]',
        'px-4'
      )}
      style={{
        minHeight: `calc(100vh - ${headerElMetrics.height}px)`,
      }}
    >
      <TaskRewardsRecordTabs />
      <TaskRewardsRecordPeriodInto />
      <TaskRewardsRecordTable />
    </div>
  );
};

export default TaskRewardsRecordContent;
