const scheduleStyles = (theme) => {
  return {
    test: {
      color: theme.palette.red
    },
    jobDetailContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '0 20px 20px',
      height: '100%',
      overflow: 'hidden'
    },
    splitButton: {
      width: 240
    },
    sshModalContainer: {
      maxWidth: 360
    },
    sshModalTitle: {
      fonzSize: 20
    },
    sshCloseBtn: {
      position: 'absolute',
      right: 24,
      top: 16,
      fontSize: 20,
      zIndex: 10,
      cursor: 'pointer'
    },
    sshModalContent: {
      width: '100%'
    },
    stepBox: {
      width: '100%',
      display: 'flex',
      marginBottom: 16,

      '&:last-child': {
        marginBottom: 0
      }
    },
    stepOrder: {
      display: 'block',
      marginRight: 20,
      color: theme.palette.customColor.black_60,
      fontSize: 14,
      fontWeight: 'bold'
    },
    stepContent: {
      display: 'block',
      color: theme.palette.customColor.black_87,
      fontSize: 14,
      flexGrow: 1,
      lineHeight: '20px'
    },
    stepHead: {
      color: 'inherit',
      fontSize: 'inherit',
      letterSpacing: '0.25px'
    },
    stepLine: {
      display: 'block',
      width: '100%'
    },
    iconButton: {
      padding: 0,
      fontSize: 18,
      cursor: 'pointer',
      marginLeft: 5
    },
    splitButtonOptionImg: {
      width: 14,
      margin: '0 4px'
    },
    link: {
      color: theme.palette.customColor.themePrimary,
      cursor: 'pointer'
    },
    summaryContainer: {
      padding: 30,
      backgroundColor: theme.palette.customColor.white,
      margin: '10px, 0',
      borderRadius: 4
    },
    summaryJobName: {
      fontSize: 28,
      fontWeight: 400,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    summaryColumn: {
      display: 'flex',
      flexDirection: 'column',
      '& div': {
        display: 'flex',
        alignItems: 'center'
      },
      '& > div:first-child': {
        marginBottom: 15
      },
      '& > :nth-child(2)': {
        flex: 2
      }
    },
    summaryToolBox: {
      display: 'flex',
      marginBottom: 0,
      paddingInline: 0,
      '& li': {
        position: 'relative',
        listStyleType: 'none',
        paddingRight: 20,
        '&:not(:last-child)::after': {
          content: '"|"',
          display: 'block',
          position: 'absolute',
          right: 10,
          top: 0
        }
      }
    },
    isTabletContainer: {
      overflow: 'auto',
      flex: 1
    },
    summaryAlert: {
      fontSize: 14,
      alignItems: 'center',
      marginTop: 10
    },
    summaryTitle: {
      fontWeight: 'bold',
      width: 100,
      textAlign: 'left',
      display: 'inline-block'
    },
    jobEventTitle: {
      fontSize: 28,
      fontWeight: 400
    },
    jobDetailTaskRoleCount: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 30,
      '& > div': {
        marginLeft: 10
      }
    },
    jobDetailTaskRoleContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      marginBottom: 10
    },
    jobDetailTaskRoleHeader: {
      position: 'relative',
      display: 'flex',
      padding: '10px 20px',
      background: 'rgb(248, 248, 248)',
      fontSize: 17,
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4,
      '& span': {
        display: 'flex',
        alignItems: 'center'
      }
    },
    jobDetailTaskRoleContent: {
      flex: 1,
      overflow: 'hidden'
    }
  }
}

export default scheduleStyles;