import {StylesConfig} from "react-select";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {DesktopRecordModal} from "./DesktopRecordModal";
import {MobileRecordModal} from "./MobileRecordModal";

export const selectStyleProps: StylesConfig = {
  control: (base, {isFocused}) => (
    {
      ...base,
      background: '#008B8D',
      border: 'none',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '100px',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {},
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

  option: (base, {isFocused, isSelected}) => ({
    ...base,
    background: isSelected ? 'rgba(0,0,0,.2)' : isFocused ? 'rgba(0,0,0,.2)' : '',
    color: 'white',
    '&:active': {
      background: "rgba(0, 0, 0, .3)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    background: '#008B8D'
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

export const statusMap = {
  1: {
    text: 'SIM',
    color: '--state-success'
  },
  0: {
    text: 'Não',
    color: '--state-warning'
  }
}

export interface RecordModalProps {
  onClose: () => void
}

export const RecordModal = ({ onClose }:RecordModalProps) => {
  const { isDesktop } = useBreakpoint()
  return (
    <div
      className='z-[1005] fixed top-0 bottom-0 left-0 right-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.5)]'
      onClick={onClose}
    >
      {
        isDesktop
            ? <DesktopRecordModal />
            : <MobileRecordModal />
      }
    </div>
  )
}