import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import Icon from '@libs/mode2/components/Icon';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';

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
    <div className={cx(FLEX_COL, 'gap-1', 'w-full')}>
      <div className={cx('w-full', FLEX_ITEMS_CENTER)}>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'mr-auto')}>
          {iconName ? (
            <Icon
              name={iconName}
              color="var(--transparent-white-70)"
              className={cx('w-4 h-4')}
            />
          ) : null}

          <span
            className={cx('bgi-text-[var(--transparent-white-70)]', 'text-xs')}
          >
            {renderI18N(progressName, t)}
          </span>
        </div>

        <span
          className={cx('text-xs', 'block', 'bgi-text-[var(--grayscale-100)]')}
        >
          ( {numerator} / {denominator} )
        </span>
      </div>

      <div className="flex-1 relative team_club_progress_container">
        <Progress
          className={cx(FLEX_CENTER)}
          percent={percent}
          showInfo={false}
          strokeColor={
            progressStrokeColor
              ? `var(${progressStrokeColor})`
              : 'var(--base-1-main)'
          }
          trailColor="var(--transparent-white-10)"
        />
      </div>
    </div>
  );
};

export default TeamClubLevelProgress;
