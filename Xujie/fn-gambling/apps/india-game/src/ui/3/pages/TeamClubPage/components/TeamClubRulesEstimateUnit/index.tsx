import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { Trans } from 'react-i18next';
import { Icon } from '@components/Icon';

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
        'bgi-[var(--base-2-variant11)]',
        'bgi-border-[var(--linear-15)]',
        'rounded-lg',
        'px-4 py-3',
        FLEX_ITEMS_CENTER,
        'gap-4'
      )}
    >
      <div className={cx(FLEX_ITEMS_CENTER, 'gap-0')}>
        <img
          src={getImgUrl(EResourceLevel.V, 'club_level_you')}
          alt="Club level icon - you image"
          className={cx('w-14 h-14')}
        />

        <Icon className={cx('w-5 h-5')} name={'ic_arrow_right_2'} />

        <img
          src={getImgUrl(EResourceLevel.V, `club_level_${order}`)}
          alt="Club level icon - level one image"
          className={cx('w-14 h-14')}
        />
      </div>

      {/* 分隔線 */}
      <div
        className={cx('w-px h-6', 'bgi-[var(--transparent-white-10)]')}
      ></div>

      <div className="flex-1">
        <p
          className={cx(
            'text-xs',
            'bgi-text-[var(--base-1-variant2)]',
            'font-normal'
          )}
        >
          <Trans
            i18nKey={`earn_rules_estimated_income_rules_${order}`}
            values={{
              totalBet: formatMoney(totalBet),
              upTo: `${formatMoney(upTo)}${upToSuffix}`,
            }}
            components={{
              upToTag: (
                <span className="text-base bgi-text-[var(--grayscale-100)] font-medium" />
              ),
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default TeamClubRulesEstimateUnit;
