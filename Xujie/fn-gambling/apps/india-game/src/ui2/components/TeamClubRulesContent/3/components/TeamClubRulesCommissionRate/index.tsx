import { cx } from '@libs/commonUtils';
import Table, { ITableColumn } from '@components/Table';
import { teamClubLevelToText } from '../../const';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import isEmpty from 'lodash/isEmpty';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';
import { CONTAINER_CLASS } from '@constant/style';

interface RebateDataSource {
  rebateForBets: string;
  clubLevelBronze: string | number;
  clubLevelSilver: string | number;
  clubLevelGold: string | number;
  clubLevelDiamond: string | number;
}

const teamClubRulesCommissionRateDataSourceTemp: RebateDataSource[] = [
  {
    rebateForBets: 'Agent rating 1',
    clubLevelBronze: '1.14',
    clubLevelSilver: '0.40',
    clubLevelGold: '0.80',
    clubLevelDiamond: '1.28',
  },
  {
    rebateForBets: 'Agent rating 2',
    clubLevelBronze: '0.68',
    clubLevelSilver: '0.25',
    clubLevelGold: '0.50',
    clubLevelDiamond: '0.80',
  },
  {
    rebateForBets: 'Agent rating 3',
    clubLevelBronze: '0.46',
    clubLevelSilver: '0.20',
    clubLevelGold: '0.30',
    clubLevelDiamond: '0.32',
  },
];

interface FirstDepositDataSource {
  clubLevel: number;
  firstDepositRebatesRate: string | number;
}

const firstDepositDataSourceTemp: FirstDepositDataSource[] = [
  {
    clubLevel: 1,
    firstDepositRebatesRate: 5,
  },
  {
    clubLevel: 2,
    firstDepositRebatesRate: 10,
  },
  {
    clubLevel: 3,
    firstDepositRebatesRate: 15,
  },
  {
    clubLevel: 4,
    firstDepositRebatesRate: 25,
  },
];

interface TeamClubRulesCommissionRateProps {}

