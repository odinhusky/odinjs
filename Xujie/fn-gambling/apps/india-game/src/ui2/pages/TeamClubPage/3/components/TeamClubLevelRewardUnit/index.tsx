import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useEffect, useState } from 'react';
import AnimateCounter from '@components/AnimateCounter';
import Icon from '@components/Icon';
interface TeamClubLevelRewardUnitProps {
  hasPrev?: boolean;
  isActive?: boolean;
  src: string;
  text1: string;
  text2: string;
  value: number;
  prevValue: number;
  formatter?: (value: number) => string;
}

export const TeamClubLevelRewardUnit = ({
  isActive = false,
  src,
  text1,
  text2,
  value,
  prevValue,
  formatter = (value) => `${value}%`,
}: TeamClubLevelRewardUnitProps) => {
  const [isShowArrowIcon, setIsShowArrowIcon] = useState<boolean>(false);
  const textClass = 'bgi-text-[var(--base-2-variant1)] text-sm';
  const valueClass = 'bgi-text-[var(--base-1-main)] text-sm';

  useEffect(() => {
    setIsShowArrowIcon(true);

    const x = setTimeout(() => {
      setIsShowArrowIcon(false);
    }, 1000);

    return () => {
      clearTimeout(x);
    };
  }, [isActive]);

  return (
    <div className={cx(FLEX_COL, 'gap-1', 'w-1/3')}>
      {/* 圖片 */}
      <div className={cx(FLEX_CENTER, 'w-full')}>
        <img
          src={getImgUrl(EResourceLevel.V, src)}
          alt=""
          className="w-[112px] h-[68px]"
        />
      </div>

      <div className={cx('text-center', 'text-xs', 'h-10')}>
        <div className={cx(textClass)}>{text1}</div>
        <div className={cx(FLEX_CENTER)}>
          <span className={cx(textClass, 'mr-1')}>{text2}</span>
          <span className={cx(valueClass)}>
            <AnimateCounter
              from={0}
              to={value}
              duration={1000}
              trigger={isActive}
              formatter={formatter}
            />
          </span>
          {isShowArrowIcon && prevValue !== value ? (
            <Icon
              className={cx('w-4 h-4')}
              name={`ic_ranking_${prevValue > value ? 'down' : 'rise'}`}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TeamClubLevelRewardUnit;
