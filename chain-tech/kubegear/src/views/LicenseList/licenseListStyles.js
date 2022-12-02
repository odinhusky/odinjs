const licenseListStyles = (theme) => {
// const licenseListStyles = () => {

  // 取出斷點
  // const { laptop } = theme.bp;

  return {
    licenseListContainer: {
      position: 'relative',
      padding: '0 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    licenseListTopBar: {
      marginBottom: 16,
      display: 'flex',
      justifyContent: 'space-between'
    },
    licenseListIsLoading: {
      backgroundColor: theme.palette.customColor.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
}

export default licenseListStyles;