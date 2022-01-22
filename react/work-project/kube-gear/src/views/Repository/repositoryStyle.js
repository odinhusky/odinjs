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
    }
  }}

export default repositoryStyle;