import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_ITEMS_CENTER, XY_CENTER } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';
import BaseProgress from '@libs/mode2/components/BaseProgress';

interface TeamClubLevelProgressProps {
  iconName?: string;
  progressStrokeColor?: string;
  progressName: I18NContent;
  percent: number;
  numerator: number | string; // 分子
  denominator: number | string; // 分母
}

export const TeamClubLevelProgress = ({
  iconName,
  progressStrokeColor,
  progressName,
  percent,
  numerator,
  denominator,
}: TeamClubLevelProgressProps) => {
  const { t } = useTranslation();

  return (
    <div className={cx(FLEX_ITEMS_CENTER, 'gap-1', 'w-full')}>
      <div className={cx(FLEX_ITEMS_CENTER, 'flex-1', 'gap-1')}>
        {iconName ? (
          <Icon
            name={iconName}
            color="var(--transparent-white-70)"
            className={cx('w-4 h-4')}
          />
        ) : null}

        <span className={cx('bgi-text-[var(--base-2-variant1)]', 'text-base')}>
          {renderI18N(progressName, t)}
        </span>
      </div>

      <div className="flex-1 relative team_club_progress_container">
        <BaseProgress
          trailClass={cx('bg-shadow-[var(--progress-inset-shadow)]')}
          strokeClass={cx('bg-shadow-[var(--team-club-progress-active)]')}
          strokeWidth={14}
          percent={percent}
          strokeColor={
            progressStrokeColor
              ? `var(${progressStrokeColor})`
              : 'var(--base-1-main)'
          }
          trailColor="var(--transparent-gray-70)"
        />

        {/* 顯示百分比 */}
        <span
          className={cx(
            'text-xs w-full text-center',
            'block',
            'bgi-text-[var(--grayscale-100)]',
            'absolute',
            'z-[10]',
            XY_CENTER
          )}
        >
          [ {numerator} / {denominator} ]
        </span>
      </div>
    </div>
  );
};

export default TeamClubLevelProgress;
