const scheduleStyles = (theme) => {
  const { laptop } = theme.bp

  return {
    pageContainerSchedule: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    filterGroup: {
    // height: 'calc(100vh - 140px)'
      height: 'auto'
    },
    root: {
      backgroundColor: theme.palette.customColor.trans,
      display: 'block',
      overflow: 'hidden'
    },
    calendarContainer: {
      width: '100%',
      flex: '1'
    },
    refreshBtn: {
      marginRight: 10
    },
    filterGroupPriamry: {
      flex: '1 1 auto'
    },
    calendarSection: {
      width: '100%',
      height: '100%',
      marginTop: 20,
      backgroundColor: theme.palette.customColor.white,
      overflowY: 'auto',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,

      '& .fc-media-screen': {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
      },
      '& .fc-header-toolbar': {
        padding: 20,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
      }
    },
    // CreateSchedule
    scheduleContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    scheduleForm: {
      flexGrow: 1,
      overflow: 'auto',
      padding: 20,
      paddingBottom: 0,
      height: 'calc(100% - 72px)'
    },
    stepCtrlPanel: {
      width: '100%',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.palette.customColor.white
    },
    scheduleTitle: {
      width: '100%',
      fontSize: 24,
      color: theme.palette.customColor.black_87
    },
    stepSection: {
      backgroundColor: theme.palette.customColor.white,
      borderRadius: 4,
      height: 'calc(100% - 74px)'
    },
    stepper: {
      width: '100%',
      borderRadius: 4
    },
    stepperClass: {
      padding: '40px 20px 20px 20px'
    },
    stepContent: {
      padding: '20px',
      overflowY: 'auto',
      borderRadius: 4,
      height: 'calc(100% - 131px)'
    },
    helperTextClasses: {
      margin: 4,
      color: 'red'
    },
    stepsContainer: {
      marginTop: 10,
      marginBottom: 10
    },
    taskRoleOutline: {
      border: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      borderRadius: 4,

      '& .MuiTabs-root': {
        backgroundColor: '#FAF9F8'
      },

      '& .MuiButtonBase-root.MuiTabScrollButton-root.MuiTabs-scrollButtons.Mui-disabled': {
        display: 'none'
      }
    },
    activeTab: {
      color: theme.palette.primary.main
    },
    tabBorder: {
      borderRight: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
    },
    addTabIcon: {
      marginLeft: 10,
      '& .material-icons.MuiIcon-root': {
        fontSize: 18,
        color: theme.palette.primary.main
      }
    },
    mb_72: {
      paddingBottom: 72
    },
    iconUnit: {
      width: 48,
      height: 48,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    stepRow: {
      display: 'flex'
    },
    stepRowAverage: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    stepWidth_30: {
      width: '30%'
    },
    stepWidth_50: {
      width: '50%'
    },
    stepBottomBorder: {
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
    },
    stepRight: {
      flexGrow: 1
    },
    stepRightBlock: {
      width: '100%',
      marginTop: 35,
      paddingLeft: 15,
      whiteSpace: 'nowrap'
    },
    dummyCtrlBar: {
      width: '100%',
      position: 'absoulute',
      left: 0,
      bottom: 0,
      padding: 20,
      backgroundColor: theme.palette.customColor.white,
      display: 'none'
    },
    mdSelect: {
      width: 200
    },
    step2Container: {
      border: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      padding: 20,
      minHeight: '100%',
      margin: 0,
      borderRadius: 4
    },
    step2TbodySet: {
      height: 300,
      overflowY: 'auto'
    },
    canUseVgListContainer: {
      width: '100%'
    },
    infoIconPosition: {
      top: 0,
      left: 7,
      zIndex: 10
    },
    col_6_20: {
      width: 'auto',
      maxWidth: 'calc(50% + 20px)',
      minWidth: 'calc((100% / 12) * 6 + 20px)'
    },
    // 表格排版
    iconButton: {
      padding: 0,
      marginLeft: 10,
      cursor: 'pointer',
      fontSize: 18
    },
    formLabel: {
      marginBottom: 0,
      fontSize: 14,
      paddingRight: 0
    },
    formControl: {
      '& > div': {
        height: 40
      },
      '& .MuiSvgIcon-root' : {
        top: '30%'
      }
    },
    toolbar: {
      backgroundColor: theme.palette.customColor.white
    },
    iconLabelWrapper: {
      flexDirection: 'row-reverse',
      // 防止 Tab 的內容轉大寫(Matrial-UI 預設大寫)
      textTransform: 'none',
      fontSize: 14,
      backgroundColor: theme.palette.customColor.white
    },
    icon: {
      fontSize: 18
    },
    contentContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    },
    flexInputTotal: {
      width: 'calc(100% / 12 * 7)',
      maxWidth: 'calc(100% / 12 * 7)',
      flex: '1 1 calc(100% / 12 * 7)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 10)',
        maxWidth: 'calc(100% / 12 * 10)',
        flex: '1 1 calc(100% / 12 * 10)'
      }
    },
    'width_6/7': {
      width: 'calc(100% / 7 * 6)',
      maxWidth: 'calc(100% / 7 * 6)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 8)',
        maxWidth: 'calc(100% / 12 * 8)'
      }
    },
    'width_1/7': {
      width: 'calc(100% / 7)',
      maxWidth: 'calc(100% / 7)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 2)',
        maxWidth: 'calc(100% / 12 * 2)'
      }
    },
    flexBothInput: {
      width: 'calc(100% / 7 * 6)',
      maxWidth: 'calc(100% / 7 * 6)',
      flex: '1 1 calc(100% / 7 * 6)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 8)',
        maxWidth: 'calc(100% / 12 * 8)',
        flex: '1 1 calc(100% / 12 * 8)'
      }
    },
    flexFrontInput: {
      width: 'calc(100% / 7 * 3)',
      maxWidth: 'calc(100% / 7 * 3)',
      flex: '1 1 calc(100% / 7 * 3)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 4)',
        maxWidth: 'calc(100% / 12 * 4)',
        flex: '1 1 calc(100% / 12 * 4)'
      }
    },
    flexBackInput: {
      width: 'calc(100% / 7 * 3)',
      maxWidth: 'calc(100% / 7 * 3)',
      flex: '1 1 calc(100% / 7 * 3)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 4)',
        maxWidth: 'calc(100% / 12 * 4)',
        flex: '1 1 calc(100% / 12 * 4)'
      }
    },
    flexEndSection: {
      width: 'calc(100% / 12 * 1)',
      maxWidth: 'calc(100% / 12 * 1)',
      flex: '1 1 calc(100% / 12 * 1)',
      [theme.breakpoints.down(laptop)]: {
        width: 'calc(100% / 12 * 2)',
        maxWidth: 'calc(100% / 12 * 2)',
        flex: '1 1 calc(100% / 12 * 2)'
      }
    },
    switchBox: {
      position: 'absolute',
      left: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      width: 100
    },
    // Step 4
    step4Title: {
      fontSize: 16,
      color: theme.palette.customColor.black_87,
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
    },
    // Step 5
    step5Container: {
      height: '480px',
      marginTop: '10px',
      marginBottom: '10px',
      padding: '0 20px 20px'
    },
    // Event
    eventModalContainer: {
      width: 400,
      maxWidth: 400
    },
    eventRow: {
      display: 'flex',
      marginTop: 10
    },
    eventDescription: {
      flex: '1 1 auto',
      paddingLeft: 12
    },
    eventTitle: {
      whiteSpace: 'nowrap',
      width: 70,
      flex: '0 0 70px',
      marginRight: 20,
      textAlign: 'right',
      color: 'rgba(0, 0, 0, 0.6)'
    },
    eventTitleState: {
      display: 'inline-block',
      padding: '4px 8px',
      fontSize: 12
    },
    eventBoldText: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    'state--denied': {
      backgroundColor: theme.palette.customColor.states.denied
    },
    'state--verifying': {
      backgroundColor: theme.palette.customColor.states.verifying
    },
    'state--verified': {
      backgroundColor: theme.palette.customColor.states.verified
    },
    'info--red': {
      color: theme.palette.customColor.infos.red
    },
    'info--green': {
      color: theme.palette.customColor.infos.green
    },
    'info--state': {
      color: theme.palette.customColor.infos.state
    },
    denyBtn: {
      backgroundColor: theme.palette.customColor.denyColor.normal,
      borderColor: theme.palette.customColor.denyColor.normal,
      color: theme.palette.customColor.white,

      '&:hover': {
        backgroundColor: theme.palette.customColor.denyColor.hover,
        borderColor: theme.palette.customColor.denyColor.hover
      }
    },
    searchPeriodModalContainer: {
      maxWidth: '960px !important',
      width: '100%',
      height: 'calc(100vh - 64px)'
    },
    searchPeriodModalBody: {
      height: 'calc(100% - 128px)'
    },
    availablePeriodContainer: {
      height: 'calc(100% - 32px)',
      border: `1px solid ${theme.palette.customColor.borderLineColor}`,
      borderRadius: 4
    },
    searchPeriodTbody: {
      height: 'calc(100% - 100px)',
      overflowY: 'auto'
    },
    filterBarContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      margin: '16px 0'
    },
    filterInputWidthCtrl: {
      maxWidth: 200,
      flexGrow: 1,
      width: '20%'
    },
    filterRemainNumberContainer: {
      width: 20
    },
    filterSubmitBtnContainer: {
      maxWidth: 80,
      flexGrow: 1
    }
  }
}

export default scheduleStyles;