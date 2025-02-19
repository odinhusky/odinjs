import React from 'react';
import Select from '@mode2/components/Select';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EN, HI } from '@/constant';
import Icon from '@components/Icon';

const LangueSelect = ({
  className,
  mode = 1,
  arrowColor = '',
  labClassName = '',
  langueClassName = '',
}: {
  className?: string;
  mode?: 1 | 2;
  arrowColor?: string;
  labClassName?: string;
  langueClassName?: string;
}) => {
  const { i18n } = useTranslation();
  return (
    <Select
      className={`langue-select mode-${mode} ${className}`}
      value={i18n.resolvedLanguage}
      onChange={i18n.changeLanguage}
      arrowColor={arrowColor}
      options={[
        {
          label: mode === 1 ? 'English' : 'En',
          value: EN,
        },
        {
          label: 'हिंदी',
          value: HI,
        },
      ].map((item) => ({
        value: item.value,
        label: (
          <div
            key={item.value}
            className={cx(
              'langue-select-item',
              FLEX_ITEMS_CENTER,
              'gap-2',
              'px-[10px] py-[6px]',
              'cursor-pointer',
              'rounded',
              langueClassName
            )}
          >
            <Icon className="w-5 h-5" name={`ic_lang_${item.value}`} />
            <span className={labClassName}>{item.label}</span>
          </div>
        ),
      }))}
    ></Select>
  );
};
export default LangueSelect;
