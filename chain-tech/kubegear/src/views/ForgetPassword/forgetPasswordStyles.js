const signUpStyles = (theme) => {
// const signUpStyles = () => {

  // 取出斷點
  const { largeAlpha } = theme.bp;

  return {
    sendButtonStyle: {
      backgroundColor: theme.palette.customColor.white,
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
    backButtonStyle: {
      fontSize: '16px',
      height: '40px',
      width: '40%',
      borderRadius: '3px'
    },
    modal: {
      width: 300
    },
    forgetPwdContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&::before': {
        content: '"',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        height: '100%',
        width: '100%'
      }
    },
    forgetPwdBlock: {
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
    forgetPwdInnerBlock: {
      display: 'flex'
    },
    forgetPwdInnerBlockLeft: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      marginRight: 160,
      '& img': {
        maxWidth: 'inherit',
        width: 382
      },
      [theme.breakpoints.down(largeAlpha)]: {
        display: 'none'
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
      }
    },
    forgetPwdBlockTitleText: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20
    },
    forgetPwdResetPasswordContainerStack: {
      overflow: 'auto',
      backgroundColor: theme.palette.customColor.white,
      padding: 40,
      width: 350,
      borderRadius: 6,
      opacity: '.9'
    }
  }
}

export default signUpStyles;