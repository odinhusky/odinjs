import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { InfoHintProps } from '../InfoHintProps';

export const InfoHint = ({ hintText, classNameObj }: InfoHintProps) => {
  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'flex-col tablet:flex-row',
        classNameObj?.containerClass
      )}
    >
      <Icon
        className={cx(
          'w-6 h-6 mb-2 tablet:mr-2 tablet:mb-0',
          classNameObj?.iconClass
        )}
        name="ic_notice"
        color="var(--state-warn-main)"
      />

      <div
        className={cx(
          'w-full',
          'text-center tablet:text-left',
          'bgi-text-[var(--state-warn-main)]',
          classNameObj?.textClass
        )}
      >
        {hintText}
      </div>
    </div>
  );
};

export default InfoHint;
