import Table, { ITableColumn } from '@components/Table';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import {
  RankingUnit,
  useMode2InvitePageRankingListStore,
} from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';

export const RankingListContent = () => {
  const { t } = useTranslation();
  const rankingData = useMode2InvitePageRankingListStore(
    (state) => state.rankingData
  );

  const rankingColumns: ITableColumn<{
    ranking: number;
    id: string;
    betAmount: number;
    bonus: number;
  }>[] = [
    {
      title: 'earn_money_ranking_list_table_header_ranking',
      dataIndex: 'ranking',
      render: (v: RankingUnit) => {
        return v.ranking > 3 ? (
          <span
            className={cx({
              'bgi-text-[var(--base-1-main)]': v.ranking <= 3,
            })}
          >
            {v.ranking}
          </span>
        ) : (
          <img
            src={getImgUrl(
              EResourceLevel.V,
              'icon_ranking_' + String(v.ranking)
            )}
            alt={String(v.ranking)}
            className="mobile:h-8 h-6"
          />
        );
      },
    },
    {
      title: 'earn_money_ranking_list_table_header_id',
      dataIndex: 'id',
      render: (v: RankingUnit) => {
        return v.id !== undefined && v.id !== 'Wait Player' ? (
          <div
            className={cx({
              'bgi-text-[var(--base-1-main)]': v.ranking <= 3,
            })}
          >
            {v.id}
          </div>
        ) : (
          <div
            className={cx('no-player', {
              'bgi-text-[var(--base-1-main)]': v.ranking <= 3,
            })}
          >
            {t('earn_money_ranking_list_table_content_wait_player')}
          </div>
        );
      },
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bet_amount',
      dataIndex: 'betAmount',
      render: (v: RankingUnit) => {
        return (
          <span
            className={cx({
              'bgi-text-[var(--base-1-main)]': v.ranking <= 3,
            })}
          >
            {formatMoney(v.betAmount)}
          </span>
        );
      },
    },
    {
      title: 'earn_money_statistics_bonus_info_table_header_bonus',
      dataIndex: 'bonus',
      render: (v: RankingUnit) => {
        return (
          <div
            className={cx({
              'bgi-text-[var(--base-1-main)]': v.ranking <= 3,
            })}
          >
            {formatMoney(v.bonus)}
          </div>
        );
      },
    },
  ];

  return (
    <div
      className={cx(
        FLEX_COL,
        'gap-1 mobile:gap-0',
        'bgi-[var(--grayscale-100)]',
        'px-3 py-2 mobile:px-6 mobile:py-3',
        'tablet:rounded-lg rounded'
      )}
    >
      <div className={cx('bgi-text-[var(--grayscale-100)]', 'font-medium')}>
        <Table
          classNames={{
            tbodyTr:
              'ranking-table-row border border-t-0 border-[var(--grayscale-90)] mobile:last:rounded-b-lg last:rounded-b !bgi-[#00000000] mobile:!h-[56px] !h-[40px] !p-0',
            thead:
              '!bgi-[var(--grayscale-80)] !bgi-text-[var(--grayscale-20)] mobile:rounded-t-lg rounded-t !border-none',
            tbodyTd: 'bgi-text-[var(--grayscale-00)]',
          }}
          columns={rankingColumns}
          dataSource={rankingData}
          rowKey={'ranking'}
          pageSize={10}
          btnClassName={{
            btnClass: '!bgi-[#00000000]',
            textClass: '!bgi-text-[var(--base-1-main)]',
            iconColor: 'var(--base-1-main)',
          }}
        />
      </div>
    </div>
  );
};

export default RankingListContent;
