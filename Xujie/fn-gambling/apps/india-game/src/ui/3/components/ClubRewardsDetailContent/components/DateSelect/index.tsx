import { DatePicker } from '@libs/components/DatePicker';
import Icon from '@components/Icon';
import { useShowDatePickerStore } from '@libs/mode2/zustand/DatePickerStore';
import dayjs from 'dayjs';
import { useState } from 'react';
import { cx } from '@libs/commonUtils';

const DateSelect = ({
  onDateChange,
}: {
  onDateChange: (data: Date) => void;
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const setDatePicker = useShowDatePickerStore((state) => state.setDatePicker);
  const handleChange = (data: Date) => {
    onDateChange(data);
    setDate(data);
  };
  return (
    <>
      <div
        className="flex items-center gap-1.5"
        onClick={() => setDatePicker(true)}
      >
        <span className="text-sm font-medium bgi-text-[var(--base-2-variant1)]">
          {dayjs(date).format('YYYY-MM')}
        </span>
        <Icon name="ic_arrow_down_2" className="w-4 h-4" />
      </div>
      <DatePicker
        className="!bgi-[var(--base-2-variant14)]"
        pickerViewClassName="flex-row"
        btnsClassName="justify-center gap-12"
        btnCommonClassName="!w-[166px] h-12 flex-none rounded-md active:transition active:duration-300 active:scale-95"
        primaryBtnClassName={cx('bgi-[var(--base-1-variant3)]')}
        primaryTextClassName="bgi-text-[var(--base-2-variant5)]"
        secondaryBtnClassName={cx('!bgi-[var(--base-2-variant5)]')}
        secondaryTextClassName=""
        precision="month"
        onDateChange={handleChange}
      />
    </>
  );
};

export default DateSelect;
