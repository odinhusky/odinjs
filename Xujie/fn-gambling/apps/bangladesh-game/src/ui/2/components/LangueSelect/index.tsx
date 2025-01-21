import React from 'react';
import Select from '@mode2/components/Select';
import { useTranslation } from 'react-i18next';
import Icon from '@mode2/components/Icon';
import './index.scss';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EN, HI } from '@/constant';

const LangueSelect = ({
  className,
  mode = 1,
}: {
  className?: string;
  mode?: 1 | 2;
}) => {
  const { i18n } = useTranslation();
  return (
    <Select
      className={`langue-select mode-${mode} ${className}`}
      value={i18n.resolvedLanguage}
      onChange={i18n.changeLanguage}
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
              'rounded'
            )}
          >
            <Icon className="w-5 h-5" name={`ic_lang_${item.value}`} />
            <span>{item.label}</span>
          </div>
        ),
      }))}
    ></Select>
  );
};
export default LangueSelect;
