import { DatePicker } from '@libs/components/DatePicker';
import Icon from '@components/Icon';
import { useShowDatePickerStore } from '@libs/mode2/zustand/DatePickerStore';
import dayjs from 'dayjs';
import { useState } from 'react';

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
        className="flex items-center gap-1"
        onClick={() => setDatePicker(true)}
      >
        <span className="text-[var(--grayscale-100)] text-xs">
          {dayjs(date).format('MM.YYYY')}
        </span>
        <Icon
          name="ic_menu_down"
          className="w-4 h-4"
          color="var(--grayscale-100)"
        />
      </div>
      <DatePicker precision="month" onDateChange={handleChange} />
    </>
  );
};

export default DateSelect;
