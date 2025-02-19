import { cx } from '@libs/commonUtils';
import { FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { formatMoney } from '@mode2/utils';

interface TeamClubLevelProgressProps {
  iconName?: string;
  progressName: string;
  mainThemeVariableName: string;
  percent: number;
  numerator: number; // 分子
  denominator: number; // 分母
  isCurrency?: boolean; // 貨幣符號
}

export const TeamClubLevelProgress = ({
  iconName,
  progressName,
  mainThemeVariableName,
  percent,
  numerator,
  denominator,
  isCurrency,
}: TeamClubLevelProgressProps) => {
  return (
    <div className={cx(FLEX_COL, 'gap-1', 'w-full')}>
      <div className={cx('w-full', FLEX_ITEMS_CENTER)}>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'mr-auto')}>
          {iconName ? (
            <Icon
              name={iconName}
              className="w-4 h-4"
              color="var(--transparent-white-70)"
            />
          ) : null}

          <span
            className={cx('bgi-text-[var(--transparent-white-70)]', 'text-xs')}
          >
            {progressName}
          </span>
        </div>

        <span
          className={cx('text-xs', 'block', 'bgi-text-[var(--grayscale-100)]')}
        >
          ( {isCurrency ? formatMoney(numerator) : numerator} /&nbsp;
          {isCurrency ? formatMoney(denominator) : denominator} )
        </span>
      </div>

      <div
        className={cx(
          'h-2 w-full bgi-[var(--transparent-white-10)] rounded-[100px]'
        )}
      >
        <div
          className={cx(
            'w-full h-full rounded-[100px]',
            mainThemeVariableName
              ? `bgi-[var(${mainThemeVariableName})]`
              : 'bgi-[var(--base-1-main)]'
          )}
          style={{
            width: `${isNaN(percent) ? 0 : percent >= 100 ? 100 : percent}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default TeamClubLevelProgress;
