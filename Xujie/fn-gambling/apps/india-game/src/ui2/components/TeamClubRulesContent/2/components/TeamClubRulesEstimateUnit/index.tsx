import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { Trans } from 'react-i18next';

interface TeamClubRulesEstimateUnitProps {
  id: string;
  order: string | number;
  totalBet: number;
  upTo: number;
  upToSuffix?: string;
}

export const TeamClubRulesEstimateUnit = ({
  order,
  totalBet,
  upTo,
  upToSuffix = '',
}: TeamClubRulesEstimateUnitProps) => {
  return (
    <div
      className={cx(
        'w-full',
        'bgi-[var(--linear-4)]',
        'rounded-lg',
        'px-2 py-3',
        FLEX_ITEMS_CENTER,
        'gap-3'
      )}
    >
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
        <img
          src={getImgUrl(EResourceLevel.V, 'club_level_you')}
          alt="Club level icon - you image"
          className={cx('w-10 h-10')}
        />

        <img
          src={getImgUrl(EResourceLevel.V, 'ic_team_swiper_right_arrow')}
          alt="Right arrow presents to image"
          className={cx('w-4 h-4')}
        />

        <img
          src={getImgUrl(EResourceLevel.V, `club_level_${order}`)}
          alt="Club level icon - level one image"
          className={cx('w-10 h-10')}
        />
      </div>

      {/* 分隔線 */}
      <div
        className={cx('w-px h-6', 'bgi-[var(--transparent-white-10)]')}
      ></div>

      <div className="flex-1">
        <p className={cx('text-xs', 'bgi-text-[var(--grayscale-100)]')}>
          <Trans
            i18nKey={`earn_rules_estimated_income_rules_${order}`}
            values={{
              totalBet: formatMoney({ value: totalBet }),
              upTo: `${formatMoney({ value: upTo })}${upToSuffix}`,
            }}
            components={{
              upToTag: <span className="bgi-text-[var(--linear-2)]" />,
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default TeamClubRulesEstimateUnit;
