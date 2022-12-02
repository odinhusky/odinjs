const userManageStyle = (theme) => ({
  userManageModalContainer: {
    width: 650,
    height: 500,
    overflow: 'auto'
  },
  userManageEditUserModalStatusBadgeBackgroundColor: {
    backgroundColor: theme.palette.customColor.userManageEditUserModalStatusBadgeBackgroundColor
  },
  viewBoxContent: {
    display: 'flex',
    flexWrap: 'wrap',
    '& div': {
      marginBottom: 10,
      paddingRight: 15,
      '& p':{
        marginBottom: 5,
        '&:first-child': {
          color: '#605E5C'
        }
      },
      '& span': {
        color: '#a19f9d'
      }
    }
  },
  denyButton: {
    backgroundColor: theme.palette.customColor.themeDenyDefaultBackgroundColor,
    color: theme.palette.customColor.white,
    border: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.customColor.themeDenyDefaultBackgroundColorHover
    }
  },
  statusLabelStyle: {
    color: 'orange',
    backgroundColor: '#FFF8EA',
    padding: '5px 10px',
    marginLeft: 10
  },
  createNfsGlusterfsModalTextField: {
    '& .MuiOutlinedInput-input' : {
      padding: 14
    }
  },
  titleClass: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0',
    '& h3': {
      fontSize: 16,
      margin: '0 10px 0 0'
    },
    '& span': {
      flexGrow: 2,
      borderBottom: `1px solid ${theme.palette.customColor.scheduleBorderColor}`,
      height: 1
    }
  }
})

export default userManageStyle;