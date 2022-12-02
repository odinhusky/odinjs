const systemSettingStyles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'calc(100vh - 160px)',
    overflow: 'hidden'
  },
  tabPanelWidthLimit: {
    width: '100%'
  },
  modifyFormContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 16
  },
  modifyFormCtrl: {
    width: '100%',
    marginBottom: 24
  },
  container: {
    width: '700px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    marginTop: 16,
    marginBottom: 16
  },
  content: {
    flexGrow: 2,
    marginBottom: 10,
    marginTop: 16
  },
  imageContainer: {
    width: '100%'
    // marginBottom: 24
  },
  imageTitle: {
    width: '100%',
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
  },
  imageTitleText: {
    color: theme.palette.text.neutralPrimary,
    fontSize: 20
    // fontWeight: 500
  },
  imageContent: {
    width: '100%',
    padding: 24
  },
  resourceSettingContainer: {
    width: '100%',
    marginBottom: 20
  },
  settingTitle: {
    width: '100%',
    marginBottom: 10
  },
  settingContent: {
    width: '100%',
    padding: 20,
    border: `1px solid ${theme.palette.customColor.borderLineColor}`,
    borderRadius: 4
  },
  muiAutocompleteCtrl: {
    '& .MuiInputLabel-formControl': {
      top: 0
    }
  },
  thresholdBox: {
    width: '100%',
    marginBottom: 20,
    '& > div': {
      marginBottom: 20
    }
  },
  thresholdRow4: {
    '& > .item': {
      width: '25%'
    },
    '& > .item:first-child': {
      marginRight: 20
    },
    '& > .item:last-child': {
      marginLeft: 20
    },
    ['@media (max-width: 768px)']: {
      display: 'flex',
      flexDirection: 'column',
      '& > .item': {
        width: '100%',
        marginBottom: 10
      },
      '& > .item:first-child': {
        marginRight: 0
      },
      '& > .item:last-child': {
        marginLeft: 0,
        marginBottom: 0
      }
    }
  }
})

export default systemSettingStyles;