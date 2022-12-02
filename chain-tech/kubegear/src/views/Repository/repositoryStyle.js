const repositoryStyle = (theme) => {
  // 取出斷點
  // const { laptop } = theme.bp;

  return {
    projectModal: {
      maxWidth: 600
    },
    projectContent: {
      width: '100%'
    },
    projectInput: {
      width: '100%',
      marginRight: 20,
      flex: '1 1 auto'
    },
    projectDetail: {
      width: '100%',
      flex: '1 0 30%',
      display: 'flex',
      alignItems: 'center'
    },

    defaultDetail: {
      width: '100%',
      flex: '1 0 10%',
      display: 'flex',
      alignItems: 'center'
    },
    selectUnit: {
      flex: '0 0 75px'
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginRight: 20
    },
    infoRow: {
      display: 'flex',
      fontSize: 16,
      color: '#333333'
    },
    infoInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: 5,

      '& span:nth-child(1)': {
        minWidth: 30,
        textAlign: 'right',
        paddingRight: 5
      }
    },
    quotaContainer: {
      paddingLeft: 20,
      borderLeft: `2px solid ${theme.palette.customColor.mirrorDividerColor}`
    },
    downloadModalContainer: {
      width: 500,
      display: 'flex',
      flexDirection: 'column'
    },
    downloadModalBreadCrumbs: {
      margin: '10px 0 0',
      padding: 0,
      color: '#333',
      fontSize: 16,
      wordWrap: 'break-word'
    },
    downloadModalDirectory: {
      marginTop: 20,
      border: '1px solid #323130',
      display: 'flex',
      flexDirection: 'column',
      height: 400,
      overflow: 'auto'
    },
    downloadModalDirectoryItem: {
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      color: '#333',
      padding: '22px 16px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& i': {
        marginRight: 10
      },
      '&:hover': {
        background: '#edebe9'
      }
    },
    downloadModalDirectoryItemActive: {
      background: '#edebe9'
    },
    downloadModalLoading: {
      display: 'flex',
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    downloadModalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 20,
      '& button:first-child': {
        marginRight: 16
      }
    },
    bg_paper: {
      backgroundColor: theme.palette.background.paper
    },
    projectDetailTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 16,
      '& p': {
        color: theme.palette.customColor.black_87,
        fontSize: 16,
        fontWeight: 500,
        flexBasis: '100%',
        marginBottom: 16
      },
      '& div': {
        display: 'flex'
      }
    },
    storageChartContainer: {
      borderRight: `2px solid ${theme.palette.customColor.mirrorDividerColor}`,
      paddingRight: 20,
      marginRight: 20
    },
    storageChartTitle: {
      marginBottom: 0,
      textAlign: 'center'
    },
    storageChartChart: {
      listStyleType: 'none',
      position: 'relative',
      width: 110,
      height: 55,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      '&::before': {
        position: 'absolute',
        content: '',
        width: 'inherit',
        height: 'inherit',
        border: `20px solid ${theme.palette.customColor.storageChartChartBeforeBorderColor}`,
        borderBottom: 'none',
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150
      },
      '& span': {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: 'inherit',
        height: 'inherit',
        border: '20px solid',
        borderTop: 'none',
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
        transformOrigin: '50% 0',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        animationFillMode: 'forwards',
        animationDuration: '.4s',
        animationTimingFunction: 'linear',
        transition: 'transform .5s'
      },
      '& b': {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 16
      }
    },
    storageChartRange: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 5,
      '& p': {
        marginBottom: 0
      }
    },
    projectDetailMemberEditModalSelectedMemberList:{
      display: 'flex',
      border: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      borderRadius: 4,
      flexDirection: 'column',
      padding: 0,
      maxHeight: 220,
      overflow: 'auto',
      '& li': {
        display: 'block',
        listStyle: 'none',
        borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
        padding: 10,
        fontSize: 14,
        color: theme.palette.customColor.black_87,
        '&:first-child': {
          fontWeight: 'bold',
          position: 'sticky',
          top: 0,
          background: theme.palette.customColor.white
        },
        '&:last-child': {
          borderBottom: 'none'
        }
      }
    },
    projectDetailSettingFormGroup: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 20px 5px',
      '& .label': {
        paddingRight: 40,
        fontSize: 16,
        color:theme.palette.customColor.black_87
      }
    }
  }}

export default repositoryStyle