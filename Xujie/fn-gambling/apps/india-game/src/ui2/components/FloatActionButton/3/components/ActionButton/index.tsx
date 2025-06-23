import RedDot from '@components/RedDot';
import { cx } from '@libs/commonUtils';
import { FloatActionButton as FloatActionButtonObj } from '@mode2/zustand/components/floatActionButtonStore';
import Icon from '@components/Icon';

export const ActionButton = ({
  item,
  styles,
  imageClassName,
  imgType = '',
}: {
  item: FloatActionButtonObj;
  styles?: React.CSSProperties;
  imageClassName?: string;
  imgType?: string;
}) => {
  return (
    <div
      key={item.type}
      className={cx(
        'bg-shadow-[var(--inset-shadow)] rounded-full',
        'w-10 h-10 mobile:w-14 mobile:h-14',
        'flex justify-center items-center',
        'cursor-pointer',
        'relative',
        item.className
      )}
      style={styles}
      onClick={item.onActionClick}
    >
      <Icon
        name={`${item.icon}`}
        className={cx(
          'rounded-full',
          'object-contain',
          'w-full h-full',
          'hover:brightness-[1.15]',
          'active:brightness-[0.85]',
          imageClassName
        )}
        imgClassName={'rounded-full'}
      />

      {item?.isShowRedDot ? (
        <RedDot type="img" className={'absolute top-[3px] right-[5px]'} />
      ) : null}
    </div>
  );
};

export default ActionButton;
