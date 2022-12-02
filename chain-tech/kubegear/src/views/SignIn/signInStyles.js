const nfsDiskListStyles = (theme) => {
// const nfsDiskListStyles = () => {

  // 取出斷點
  const { largeAlpha } = theme.bp;

  return {
    loginButtonStyle: {
      fontSize: '16px',
      height: '40px',
      width: '40%',
      borderRadius: '3px'
    },
    loginButtonStyleOnly: {
      fontSize: '16px',
      height: '40px',
      width: '100%',
      borderRadius: '3px'
    },
    registerButtonStyle: {
      backgroundColor: '#fff',
      fontSize: '16px',
      height: '40px',
      width: '40%',
      border: '1px solid #dddddd',
      borderRadius: '3px',
      '&:hover': {
        border: '1px solid #adadad',
        backgroundColor: '#e7e7e7e'
      }
    },
    signInContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        height: '100%',
        width: '100%'
      }
    },
    signInBlock: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
      zIndex: 2
    },
    signInBlockLeft: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      marginRight: 160,
      '& img': {
        maxWidth: 'inherit',
        width: 382
      },
      '& p': {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.customColor.white,
        fontSize: 36,
        whiteSpace: 'nowrap',
        '& img': {
          width: 50,
          marginRight: 20
        }
      },
      [theme.breakpoints.down(largeAlpha)]: {
        display: 'none'
      }
    },
    signInLogInContainerStack: {
      overflow: 'auto',
      backgroundColor: theme.palette.customColor.white,
      padding: 40,
      width: 350,
      borderRadius: 6,
      opacity: .9
    }
  }
}

export default nfsDiskListStyles;