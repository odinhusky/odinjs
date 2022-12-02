const roleListStyles = (theme) => {
  // const { largeAlpha } = theme.bp

  return {
    toolbar: {
      backgroundColor: theme.palette.background.paper
    },
    labelChange: {
      top: -10
    },
    muiautoTablet: {
      height: 42
    },
    roleListWrapper: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '0 20px 20px',
      height: '100%',
      overflow: 'hidden'
    },
    roleListTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }
};

export default roleListStyles;