const hardWareStyles = (theme) => {
// const hardWareStyles = () => {

  const { md } = theme.bp

  return {
    hardWareContainer: {
      position: 'relative',
      padding: '0 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    hardWareImagePageTopBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    hardWareImagePageLeft: {
      display: 'flex',
      '& > div:not(:last-child)': {
        marginRight: 20
      },
      '& > button': {
        marginRight: 20
      },
      [theme.breakpoints.down(md)]: {
        flexDirection: 'column',
        '& > div:not(:last-child)': {
          marginBottom: 8
        },
        '& > button': {
          marginBottom: 8
        }
      }
    },
    hardWareImagePageRight: {
      display: 'flex',
      '& > div:not(:last-child)': {
        marginRight: 20
      },
      [theme.breakpoints.down(md)]: {
        flexDirection: 'column',
        '& > div:not(:last-child)': {
          marginBottom: 8
        }
      }
    },
    projectInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    projectInfoRow: {
      fontSize: 16,
      color: theme.palette.customColor.black_87,
      display: 'flex'
    },
    projectInfoInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: 5,
      'span:nth-child(1)': {
        minWidth: 30,
        textAlign: 'right',
        paddingRight: 5
      }
    },
    hardWareStorageChartContainer: {
      borderRight: `2px solid ${theme.palette.customColor.mirrorDividerColor}`,
      paddingRight: 20,
      marginRight: 20
    },
    hardWareStorageChartTitle: {
      marginBottom: 0,
      textAlign: 'center'
    },
    hardWareStorageChartChart: {
      listStyleType: 'none',
      position: 'relative',
      width: 110,
      height: 55,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      '&::before': {
        position: 'absolute',
        content: '"',
        width: 'inherit',
        height: 'inherit',
        border: `20px solid ${theme.palette.customColor.storageChartChartBeforeBorderColor}`,
        borderBottom: 'none',
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150
      },
      '& span': {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: 'inherit',
        height: 'inherit',
        border: '20px solid',
        borderTop: 'none',
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
        transformOrigin: '50% 0',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        animationFillMode: 'forwards',
        animationDuration: '.4s',
        animationTimingFunction: 'linear',
        transition: 'transform .5s'
      },
      '& b': {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 12
      }
    },
    hardWareStorageChartRange: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 5
    }
  }
};

export default hardWareStyles;