import useRankingPageRewardsBase from './useRankingPageRewardsBase';
import { RankingMyRewardInfoResult } from '@mode2API/endpoint/ranking/PostRankingMyRewardsEndpoint';
import { useRankingPageStore } from '@mode2/zustand/page/RankingPage/rankingPageStore';
import { useTranslation } from 'react-i18next';
import { ITableColumn } from '@mode2/components/Table';
import { formatDate, formatMoney } from '@mode2/utils';
import cx from '@commonUtils/cx';
import Table from '@components/Table';
import { useMemo } from 'react';
import NoData from '@components/NoData';
import { useTemplateLayoutStore } from '@mode2/zustand/template/templateLayoutStore';

interface RankingRewardsColumn extends RankingMyRewardInfoResult {}

export const RankingRewardsContent = () => {
  const { t } = useTranslation();
  useRankingPageRewardsBase();
  const rankingMyRewardResults = useRankingPageStore(
    (state) => state.rankingMyRewardResults
  );

  const columns: ITableColumn<RankingRewardsColumn>[] = [
    {
      title: t('ranking_my_reward_time'),
      dataIndex: 'indexKey',
      render: (record) => {
        return (
          <div className="w-full flex flex-col justify-center items-start gap-1 text-xs">
            <p>{record.period}</p>
            <p>{formatDate(record.claimTime, 'YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        );
      },
    },
    {
      title: t('ranking_my_reward_reward_amount'),
      dataIndex: 'rewardAmount',
      render: (record) => (
        <div
          className={'bgi-text-[var(--grayscale-100)] text-sm w-full text-end'}
        >
          {' '}
          {formatMoney({ value: record.rewardAmount })}{' '}
        </div>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    return rankingMyRewardResults;
  }, [rankingMyRewardResults]);

  const headerElMetrics = useTemplateLayoutStore(
    (state) => state.headerElMetrics
  );

  return (
    <div className={'mx-4'}>
      <Table
        classNames={{
          table: cx(
            '!p-0 !m-0 bg-transparent !border-collapse',
            '!bgi-text-[var(--base-2-variant2)]  !rounded-none'
          ),
          thead:
            '!p-0 !m-0 !bg-transparent !border-[var(--transparent-white-10)] !border-b',
          theadTr:
            '!p-0 !m-0 !gap-0 !bgi-text-[var(--base-2-variant2)] !text-xs !font-normal',
          theadTth: '!font-normal',
          tbody: '',
          tbodyTr:
            '!px-0 !min-h-max !border-[var(--transparent-white-10)] !border-b !px-3 py-4  h-auto',
          tbodyTd: '!p-0 !min-h-max !font-normal ',
        }}
        rowKey={'indexKey'}
        dataSource={dataSource}
        columns={columns}
        noData={
          <div
            style={{
              height: `calc(100vh - ${headerElMetrics.height}px)`,
            }}
          >
            <NoData
              text={t('ranking_my_reward_no_data')}
              styles={{
                container: cx(
                  'max-w-[303px] mx-auto',
                  'h-full'
                  // 'pb-[80px]',
                  // noDataHeight
                ),
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default RankingRewardsContent;
