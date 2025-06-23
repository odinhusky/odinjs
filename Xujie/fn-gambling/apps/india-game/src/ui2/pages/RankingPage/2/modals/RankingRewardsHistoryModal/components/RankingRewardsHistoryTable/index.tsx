import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import './index.scss';
import { useMemo, useRef } from 'react';
import { RankingHistoryInfoResult } from '@mode2API/endpoint/ranking/PostRankingHistoryEndpoint';
import { ITableColumn } from '@mode2/components/Table';
import { Icon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import cx from '@commonUtils/cx';
import Table from '@components/Table';
import { formatMoney, formatMoneyAbbrev4Digits } from '@mode2/utils';

interface RankingRewardsHistoryColumn extends RankingHistoryInfoResult {
  icon?: string;
}

export const RankingRewardsHistoryTable = () => {
  const { t } = useTranslation();
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const rankingRewards = useRankingRewardsHistoryModalStore(
    (state) => state.rankingRewards
  );

  const columns: ITableColumn<RankingRewardsHistoryColumn>[] = [
    {
      title: t('ranking_history_table_rank'),
      dataIndex: 'ranking',
      render: (record) => {
        return record.icon ? (
          <Icon className={'h-6 w-6'} name={record.icon} />
        ) : (
          `${record.ranking}`
        );
      },
    },
    {
      title: t('ranking_history_table_phone_number'),
      dataIndex: 'playerName',
      render: (record) => {
        return <div>{record.playerName}</div>;
      },
    },
    {
      title: t('ranking_history_table_total_bets'),
      dataIndex: 'betAmount',
      render: (record) => {
        return (
          <div className="w-full text-end mr-6">
            {formatMoneyAbbrev4Digits({
              value: record.betAmount,
              includeDecimalAbbrev: true,
              includeCommaAbbrev: true,
            })}
          </div>
        );
      },
    },
    {
      title: t('ranking_history_table_rewards'),
      dataIndex: 'rewardAmount',
      render: (record) => {
        return (
          <div className="w-full text-end mr-4 bgi-text-[var(--base-1-main)]">
            {formatMoney({
              value: record.rewardAmount,
              includeDecimal: true,
            })}
          </div>
        );
      },
    },
  ];

  const dataSource: RankingRewardsHistoryColumn[] = useMemo(() => {
    tbodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    return rankingRewards.map((item, index) => {
      return {
        ...item,
        icon: [1, 2, 3].includes(item.ranking)
          ? `ic_ranking_${item.ranking}`
          : undefined,
      };
    });
  }, [rankingRewards]);

  return (
    <div className="">
      <Table
        tbodyRef={tbodyRef}
        classNames={{
          table: cx(
            'ranking-rewards-history',
            'h-[292px]',
            '!p-0 !m-0 bg-transparent !border-collapse',
            '!text-xs !font-normal !rounded-none'
          ),
          thead:
            '!p-0 !m-0 !bgi-[var(--base-2-variant6)] !border-[var(--transparent-white-10)] !border-b',
          theadTr: '!p-0 !m-0 !gap-0 !bgi-text-[var(--base-2-variant2)] ',
          theadTth: '!font-normal',
          tbody: '',
          tbodyTr:
            '!p-0 !my-0 !min-h-auto !border-[var(--transparent-white-10)] !border-b',
          tbodyTd:
            '!p-0 !my-0 !font-normal !bgi-text-[var(--base-2-variant1)] items-center',
        }}
        rowKey={'indexKey'}
        dataSource={dataSource}
        columns={columns}
        isShowThead={true}
        noData={<div className="h-[292px]"></div>}
      />
    </div>
  );
};

export default RankingRewardsHistoryTable;
