import Table, { ITableColumn } from '@components/Table';
import {
  EResourceLevel,
  formatMoney,
  formatNumber,
  getImgUrl,
} from '@mode2/utils';
import { useMode2InvitePageStaticsStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@commonUtils/cx';
import useInvitePageActions from '@mode2/action/invitePageAction/useInvitePageActions';
import { handleInvitePageStatisticsDetailCustomerServiceClick } from '@mode2/action/invitePageAction/actionType';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@libs/mode2/components/Icon';

export const StaticsSpecialDetail = () => {
  const { t } = useTranslation();
  const { handleInvitePageClick } = useInvitePageActions();
  const { isMobile } = useBreakPoint();
  const rewardDataList = useMode2InvitePageStaticsStore(
    (state) => state.rewardDataList
  );

  const weeklyData = useMode2InvitePageStaticsStore(
    (state) => state.weeklyData
  );

  const rewardColumns: ITableColumn<{
    level: number;
    betAmount: number;
    activeMember: number;
    bonus: number;
  }>[] = [
    {
      title: 'earn_money_statistics_bonus_info_table_header_level',
      dataIndex: 'level',
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bet_amount',
      dataIndex: 'betAmount',
      render: (v) => {
        return formatMoney(v.betAmount);
      },
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bet_active_member',

      dataIndex: 'activeMember',
      render: (v) => {
        return formatNumber(v.activeMember);
      },
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bonus',
      dataIndex: 'bonus',
      render: (v) => {
        return formatMoney(v.bonus);
      },
    },
  ];

  const weeklyColumns: ITableColumn<{
    currentLevel: number;
    bonus: number;
    lastWeek: number;
  }>[] = [
    {
      title: 'earn_money_statistics_bonus_info_table_header_current_level',
      dataIndex: 'currentLevel',
      render: (v) => {
        return (
          <span className="bgi-text-[var(--state-success-main)]">
            {formatMoney(v.currentLevel)}
          </span>
        );
      },
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bonus',
      dataIndex: 'bonus',
      render: (v) => {
        return (
          <span className="bgi-text-[var(--state-warn-main)]">
            {formatMoney(v.bonus)}
          </span>
        );
      },
    },
    {
      title: 'earn_money_team_data_content_last_week',
      dataIndex: 'lastWeek',
      render: (v) => {
        return (
          <span className="bgi-text-[var(--grayscale-50)]">
            {formatMoney(v.lastWeek)}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={cx(
          FLEX_ITEMS_CENTER,
          'flex-col rounded-lg',
          'gap-2 mobile:gap-3 tablet:gap-6',
          'p-3 tablet:p-6',
          'bgi-[var(--grayscale-100)]'
        )}
      >
        <div
          className={cx(FLEX_ITEMS_CENTER, 'w-full', 'gap-3', 'font-medium')}
        >
          <img
            src={getImgUrl(EResourceLevel.V, 'statistics_gift')}
            className="w-[52px] h-[52px] tablet:w-[72px] tablet:h-[72px]"
            alt="icon_gift"
          />
          <div className="w-full">
            <div
              className={cx(
                'bgi-text-[var(--base-1-main)]',
                'text-sm mobile:text-lg',
                'font-medium'
              )}
            >
              {t('earn_money_statistics_bonus_info_title_in_addition')}
            </div>
            <div
              className={cx(
                'bgi-text-[var(--grayscale-50)]',
                'text-xs mobile:text-base',
                'font-medium'
              )}
            >
              {t('earn_money_statistics_bonus_info_see_the_table_below')}
            </div>
          </div>
        </div>

        <Table
          columns={rewardColumns}
          dataSource={rewardDataList}
          rowKey={'level'}
          classNames={{
            tbodyTd: cx(
              'bgi-text-[var(--grayscale-20)] !bgi-text-[var(--grayscale-50)]'
            ),
            thead:
              '!bgi-[var(--grayscale-80)] !bgi-text-[var(--grayscale-20)] !border-b-0 rounded-t-lg',
            tbodyTr:
              '!bgi-[var(--grayscale-100)] border border-[var(--grayscale-90)] border-t-0 last:rounded-b-lg',
          }}
        />

        <div
          className={cx(
            ' text-xs mobile:text-sm bgi-text-[var(--grayscale-10)] my-2',
            'text-center'
          )}
        >
          {t('earn_money_statistics_bonus_info_for_more_rewards')}

          {isMobile ? <br /> : null}
          <button
            className="ml-1 !bgi-text-[var(--base-1-main)] underline decoration-[#009D80]"
            onClick={() => {
              handleInvitePageClick({
                actionName:
                  handleInvitePageStatisticsDetailCustomerServiceClick,
              });
            }}
          >
            {t('account_menu_customer_support')}
          </button>
        </div>
      </div>
      <div
        className={cx(
          'w-full',
          FLEX_ITEMS_CENTER,
          'flex-col rounded-lg',
          'gap-2 mobile:gap-3 tablet:gap-6',
          'p-3 tablet:p-6',
          'bgi-[var(--grayscale-100)]'
        )}
      >
        <div
          className={cx(
            'w-full',
            FLEX_ITEMS_CENTER,
            'justify-start mobile:justify-center gap-3',
            'text-xl font-medium'
          )}
        >
          <Icon
            className="mobile:w-[72px] mobile:h-[72px] w-[52px] h-[52px]"
            name="ic_vip_daily_withdrawl"
          />
          <span
            className={cx(
              'text-sm mobile:text-lg tablet:text-xl',
              'font-medium',
              'bgi-text-[var(--base-1-main)]'
            )}
          >
            {t('earn_money_statistics_bonus_info_title_weekly_reward_info')}
          </span>
        </div>

        <Table
          columns={weeklyColumns}
          dataSource={weeklyData}
          rowKey={'currentLevel'}
          classNames={{
            tbodyTd: cx('bgi-text-[var(--grayscale-50)]'),
            thead:
              '!bgi-[var(--grayscale-80)] !bgi-text-[var(--grayscale-20)] !border-b-0 rounded-t-lg',
            tbodyTr:
              '!bgi-[var(--grayscale-100)] border border-[var(--grayscale-90)] border-t-0 last:rounded-b-lg',
          }}
        />
      </div>
    </>
  );
};

export default StaticsSpecialDetail;
