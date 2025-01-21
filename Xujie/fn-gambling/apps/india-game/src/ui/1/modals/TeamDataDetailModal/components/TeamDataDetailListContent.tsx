import cx from '@libs/commonUtils/cx';
import Table, { ITableColumn } from '@libs/mode2/components/Table';
import { PromoteDailyDetailListItemResult } from '@libs/mode2/external/api/endpoint/team/PostPromoteDailyDetailEndpoint';
import { formatMoney, formatDate } from '@libs/mode2/utils';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';
import { isValidElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const TeamDataDetailListContent = () => {
  const { t } = useTranslation();
  const teamDataDetailList = useTeamDataDetailModalStore(
    (state) => state.teamDataDetailList
  );
  const rankingColumns = useMemo<
    ITableColumn<PromoteDailyDetailListItemResult>[]
  >(
    () => [
      {
        title: 'earn_money_team_data_popup_detail_table_header_time',
        dataIndex: 'timestamp',
        render: (v) => (
          <div className="tablet:leading-6 mobile:leading-5 leading-3 whitespace-nowrap">
            {formatDate(v.timestamp)}
          </div>
        ),
      },
      {
        title: 'earn_money_team_data_popup_detail_table_header_type',
        dataIndex: 'level',
        render: (v) =>
          t('earn_money_team_data_popup_detail_table_content_level_1', {
            lv: v.level,
          }),
      },
      {
        title:
          'earn_money_team_data_popup_detail_table_header_total_commission',
        dataIndex: 'totalCommission',
        render: (v) => formatMoney(v.totalCommission, true, 2),
      },
    ],
    []
  );
  return (
    <div>
      {teamDataDetailList.length > 0 ? (
        <Table
          classNames={{
            thead:
              '!bgi-[var(--grayscale-100)] !border-b-[var(--grayscale-80)]',
            tbody: 'mobile:text-base text-xs font-medium h-[80vh] max-h-max',
            theadTth: 'text-nowrap',
            tbodyTr:
              'bgi-text-[var(--grayscale-50)] !bgi-[var(--grayscale-100)] !h-14 !h-10',
          }}
          columns={rankingColumns}
          dataSource={teamDataDetailList}
          rowKey={'timestamp'}
          pageSize={10}
        />
      ) : (
        <table className={cx('mode-table')}>
          <thead
            className={cx(
              'table-thead !bgi-[var(--grayscale-100)] !border-b-[var(--grayscale-80)]'
            )}
          >
            <tr className={cx('table-thead-tr text-nowrap')}>
              {rankingColumns.map((col, index) => (
                <th
                  key={col.title + index.toString()}
                  className={cx('table-thead-th')}
                >
                  {isValidElement(col.title)
                    ? col.title
                    : t(col.title as string)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="mobile:text-base text-xs py-3 px-4 text-[var(--grayscale-50)] font-medium">
            {t('earn_money_team_data_popup_detail_no_data')}
          </tbody>
        </table>
      )}
    </div>
  );
};
