// const resourceManageStyles = (theme) => {
const resourceManageStyles = () => {
  // const { laptop } = theme.bp

  return {
    treeView: {
      width: 'calc(20% - 20px)',
      maxWidth: 'calc(20% - 20px)'
    },
    editResourceNameModal: {
      maxWidth: 600
    },
    groupContainer: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexGrow: 1
    },
    groupTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 10
    }
  }
}

export default resourceManageStyles;