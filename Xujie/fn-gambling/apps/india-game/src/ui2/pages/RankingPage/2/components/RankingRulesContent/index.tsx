import { ITableColumn } from '@mode2/components/Table';

import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import cx from '@commonUtils/cx';
import Table from '@components/Table';
import { Icon } from '@components/Icon';
import './index.scss';
import useRankingPageRuleBase from './useRankingPageRuleBase';
import { useRankingPageStore } from '@mode2/zustand/page/RankingPage/rankingPageStore';
import { useMemo } from 'react';
import { RankingRateInfoResult } from '@mode2API/endpoint/ranking/PostRankingRulesEndpoint';
import { I18NContent } from '@mode2/@types/i18nType';

interface RankingRuleColumn extends RankingRateInfoResult {
  icon?: string;
}

export interface I18NContentExt extends I18NContent {
  itemPrefixIcon?: string;
  itemPrefix?: string;
}

interface RankingRuleNoticeGroup {
  title: I18NContentExt;
  useNumbered: boolean;
  contents: I18NContentExt[];
}

const RankingRuleTable = () => {
  const { t } = useTranslation();
  const rankingRulesResult = useRankingPageStore(
    (state) => state.rankingRulesResult
  );

  const dataSource: RankingRuleColumn[] = useMemo(() => {
    return rankingRulesResult.rankingRates.map((item, index) => {
      return {
        ...item,
        icon: ['1', '2', '3'].includes(item.rank)
          ? `ic_ranking_${item.rank}`
          : undefined,
      };
    });
  }, [rankingRulesResult]);

  const columns: ITableColumn<RankingRuleColumn>[] = [
    {
      title: t('ranking_rules_award_rank'),
      dataIndex: 'rank',
      render: (record) => {
        return record.icon ? (
          <Icon className={'h-6 w-6'} name={record.icon} />
        ) : (
          record.rank
        );
      },
    },
    {
      title: t('ranking_rules_award_daily_list'),
      dataIndex: 'dailyRate',
      render: (record) => `${record.dailyRate.toFixed(2)}%`,
    },
    {
      title: t('ranking_rules_award_weekly_list'),
      dataIndex: 'weeklyRate',
      render: (record) => `${record.weeklyRate.toFixed(2)}%`,
    },
    {
      title: t('ranking_rules_award_monthly_list'),
      dataIndex: 'monthlyRate',
      render: (record) => `${record.monthlyRate.toFixed(2)}%`,
    },
  ];

  return (
    <div>
      <div
        className={
          'bgi-text-[var(--grayscale-100)] text-xl font-medium mx-4 mb-1.5'
        }
      >
        <p>{t('ranking_rules_activity_award')}</p>
      </div>
      <Table
        classNames={{
          table: cx(
            'ranking-rule-table',
            '!p-0 !m-0 bg-transparent !border-collapse',
            '!bgi-text-[var(--base-2-variant1)] !text-sm !font-normal !rounded-none'
          ),
          thead:
            '!p-0 !m-0 !bgi-[var(--base-2-variant8)] !border-[var(--transparent-white-10)] !border-b',
          theadTr: '!p-0 !m-0 !gap-0 !bgi-text-[var(--base-2-variant1)]',
          theadTth: '!font-normal',
          tbody: '',
          tbodyTr:
            '!p-0 !my-0 !min-h-min !border-[var(--transparent-white-10)] !border-b',
          tbodyTd: '!p-0 !my-0 !font-normal !bgi-text-[var(--base-2-variant1)]',
        }}
        rowKey={'indexKey'}
        dataSource={dataSource}
        columns={columns}
        noData={null}
      />
    </div>
  );
};

const noticeGroup: RankingRuleNoticeGroup[] = [
  {
    title: { i18nKey: 'ranking_rules_daily_ranking_title' },
    useNumbered: false,
    contents: [{ i18nKey: 'ranking_rules_daily_ranking_content' }],
  },

  {
    title: { i18nKey: 'ranking_rules_weekly_ranking_title' },
    useNumbered: false,
    contents: [{ i18nKey: 'ranking_rules_weekly_ranking_content' }],
  },

  {
    title: { i18nKey: 'ranking_rules_monthly_ranking_title' },
    useNumbered: false,
    contents: [
      { i18nKey: 'ranking_rules_monthly_ranking_content_1' },
      // { i18nKey: 'ranking_rules_monthly_ranking_content_2' },
    ],
  },

  {
    title: { i18nKey: 'ranking_rules_activity_rules_title' },
    useNumbered: true,
    contents: [
      { i18nKey: 'ranking_rules_activity_rules_1' },
      { i18nKey: 'ranking_rules_activity_rules_2' },
      { i18nKey: 'ranking_rules_activity_rules_3' },
      { i18nKey: 'ranking_rules_activity_rules_4' },
      { i18nKey: 'ranking_rules_activity_rules_5' },
      { i18nKey: 'ranking_rules_activity_rules_6' },
    ],
  },

  {
    title: { i18nKey: 'ranking_rules_terms_and_conditions_title' },
    useNumbered: true,
    contents: [
      { i18nKey: 'ranking_rules_terms_and_conditions_1' },
      { i18nKey: 'ranking_rules_terms_and_conditions_2' },
      { i18nKey: 'ranking_rules_terms_and_conditions_3' },
    ],
  },
];

const RankingRuleNotices = () => {
  const { t } = useTranslation();
  const rankingRulesResult = useRankingPageStore(
    (state) => state.rankingRulesResult
  );

  const i18nOptions = useMemo(() => {
    return {
      dailyRebate: (rankingRulesResult.dailyTotalRebate * 1000).toFixed(1),
      weeklyRebate: (rankingRulesResult.weeklyTotalRebate * 1000).toFixed(1),
      monthlyRebate: (rankingRulesResult.monthlyTotalRebate * 1000).toFixed(1),
    };
  }, [rankingRulesResult]);

  return (
    <div
      className={cx(
        'flex flex-col gap-2 justify-center',
        'm-4 pb-[80px]',
        'bgi-text-[var(--grayscale-100)] text-xl font-medium'
      )}
    >
      {noticeGroup.map((group, g_index) => {
        return (
          <div key={g_index}>
            {renderI18N(group.title, t)}
            <div className="bgi-text-[var(--base-2-variant2)] text-sm font-normal mt-1.5 ">
              {group.contents.map((item, index) => {
                return (
                  <p
                    key={`${g_index}_${index}`}
                    className={cx({ 'numbered-item': group.useNumbered })}
                  >
                    {renderI18N({ ...item, i18nOption: i18nOptions }, t)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RankingRulesContent = () => {
  useRankingPageRuleBase();
  return (
    <div className={'bgi-[var(--background-dark)] pt-3 -mb-[80px]'}>
      <RankingRuleTable />

      <RankingRuleNotices />
    </div>
  );
};

export default RankingRulesContent;
