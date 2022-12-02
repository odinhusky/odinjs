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
    w_30: {
      width: '30% !important'
    },
    w_40: {
      width: '40% !important'
    },
    w_50: {
      width: '50% !important'
    },
    w_50_5: {
      width: 'calc(50% - 5px) !important'
    },
    w_50_10: {
      width: 'calc(50% - 10px) !important'
    },
    w_50_20: {
      width: 'calc(50% - 20px) !important'
    },
    w_65: {
      width: '65%'
    },
    w_75: {
      width: '75% !important'
    },
    w_80: {
      width: '80% !important'
    },
    w_650px: {
      width: '650px !important'
    },
    w_800px: {
      width: '800px !important'
    },
    h_full: {
      height: '100% !important'
    },
    h_40px: {
      height: '40px !important'
    },
    h_screen: {
      height: '100vw !important'
    },
    h_auto: {
      height: 'auto !important'
    },
    h_30: {
      height: '30px !important'
    },
    h_36: {
      height: '36px !important'
    },
    h_72px: {
      height: '72px !important'
    },
    h_300: {
      height: '300px !important'
    },
    h_500px: {
      height: '500px !important'
    },
    h_700px: {
      height: '700px !important'
    },
    minH_0: {
      minHeight: 0
    },
    minW_init: {
      minWidth: 'initial'
    },
    minW_80px: {
      minWidth: 80
    },
    maxH_56px: {
      maxHeight: 56
    },
    maxH_90px: {
      maxHeight: 90
    },
    maxW_100px: {
      maxWidth: 100
    },
    maxW_300px: {
      maxWidth: 300
    },
    maxW_200px: {
      maxWidth: 200
    },
    maxW_600px: {
      maxWidth: 600
    },
    maxW_1200px: {
      maxWidth: 1200
    },
    maxW_100: {
      maxWidth: '100% !important'
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
      justifyContent: 'space-between !important'
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
    alignItemsStretch: {
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
    flex_nowrap: {
      flexWrap: 'nowrap !important'
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
    left_0: {
      left: 0
    },
    bottom_minus_20: {
      bottom: '-20px'
    },
    bottom_minus_30: {
      bottom: '-30px'
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
    mt_auto: {
      marginTop: 'auto !important'
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
    ml_0: {
      marginLeft: '0px !important'
    },
    ml_6: {
      marginLeft: '6px !important'
    },
    ml_10: {
      marginLeft: '10px !important'
    },
    ml_16: {
      marginLeft: '16px !important'
    },
    ml_auto: {
      marginLeft: 'auto !important'
    },
    ml_20: {
      marginLeft: '20px !important'
    },
    mr_5: {
      marginRight: '5px !important'
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
    mx_20: {
      margin: '0 20px'
    },
    p_0: {
      padding: '0 !important'
    },
    p_4: {
      padding: '4 !important'
    },
    p_8: {
      padding: '8px !important'
    },
    p_9: {
      padding: '9px !important'
    },
    p_12: {
      padding: '12px !important'
    },
    p_15: {
      padding: '15px !important'
    },
    p_20: {
      padding: '20px !important'
    },
    pt_0: {
      paddingTop: '0 !important'
    },
    pt_12: {
      paddingTop: '12px !important'
    },
    pt_15: {
      paddingTop: '15px !important'
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
    pb_6: {
      paddingBottom: '6 !important'
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
    pb_30: {
      paddingBottom: '30px !important'
    },
    pb_40: {
      paddingBottom: '40px !important'
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
    py_4: {
      paddingTop: '4px !important',
      paddingBottom: '4px !important'
    },
    py_5: {
      paddingTop: '5px !important',
      paddingBottom: '5px !important'
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
    py_20: {
      paddingTop: '20px !important',
      paddingBottom: '20px !important'
    },
    py_24: {
      paddingTop: '24px !important',
      paddingBottom: '24px !important'
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
    px_15: {
      paddingLeft: '15px !important',
      paddingRight: '15px !important'
    },
    px_20: {
      paddingLeft: '20px !important',
      paddingRight: '20px !important'
    },
    // background-color
    bg_primary: {
      backgroundColor: theme.palette.customColor.themePrimary
    },
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
    bg_selected: {
      backgroundColor: theme.palette.customColor.themePrimaryLightBg
    },
    // border
    border: {
      border: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
    },
    border_type2: {
      border: `1px solid ${theme.palette.customColor.borderLineColor}`
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
    textWhite: {
      color: 'white'
    },
    textPrimary: {
      color: theme.palette.customColor.themePrimary
    },
    textTempHint: {
      color: theme.palette.customColor.themeTemplateHint
    },
    textWaiting: {
      color: '#ED6C02'
    },
    text_center: {
      textAlign: 'center'
    },
    text_right: {
      textAlign: 'right'
    },
    text_transform_none: {
      textTransform: 'none'
    },
    // utilities
    boxSizing_initial: {
      boxSizing: 'initial'
    },
    scrollable_y: {
      height: '100%',
      overflowY: 'auto'
    },
    cursorPointer: {
      cursor: 'pointer'
    },
    cursorHelp: {
      cursor: 'help'
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
    whiteSpacePreLine: {
      whiteSpace: 'pre-line'
    },
    guideShow: {
      position: 'relative !important',
      zIndex: 1103,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%'
      }
    },
    guideShowZIndex: {
      zIndex: 1103,
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1104,
        width: '100%',
        height: '100%'
      }
    },
    whiteSpaceNowrap: {
      whiteSpace: 'nowrap'
    },
    break_word: {
      wordBreak: 'break-word'
    },
    break_all: {
      wordBreak: 'break-all'
    },
    textOverflowEllipsis: {
      textOverflow: 'ellipsis'
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
    fz_24: {
      fontSize: 24
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
    // Animation keyframe
    '@keyframes bounce': {
      'from': {
        animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        transform: 'translate3d(0, 0, 0)'
      },
      '20%': {
        animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        transform: 'translate3d(0, 0, 0)'
      },
      '53%': {
        animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        transform: 'translate3d(0, 0, 0)'
      },
      'to': {
        animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        transform: 'translate3d(0, 0, 0)'
      },

      '40%':{
        animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        transform: 'translate3d(0, -15px, 0) scaleY(1.1)'
      },
      '43%': {
        animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        transform: 'translate3d(0, -15px, 0) scaleY(1.1)'
      },

      '70%': {
        animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        transform: 'translate3d(0, -7.5px, 0) scaleY(1.05)'
      },

      '80%': {
        animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        transform: 'translate3d(0, 0, 0) scaleY(0.95)'
      },

      '90%': {
        transform: 'translate3d(0, -4px, 0) scaleY(1.02)'
      }
    },
    bouncing: {
      animation: `$bounce 1500ms ${theme.transitions.easing.easeInOut} 200ms infinite`
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
      // maxHeight: 40,
      '& .MuiOutlinedInput-root': {
        height: 40
      }
    },
    unlimitWidthInput: {
      // maxHeight: 40,
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
      // maxHeight: 40,
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
    },
    passwordStyle: {
      width: '100%',
      '& legend': {
        border: 'none'
      }
    },
    passwordInput: {
      '& #outlined-adornment-password': {
        boxSizing: 'initial'
      },
      '& #outlined-adornment-confirmPassword': {
        boxSizing: 'initial'
      }
    },
    tooltipBgColor: {
      backgroundColor: `${theme.palette.customColor.others.resourceManageSubsourceGroupTooltipBgColor}`
    },
    resourceModalContainer: {
      flexDirection: 'column',
      border: `1px solid ${theme.palette.customColor.borderLineColor}`,
      flexWrap: 'nowrap',
      height: '100%',
      borderRadius: 4,
      overflow: 'auto'
    },
    errorText: {
      position: 'relative',
      '& .MuiFormHelperText-root': {
        color: 'red !important',
        position: 'absolute',
        bottom: -24,
        left: 0,
        zIndex: 5
      }
    },
    userSettingModalBox: {
      height: 200,
      width: '100%',
      border: `1px solid ${theme.palette.customColor.themeDisablePrimaryBackground}`,
      borderRadius: 4,
      overflow: 'auto'
    },
    userSettingModalRows: {
      padding: '10px 20px'
    },
    userSettingModalRow: {
      marginBottom: 10,
      '& > div:first-child': {
        marginBottom: 10
      }
    },
    // - PreviewModal 相關的樣式
    step5PreviewModalBox: {
      width: 580,
      display: 'flex',
      paddingBottom: 20
    },
    step5PreviewModalContainer: {
      float: 'left',
      width: 330
    },
    step5PreviewModalCell: {
      float: 'left'
    },
    step5PreviewModalSmall: {
      width: 120,
      marginLeft: 10,
      marginBottom: 10
    },
    step5PreviewModalNormal: {
      border: '1px solid',
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      '& p': {
        margin: 0,
        '& b': {
          fontSize: 16
        }
      },
      '& i': {
        fontSize: 26
      }
    },
    step5PreviewModalGPU: {
      width: '100%',
      marginTop: 10
    },
    step5PreviewModalNFSBorderColor: {
      borderColor: theme.palette.customColor.step5PreviewModalNFSBorderColor
    },
    step5PreviewModalGlusterFSBorderColor: {
      borderColor: theme.palette.customColor.step5PreviewModalGlusterFSBorderColor
    },
    step5PreviewModalRDMABorderColor: {
      borderColor: theme.palette.customColor.step5PreviewModalRDMABorderColor
    },
    step5PreviewModalWithoutRDMABorderColor: {
      borderColor: theme.palette.customColor.step5PreviewModalWithoutRDMABorderColor
    },
    step5PreviewModalRDMAColor: {
      borderColor: theme.palette.customColor.step5PreviewModalRDMABorderColor
    },
    step5PreviewModalWithoutRDMAColor: {
      borderColor: theme.palette.customColor.step5PreviewModalWithoutRDMABorderColor
    },
    // - PreviewModal 相關的樣式 End
    // - EditNFSUserModal 相關的樣式 Start
    detailPageCreateModalAddUserBar: {
      display: 'flex',
      alignItems: 'center',
      '& > .MuiFormControl-root': {
        flex: 2,
        marginRight: '16px !important',
        maxWidth: '400px !important'
      }
    },
    detailPageCreateModalUserBox: {
      marginTop: 20,
      marginBottom: 20,
      border: `1px solid ${theme.palette.customColor.black_87}`,
      height: 200,
      overflow: 'auto'
    },
    detailPageCreateModalUserBoxItem: {
      padding: 16,
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    detailPageCreateModalName: {
      width: 100,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
  // - EditNFSUserModal 相關的樣式 End
};

export default commonStyle;