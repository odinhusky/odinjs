import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { Trans } from 'react-i18next';

interface TeamClubLevelRewardUnitProps {
  src: string;
  i18nKey: string;
  values: {
    percent?: number | string;
    maxReward?: number | string;
  };
  isAnimation?: boolean;
}

export const TeamClubLevelRewardUnit = ({
  src,
  i18nKey,
  values,
  isAnimation = false,
}: TeamClubLevelRewardUnitProps) => {
  return (
    <div className={cx(FLEX_COL, 'gap-1', 'w-1/3')}>
      {/* 圖片 */}
      <div className={cx(FLEX_CENTER, 'w-full')}>
        <img
          src={getImgUrl(EResourceLevel.V, src)}
          alt=""
          className="w-10 h-10"
        />
      </div>

      <div className={cx('text-center', 'text-xs')}>
        <Trans
          i18nKey={i18nKey}
          values={values}
          components={{
            percentTag: <span className="percent break-all" />,
            maxRewardTag: <span className="max_reward break-all" />,
          }}
        />
      </div>
    </div>
  );
};

export default TeamClubLevelRewardUnit;
