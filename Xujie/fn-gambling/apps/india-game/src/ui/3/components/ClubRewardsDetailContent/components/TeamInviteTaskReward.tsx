import NoData from '@components/NoData';
import Table, { ITableColumn } from '@components/Table';
import { usePostTeamInvitationTaskRewardListMutation } from '@libs/mode2/external/api';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useEffect } from 'react';
import DateSelect from './DateSelect';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { TeamInvitationTaskRewardItemResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamInvitationTaskRewardListEndpoint';

const TeamBetReward = () => {
  const { t } = useTranslation();
  const columns: ITableColumn<TeamInvitationTaskRewardItemResult>[] = [
    {
      title: t('earn_rewards_detail_table_title_time'),
      dataIndex: 'joinTime',
      render: (record) => {
        return (
          <div className="bgi-text-[var(--base-2-variant1)]">
            {formatDate(record.joinTime, 'YYYY-MM-DD hh:mm:ss')}
          </div>
        );
      },
    },

    {
      title: t('earn_rewards_detail_table_title_invitees_count'),
      dataIndex: 'invitees',
    },
    {
      title: t('earn_rewards_detail_table_title_commission_amount'),
      dataIndex: 'commissionAmount',
      render: (v) => {
        return formatMoney(v.commissionAmount);
      },
    },
  ];
  const [trigger, { data }] = usePostTeamInvitationTaskRewardListMutation();

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
          {formatMoney(data?.totalCommissionAmount || 0)}
        </span>
      </div>
      <Table
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
            text={t('earn_money_team_data_popup_detail_no_data')}
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
