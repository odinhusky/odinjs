const groupManageStyles = (theme) => {
  // const { largeAlpha } = theme.bp

  return {
    toolbar: {
      backgroundColor: theme.palette.background.paper
    },
    groupManageContainer: {
      padding: '0 20px 20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    groupManageContent: {
      display: 'flex',
      flexGrow: 2,
      overflow: 'hidden'
    },
    groupManageLeft: {
      width: 230,
      marginRight: 20,
      maxWidth: 230,
      overflow: 'auto',
      background: '#fff',
      position: 'relative',
      padding: '4px 0',
      borderRadius: 4
    },
    groupManageRight: {
      width: 'calc(100% - 250px)',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '4px 0',
      borderRadius: 4
    },
    groupManageTabContentContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
      flexGrow: 2,
      background: '#FBFBFB',
      overflow: 'hidden'
    },
    groupManageTabContentTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 15
    },
    groupManageTabContentContent: {
      flexGrow: 2
    },
    groupManageMemberEditModalTopBar: {
      borderBottom: `1px solid ${theme.palette.customColor.groupManageMemberEditModalBorderColor}`,
      height: '15%'
    },
    groupManageMemberEditModalUserBox: {
      height: 400,
      width: '100%',
      border: `1px solid ${theme.palette.customColor.groupManageMemberEditModalBorderColor}`,
      borderRadius: 4,
      marginTop: 20
    },
    groupManageMemberEditModalRow: {
      marginBottom: 10,
      '& > div:first-child': {
        marginBottom: 10
      }
    }
  }
};

export default groupManageStyles;