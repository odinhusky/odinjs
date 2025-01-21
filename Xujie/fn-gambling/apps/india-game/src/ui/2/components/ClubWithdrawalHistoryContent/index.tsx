import NoData from '@components/NoData';
import Table, { ITableColumn } from '@components/Table';
import { usePostTeamRewardClaimHistoryListMutation } from '@libs/mode2/external/api';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TeamRewardClaimHistoryItemResult,
  TeamRewardClaimHistoryState,
} from '@libs/mode2/external/api/endpoint/teamClub/PostTeamRewardClaimHistoryListEndpoint';
import { cx } from '@libs/commonUtils';
import { formatDate, formatMoney } from '@libs/mode2/utils';
const TeamBetReward = () => {
  const { t } = useTranslation();

  const columns: ITableColumn<TeamRewardClaimHistoryItemResult>[] = [
    {
      title: t('earn_rewards_detail_table_title_time'),
      dataIndex: 'updateTime',
      render: (record) => {
        return (
          <>
            <div>{formatDate(record.updateTime, 'DD.MM.YYYY')}</div>
            <div>{formatDate(record.updateTime, 'hh:mm')}</div>
          </>
        );
      },
    },

    {
      title: t('earn_rewards_detail_table_title_commission_amount'),
      dataIndex: 'commissionAmount',
      render: (record) => {
        return <div>{formatMoney(record.commissionAmount)}</div>;
      },
    },
    {
      title: t('earn_rewards_detail_table_title_state'),
      dataIndex: 'state',
      render: (record) => {
        let color = '';
        let i18nKey = '';
        switch (record.state) {
          case TeamRewardClaimHistoryState.PENDING:
            color = 'bgi-text-[var(--state-warn-main)]';
            i18nKey = 'earn_rewards_detail_state_unsettled';
            break;
          case TeamRewardClaimHistoryState.COMPLETED:
            color = 'bgi-text-[var(--state-success-main)]';
            i18nKey = 'earn_rewards_detail_state_completed';
            break;
          default:
            color = '';
            i18nKey = record.state;
            break;
        }
        return <div className={cx(color)}>{t(i18nKey)}</div>;
      },
    },
  ];
  const [trigger, { data }] = usePostTeamRewardClaimHistoryListMutation();

  useEffect(() => {
    trigger();
  }, []);
  return (
    <div className="mt-4 mb-10">
      <Table
        classNames={{
          tbody: 'text-[var(--grayscale-100)]',
          tbodyTr: '!h-12 mobile:!h-14 tablet:!h-16',
          tbodyTd: 'flex flex-col',
        }}
        columns={columns}
        dataSource={data || []}
        rowKey="updateTime"
        noData={
          <NoData
            text={t('earn_money_team_data_popup_detail_no_data')}
            styles={{
              container: 'mt-28',
            }}
          />
        }
      />
    </div>
  );
};
export default TeamBetReward;
