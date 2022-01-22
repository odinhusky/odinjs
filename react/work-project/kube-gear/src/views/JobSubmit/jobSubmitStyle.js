const jobSubmitStyle = (theme) => {
  // 取出斷點
  const { largeAlpha } = theme.bp;

  return {
    defaultBtn: {
      color: '#fff',
      background: 'rgb(39, 39, 39)',
      '&:hover': {
        color: '#fff',
        background: 'rgb(29, 29, 29)'
      }
    },
    jobSubmitContainer: {
      height: '100%',
      overflow: 'auto',
      padding: '0 20px 20px',
      display: 'flex',
      flexDirection: 'column'
    },
    jobSubmitCtrlBtn_Left: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      padding: 5,
      borderRight: 'none',
      height: 40
    },
    jobSubmitCtrlBtn_Right: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      padding: 5,
      height: 40
    },
    select: {
      maxWidth: '100%',
      width: '100%'
    },
    gridcontainer: {
      marginTop: 10
    },
    remainingNumber: {
      paddingTop: 16,
      paddingLeft: 12
    },
    highlevelSettingBorder: {
      flexGrow: 1,
      borderBottom: '1px solid #eaeaea',
      marginLeft: 20
    },
    resourcesWidthCtrl: {
      paddingLeft: 'calc(100% / 12 * 3)',
      margin: '10px 0',
      [theme.breakpoints.down(largeAlpha)]: {
        paddingLeft: 0
      }
    },
    toolbar: {
      backgroundColor: theme.palette.background.paper
    },
    iconLabelWrapper: {
      flexDirection: 'row-reverse',
      // 防止 Tab 的內容轉大寫(Matrial-UI 預設大寫)
      textTransform: 'none',
      fontSize: 14
    },
    tabFormContainer: {
      backgroundColor: '#F0FAF7',
      padding: '10px 20px',
      borderTopRightRadius: 4,
      borderTopLeftRadius: 4
    },
    tabFormContentContainer: {
      padding: '32px 20px 20px',
      background: '#ffffff',
      boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 4px, rgb(0 0 0 / 5%) 0px 0.5px 1px',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4
    },
    nfsMountContainer: {
      padding: 20,
      background: '#ffffff',
      boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 4px, rgb(0 0 0 / 5%) 0px 0.5px 1px',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4
    },
    textColor: {
      color: theme.palette.customColor.themePrimary
    },
    vgCtrl: {
      '& .MuiGrid-align-items-xs-center': {
        alignItems: 'flex-start',
        paddingTop: 12
      }
    },
    iconButton: {
      padding: 0,
      marginLeft: 10,
      marginRight: 5,
      fontSize: 18,
      cursor: 'pointer'
    },
    formLabel: {
      marginBottom: 0,
      marginTop: 2,
      fontSize: 14,
      paddingRight: 0
    },
    outlined: {
      maxWidth: '100px',
      width: '100px'
    },
    portListLabelSection: {
      alignItems: 'flex-start !important'
    },
    portListFormLabelWithoutValue: {
      paddingTop: 13,
      [theme.breakpoints.down(largeAlpha)]: {
        paddingTop: 0
      }
    },
    portListFormLabel: {
      paddingTop: 24,
      [theme.breakpoints.down(largeAlpha)]: {
        paddingTop: 0
      }
    },
    completePolicyContainer: {
      paddingBottom: '20px !important',
      [theme.breakpoints.down(largeAlpha)]: {
        paddingBottom: '0px !important',
        marginBottom: 30
      }
    },
    completePolicyFormLabeGrid: {
      marginTop: 9,
      [theme.breakpoints.down(largeAlpha)]: {
        marginTop: 0,
        marginBottom: 12
      }
    },
    vgDetail: {
      paddingLeft: '24.3%',
      marginTop: 12,
      [theme.breakpoints.down(largeAlpha)]: {
        paddingLeft: 0
      }
    }
  }
}

export default jobSubmitStyle;