export const TeamClubRulesCommissionRate =
  (props: TeamClubRulesCommissionRateProps) => {
    const { t } = useTranslation();

    // - Rebate Commission
    const teamClubCommissionRulesItems = useTeamClubRulesStore(
      (state) => state.teamClubCommissionRulesItems
    );

    const rebateDataSource = !isEmpty(teamClubCommissionRulesItems)
      ? teamClubCommissionRulesItems.map((item) => ({
          rebateForBets: `${t('earn_rules_commission_rate_form_row_title')} ${
            item.agentLevel
          }`,
          clubLevelBronze: item.teamLevel0,
          clubLevelSilver: item.teamLevel1,
          clubLevelGold: item.teamLevel2,
          clubLevelDiamond: item.teamLevel3,
        }))
      : teamClubRulesCommissionRateDataSourceTemp; // 假資料

    // - First Rebate
    const teamClubFirstDepositRebatesItems = useTeamClubRulesStore(
      (state) => state.teamClubFirstDepositRebatesItems
    );

    const firstDepositDataSource = !isEmpty(teamClubFirstDepositRebatesItems)
      ? teamClubFirstDepositRebatesItems.map((item) => ({
          clubLevel: item.level + 1,
          firstDepositRebatesRate: item.firstDepositRebatesRate,
        }))
      : firstDepositDataSourceTemp;

    // - Columns
    const rebateColumns: ITableColumn<RebateDataSource>[] = useMemo(
      () => [
        {
          title: (
            <div
              className={cx('w-full', 'flex justify-center', 'min-w-[56px]')}
            >
              {t('earn_rules_commission_rate_form_column_a_title')}
            </div>
          ),
          dataIndex: 'rebateForBets',
          render: (v) => <span>{v.rebateForBets}</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_b_title')}</>,
          dataIndex: 'clubLevelBronze',
          render: (v) => <span>{Number(v.clubLevelBronze).toFixed(2)}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_c_title')}</>,
          dataIndex: 'clubLevelSilver',
          render: (v) => <span>{Number(v.clubLevelSilver).toFixed(2)}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_d_title')}</>,
          dataIndex: 'clubLevelGold',
          render: (v) => <span>{Number(v.clubLevelGold).toFixed(2)}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_e_title')}</>,
          dataIndex: 'clubLevelDiamond',
          render: (v) => <span>{Number(v.clubLevelDiamond).toFixed(2)}%</span>,
        },
      ],
      [t]
    );

    const firstDepositColumns: ITableColumn<FirstDepositDataSource>[] = useMemo(
      () => [
        {
          title: (
            <div className={cx('w-full', 'flex justify-center')}>
              {t('earn_rules_first_deposit_rebate_form_column_a_title')}
            </div>
          ),
          dataIndex: 'clubLevel',
          render: (v) => (
            <span className={cx()}>
              {renderI18N(
                teamClubLevelToText[v?.clubLevel ? v.clubLevel : 1],
                t
              )}
            </span>
          ),
        },
        {
          title: (
            <>{t('earn_rules_first_deposit_rebate_form_column_b_title')}</>
          ),
          dataIndex: 'firstDepositRebatesRate',
          render: (v) => <span>{v.firstDepositRebatesRate}%</span>,
        },
      ],
      [t]
    );

    return (
      <div className={cx(CONTAINER_CLASS)}>
        <RulesImgTitle
          title={{ i18nKey: 'earn_rules_title_commission_rate' }}
          classNameSub="w-[360px] h-[42px] !m-0"
          classNameImg="h-full"
        />

        <div>
          <h4
            className={cx(
              'bgi-text-[var(--base-2-variant1)]',
              'text-base font-bold',
              'block',
              'mb-2'
            )}
          >
            {t('earn_rules_commission_rate_subtitle_rebate_on_turnover')}
          </h4>

          <RulesContainer
            className={cx('bgi-border-[var(--linear-15)] border', 'rounded-lg')}
            children={
              <Table
                classNames={{
                  table: cx('bgi-[var(--base-2-variant11)] !border-collapse !table-auto'),
                  thead: '!p-0 !m-0 !bg-transparent !border-none',
                  theadTr: '!p-0  !gap-0',
                  theadTth:
                    '!text-xs !w-1/5 first:!w-2/6 !border-[var(--transparent-white-20)] !border-r border-b !bgi-text-[var(--base-2-variant1)] !px-4 !py-1.5 !m-0',
                  tbodyTr: '!bgi-text-[var(--transparent-white-80)]',
                  tbodyTd:
                    ' !w-1/5 first:!w-2/6 !border-[var(--transparent-white-20)] border-b border-r !font-medium !text-xs !px-4 !py-2 !m-0',
                }}
                columns={rebateColumns}
                dataSource={rebateDataSource}
                rowKey={'rebateForBets'}
              />
            }
          />
        </div>

        <div
          className={cx(
            'bgi-border-[var(--linear-15)] border',
            'rounded-lg',
            'w-full p-3',
            'text-sm',
            'bgi-text-[var(--transparent-white-80)]',
            'bgi-[var(--base-2-variant11)]'
          )}
        >
          <span className={cx('block', 'w-full')}>
            *{t('earn_rules_rebate_note')}
          </span>
          {/*<span className={cx('block', 'w-full')}>*/}
          {/*  *{t('earn_rules_valid_bet_note')}*/}
          {/*</span>*/}
          {/*<span className={cx('block', 'w-full')}>*/}
          {/*  *{t('earn_invite_rewards_rules_settlement_note')}*/}
          {/*</span>*/}
        </div>

        <div>
          <h4
            className={cx(
              'bgi-text-[var(--base-2-variant1)]',
              'text-base font-bold',
              'block',
              'mb-2'
            )}
          >
            {t('earn_rules_commission_rate_subtitle_first_deposit_rebate')}
          </h4>

          <RulesContainer
            className={cx('bgi-border-[var(--linear-15)] border', 'rounded-lg')}
            children={
              <Table
                classNames={{
                  table: cx('bgi-[var(--base-2-variant11)] !border-collapse !table-auto'),
                  thead: '!p-0 !m-0 !bg-transparent !border-none',
                  theadTr: '!p-0  !gap-0',
                  theadTth:
                    '!text-xs !border-[var(--transparent-white-20)] !border-r border-b !bgi-text-[var(--base-2-variant1)] !px-4 !py-1.5 !m-0',
                  tbodyTr: '!bgi-text-[var(--transparent-white-80)]',
                  tbodyTd:
                    '!border-[var(--transparent-white-20)] !border-b border-r !font-medium !text-xs !px-1 !py-2 !m-0',
                }}
                columns={firstDepositColumns}
                dataSource={firstDepositDataSource}
                rowKey={'clubLevel'}
              />
            }
          />
        </div>
      </div>
    );
  };

export default TeamClubRulesCommissionRate;
