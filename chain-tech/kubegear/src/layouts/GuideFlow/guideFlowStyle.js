const guideFlowStyle = (theme) => {
// const guideFlowStyle = () => {

  // 取出斷點
  // const { largeAlpha } = theme.bp;

  return {
    guideContainer: {
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0
    },
    mask: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.customColor.maskColor,
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1100
    },
    guideComponent: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1101
    },
    detailContainer: {
      maxWidth: 380,
      position: 'relative',
      backgroundColor: theme.palette.customColor.white,
      borderRadius: 4,
      boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)'
    },
    detailTopArrow: {
      width: 16,
      height: 16,
      backgroundColor: theme.palette.customColor.white,
      position: 'absolute',
      top: -8,
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)'
    },
    detailBottomArrow: {
      width: 16,
      height: 16,
      backgroundColor: theme.palette.customColor.white,
      position: 'absolute',
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)'
    },
    detailLeftArrow: {
      width: 16,
      height: 16,
      backgroundColor: theme.palette.customColor.white,
      position: 'absolute',
      top: '50%',
      left: -8,
      transform: 'translateY(-50%) rotate(45deg)'
    },
    detailRightArrow: {
      width: 16,
      height: 16,
      backgroundColor: theme.palette.customColor.white,
      position: 'absolute',
      top: '50%',
      right: -8,
      transform: 'translateY(-50%) rotate(45deg)'
    },
    detailIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 48,
      height: 48,
      cursor: 'pointer'
    },
    detailHead: {
      width: '100%',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 8px 0px 24px'
    },
    detailTitle: {
      color: 'black',
      fontSize: '18px',
      fontWeight: 'bold',
      flexGrow: 1,
      overflowX: 'auto'
    },
    detailHeadNode: {
      marginRight: 8
    },
    detailCloseBtn: {
      display: 'block',
      fontSize: 12,
      color: theme.palette.customColor.black_60
    },
    detailBody: {
      width: '100%',
      padding: '0px 24px 28px'
    },
    detailFoot: {
      width: '100%',
      padding: '8px 8px 8px 24px',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    stepContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0
    },
    guideAdvice: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    },
    entryAdminStep1: {
      width: 'calc(100vw - 230px)',
      height: 113,
      position: 'absolute',
      top: 50,
      right: 0,

      '& img': {
        width: '100%',
        height: '100%'
      }
    },
    entryAdminDetail1: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(((100vw - 230px) / 2) + 40px)',
      top: 'calc(113px + 25px + 50px)'
    },
    entryAdminDetail2: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc((((100vw - 230px) * 0.576 * 0.685) / 2) + 40px)',
      top: 'calc(113px + 25px + 50px + 212px + 13px)'
    },
    entryAdminDetail3: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(230px + 20px + ((100vw - 230px - 40px) * 0.576 * 0.7026) + 20px + ((100vw - 230px - 40px) * 0.576 * 0.265 / 2) - 190px)',
      top: 'calc(113px + 25px + 50px + 212px + 13px)'
    },
    entryAdminDetail4: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(230px + 20px + ((100vw - 230px) * 0.53 * 0.47))',
      top: 'calc(50px + 113px + 40px + ((100vh - 113px - 50px) * 0.46))'
    },
    entryAdminDetail5: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(230px + 20px + ((100vw - 230px) * 0.578))',
      top: 'calc(50px + 113px + 40px + ((100vh - 113px - 50px) * 0.46))'
    },
    entryAdminDetail6: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(230px + 40px + ((100vw - 230px) * 0.568) - 420px)',
      top: 'calc(50px + 113px + ((100vh - 113px - 50px) * 0.36))'
    },
    entryAdminDetail7: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: '66vw',
      top: '75px'
    },
    entryGeneralDetail1: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(((100vw - 230px) / 2) + 40px)',
      top: 'calc(113px + 25px + 50px)'
    },
    entryGeneralDetail2: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc((((100vw - 230px) * 0.68 * 0.75) / 2) + 30px)',
      top: 'calc(113px + 25px + 50px + 282px + 20px)'
    },
    entryGeneralDetail3: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc((((100vw - 230px) * 0.68 * 0.75) + ((100vw - 230px) * 0.68 * 0.25) / 2))',
      top: 'calc(113px + 25px + 50px + 282px + 20px)'
    },
    entryGeneralDetail4: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      left: 'calc(((100vw - 230px) * 0.68) / 2)',
      top: 'calc(113px + 25px + 50px + 110px)'
    },
    entryGeneralDetail5: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      right: 'calc(((100vw - 230px - 40px) * 0.32) + 40px + 35px)',
      top: 'calc(((100vh - 113px - 50px) / 2) + 45px)'
    },
    entryGeneralDetail6: {
      width: '100%',
      maxWidth: 380,
      position: 'absolute',
      right: '0px',
      top: '75px'
    }
  }
}

export default guideFlowStyle;