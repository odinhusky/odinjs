
const  baseVerticalTabAndPanelStyles = (theme) => ({
  baseVerticalTabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flex: '0 0 160px',
    '& .MuiTab-root': {
      color: theme.palette.text.black,
      fontSize: '14px'
    },
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingLeft: '24px',
      fontWeight: 'normal'
    },
    '& .Mui-selected': {
      backgroundColor: theme.palette.customColor.themePrimaryLightBg,
      color: theme.palette.customColor.themePrimary,
      fontWeight: 'normal'
    }
  },
  indicator: {
    width: '4px',
    backgroundColor: theme.palette.customColor.themePrimary
  },
  baseVerticalTabPanelContainer: {
    flex: '1 1 auto',
    overflow: 'auto'
  },
  baseVerticalTabPanel: {
    overflowY: 'auto',
    height: '100%'
  }
});

export default baseVerticalTabAndPanelStyles;