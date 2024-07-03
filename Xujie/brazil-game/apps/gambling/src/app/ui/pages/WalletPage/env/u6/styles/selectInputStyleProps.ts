import { StylesConfig } from "react-select";

export const selectInputStyleProps = (isMobile?: boolean): StylesConfig => {

  return {
    control: (baseStyle: any, states: any) => {
      return {
        ...baseStyle,
        cursor: 'pointer',
        background: 'var(--grayscale-20)',
        color: 'white',
        padding: '8px 10px',
        borderRadius: '8px',
        outline: 'none',
        boxShadow: 'none',
        // border: 'solid 1px #808080',
        backgroundClip: 'padding-box,border-box',
        backgroundOrigin: 'padding-box,border-box',
        '&:hover': {
          // borderColor: 'none',
          border: 'solid 1.5px var(--grayscale-80)',
        },

        border: states.isFocused ? 'solid 1.5px var(--grayscale-80)' : 'solid 1.5px var(--grayscale-50)',
      };
    },
    valueContainer: (style: any, state: any) => ({
      ...style,
      color: 'var(--grayscale-90)',
      padding: 0,
      margin: 0
    }),
    //@ts-ignore
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',

    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      paddingTop: '0px',
      paddingBottom: '0px'
    }),
    //@ts-ignore
    option: (
      styles: any,
      { data, isDisabled, isFocused, isSelected }: any
    ) => {
      return {
        ...styles,
        // borderColor: '#808080',
        color: isFocused || isSelected ? 'var(--grayscale-90)' : 'var(--grayscale-90)',
        marginTop: '0',
        marginBottom: '0',
        ':active': {
          ...styles[':active'],
          backgroundColor: isFocused || isSelected ? 'var(--grayscale-20)' : 'var(--grayscale-20)',
        },
        borderRadius: 8,
        background:
          isFocused  // 聚焦时的颜色
            ? 'var(--grayscale-40)' :
            isSelected
              ? 'var(--grayscale-15)' // 被选中的颜色
              : 'var(--grayscale-15)', // 默认颜色
      };
    },
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: 'var(--grayscale-90)',
    }),
    menuList: (base) => ({
      ...base,
      marginTop: '-6px',
      padding: '8px',
      background: 'var(--grayscale-15)',
      borderRadius: 8,
      "::-webkit-scrollbar": {
        width: "0px",
        height: "0px",
      }
    })
  }
}
