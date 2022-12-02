const fsItemListStyles = (theme) => {
// const fsItemListStyles = () => {

  // 取出斷點
  // const { laptop } = theme.bp,

  return {
    routeContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '0 20px 20px',
      height: '100%',
      overflow: 'hidden'
    },
    indexEditModalAddUserBar: {
      display: 'flex',
      alignItems: 'stretch',
      '& > :first-child': {
        flex: 2,
        marginRight: 16,
        maxWidth: 300
      }
    },
    indexEditModalUserBox: {
      marginTop: 20,
      border: `1px solid ${theme.palette.customColor.black_87}`,
      height: 300,
      overflow: 'auto'
    },
    indexEditModalUserBoxItem: {
      padding: 16,
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    indexEditModalName: {
      width: 100,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    detailPageBreadCrumb: {
      fontSize: 20,
      color: theme.palette.customColor.black_87
    },
    detailPageLinkStyle: {
      color: theme.palette.customColor.black_87,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.customColor.gray
      }
    },
    uploadModalFileContainer: {
      width: '100%',
      height: 200,
      display: 'flex',
      position: 'relative',
      border: `1px solid ${theme.palette.customColor.step5PreviewModalWithoutRDMABorderColor}`,
      borderRadius: 4,
      flexDirection: 'column',
      marginBottom: 10,
      overflow: 'auto',
      '& input[type="file"]': {
        display: 'none'
      }
    },
    uploadModalNonSelected: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    uploadModalSelected: {
      display: 'flex',
      flexDirection: 'column'
    },
    uploadModalProgressContainer: {
      width: '100%',
      position: 'relative',
      zIndex: 1
    },
    progressTrack: {
      margin: '20px 0',
      width: '100%',
      height: 2,
      backgroundColor: theme.palette.customColor.fsItemListProgressBgColor
    },
    progressBar: {
      height: 2,
      width: 0,
      position: 'absolute',
      left: 0,
      transition: 'width .2s'
    },
    muiComboBoxInput: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: '0 9px'
      }
    },
    directoryModalContainer: {
      width: 500,
      display: 'flex',
      flexDirection: 'column'
    },
    directoryModalBreadCrumb: {
      margin: 0,
      padding: 0,
      color: theme.palette.customColor.black_87,
      fontSize: 16
    },
    directoryModalDirectory: {
      marginTop: 20,
      border: `1px solid ${theme.palette.customColor.neutralPrimary}`,
      display: 'flex',
      flexDirection: 'column',
      height: 400,
      overflow: 'auto'
    },
    directoryModalDirectoryItem: {
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      color: theme.palette.customColor.black_87,
      padding: '22px 16px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& i': {
        marginRight: 10
      },
      '&.active, &:hover': {
        background: theme.palette.customColor.fsItemListProgressBgColor
      }
    },
    directoryModalLoading: {
      display: 'flex',
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    directoryModalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 20,
      '& button:first-child': {
        marginRight: 16
      }
    }
  }}

export default fsItemListStyles