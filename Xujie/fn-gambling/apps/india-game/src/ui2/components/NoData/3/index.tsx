import Icon from '@components/Icon';
import { cx } from '@libs/commonUtils';
import { NoDataProps } from '../NoDataProps';

export const NoData = (props: NoDataProps) => {
  return (
    <div
      className={cx(
        'flex flex-col justify-center items-center',
        'gap-2',
        'font-medium text-sm bgi-text-[var(--base-2-variant2)]',
        props.styles?.container
      )}
    >
      <Icon
        className={cx('w-[134px] h-[134px]', props.styles?.img)}
        name="img_no_results"
      />

      <p>{props.text || 'It is empty here.'}</p>
    </div>
  );
};

export default NoData;
