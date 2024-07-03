import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import Drawer, { DrawerDelay } from "../../Drawers/AnimateDrawer";
import RMCDatePicker from "rmc-date-picker";
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/index.css'
import { renderByUVersion } from "../../../utils/renderByUVersion";
import { DatePickerBlock as CocoDatePickerBlock } from './env/u1/DatePickerBlock'
import { DatePickerBlock as RioDatePickerBlock } from './env/u2/DatePickerBlock'
import { DatePickerBlock as U5DatePickerBlock } from './env/u5/DatePickerBlock'
import { DatePickerBlock as U6DatePickerBlock } from './env/u6/DatePickerBlock'
import { DatePickerBlock as U7DatePickerBlock } from './env/u7/DatePickerBlock'
import cx from "../../../utils/cx";

export const dateToString = (date: any) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const datePickerStyle = renderByUVersion(
  {
    "u6": {
      padding: '4px 8px',
      width: '280px',
      color: 'white',
      backgroundColor: 'var(--primary-variant)',
      border: '1px solid rgba(255,255,255,30%)',
      borderRadius: '4px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    "u7": {
      padding: '4px 8px',
      width: '226px',/**217 */
      height: '36px',
      color: 'var(--grayscale-70)',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      borderRadius: '100px',
      display: 'flex',
      alignItems: 'center',
    },
  }, {
  padding: '4px 8px',
  width: '280px',
  color: 'white',
  backgroundColor: 'var(--primary-variant)',
  border: '1px solid rgba(255,255,255,30%)',
  borderRadius: '4px',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
}
)

export const DatePickerBlock = renderByUVersion({
  "u1": CocoDatePickerBlock,
  "u2": RioDatePickerBlock,
  "u5": U5DatePickerBlock,
  "u6": U6DatePickerBlock,
  "u7": U7DatePickerBlock,
}, CocoDatePickerBlock)

interface IDatePickerProps {
  className?: string;
  onConfirm: (values: string) => void
  value: string
  max?: string
  min?: string
}

const DatePicker = ({
  className,
  onConfirm,
  value,
  max,
  min
}: IDatePickerProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [open, setOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date(value))

  const handleConfirm = () => {
    setOpen(false)
    setTimeout(() => {
      setDrawerOpen(false);
      setOpen(true)
    }, DrawerDelay)
    onConfirm(dateToString(selectedDate))
  }

  const handleCancel = () => {
    setOpen(false)
    setTimeout(() => {
      setDrawerOpen(false);
      setOpen(true)
    }, DrawerDelay)
  }

  return (
    <>
      <DatePickerBlock
        onClick={() => setDrawerOpen(true)}
      >
        <div>
          {value}
        </div>
        <DownOutlined />
      </DatePickerBlock>
      {
        drawerOpen && (
          <Drawer
            className={
              cx(
                'w-full bg-[var(--white)] text-[var(--black)]',
                className
              )
            }
            onClose={() => {
              setDrawerOpen(false)
              setOpen(true)
            }
            }
            open={open}
            setOpen={setOpen}
          >
            <div className='p-4 flex text-base font-medium justify-between items-center text-[var(--black)]'>
              <div className='text-xs' onClick={handleCancel}>Cancelar</div>
              <div className='font-bold'>Selecione a data</div>
              <div className='text-xs' onClick={handleConfirm}>Confirme</div>
            </div>

            <RMCDatePicker
              className="custom-date-picker"
              date={selectedDate}
              mode='date'
              onDateChange={(date) => setSelectedDate(date)}
              minDate={min ? new Date(min) : undefined}
              maxDate={max ? new Date(max) : undefined}
            />
          </Drawer>
        )
      }

    </>
  )
}

export default DatePicker;
