const versionLogStyles = (theme) => {
// const versionLogStyles = () => {

  // 取出斷點
  // const { laptop } = theme.bp;

  return {
    versionLogBg: {
      backgroundColor: theme.palette.customColor.versionLogBgColor
    },
    versionLogContainer: {
      padding: '0px 20px',
      maxHeight: 'calc(100vh - 200px)',
      overflow: 'auto',
      '& li': {
        listStylePosition: 'inside'
      }
    }
  }
}

export default versionLogStyles;