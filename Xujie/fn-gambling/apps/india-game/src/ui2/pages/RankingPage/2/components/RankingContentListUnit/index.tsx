import Icon from '@components/Icon';
import { cx, getAvatarOrder } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_COL,
  FLEX_ITEMS_CENTER,
  FLEX_JUSTIFY_END,
} from '@libs/constant/style';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

interface RankingContentListUnitProps {
  uniqueKey: number | string;
  ranking: number;
  isRise?: boolean;
  avatarId: number | string;
  playerName: number | string;
  reward: number | string;
  totalBets: number | string;
  loading?: boolean;
}

export const RankingContentListUnit = ({
  uniqueKey,
  ranking,
  isRise,
  avatarId,
  playerName,
  reward,
  totalBets,
  loading,
}: RankingContentListUnitProps) => {
  const { t } = useTranslation();
  // const loading = true;

  const iconName =
    isRise === true ? 'rise' : isRise === false ? 'down' : 'stay';

  return (
    <div
      key={uniqueKey}
      className={cx(
        'w-full',
        'py-2 pr-4',
        'bgi-[var(--base-2-variant10)]',
        'rounded',
        FLEX_ITEMS_CENTER,
        'gap-[6px]'
      )}
    >
      {/* 排名 */}
      {loading ? (
        <Skeleton.Button className="ml-4 mr-2" />
      ) : (
        <div className={cx('flex-[1_1_17.4%] h-12', FLEX_CENTER)}>
          {Number(ranking) < 100 ? (
            <Icon name={`ic_ranking_${iconName}`} className="w-4 h-4" />
          ) : null}
          <span
            className={cx(
              'block',
              'text-2xl',
              'bgi-text-[var(--base-2-variant2)]'
            )}
          >
            {ranking}
          </span>
        </div>
      )}

      {/* 大頭貼資料 */}
      <div className={cx('flex-[1_1_40.9%] h-12', FLEX_ITEMS_CENTER, 'gap-3')}>
        {loading ? (
          <Skeleton.Avatar size={46} active />
        ) : (
          // <Avatar
          //   isGuest={true}
          //   isShowVIP={false}
          //   otherAvatarId={avatarId} // 0 就是預設都沒有
          //   rootClassName={cx('!w-[48px] !h-[48px]')}
          //   className={cx('!w-[48px] !h-[48px]')}
          // />
          <div
            className={cx(
              '!w-[48px] !h-[48px]',
              'rounded-full border bgi-border-[var(--base-1-variant3)]'
            )}
          >
            <BaseCacheImg
              src={getImgUrl(
                EResourceLevel.V,
                `avatar_${getAvatarOrder(Number(avatarId))}`
              )}
              className={cx('!w-[48px] !h-[48px]', 'rounded-full')}
            />
          </div>
        )}

        {loading ? (
          <Skeleton
            paragraph={{ rows: 2, width: '60%' }}
            active
            title={false}
            className="mr-20"
          />
        ) : (
          <div className={cx(FLEX_COL, 'gap-2', 'flex-1')}>
            <span
              className={cx(
                'block',
                'bgi-text-[var(--base-2-variant1)]',
                'text-xs'
              )}
            >
              {playerName}
            </span>

            <div
              className={cx(
                FLEX_ITEMS_CENTER,
                'bgi-text-[var(--base-1-main)]',
                'text-xs'
              )}
            >
              <span>{t('ranking_reward')}</span>
              <span>&nbsp;{reward}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Total Bets */}
      {loading ? null : (
        <div className={cx('flex-[1_1_40.9%] h-12', FLEX_JUSTIFY_END)}>
          <div className={cx(FLEX_COL, 'gap-2', 'text-right')}>
            <span
              className={cx('bgi-text-[var(--base-2-variant1)]', 'text-xs')}
            >
              {t('ranking_history_table_total_bets')}
            </span>
            <span className={cx('bgi-text-[var(--base-1-main)]', 'text-lg')}>
              {totalBets}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingContentListUnit;
