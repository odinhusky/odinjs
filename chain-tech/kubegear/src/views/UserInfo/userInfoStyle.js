const userInfoStyle = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 'calc(100vh - 160px)',
    overflow: 'hidden'
  },
  settingTitle: {
    display: 'block',
    marginTop: 0,
    marginBottom: 16,
    fontSize: 20
  },
  statusContainer: {
    display: 'block',
    marginTop: 16
  },
  'userInfo__container__block__info--state': {
    color: '#FFA500',
    background: '#FFF8EA',
    padding: '5px 10px'
  },
  'userInfo__container__block__info--red': {
    color: 'red'
  },
  'userInfo__container__block__info--green': {
    color: 'green',
    background: '#D6F8C5',
    padding: '5px 10px'
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
  passwordInput: {
    '& #outlined-adornment-password': {
      boxSizing: 'initial'
    }
  },
  container: {
    width: '100%',
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
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  columnGroup: {
    fontSize: 14
  },
  columnState: {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 10px',
    maxWidth: 75,
    fontSize: 14
  },
  groupTableTitle: {
    marginRight: 'auto',
    fontSize: 16
  },
  topologyChartBtn: {
    display: 'block',
    fontSize: 16
  },
  tableContainer: {
    border: `1px solid ${theme.palette.customColor.borderLineColor}`,
    borderRadius: 4,
    boxShadow: 'none'
  },
  tableHead: {
    padding: '16px 20px',
    borderBottom: `1px solid ${theme.palette.customColor.borderLineColor}`
  },
  tableBody: {},
  groupListContainer: {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  groupListNoData: {
    background: theme.palette.text.white,
    flexGrow: 2,
    padding: 20
  },
  vgUnit: {
    width: '100%',
    marginBottom: 16
  },
  orgModalWidth: {
    width: 848
  }
})

export default userInfoStyle;