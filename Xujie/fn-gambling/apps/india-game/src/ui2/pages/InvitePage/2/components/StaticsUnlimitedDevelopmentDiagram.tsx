import Table, { ITableColumn } from '@components/Table';
import StaticsInviteBtn from './StaticsInviteBtn';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { useBreakPoint, useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { useMode2InvitePageStaticsStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { memo } from 'react';

export const StaticsUnlimitedDevelopmentDiagram = memo(() => {
  const { t, i18n } = useTranslation();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();
  const { isTablet, isMobile } = useBreakPoint();

  const exampleColumns: ITableColumn<{
    name: string;
    betting: number;
    percentage: number;
  }>[] = [
    {
      title: 'earn_money_statistics_bonus_info_table_header_level',
      dataIndex: 'name',
    },
    {
      title: 'earn_money_statistics_for_example_table_header_betting',
      dataIndex: 'betting',
      render: (v) => {
        return t('earn_money_statistics_for_example_per_day', {
          batAmount: v.betting.toLocaleString(),
        });
      },
    },
    {
      title: 'earn_money_statistics_for_example_table_header_percentage',
      dataIndex: 'percentage',
      render: (v) => {
        return (
          <span className="bgi-text-[var(--state-warn-main)]">
            {v.percentage}%
          </span>
        );
      },
    },
  ];

  const statisticsLevelExampleData = useMode2InvitePageStaticsStore(
    (state) => state.statisticsLevelExampleData
  );
  const { level1, level2, rateResult, exampleDataSource } =
    statisticsLevelExampleData;
  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'flex-col rounded-lg',
        'gap-2 mobile:gap-3 tablet:gap-6',
        'p-3 tablet:p-6',
        'bgi-[var(--linear-1)]'
      )}
    >
      <img
        src={getImgUrl(EResourceLevel.V, 'statistics_title')}
        className="max-w-xl w-full"
        alt="icon-subordinates"
      />
      <div
        className={cx(
          FLEX_CENTER,
          'w-full flex-col gap-3 tablet:gap-[72px]',
          'mt-2 mobile:mt-0'
        )}
      >
        <div
          className={cx(
            FLEX_ITEMS_CENTER,
            'flex-col',
            'w-full',
            'gap-3 mobile:gap-4'
          )}
        >
          <div
            className={cx(
              FLEX_ITEMS_CENTER,
              'flex-col',
              'whitespace-pre-line',
              'gap-3 tablet:gap-6'
            )}
          >
            <img
              className={'object-contain'}
              src={getImgUrlByBreakPoint(
                `statistics_level_${i18n.language}`,
                EResourceLevel.V,
                isTablet,
                isMobile
              )}
              alt=""
            />

            <span
              className={cx(
                'text-center font-medium',
                'text-sm tablet:text-lg',
                'bgi-text-[var(--state-warn-main)]'
              )}
            >
              {t('earn_money_statistics_level_bonus_you_will_get_every_day', {
                lv1Percentage: level1.percentage,
                lv2Percentage: level2.percentage,
              })}
            </span>
          </div>
        </div>

        <div
          className={cx('w-full', FLEX_COL, 'gap-2 mobile:gap-3 tablet:gap-4')}
        >
          <div className={cx('bgi-text-[var(--grayscale-100)]', 'w-full')}>
            {t('earn_money_statistics_for_example_for_example')}
          </div>

          <Table
            columns={exampleColumns}
            dataSource={exampleDataSource}
            rowKey={'name'}
            classNames={{
              tbodyTd: cx('bgi-text-[var(--grayscale-100)]'),
            }}
          />

          <div
            className={cx(
              'font-medium w-full whitespace-pre',
              'text-xs mobile:text-sm',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {t('earn_money_statistics_for_example_u_will_get_every_day', {
              lv1Percentage: level1.percentage,
              lv2Percentage: level2.percentage,
              rateResult: formatMoney({ value: rateResult }),
            })}
          </div>
        </div>
      </div>

      <StaticsInviteBtn />
    </div>
  );
});

export default StaticsUnlimitedDevelopmentDiagram;
