import React from 'react';
import Select from '@mode2/components/Select';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EN, UR } from '@/constant';
import Icon from '@mode2/components/Icon';

const LangueSelect = ({
  className,
  mode = 1,
  arrowColor = '',
  labClassName = '',
  langueClassName = '',
  defaultLangue = '',
  isHideArrow = false,
}: {
  className?: string;
  mode?: 1 | 2;
  arrowColor?: string;
  labClassName?: string;
  langueClassName?: string;
  defaultLangue?: string;
  isHideArrow?: boolean;
}) => {
  const { i18n } = useTranslation();
  return (
    <Select
      className={cx(`langue-select mode-${mode} ${className}`)}
      value={i18n.resolvedLanguage}
      onChange={i18n.changeLanguage}
      arrowColor={arrowColor}
      isHideArrow={isHideArrow}
      options={[
        {
          label: defaultLangue ? defaultLangue : mode === 1 ? 'English' : 'En', // mode === 1 ? 'English' : 'En',
          value: EN,
        },
        {
          label: 'اردو',
          value: UR,
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
