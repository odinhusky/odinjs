import React, { useMemo } from 'react';
import { cx } from '@libs/commonUtils';
import Table, { ITableColumn } from '@components/Table';
import { formatMoney } from '@libs/mode2/utils';
import { CONTAINER_CLASS } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import isEmpty from 'lodash/isEmpty';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';
import { teamClubLevelToText } from '../../const';

interface TeamClubRulesHowToIncreaseTheClubsStarRatingResult {
  clubLevel: number;
  requiredMembers: number;
  requiredBets: number;
}

const teamClubRulesHowToIncreaseTheClubsStarRatingDataSourceTemp: TeamClubRulesHowToIncreaseTheClubsStarRatingResult[] =
  [
    {
      clubLevel: 1,
      requiredMembers: 5,
      requiredBets: 5,
    },
    {
      clubLevel: 2,
      requiredMembers: 10,
      requiredBets: 10,
    },
    {
      clubLevel: 3,
      requiredMembers: 17,
      requiredBets: 15,
    },
    {
      clubLevel: 4,
      requiredMembers: 20,
      requiredBets: 25,
    },
  ];

export const TeamClubRulesHowToIncreaseTheClubsStartRating = () => {
  const { t } = useTranslation();

  const teamClubUpgradeRequiredItems = useTeamClubRulesStore(
    (state) => state.teamClubUpgradeRequiredItems
  );

  const teamClubRulesHowToIncreaseTheClubsStarRatingDataSource = !isEmpty(
    teamClubUpgradeRequiredItems
  )
    ? teamClubUpgradeRequiredItems.map((item) => ({
        clubLevel: item.level + 1,
        requiredMembers: item.requiredMembers,
        requiredBets: item.requiredBets,
      }))
    : teamClubRulesHowToIncreaseTheClubsStarRatingDataSourceTemp;

  const teamClubRulesHowToIncreaseTheClubsStarRatingColumns: ITableColumn<TeamClubRulesHowToIncreaseTheClubsStarRatingResult>[] =
    useMemo(
      () => [
        {
          title: (
            <div className={cx('w-full', 'flex justify-center')}>
              {t('earn_rules_increase_club_level_rating_form_column_a_title')}
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
            <>
              {t('earn_rules_increase_club_level_rating_form_column_b_title')}
            </>
          ),
          dataIndex: 'requiredMembers',
          render: (v) => <span>{v.requiredMembers}</span>,
        },
        {
          title: (
            <>
              {t('earn_rules_increase_club_level_rating_form_column_c_title')}
            </>
          ),
          dataIndex: 'requiredBets',
          render: (v) => <span>{formatMoney({ value: v.requiredBets })}</span>,
        },
      ],
      [t]
    );
  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle
        classNameText={cx('text-base')}
        title={{ i18nKey: 'earn_rules_title_increase_club_level_rating' }}
        classNameSub="w-[360px] h-[42px] !m-0"
        classNameImg="h-full"
      />

      <RulesContainer
        className={cx(
          'bgi-border-[var(--linear-15)] border',
          'rounded-lg',
          'mt-3'
        )}
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
                '!border-[var(--transparent-white-20)] !border-r border-b !font-medium !text-xs !px-1 !py-2 !m-0',
            }}
            columns={teamClubRulesHowToIncreaseTheClubsStarRatingColumns}
            dataSource={teamClubRulesHowToIncreaseTheClubsStarRatingDataSource}
            rowKey={'clubLevel'}
          />
        }
      />
    </div>
  );
};

export default TeamClubRulesHowToIncreaseTheClubsStartRating;
