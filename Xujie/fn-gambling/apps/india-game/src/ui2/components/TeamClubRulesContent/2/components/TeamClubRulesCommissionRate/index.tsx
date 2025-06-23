import { cx } from '@libs/commonUtils';
import Table, { ITableColumn } from '@components/Table';

import { CONTAINER_CLASS, FLEX_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import isEmpty from 'lodash/isEmpty';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';
import { teamClubLevelToText } from '../../const';

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
  ({}: TeamClubRulesCommissionRateProps) => {
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
          title: <>{t('earn_rules_commission_rate_form_column_a_title')}</>,
          dataIndex: 'rebateForBets',
          render: (v) => <span>{v.rebateForBets}</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_b_title')}</>,
          dataIndex: 'clubLevelBronze',
          render: (v) => <span>{v.clubLevelBronze}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_c_title')}</>,
          dataIndex: 'clubLevelSilver',
          render: (v) => <span>{v.clubLevelSilver}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_d_title')}</>,
          dataIndex: 'clubLevelGold',
          render: (v) => <span>{v.clubLevelGold}%</span>,
        },
        {
          title: <>{t('earn_rules_commission_rate_form_column_e_title')}</>,
          dataIndex: 'clubLevelDiamond',
          render: (v) => <span>{v.clubLevelDiamond}%</span>,
        },
      ],
      [t]
    );

    const firstDepositColumns: ITableColumn<FirstDepositDataSource>[] = useMemo(
      () => [
        {
          title: (
            <div className={cx('w-full', 'flex', 'pl-[40%]')}>
              {t('earn_rules_first_deposit_rebate_form_column_a_title')}
            </div>
          ),
          dataIndex: 'clubLevel',
          render: (v) => (
            <div
              className={cx('w-full h-full', 'relative', 'flex', 'pl-[40%]')}
            >
              <div className={cx(FLEX_CENTER, 'gap-1', 'h-full')}>
                <img
                  src={getImgUrl(
                    EResourceLevel.V,
                    `club_leve_${v?.clubLevel ? v.clubLevel : '1'}`
                  )}
                  alt="Level icon image"
                  className={cx('w-5 h-5', 'block')}
                />

                <span
                  className={cx(
                    'text-sm text-semibold',
                    'block',
                    'bgi-text-[var(--grayscale-100)]'
                  )}
                >
                  {renderI18N(
                    teamClubLevelToText[v?.clubLevel ? v.clubLevel : 1],
                    t
                  )}
                </span>
              </div>
            </div>
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
        />

        <div>
          <h4
            className={cx(
              'bgi-text-[var(--base-2-main)]',
              'text-base font-medium',
              'block',
              'mb-2'
            )}
          >
            {t('earn_rules_commission_rate_subtitle_rebate_on_turnover')}
          </h4>

          <RulesContainer
            children={
              <Table
                classNames={{
                  thead: cx(
                    '!bgi-[transparent]',
                    '!border-none',
                    'border-b !bgi-border-b-[var(--linear-1)]'
                  ),
                  theadTth: cx(
                    'bgi-text-[var(--base-2-main)]',
                    'text-xs',
                    'w-[calc(50%-4px)]'
                  ),
                  tbody: cx('h-[80vh] max-h-max'),
                  tbodyTr: cx(
                    'bgi-text-[var(--grayscale-100)]',
                    '!bgi-[transparent]',
                    '!h-auto',
                    '!p-1'
                  ),
                  tbodyTd: cx('p-2', '!w-1/5', 'text-wrap text-sm font-medium'),
                }}
                columns={rebateColumns}
                dataSource={rebateDataSource}
                rowKey={'rebateForBets'}
              />
            }
          />
        </div>

        <div
          className={cx('w-full', 'text-sm', 'bgi-text-[var(--grayscale-100)]')}
        >
          <span className={cx('block', 'w-full')}>
            *{t('earn_rules_rebate_note')}
          </span>
          <span className={cx('block', 'w-full')}>
            *{t('earn_rules_valid_bet_note')}
          </span>
          <span className={cx('block', 'w-full')}>
            *{t('earn_invite_rewards_rules_settlement_note')}
          </span>
        </div>

        <div>
          <h4
            className={cx(
              'bgi-text-[var(--base-2-main)]',
              'text-base font-medium',
              'block',
              'mb-2'
            )}
          >
            {t('earn_rules_commission_rate_subtitle_first_deposit_rebate')}
          </h4>

          <RulesContainer
            children={
              <Table
                classNames={{
                  thead: cx(
                    '!bgi-[transparent]',
                    '!border-none',
                    'border-b !bgi-border-b-[var(--linear-1)]'
                  ),
                  theadTth: cx(
                    'bgi-text-[var(--base-2-main)]',
                    'text-sm',
                    'w-full'
                  ),
                  tbody: cx('h-[80vh] max-h-max', 'w-full'),
                  tbodyTr: cx(
                    'w-full',
                    'bgi-text-[var(--grayscale-100)]',
                    '!bgi-[transparent]',
                    '!h-auto',
                    '!p-1',
                    'gap-1'
                  ),
                  tbodyTd: cx('text-wrap text-sm font-medium'),
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
