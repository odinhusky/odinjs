const signUpStyles = (theme) => {
// const signUpStyles = () => {

  // 取出斷點
  const { largeAlpha } = theme.bp;

  return {
    signUpContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'block',
        height: '100%',
        width: '100%'
      }
    },
    signUpLeftBlock: {
      fontSize: 36,
      color: theme.palette.customColor.white,
      marginRight: 160,
      zIndex: 1,
      '& img': {
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
        '& img': {
          width: 50,
          marginRight: 20
        }
      }
    },
    signUpLeftBlockIconBlock: {
      display: 'flex',
      alignItems: 'center',
      '& img': {
        width: 30
      }
    },
    signUpRightBlockTitleText: {
      fontSize: 24,
      color: theme.palette.customColor.black_87,
      textAlign: 'center'
    },
    signUpLeftBlockIconBlockImg: {
      width: 30
    },
    signUpRightBlockForm: {
      backgroundColor: theme.palette.customColor.white,
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
      padding: '0 40px'
    },
    signUpRightBlockSubTitle: {
      color: '#999999',
      fontSize: 14,
      textAlign: 'center'
    },
    signUpRightBlockSubTitleHref: {
      color: theme.palette.customColor.themePrimary,
      fontSize: 14
    },
    signUpRightBlock: {
      width: 400,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      zIndex: 1,
      position: 'relative',
      opacity: .9
    },
    signUpFooter: {
      position: 'absolute',
      bottom: 10,
      color: theme.palette.customColor.black_87,
      paddingLeft: 20,
      fontSize: 16,
      width: '100%'
    }
  }
}

export default signUpStyles;