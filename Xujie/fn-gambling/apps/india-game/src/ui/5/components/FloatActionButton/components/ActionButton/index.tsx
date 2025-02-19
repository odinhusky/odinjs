import RedDot from '@components/RedDot';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { isEmpty } from 'lodash';
import { FloatActionButton as FloatActionButtonObj } from '@mode2/zustand/components/floatActionButtonStore';
import Icon from '@components/Icon';

export const ActionButton = ({
  item,
  styles,
  imageClassName,
  imgType = '',
  onAnimationEnd = () => {},
}: {
  item: FloatActionButtonObj;
  styles?: React.CSSProperties;
  imageClassName?: string;
  imgType?: string;
  onAnimationEnd?: () => void;
}) => {
  return (
    <div
      key={item.type}
      className={cx(
        'rounded-full',
        'h-12 w-12',
        'flex justify-center items-center',
        'cursor-pointer',
        'relative',
        item.className,
        {
          'bg-shadow-[var(--inset-shadow)]': !isEmpty(item.label),
        }
      )}
      style={styles}
      onClick={item.onActionClick}
      onAnimationEnd={onAnimationEnd}
    >
      {isEmpty(imgType) ? (
        <Icon
          name={`${item.icon}_default`}
          className={cx(
            'rounded-full',
            'object-contain',
            'w-full h-full',
            'hover:brightness-[1.15]',
            'active:brightness-[0.85]',
            imageClassName
          )}
        />
      ) : (
        <img
          src={getImgUrl(EResourceLevel.V, item.icon, imgType)}
          className={cx(
            'rounded-full',
            'object-contain',
            'w-full h-full',
            'hover:brightness-[1.15]',
            'active:brightness-[0.85]',
            imageClassName
          )}
          alt={item.label}
        />
      )}

      {item?.isShowRedDot ? (
        <RedDot type="img" className={'absolute top-[3px] right-[5px]'} />
      ) : null}
    </div>
  );
};

export default ActionButton;
