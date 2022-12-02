export const manageTemplateStyles = (theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.paper
  },
  iconLabelWrapper: {
    flexDirection: 'row-reverse',
    textTransform: 'none'
  },
  iconButton: {
    padding: 0,
    marginLeft: 10,
    cursor: 'pointer',
    fontSize: 18
  },
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  },
  formControl: {
    width: '100%',
    '& > div': {
      height: 40
    },
    '& .MuiSvgIcon-root' : {
      top: '30%'
    }
  },
  manageTemplateContainer: {
    overflow: 'auto',
    height: '100%',
    marginBottom: 16
  },
  manageTemplateFormContent: {
    // width: 80%;
    margin: 'auto',
    padding: 20,
    '& > div:not(:first-child)': {
      marginTop: 20
    }
  },
  manageTemplateFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.customColor.white,
    padding: 20,
    borderRadius: 4
  },
  manageTemplateFooterLeft: {
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  manageTemplateFooterRight: {
    width: '50%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export default manageTemplateStyles;