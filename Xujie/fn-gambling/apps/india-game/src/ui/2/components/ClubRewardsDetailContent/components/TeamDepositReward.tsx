import NoData from '@components/NoData';
import Table, { ITableColumn } from '@components/Table';
import { usePostTeamDepositRewardListMutation } from '@libs/mode2/external/api';
import { TeamBetRewardItemResult } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamBetRewardListEndpoint';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useEffect } from 'react';
import DateSelect from './DateSelect';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const TeamBetReward = () => {
  const { t } = useTranslation();
  const columns: ITableColumn<TeamBetRewardItemResult>[] = [
    {
      title: t('earn_rewards_detail_table_title_time'),
      dataIndex: 'joinTime',
      render: (record) => {
        return (
          <>
            <div>{formatDate(record.joinTime, 'DD.MM.YYYY')}</div>
            <div>{formatDate(record.joinTime, 'hh:mm')}</div>
          </>
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
        return formatMoney(v.commissionAmount);
      },
    },
  ];

  const [trigger, { data }] = usePostTeamDepositRewardListMutation();

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
        <span className="bgi-text-[var(--grayscale-70)] text-xs font-medium">
          {t('earn_rewards_detail_table_total_commission')}:{' '}
          {formatMoney(data?.totalCommissionAmount || 0)}
        </span>
      </div>
      <Table
        classNames={{
          tbody: 'text-[var(--grayscale-100)]',
          tbodyTr: '!h-12 mobile:!h-14 tablet:!h-16',
          tbodyTd: 'flex flex-col',
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
