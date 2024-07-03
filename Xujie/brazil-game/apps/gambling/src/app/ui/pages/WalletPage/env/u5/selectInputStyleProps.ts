import { StylesConfig } from "react-select";

export const selectInputStyleProps = (isMobile: boolean): StylesConfig => {

  return {
    control: (baseStyle: any, states: any) => {
      return {
        ...baseStyle,
        background: 'var(--grayscale-30)',
        color: 'var(--grayscale-60)',
        padding: '8px 10px',
        borderRadius: '8px',
        outline: 'none',
        boxShadow: 'none',
        // border: 'solid 1px #808080',
        backgroundClip: isMobile
          ? 'padding-box,border-box'
          : '',
        backgroundOrigin: isMobile
          ? 'padding-box,border-box'
          : '',
        '&:hover': {
          // borderColor: 'none',
          border: 'solid 2px var(--state-warn-main)',
        },

        border: states.isFocused ? 'solid 2px var(--state-warn-main)' : 'solid 1px var(--grayscale-40)',


      };
    },
    valueContainer: (style: any, state: any) => ({
      ...style,
      color: 'var(--grayscale-60)',
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
        color: isFocused || isSelected ? '#fff' : '#B3B3B3',
        marginTop: '-5px',
        marginBottom: '-5px',
        ':active': {
          ...styles[':active'],
          backgroundColor: isFocused || isSelected ? 'var(--grayscale-20)' : 'var(--grayscale-20)',
        },
        background:
          isFocused && !isMobile // 聚焦时的颜色
            ? 'var(--grayscale-40)' :
            isSelected
              ? 'var(--grayscale-20)' // 被选中的颜色
              : 'var(--grayscale-30)', // 默认颜色
      };
    },
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: 'var(--grayscale-60)',
    }),
    menuList: (base) => ({
      ...base,
      "::-webkit-scrollbar": {
        width: "0px",
        height: "0px",
      }
    })
  }
}
