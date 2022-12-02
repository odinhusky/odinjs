const manageReserveStyle = (theme) => {
  return {
    topBar: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 16
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    wrapperPaper: {
      flex: 1,
      overflow: 'hidden'
    },
    waitingStatusText: {
      color: theme.palette.customColor.reserve.waiting.text
    }
  }
}

export default manageReserveStyle;