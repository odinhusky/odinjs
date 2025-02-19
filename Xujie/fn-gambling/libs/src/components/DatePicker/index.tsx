import { DatePickerView } from 'antd-mobile';
import { useState } from 'react';
import React from 'react';
import { useShowDatePickerStore } from '@libs/mode2/zustand/DatePickerStore';
import './index.scss';
import useAnimation from '@libs/commonUtils/hooks/useAnimation';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { Precision } from 'antd-mobile/es/components/date-picker/date-picker-utils';
import BaseModal from '../Modal';
import { t } from 'i18next';
import { PickerDate } from 'antd-mobile/es/components/date-picker/util';

const now = new Date();

/**
 * 參考 https://mobile.ant.design/zh/components/picker-view/#%E5%B1%9E%E6%80%A7-2
 * @returns
 */

interface IDatePickerProps {
  className?: string;
  pickerViewClassName?: string;
  btnsClassName?: string;
  btnCommonClassName?: string;
  primaryBtnClassName?: string;
  secondaryBtnClassName?: string;
  primaryTextClassName?: string;
  secondaryTextClassName?: string;
  styles?: React.CSSProperties;
  precision?: Precision; // default day. || 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' ...
  onDateChange: (message: Date) => void;
}

export const DatePicker = (props: IDatePickerProps) => {
  const { isMobile } = useBreakPoint();
  const [value, setValue] = useState<Date>(now);

  const isShowDatePicker = useShowDatePickerStore(
    (state) => state.isShowDatePicker
  );
  const setDatePicker = useShowDatePickerStore((state) => state.setDatePicker);

  const handleChange = (value: PickerDate) => {
    setValue(value);
  };

  const { animate, runAnimate } = useAnimation('animate__fadeInUp', 300, false);

  const handleClose = (isShow: boolean, date?: Date) => {
    runAnimate('animate__fadeOutDown', () => {
      setDatePicker(isShow);
      if (date) {
        props.onDateChange(date!);
      }
    });
  };

  return isShowDatePicker ? (
    <BaseModal>
      <div
        className={cx(
          'w-full px-4 rounded-t-xl box-border flex flex-col bgi-text-[var(--grayscale-00)] bgi-[var(--bg-sidebar)] z-[51]',
          animate,
          'animate__animated animate__fadeInUp',
          'border-t border-[var(--transparent-white-20)]',
          {
            'fixed bottom-0 left-0 right-0': isMobile,
            'max-w-[60%]': !isMobile,
          },
          props.className
        )}
      >
        <DatePickerView
          style={
            props.styles || {
              '--height': '9.75rem',
              '--item-height': '3.25rem',
              '--item-font-size': '0.875rem',
            }
          }
          className={cx(
            'h-1/3 touch-none bgi-[var(--bg-sidebar)] flex-row-reverse',
            props.pickerViewClassName
          )}
          defaultValue={now}
          value={value}
          max={now}
          mouseWheel={true}
          precision={props.precision || 'day'}
          onChange={handleChange}
        />

        <div className={cx('flex gap-7 mb-4', props.btnsClassName)}>
          <button
            className={cx(
              'flex-1 text-lg font-medium rounded-[100px] h-10 bgi-text-[var(--grayscale-100)] bgi-[var(--grayscale-30)]',
              props.btnCommonClassName,
              props.secondaryBtnClassName
            )}
            onClick={() => handleClose(false)}
          >
            <span className={cx(props.secondaryTextClassName)}>
              {t('datepicker_button_cancel')}
            </span>
          </button>
          <button
            className={cx(
              'flex-1 text-lg rounded-[100px] h-10 bgi-text-[var(--grayscale-100)] bgi-[var(--base-1-main)]',
              props.btnCommonClassName,
              props.primaryBtnClassName
            )}
            onClick={() => handleClose(false, value)}
          >
            <span className={cx(props.primaryTextClassName)}>
              {t('datepicker_button_confirm')}
            </span>
          </button>
        </div>
      </div>
    </BaseModal>
  ) : null;
};
