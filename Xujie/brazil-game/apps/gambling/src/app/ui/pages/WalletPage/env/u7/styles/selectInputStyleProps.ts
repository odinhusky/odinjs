import { StylesConfig } from "react-select";

export const selectInputStyleProps = (isMobile?: boolean, menuIsOpen?:boolean): StylesConfig => {

  return {
    control: (baseStyle: any, states: any) => {
      return {
        ...baseStyle,
        cursor: 'pointer',
        background: 'var(--linear-4-main)',
        color: 'var(--grayscale-70)',
        padding: '8px 10px',
        borderRadius: '100px',
        outline: 'none',
        boxShadow: 'none',
        border: 'none',
        backgroundClip: 'padding-box,border-box',
        backgroundOrigin: 'padding-box,border-box',
        height:'100%',
        '&:hover': {
          background: 'var(--linear-4-light-hover)',
          // border: 'solid 1.5px var(--grayscale-80)',
        },

        // border: states.isFocused ? 'solid 1.5px var(--grayscale-80)' : 'solid 1.5px var(--grayscale-50)',
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
        color: isFocused || isSelected ? 'var(--grayscale-100)' : 'var(--grayscale-80)',
        marginTop: '0',
        marginBottom: '0',
        ':active': {
          ...styles[':active'],
          backgroundColor: isFocused || isSelected ? 'var(--transparent-white-10)' : 'none',
        },
        borderRadius: 0,
        background:
          isFocused  // 聚焦时的颜色
            ? 'var(--transparent-white-10)' :
            isSelected
              ? 'var(--grayscale-15)' // 被选中的颜色
              : 'var(--grayscale-15)', // 默认颜色
      };
    },
    singleValue: (provided: any, state: any) => {      
      return{
      ...provided,
      color: menuIsOpen ?'var(--grayscale-100)' : 'var(--grayscale-70)',
      '&:hover': {
        color: 'var(--grayscale-100)'
      }
    }},
    menuList: (base) => ({
      ...base,
      marginTop: '-6px',
      padding: '0px',
      background: 'var(--linear-4-main)',
      borderRadius: 8,
      border: '1.5px solid var(--grayscale-40)',
      "::-webkit-scrollbar": {
        width: "0px",
        height: "0px",
      }
    }),
    indicatorsContainer:(base)=>({
      ...base,
      opacity: menuIsOpen ? '1' : '0.7',
      transform:menuIsOpen ? 'rotate(180deg)':'rotate(0deg)'
    })
  }
}
