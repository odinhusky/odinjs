import Table, { ITableColumn } from '@libs/mode2/components/Table';
import { PromoteDailyDetailListItemResult } from '@libs/mode2/external/api/endpoint/team/PostPromoteDailyDetailEndpoint';
import { formatMoney, formatDate } from '@libs/mode2/utils';
import { useTeamDataDetailModalStore } from '@libs/mode2/zustand/components/teamDataDetailModalStore';
import { useMemo } from 'react';
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
        render: (v) =>
          formatMoney({ value: v.totalCommission, includeDecimal: true }),
      },
    ],
    []
  );
  return (
    <div>
      <Table
        isShowThead={true}
        classNames={{
          thead: '!bgi-[var(--grayscale-20)]',
          tbody: 'mobile:text-base text-xs font-medium h-[80vh] max-h-max',
          theadTth: 'text-nowrap',
        }}
        columns={rankingColumns}
        dataSource={teamDataDetailList}
        rowKey={'timestamp'}
        pageSize={10}
        noData={
          <div className="mobile:text-base text-xs py-3 px-4 text-[var(--grayscale-50)] font-medium">
            {t('earn_money_team_data_popup_detail_no_data')}
          </div>
        }
      />
    </div>
  );
};
