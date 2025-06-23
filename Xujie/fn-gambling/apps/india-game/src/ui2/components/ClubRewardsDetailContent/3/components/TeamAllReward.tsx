import NoData from '@components/NoData';
import { usePostTeamRewardClaimListMutation } from '@libs/mode2/external/api';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useEffect } from 'react';
import DateSelect from './DateSelect';
import dayjs from '@commonUtils/localizedDayjs';
import { useTranslation } from 'react-i18next';
import {
  TeamRewardClaimItemResult,
  TeamRewardClaimState,
} from '@libs/mode2/external/api/endpoint/teamClub/PostTeamRewardClaimListEndpoint';
import { cx } from '@libs/commonUtils';
import ModeTable, { ITableColumn } from '@libs/mode2/components/Table';
import TableSkeleton from '@components/TableSkeleton';

const TeamBetReward = () => {
  const { t } = useTranslation();
  const columns: ITableColumn<TeamRewardClaimItemResult>[] = [
    {
      title: t('earn_rewards_detail_table_title_time'),
      dataIndex: 'createTime',
      render: (record) => {
        return (
          <div className="bgi-text-[var(--base-2-variant1)]">
            {formatDate(record.createTime, 'YYYY-MM-DD HH:mm:ss')}
          </div>
        );
      },
    },

    {
      title: t('earn_rewards_detail_table_title_commission_amount'),
      dataIndex: 'commissionAmount',
      render: (record) => {
        return (
          <>
            {formatMoney({
              value: record.commissionAmount,
              includeDecimal: true,
            })}
          </>
        );
      },
    },

    {
      title: t('earn_rewards_detail_table_title_state'),
      dataIndex: 'state',
      render: (record) => {
        let color = '';
        let i18nKey = '';
        switch (record.state) {
          case TeamRewardClaimState.PENDING:
            color = 'bgi-text-[var(--base-1-90)]';
            i18nKey = 'earn_rewards_detail_state_unsettled';
            break;
          case TeamRewardClaimState.COMPLETED:
            color = 'bgi-text-[var(--state-success-main)]';
            i18nKey = 'earn_rewards_detail_state_settled';
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
  const [trigger, { data, isLoading }] = usePostTeamRewardClaimListMutation();

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
        rowKey="createTime"
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
