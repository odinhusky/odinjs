const virtualGroupStyle = () => {
  return {
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
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
    }
  }
}

export default virtualGroupStyle;