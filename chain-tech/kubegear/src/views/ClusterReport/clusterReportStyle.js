const clusterReportStyle = (theme) => {
  // 取出斷點
  // const { laptop } = theme.bp;

  return {
    toolbar: {
      backgroundColor: theme.palette.background.paper
    },
    textField: {
      width: 200
    },
    clusterReportContainer: {
      position: 'relative',
      padding: '0 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    clusterReportWrapper: {
      overflow: 'auto',
      flex: 1,
      backgroundColor: theme.palette.customColor.clusterReportBgColor,
      padding: 20
    },
    clusterReportLineChartBox: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > div': {
        width: '50%',
        padding: 20
      }
    },
    clusterReportLineGpuInfo: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center'
    },
    clusterReportOverViewContainer: {
      display: 'flex',
      '& > div': {
        display: 'flex',
        width: '33.33%',
        justifyContent: 'center',
        padding: 20,
        flexDirection: 'column',
        position: 'relative',
        '&:not(:last-child)': {
          borderRight: `1px solid ${theme.palette.customColor.scheduleBorderColor}`
        },
        '& p': {
          textAlign: 'center',
          color: theme.palette.customColor.black_87,
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    },
    clusterReportTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 18,
      fontWeight: 'bold'
    },
    clusterReportUsedTimeWrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 2,
      overflow: 'hidden'
    },
    clusterReportUsedTimeContainer: {
      paddingTop: 16,
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 2,
      overflow: 'hidden'
    },
    clusterReportUsedTimeSearchBar: {
      padding: '0 16px',
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      '& > div': {
        display: 'flex',
        alignSelf: 'center',
        '& label': {
          display: 'flex',
          alignSelf: 'center',
          fontWeight: 'normal',
          marginRight: 10,
          marginBottom: 0,
          fontSize: 14
        }
      }
    },
    clusterReportUsedTimeSearchBarSelect: {
      width: 175,
      marginRight: 10
    },
    clusterReportUsedTimeContent: {
      display: 'flex',
      flexGrow: 2,
      height: '100%',
      overflow: 'auto',
      marginTop: 16,
      flexWrap: 'wrap'
    },
    clusterReportUsedTimeField: {
      display: 'flex',
      flexDirection: 'column',
      marginRight: 16,
      width: 150,
      '& p:first-child': {
        fontSize: 14
      },
      '& p:nth-child(2)': {
        fontSize: 18
      }
    }
  }
}

export default clusterReportStyle;