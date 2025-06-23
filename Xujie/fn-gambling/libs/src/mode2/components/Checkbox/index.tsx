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
  checkName?: string;
  uncheckName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  className,
  textClassName,
  iconClassName,
  checkName,
  uncheckName,
}) => {
  const checkedSrc = checkName
    ? checkName
    : getImgUrl(EResourceLevel.ICONS, 'icon_checkbox_checked');

  const unCheckSrc = uncheckName
    ? uncheckName
    : getImgUrl(EResourceLevel.ICONS, 'icon_checkbox_uncheck');

  const checkStateIconSrc = checked ? checkedSrc : unCheckSrc;

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
          className={cx('text-base ml-3 font-medium text-white', textClassName)}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
