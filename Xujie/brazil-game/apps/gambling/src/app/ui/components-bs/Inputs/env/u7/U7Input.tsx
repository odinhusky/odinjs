import cx from 'apps/gambling/src/app/ui/utils/cx';
import { ReactNode } from 'react';
import { Input } from '../../Input';
import U7BorderDiv from '../../../../components/U7BorderDiv';

interface U7InputProps {
  prefix?: ReactNode;
  className?: string;
  containerClass?: string;
  inputClass?: string;
  value: string | number;
  onChange?: <T>(arg?: T) => void;
  validation?: boolean;
  errorMessage?: string;
  errorMessageClassName?: string;
}

export const U7Input = ({
  prefix,
  className,
  containerClass,
  inputClass,
  value,
  onChange,
  validation,
  errorMessage,
  errorMessageClassName,
}: U7InputProps) => {
  return (
    <U7BorderDiv
      className={cx(
        'border-x-[0px]',
        'border-t-[0px]',
        'border-b-[1px]',
        'relative',
        // 留空間給 errorMessage
        { 'mb-3': errorMessage !== '' },
        containerClass
      )}
    >
      <Input
        prefix={prefix}
        inputOuterClassName={cx('m-0 md:m-0')}
        themeStyle="normal"
        className={cx(
          'rounded-lg',
          'w-full',
          'bg-[var(--input-bg)]',
          'text-base leading-5',
          'm-0',
          'py-[10px] px-3',
          className
        )}
        focusClassName={cx('bg-[var(--input-focus-bg)]')}
        inputFocusClass={cx('text-[var(--grayscale-100)]')}
        inputClassName={cx(
          'text-base leading-5',
          'text-[var(--transparent-white-70)]',
          inputClass
        )}
        value={value}
        onChange={onChange}
        validation={validation}
        errorMessage={errorMessage}
        errorMessageClassName={cx(
          'pt-0 mt-2',
          'text-xs leading-4',
          'text-[var(--state-error-main)]',
          'absolute bottom-[-18px] left-0',
          errorMessageClassName
        )}
      />
    </U7BorderDiv>
  );
};

export default U7Input;
