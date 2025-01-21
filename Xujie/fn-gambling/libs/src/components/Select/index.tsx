import * as React from 'react';
import { useState } from 'react';
import { EResourceLevel, getImgUrl } from '@mode2/utils/img';
import { Select } from 'antd';
import { Picker } from 'antd-mobile';
import './index.scss';
import IconTint from '../IconTint';
const BaseSelect = <T extends string | number>(props: {
  value?: T;
  onChange?: (value: T) => void;
  options: Array<{
    value: T;
    label: string | React.ReactNode;
    icon?: string;
  }>;
  className?: string;
  mobileMode?: boolean;
  popupClassName?: string;
  arrowColor?: string;
  isHideArrow?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${props.className}`}>
      <Select
        value={props.value}
        onChange={(value) => props.onChange?.(value)}
        open={props.mobileMode ? false : open}
        onDropdownVisibleChange={setOpen}
        options={props.options}
        className={`mode-select ${props.className}`}
        popupClassName={`mode-select-popup ${props.popupClassName}`}
      />
      {
        props.isHideArrow ? null : <IconTint
          className={`${
            open ? 'rotate-180' : ''
          } absolute w-4 h-4 top-1/2 right-2 -translate-y-1/2 cursor-pointer pointer-events-none select-arrow`}
          src={getImgUrl(EResourceLevel.V, 'ic_arrow_down_1')}
          color={props.arrowColor ? props.arrowColor : 'var(--base-2-main)'}
        />
      }
      <Picker
        value={props.value ? [props.value] : []}
        visible={props.mobileMode && open}
        columns={[props.options]}
        onClose={() => setOpen(false)}
        onConfirm={(e) => props.onChange?.(e[0] as T)}
      />
    </div>
  );
};

export default BaseSelect;
