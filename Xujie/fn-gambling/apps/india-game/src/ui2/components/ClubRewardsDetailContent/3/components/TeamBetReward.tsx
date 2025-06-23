import NoData from '@components/NoData';
import { ITableColumn, ModeTable } from '@components/Table';
import { usePostTeamBetRewardListMutation } from '@libs/mode2/external/api';
import { TeamBetRewardItemResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamBetRewardListEndpoint';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useEffect } from 'react';
import DateSelect from './DateSelect';
import dayjs from '@commonUtils/localizedDayjs';
import { useTranslation } from 'react-i18next';
import TableSkeleton from '@components/TableSkeleton';

const TeamBetReward = () => {
  const { t } = useTranslation();
  const columns: ITableColumn<TeamBetRewardItemResult>[] = [
    {
      title: t('earn_rewards_detail_table_title_time'),
      dataIndex: 'joinTime',
      render: (record) => {
        return (
          <div className="bgi-text-[var(--base-2-variant1)]">
            {formatDate(record.joinTime, 'YYYY-MM-DD')}
          </div>
        );
      },
    },

    {
      title: t('earn_rewards_detail_table_title_subordinate'),
      dataIndex: 'subordinateId',
    },
    {
      title: t('earn_rewards_detail_table_title_commission_amount'),
      dataIndex: 'commissionAmount',
      render: (v) => {
        return formatMoney({ value: v.commissionAmount, includeDecimal: true });
      },
    },
  ];

  const [trigger, { data, isLoading }] = usePostTeamBetRewardListMutation();

  useEffect(() => {
    trigger({ time: dayjs().unix() });
  }, []);

  return (
    <>
      <div className="flex items-center justify-between my-3">
        <DateSelect
          onDateChange={(time) => {
            trigger({ time: dayjs(time).unix() });
          }}
        />
        <span className="text-sm font-medium bgi-text-[var(--base-2-variant1)]">
          {t('earn_rewards_detail_table_total_commission')}:{' '}
          {formatMoney({
            value: data?.totalCommissionAmount || 0,
            includeDecimal: true,
          })}
        </span>
      </div>
      <ModeTable
        isShowThead={true}
        isLoading={isLoading}
        skeleton={
          <TableSkeleton
            length={columns.length}
            key={data?.items?.length || 0 + columns.length}
          />
        }
        classNames={{
          table: '!rounded-none',
          thead: '!bgi-[var(--base-2-variant6)] !border-none',
          theadTr:
            '!py-1 text-xs font-medium !bgi-text-[var(--base-2-variant1)]',
          tbodyTr: '!h-[52px] border-b border-[var(--transparent-white-10)]',
          tbodyTd: 'flex flex-col !text-sm !bgi-text-[var(--grayscale-100)]',
        }}
        columns={columns}
        dataSource={data?.items || []}
        rowKey="joinTime"
        noData={
          <NoData
            styles={{
              container: 'mt-28',
            }}
          />
        }
      />
    </>
  );
};
export default TeamBetReward;
