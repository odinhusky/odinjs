const clusterReportStyle = (theme) => {
  // 取出斷點
  // const { laptop } = theme.bp;

  return {
    toolbar: {
      backgroundColor: theme.palette.background.paper
    },
    textField: {
      width: 200
    }
  }
}

export default clusterReportStyle;