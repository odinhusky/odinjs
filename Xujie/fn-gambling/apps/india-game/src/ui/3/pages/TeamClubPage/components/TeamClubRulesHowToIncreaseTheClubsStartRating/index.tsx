import React, { useMemo } from 'react';
import { cx } from '@libs/commonUtils';
import {
  CONTAINER_CLASS,
  teamClubLevelToText,
} from '@pages/TeamClubPage/const';
import Table, { ITableColumn } from '@components/Table';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { FLEX_CENTER } from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import { isEmpty } from 'lodash';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

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
            <div className={cx('w-full', 'flex', 'pl-[20%]  se:pl-[35%]')}>
              {t('earn_rules_increase_club_level_rating_form_column_a_title')}
            </div>
          ),
          dataIndex: 'clubLevel',
          render: (v) => (
            <div
              className={cx(
                'w-full h-full',
                'relative',
                'flex',
                'pl-[20%] se:pl-[35%]'
              )}
            >
              <div className={cx(FLEX_CENTER, 'gap-1', 'h-full')}>
                <img
                  src={getImgUrl(EResourceLevel.V, `club_leve_${v.clubLevel}`)}
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
          render: (v) => <span>{formatMoney(v.requiredBets)}</span>,
        },
      ],
      [t]
    );
  return (
    <div className={cx(CONTAINER_CLASS)}>
      <RulesImgTitle
        classNameText={cx('text-base')}
        title={{ i18nKey: 'earn_rules_title_increase_club_level_rating' }}
      />

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
