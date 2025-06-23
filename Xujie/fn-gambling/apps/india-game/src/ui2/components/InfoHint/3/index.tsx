import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { InfoHintProps } from '../InfoHintProps';

export const InfoHint = ({ hintText, classNameObj }: InfoHintProps) => {
  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'flex items-start gap-1',
        classNameObj?.containerClass
      )}
    >
      <Icon
        className={cx('w-5 h-5', classNameObj?.iconClass)}
        name="ic_information_1"
      />

      <div
        className={cx(
          'w-full',
          'text-start text-sm',
          'bgi-text-[var(--base-2-variant2)]',
          classNameObj?.textClass
        )}
      >
        {hintText}
      </div>
    </div>
  );
};

export default InfoHint;
