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
    }
  }
}

export default scheduleStyles;