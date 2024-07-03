import {StylesConfig} from "react-select";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../../utils/renderByRWD";
import {DesktopRecordPage} from "./device/DesktopRecordPage";
import {TabletRecordPage} from "./device/TabletRecordPage";
import {MobileRecordPage} from "./device/MobileRecordPage";


export const selectStyleProps: StylesConfig = {
  control: (base, { isFocused }) => (
    {
      ...base,
      background: 'var(--grayscale-30)',
      border: isFocused? '1.5px solid var(--state-warn-main)': '1.5px solid var(--grayscale-40)',
      color: 'white',
      padding: '0px 8px',
      borderRadius: '8px',
      outline: 'none',
      boxShadow: 'none',
      '&:hover': {
      },
      cursor: 'pointer'
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

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isSelected ? 'var(--grayscale-20)': isFocused ? 'var(--grayscale-40)': 'var(--grayscale-30)',
    color: 'white',
    '&:active': {
      background: "var(--grayscale-20)"
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: '8px',
    border: '1.5px solid var(--grayscale-40)',
    padding: '0px'
  }),

  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'white'
  }),
}

export const recordStatusMap = {
  true: {
    title: 'Sucesso',
    color: 'var(--state-success-main)'
  },
  false: {
    title: 'Não recebido',
    color: 'var(--state-warn-main)'
  }
}

export const RecordPage = () => {
  const device = useBreakpoint();

  const handleStyle = (judge: boolean) => ({
    ...selectStyleProps,
    singleValue:  (provided: any) => ({
      ...provided,
      color: judge ? 'white' : 'var(--grayscale-60)'
    })
  });

  return renderByRWD({
    desktop: <DesktopRecordPage handleStyle={handleStyle} />,
    tablet: <TabletRecordPage handleStyle={handleStyle} />,
    mobile: <MobileRecordPage handleStyle={handleStyle} />
  }, device)
}
