const commonStyle = (theme) => {
  const { largeAlpha } = theme.bp

  return {
    // width and height
    w_full: {
      width: '100% !important'
    },
    w_screen: {
      width: '100vw !important'
    },
    w_auto: {
      width: 'auto !important'
    },
    w_20: {
      width: '20% !important'
    },
    w_25: {
      width: '25% !important'
    },
    w_40: {
      width: '20% !important'
    },
    w_50: {
      width: '50% !important'
    },
    w_50_20: {
      width: 'calc(50% - 20px) !important'
    },
    w_80: {
      width: '80% !important'
    },
    h_full: {
      height: '100% !important'
    },
    h_screen: {
      height: '100vw !important'
    },
    h_auto: {
      height: 'auto !important'
    },
    h_30: {
      height: '30 !important'
    },
    minH_0: {
      minHeight: 0
    },
    maxH_56: {
      minHeight: 56
    },
    maxW_1200: {
      maxWidth: 1200
    },
    // col
    col_3: {
      width: 'auto',
      maxWidth: '25%',
      minWidth: 'calc((100% / 12) * 3)'
    },
    col_4: {
      width: 'auto',
      maxWidth: '33.3333%',
      minWidth: 'calc((100% / 12) * 4)'
    },
    col_6: {
      width: 'auto',
      maxWidth: '50%',
      minWidth: 'calc((100% / 12) * 6)'
    },
    'largeAlpha:col_6': {
      [theme.breakpoints.down(largeAlpha)]: {
        width: 'auto',
        maxWidth: '50%'
      }
    },
    'largeAlpha:col_12': {
      [theme.breakpoints.down(largeAlpha)]: {
        width: 'auto',
        maxWidth: '100%'
      }
    },
    // ctrl
    w_ctrl90: {
      width: 90,
      flex: '0 0 90px'
    },
    w_ctrl_left90: {
      width: 'auto',
      flex: '1 1 auto'
    },
    // display,
    d_flex: {
      display: 'flex !important'
    },
    d_inflex: {
      display: 'inline-flex !important'
    },
    d_block: {
      display: 'block !important'
    },
    d_inblock: {
      display: 'inline-block !important'
    },
    d_none: {
      display: 'none !important'
    },
    // flex
    flex_left: {
      marginRight: 'auto !important'
    },
    flex_right: {
      color: 'inherit !important'
    },
    flex_justify_start: {
      display: 'flex !important',
      justifyContent: 'flex-start !important'
    },
    flex_justify_between: {
      display: 'flex !important',
      justifyContent: 'between !important'
    },
    flex_justify_center: {
      display: 'flex !important',
      justifyContent: 'center !important'
    },
    flex_justify_end: {
      display: 'flex !important',
      justifyContent: 'flex-end !important'
    },
    flex_align_start: {
      display: 'flex !important',
      alignItems: 'start !important'
    },
    flex_align_center: {
      display: 'flex !important',
      alignItems: 'center !important'
    },
    flex_center: {
      display: 'flex !important',
      justifyContent: 'center !important',
      alignItems: 'center !important'
    },
    justify_start: {
      justifyContent: 'flex-start !important'
    },
    justify_end: {
      justifyContent: 'flex-end !important'
    },
    justify_around: {
      justifyContent: 'space-around !important'
    },
    justify_between: {
      justifyContent: 'space-between !important'
    },
    justify_center: {
      justifyContent: 'center !important'
    },
    alignItems: {
      alignItems: 'stretch !important'
    },
    alignItemsStart: {
      alignItems: 'flex-start !important'
    },
    alignItemsCenter: {
      alignItems: 'center !important'
    },
    alignItemsEnd: {
      alignItems: 'flex-end !important'
    },
    directionColumn: {
      flexDirection: 'column !important'
    },
    directionRow: {
      flexDirection: 'row !important'
    },
    flexDColumn: {
      display: 'flex !important',
      flexDirection: 'column !important'
    },
    flexDRow: {
      display: 'flex !important',
      flexDirection: 'row !important'
    },
    flex_wrap: {
      flexWrap: 'wrap !important'
    },
    flex_0_0_auto: {
      flex: '0 0 auto !important'
    },
    flex_1_1_auto: {
      flex: '1 1 auto !important'
    },
    flex_1_1_25: {
      flex: '1 1 25% !important'
    },
    flex_1_1_50: {
      flex: '1 1 50% !important'
    },
    flex_0_1_50: {
      flex: '0 1 50% !important'
    },
    flex_0_1_33: {
      flex: '0 1 33.333% !important'
    },
    flex_0_1_20: {
      flex: '0 1 20% !important'
    },
    flexGrow1: {
      flexGrow: 1
    },
    // position
    pos_rel: {
      position: 'relative !important'
    },
    pos_abs: {
      position: 'absolute !important'
    },
    pos_fix: {
      position: 'fixed !important'
    },
    // spacing
    m_0: {
      margin: '0 !important'
    },
    m_auto: {
      margin: 'auto !important'
    },
    my_0: {
      marginTop: '0 !important',
      marginBottom: '0 !important'
    },
    mx_0: {
      marginLeft: '0 !important',
      marginRight: '0 !important'
    },
    mt_0: {
      marginTop: '0 !important'
    },
    mt_6: {
      marginTop: '6 !important'
    },
    mt_8: {
      marginTop: '8px !important'
    },
    mt_9: {
      marginTop: '9px !important'
    },
    mt_10: {
      marginTop: '10px !important'
    },
    mt_12: {
      marginTop: '12px !important'
    },
    mt_16: {
      marginTop: '16px !important'
    },
    mt_20: {
      marginTop: '20px !important'
    },
    mt_24: {
      marginTop: '24px !important'
    },
    mt_30: {
      marginTop: '30px !important'
    },
    ml_10: {
      marginLeft: '10px !important'
    },
    ml_auto: {
      marginLeft: 'auto !important'
    },
    ml_20: {
      marginLeft: '20px !important'
    },
    mr_10: {
      marginRight: '10px !important'
    },
    mr_16: {
      marginRight: '16px !important'
    },
    mr_20: {
      marginRight: '20px !important'
    },
    mr_auto: {
      marginRight: 'auto !important'
    },
    mb_0: {
      marginBottom: '0 !important'
    },
    mb_6: {
      marginBottom: '6px !important'
    },
    mb_10: {
      marginBottom: '10px !important'
    },
    mb_12: {
      marginBottom: '12px !important'
    },
    mb_16: {
      marginBottom: '16px !important'
    },
    mb_20: {
      marginBottom: '20px !important'
    },
    mb_24: {
      marginBottom: '24px !important'
    },
    mb_30: {
      marginBottom: '30px !important'
    },
    mb_40: {
      marginBottom: '40px !important'
    },
    my_16: {
      margin: '16px 0'
    },
    p_0: {
      padding: '0 !important'
    },
    p_8: {
      padding: '8px !important'
    },
    p_12: {
      padding: '12px !important'
    },
    p_20: {
      padding: '20px !important'
    },
    pt_0: {
      paddingTop: '0 !important'
    },
    pt_16: {
      paddingTop: '16px !important'
    },
    pt_20: {
      paddingTop: '20px !important'
    },
    pb_0: {
      paddingBottom: '0 !important'
    },
    pb_10: {
      paddingBottom: '10px !important'
    },
    pb_16: {
      paddingBottom: '16px !important'
    },
    pb_20: {
      paddingBottom: '20px !important'
    },
    pb_24: {
      paddingBottom: '24px !important'
    },
    pl_0: {
      paddingLeft: '0px !important'
    },
    pl_2: {
      paddingLeft: '2px !important'
    },
    pl_4: {
      paddingLeft: '4px !important'
    },
    pl_8: {
      paddingLeft: '8px !important'
    },
    pl_10: {
      paddingLeft: '10px !important'
    },
    pl_16: {
      paddingLeft: '16px !important'
    },
    pl_20: {
      paddingLeft: '20px !important'
    },
    pl_30: {
      paddingLeft: '30px !important'
    },
    pr_0: {
      paddingRight: '0px !important'
    },
    pr_8: {
      paddingRight: '8px !important'
    },
    pr_10: {
      paddingRight: '10px !important'
    },
    pr_16: {
      paddingRight: '16px !important'
    },
    pr_18: {
      paddingRight: '18px !important'
    },
    pr_20: {
      paddingRight: '20px !important'
    },
    pr_24: {
      paddingRight: '24px !important'
    },
    py_5: {
      paddingTop: '5px !important',
      paddingBottom: '5px !important'
    },
    px_0: {
      paddingLeft: '0 !important',
      paddingRight: '0 !important'
    },
    px_8: {
      paddingLeft: '8px !important',
      paddingRight: '8px !important'
    },
    px_10: {
      paddingLeft: '10px !important',
      paddingRight: '10px !important'
    },
    px_20: {
      paddingLeft: '20px !important',
      paddingRight: '20px !important'
    },
    py_4: {
      paddingTop: '4px !important',
      paddingBottom: '4px !important'
    },
    py_10: {
      paddingTop: '10px !important',
      paddingBottom: '10px !important'
    },
    py_12: {
      paddingTop: '12px !important',
      paddingBottom: '12px !important'
    },
    py_18: {
      paddingTop: '18px !important',
      paddingBottom: '18px !important'
    },
    py_24: {
      paddingTop: '24px !important',
      paddingBottom: '24px !important'
    },
    // background-color
    bg_white: {
      backgroundColor: theme.palette.customColor.white
    },
    bg_white_imp: {
      backgroundColor: `${theme.palette.customColor.white} !important`
    },
    bg_red: {
      backgroundColor: theme.palette.customColor.red
    },
    bg_red_imp: {
      backgroundColor: `${theme.palette.customColor.red} !important`
    },
    // border
    border: {
      border: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
    },
    borderBottom: {
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
    },
    border_TL_Radius_0: {
      borderTopLeftRadius: '0px !important'
    },
    border_TR_Radius_0: {
      borderTopRightRadius: '0px !important'
    },
    border_BL_Radius_0: {
      borderBottomLeftRadius: '0px !important'
    },
    border_BR_Radius_0: {
      borderBottomRightRadius: '0px !important'
    },
    borderRadius_4: {
      borderRadius: '4px !important'
    },
    border_none: {
      border: 'none !important'
    },
    // color
    black_100: {
      color: theme.palette.customColor.black
    },
    black_87: {
      color: 'rgba(0, 0, 0, 0.87)'
    },
    black_60: {
      color: 'rgba(0, 0, 0, 0.6)'
    },
    textRed: {
      color: theme.palette.customColor.red
    },
    textYellow: {
      color: 'yellow'
    },
    textOrange: {
      color: 'orange'
    },
    textGreen: {
      color: 'green'
    },
    textBlue: {
      color: 'blue'
    },
    textAqua: {
      color: 'aqua'
    },
    textPurple: {
      color: 'purple'
    },
    // utilities
    scrollable_y: {
      height: '100%',
      overflowY: 'auto'
    },
    cursorPointer: {
      cursor: 'pointer'
    },
    opacity_0: {
      opacity: 0
    },
    overflowHidden: {
      overflow: 'hidden'
    },
    overflowAuto: {
      overflow: 'auto'
    },
    whiteSpacePre: {
      whiteSpace: 'pre'
    },
    // font
    fz_12: {
      fontSize: 12
    },
    fz_14: {
      fontSize: 14
    },
    fz_16: {
      fontSize: 16
    },
    fz_18: {
      fontSize: 18
    },
    fw_normal: {
      fontWeight: 'normal'
    },
    fw_bold: {
      fontWeight: 'bold'
    },
    // Icons
    viewBtn: {
      width: 36,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 10,
      cursor: 'pointer'
    },
    viewIcon: {
      fontSize: 16,
      color: theme.palette.customColor.themePrimary
    },
    iconButton: {
      padding: 0,
      fontSize: 18,
      cursor: 'pointer'
    },
    toolTipIcon: {
      fontSize: 14,
      color: theme.palette.customColor.themePrimary
    },
    // components
    pageContainer: {
      position: 'relative',
      padding: '0 20px 20px'
    },
    rowRadioGroup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    rowRadioGroupLabel: {
      color: theme.palette.text.black,
      fontSize: 14,
      marginRight: 25
    },
    radioRoot: {
      '& .MuiSvgIcon-root': {
      // 可以調整寬高
        height: 20,
        width: 20
      }
    },
    checkboxRoot: {
      '& .MuiSvgIcon-root': {
      // 可以調整寬高
        height: 20,
        width: 20
      }
    },
    defaultInput: {
      maxWidth: 200,
      minWidth: 150,
      maxHeight: 40,
      '& .MuiOutlinedInput-root': {
        height: 40
      }
    },
    unlimitWidthInput: {
      maxHeight: 40,
      '& .MuiOutlinedInput-root': {
        height: 40
      },

      '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px) scale(1)'
      },

      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)'
      }
    },
    unlimitWidthSelect: {
      maxHeight: 40,
      height: 40,

      '& .MuiSelect-outlined': {
        padding: '12px 14px',
        paddingRight: 32
      },

      '& .MuiSelect-icon': {
        top: 'calc(50% - 8px)'
      },

      '& .MuiFormLabel-root': {
        transform: 'translate(14px, 14px) scale(1)'
      },

      '& .MuiFormLabel-root.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)'
      }
    },
    ctrlBarDatePicker: {
      width: 200,
      backgroundColor: theme.palette.customColor.trans
    },
    tabs: {
      '& .MuiTab-wrapper': {
        fontSize: '14px'
      }
    },
    defaultTextField: {
      '& .MuiFormHelperText-root': {
        fontSize: '14px'
      }
    }
  }
};

export default commonStyle;