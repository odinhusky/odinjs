import React from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';

interface CheckboxProps {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  className,
  textClassName,
  iconClassName,
}) => {
  const checkStateIconSrc = checked
    ? getImgUrl(EResourceLevel.V, 'icon_checkbox_checked')
    : getImgUrl(EResourceLevel.V, 'icon_checkbox_uncheck');

  return (
    <label className={cx('flex items-center cursor-pointer', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <img
        src={checkStateIconSrc}
        className={cx('h-6 w-6', iconClassName)}
        alt="checkbox"
      />
      {label && (
        <span
          className={cx(
            'text-base ml-3 font-medium text-white',
            textClassName
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
