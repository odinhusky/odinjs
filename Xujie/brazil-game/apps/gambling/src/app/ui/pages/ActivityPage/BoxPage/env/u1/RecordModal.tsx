import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../../utils/renderByRWD";
import {MobileRecordModal} from "./device/MobileRecordModal";
import {DesktopRecordModal} from "./device/DesktopRecordModal";
import {StylesConfig} from "react-select";


export const statusMap = {
  1: {
    text: 'SIM',
    color: '--state-success-main'
  },
  0: {
    text: 'Não',
    color: '--state-error-main'
  }
}


export const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => (
    {
      ...base,
      background: 'var(--primary-variant)',
      borderColor: isFocused? 'var(--primary-assistant)': 'rgba(255,255,255,.3)',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '8px',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
      },
    }
  ),
  valueContainer: (style) => ({
    ...style,
    color: 'white',
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),

  option: (base, { isFocused }) => ({
    ...base,
    background: isFocused ? 'rgba(255,255,255, .2)': 'var(--primary-variant)',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    background: 'var(--primary-variant)',
    border: 'rgba(255,255,255,.3) solid 1px',
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: '8px',
    padding: '0px'
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'white'
  }),
}

export interface RecordModalProps {
  onClose: () => void
}

export const RecordModal = ({ onClose }: RecordModalProps) => {
  const device = useBreakpoint()

  return (
    <div
      className='z-[1005] fixed top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center bg-[var(--black-50)]'
      onClick={onClose}
    >
      {
        renderByRWD({
          mobile: <MobileRecordModal onClose={onClose} />,
          tablet: <MobileRecordModal onClose={onClose} />,
          desktop: <DesktopRecordModal onClose={onClose} />,
        }, device)
      }
    </div>
  )
}