import cx from 'apps/gambling/src/app/ui/utils/cx';
import { IndexGameTab } from '../../hooks/useU9IndexPageBase';
import {
  FLEX_CENTER,
  FLEX_JUSTIFY_CENTER,
} from 'apps/gambling/src/assets/constant/style';
import Icon from '../../../../components-bs/Icon';

interface U9IndexGameTabUnitProps extends IndexGameTab {
  heightClass: string;
}

export const U9IndexGameTabUnit = ({
  id,
  isActive,
  activeImgSrc,
  inActiveTarget,
  text,
  action,
  heightClass,
}: U9IndexGameTabUnitProps) => {
  return (
    <div key={id}>
      {/* 第二層 Div 才能做客製化，第一層會被給予固定的 style */}
      <div
        className={cx(FLEX_CENTER, 'w-full', heightClass, {
          'border-b-[2px] border-[var(--tertiary-main)]': isActive,
        })}
      >
        <button
          className={cx(FLEX_JUSTIFY_CENTER, 'flex-col', 'gap-1')}
          onClick={action}
        >
          <img
            className={cx('w-[20px] h-[20px]')}
            style={!isActive ? { display: 'none' } : {}}
            src={activeImgSrc}
            alt="Active tab image"
          />

          {/* Inactive 的 icon 改用 svg 的元件代替 */}
          <Icon
            name={inActiveTarget}
            color="var(--transparent-50)"
            className={cx({ hidden: isActive })}
          />

          <span
            className={cx(
              'block',
              'text-xs leading-4',
              'text-[var(--transparent-80)]',
              'font-bold',
              {
                'text-[var(--tertiary-main)]': isActive,
              }
            )}
          >
            {text}
          </span>
        </button>
      </div>
    </div>
  );
};

export default U9IndexGameTabUnit;
