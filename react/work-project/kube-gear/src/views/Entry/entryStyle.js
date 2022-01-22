const entryStyle = (theme) => {
  // 取出斷點
  const { laptop } = theme.bp;

  return {
    rootContent: {
      flexGrow: 1,
      backgroundColor: theme.palette.customColor.others.themeContentBgColor,
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 50px)',
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    statusContent: {
      width: '100%',
      flex: '0 0 auto',
      [theme.breakpoints.down(laptop)]: {
        overflowX: 'auto'
      }
    },
    statusBar: {
      width: '100%',
      backgroundColor: theme.palette.customColor.white,
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down(laptop)]: {
        minWidth: laptop
      }
    },
    welcomSection: {
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 auto'
    },
    statusBarLogo: {
      width: 72,
      height: 72,
      marginRight: 20,
      flex: '0 0 72px'
    },
    statusBarLogoImg: {
      width: '100%',
      height: '100%'
    },
    detailBox: {
      flex: '1 1 auto'
    },
    welcomText: {
      fontSize: 20,
      fontWeight: '500',
      marginBottom: 20
    },
    detailLine: {
      display: 'flex',
      alignItems: 'center'
    },
    personalMsg: {
      fontSize: 14,
      marginRight: 28,
      display: 'block',
      width: 60,
      flex: '0 0 60px',
      cursor: 'pointer'
    },
    categorySystemName: {
      fontSize: 14,
      color: theme.palette.black_60,
      width: 'calc(100% - 80px)',
      flex: '1 1 calc(100% - 80px)'
    },
    statusSection: {
      display: 'flex',
      alignItems: 'center',
      flex: '0 0 auto'
    },
    statusUnit: {
      padding: '0 20px',
      borderRight: `1px solid ${theme.palette.customColor.borderLineColor}`,
      '&:last-child': {
        borderRight: 'none'
      }
    },
    statusUnitItemName: {
      fontSize: 16,
      marginBottom: 16,
      color: theme.palette.customColor.black_60
    },
    statusUnitItemValue: {
      fontSize: 24,
      color: theme.palette.customColor.black_87,
      textAlign: 'center'
    },
    entryContent: {
      width: '100%',
      height: 'calc(100vh - 113px)',
      display: 'flex',
      justifyContent: 'center',
      padding: 20,
      [theme.breakpoints.down(laptop)]: {
        height: 'auto',
        flexWrap: 'wrap'
      }
    },
    entryContentLeft: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: 20,
      flex: '1 1 57.6%',
      width: '57.6%',
      [theme.breakpoints.down(laptop)]: {
        width: '100%',
        flex: '1 1 100%',
        marginRight: 0,
        marginBottom: 20
      }
    },
    entryContentRight: {
      flex: '1 1 40.68%',
      width: '40.68%',
      [theme.breakpoints.down(laptop)]: {
        width: '100%',
        flex: '1 1 100%'
      }
    },
    leftLayer1: {
      flex: '1 1 30%',
      marginBottom: 20
    },
    leftLayer2: {
      flex: '1 1 70%'
    },
    weeklyUtilRateContainer: {
      flex: '1 1 70.62%',
      marginRight: 20,
      height: '100%'
    },
    onlineNumContainer: {
      flex: '1 1 29.38%',
      height: '100%'
    },
    iconWrapper: {
      textAlign: 'center'
    },
    baseSimpleCardHeaderText: {
      fontSize: 34,
      color: theme.palette.black_87,
      textAlign: 'center'
    },
    baseSimpleCardHeaderSubText: {
      fontSize: 14,
      color: theme.palette.black_60,
      textAlign: 'center'
    },
    jobStatusContainer: {
      width: '42.5%',
      flex: '1 1 42.5%',
      marginRight: 20,
      height: 'calc(100vh - 432px)'
    },
    jobCardContent: {
      padding: 0,
      height: 'calc(100vh - 490px)',
      overflowY: 'auto'
    },
    jobStatusContent: {
      height: '100%'
    },
    jobStatusLine: {
      width: '100%',
      display: 'flex',
      padding: 10,
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`,
      maxHeight: 40
    },
    jobStatusLineClickable: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.customColor.others.clickableLineBg
      }
    },
    jobStatusLineName: {
      flex: '1 1 auto',
      marginRight: 'auto',
      display: 'flex',
      alignItems: 'center'
    },
    jobStatusLineIcon: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 5
    },
    jobStatusLineText: {
      fontSize: 14,
      color: theme.palette.customColor.black_87
    },
    jobStatusLineValue: {
      flex: '0 0 auto',
      fontSize: 14,
      color: theme.palette.customColor.black_87
    },
    jobStatusPieContainer: {
      height: 'calc(100% - 160px)'
    },
    weeklyUtilHourContainer: {
      width: '57.8%',
      flex: '1 1 57.8%',
      height: 'calc(100vh - 432px)'
    },
    weeklyUtilHourContent: {
      height: 'calc(100vh - 490px)',
      overflowY: 'auto'
    },
    weeklyUtilHourLine: {
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`,
      maxHeight: 56
    },
    weeklyUtilHourLineUser: {
      flex: '1 1 auto',
      marginRight: 'auto'
    },
    weeklyUtilHourLineUserTitle: {
      width: 'calc(100% - 128px)',
      padding: '8px 0'
    },
    weeklyUtilHourLineBadge: {
      flex: '1 1 128px'
    },
    clusterStatusContent: {
      height: 'calc(100vh - 298px)',
      width: '100%',
      overflowY: 'auto'
    },
    clusterStatusChart: {
      width: '100%'
    },
    clusterStatusChartTitle: {
      color: theme.palette.customColor.black_87,
      fontSize: 14
    },
    clusterStatusTable: {
      width: '100%'
    },
    clusterStatusLine: {
      display: 'flex',
      alignItems: 'center',
      padding: 16,
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
    },
    clusterStatusLineName: {
      flex: '0 1 160px',
      marginRight: 16
    },
    clusterStatusLineNameSecondary: {
      flex: '0 1 80px',
      marginRight: 16
    },
    clusterStatusLineDetail: {
      flex: '1 1 auto'
    },
    clusterStatusLineDetailFixing: {
      margin: '-8px 0'
    },
    relatedGroupName: {
      display: 'flex',
      width: '100%',
      maxWidth: '438px',
      overflow: 'hidden'
    },
    relatedGroupTitle: {
      width: '65px',
      flex: '0 0 65px',
      marginRight: 15
    },
    relatedGroupString: {
      width: 'calc(100% - 190px)',
      flex: '1 1 calc(100% - 190px)',
      overflow: 'hidden', //超出的文本隐藏
      textOverflow: 'ellipsis', //溢出用省略号显示
      whiteSpace: 'nowrap' //溢出不换行
    },
    // # GeneralPanels
    entryContentGeneral: {
      width: '100%',
      height: 'calc(100vh - 113px)',
      display: 'flex',
      justifyContent: 'center',
      padding: 20,
      [theme.breakpoints.down('md')]: {
        height: 'auto',
        flexWrap: 'wrap'
      }
    },
    entryContentGeneralLeft: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: 20,
      flex: '1 1 59%',
      width: '59%',
      [theme.breakpoints.down('md')]: {
        flex: '1 1 100%',
        width: '100%',
        marginRight: 0,
        marginBottom: 20,
        display: 'block'
      }
    },
    entryContentGeneralRight: {
      flex: '1 1 28%',
      width: '28%',
      [theme.breakpoints.down('md')]: {
        flex: '1 1 100%',
        width: '100%'
      }
    },
    generalCtrlLayer1: {
      [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
        flex: '1 1 auto'
      }
    },
    generalCtrlLayer2: {
      flex: '1 1 auto'
    },
    runningJobsContainer: {
      flex: '1 1 75%',
      marginRight: 20,
      height: '100%',
      maxHeight: 284,
      [theme.breakpoints.down('md')]: {
        flex: '1 1 100%',
        width: '100%',
        marginRight: 0
      }
    },
    runningCardContent: {
      height: 'calc(100% - 58px)',
      [theme.breakpoints.down(laptop)]: {
        height: 'auto'
      }
    },
    runningJobsContent: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      height: '100%'
    },
    runnungItem: {
      border: `1px solid ${theme.palette.customColor.borderLineColor}`,
      padding: 16,
      width: 'calc(33.33333% - 16px)',
      flex: '0 0 calc(33.333333% - 16px)',
      height: 'calc(50% - 16px)',
      margin: 8,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      cursor: 'pointer',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: theme.palette.customColor.themePrimaryLightBg
      }
    },
    runningTitle: {
      width: '85%',
      margin: '0 0 6px 0',
      overflow: 'hidden', //超出的文本隐藏
      textOverflow: 'ellipsis', //溢出用省略号显示
      whiteSpace: 'nowrap' //溢出不换行
    },
    runningLanuchTime: {
      color: theme.palette.customColor.black_60,
      fontSize: 12
    },
    uploadFilesContainer: {
      flex: '1 1 25%',
      height: '100%',
      maxHeight: 284,
      [theme.breakpoints.down('md')]: {
        flex: '1 1 100%',
        width: '100%',
        maxHeight: 'initial',
        marginTop: 20
      }
    },
    uploadFilesContent: {
      width: '100%'
    },
    quickStartContainer: {
      width: '100%',
      height: 'calc(100vh - 501px)'
    },
    quickStartCardContent: {
      height: 'calc(100% - 58px)'
    },
    quickStartContent: {
      height: '100%'
    },
    startItemContainer: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    startItem: {
      width: 135,
      marginRight: 20,
      marginBottom: 20,

      '&:hover': {
        backgroundColor: theme.palette.customColor.themePrimaryLightBg,
        borderRadius: 4
      },

      '& a': {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% center',
        backgroundOrigin: 'content-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '10rem',
        border: '1px solid rgb(239, 239, 239)',
        borderRadius: 4,
        fontSize: 22,
        padding: 16,
        color: 'rgb(51, 51, 51)',
        margin: 0
      }
    },
    recentNotesContainer: {
      height: 'calc(100vh - 203px)'
    },

    recentNotesCardContent: {
      height: 'calc(100% - 58px)'
    },
    recentNotesContent: {
      width: '100%',
      height: '100%',
      overflowY: 'auto'
    },
    noticeLink: {
      padding: 16,
      width: '100%',
      borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
    },
    hasLink: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.customColor.themePrimaryLightBg
      }
    },
    noticeMsg: {
      color: theme.palette.customColor.black_87,
      marginBottom: 6
    },
    noticeMsgHovered: {
      color: theme.palette.customColor.themePrimary
    },
    noticeDuration: {
      color: theme.palette.customColor.black_60,
      fontSize: 12
    }
  }}

export default entryStyle;