import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';
import { selectIsShowGuide, selectCurrentStep } from 'layouts/Main/features/guide/guideSlice';

// # API
import { getJobList } from '../../utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import EntryContext from './EntryContext';

// ^ Material-ui Componets(Functions)
import useMediaQuery from '@material-ui/core/useMediaQuery';

// ? Self-packed Components || Functions
import StatusBar from './components/StatusBar'
import AdminPanels from './components/AdminPanels'
import GeneralPanels from './components/GeneralPanels'
import { proxyGetCanUseVgList } from 'common/commonMethods'

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import entryStyle from './entryStyle'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...entryStyle(theme)
  }});

// ^ Plugins
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Entry
 * @component Entry
 * @description Entry page
*/
const Entry = () => {

  // $ init data
  const history = useHistory();
  const { t } = useTranslation();
  const isSmallTablet = useMediaQuery('(max-width: 1024px)');

  // 作業依據不同的狀態所定義的作業數量，y 為HighChart 套件的資料定義名稱，在此代表數量, list 為依照該內容分類的作業列表
  const defalutJobStatusObj = {
    'STOPPED': {
      name: t('stopped'),
      y: 0,
      list: []
    },
    'STOPPING': {
      name: t('stopping'),
      y: 0,
      list: []
    },
    'WAITING': {
      name: t('waitingNoun'),
      y: 0,
      list: []
    },
    'FAILED': {
      name: t('fail'),
      y: 0,
      list: []
    },
    'RUNNING': {
      name: t('running'),
      y: 0,
      list: []
    },
    'SUCCEEDED': {
      name: t('success'),
      y: 0,
      list: []
    }
  }

  // ? context
  const {
    // userInfo,
    noticeList,
    useSelector
  } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);
  const isShowGuide = useSelector(selectIsShowGuide);
  const currentStep = useSelector(selectCurrentStep);

  // = styles
  const classes = useStyles();

  // # states
  const [isAdmin, setIsAdmin] = useState()
  const [jobList, setJobList] = useState([])

  // 各個狀態的數量有多少
  const [jobStatusList, setJobStatusList] = useState(defalutJobStatusObj)
  const [selfCanUseVgList, setSelfCanUseVgList] = useState([]);

  // & handled data
  const states = new Set([
    'STOPPED',
    'STOPPING',
    'WAITING',
    'FAILED',
    'RUNNING',
    'SUCCEEDED'
  ]);

  const jobListKeys = Object.keys(defalutJobStatusObj);

  const entryContext = {
    userInfo,
    classes,
    isAdmin,
    history,
    noticeList,
    jobList,
    jobStatusList,
    jobListKeys,
    selfCanUseVgList,
    isShowGuide,
    currentStep,
    isSmallTablet
  };

  // - methods
  /**
   * @author odin
   * @description 取得 所有的作業
  */
  const getData = async () => {
    try {
      // 取得本週的 jobSchedule
      const jobListReq = await getJobList();

      if(jobListReq && !isEmpty(jobListReq)){
        // 儲存結果到 state 上
        setJobList(jobListReq)

        // 計算作業的狀態
        calculateJobStatus(jobListReq)
      }

    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @description 依據不同的作業狀態，計算個別數量
  */
  const calculateJobStatus = (jobListReq) => {
    const immutableJobStatusObj = { ...defalutJobStatusObj }

    jobListReq.forEach(job => {
      const { state } = job

      // 計算各個類別的資料，並且分類
      if (states.has(state)){
        immutableJobStatusObj[state]['y'] += 1
        immutableJobStatusObj[state]['list'].push(job)
      }
    })

    // 儲存計算好的結果
    setJobStatusList(immutableJobStatusObj);
  }

  // * hooks
  /**
   * @author odin
   * @description 確認是否為 Admin 帳號身份
  */
  useEffect(() => {
    if(isEmpty(userInfo)) return;

    const { privileges } = userInfo;
    setIsAdmin(!isEmpty(privileges) && privileges.includes('ADMIN'))
  }, [userInfo])

  /**
   * @author odin
   * @description Component data initialization
  */
  useEffect(() => {
    getData();
  }, [])

  /**
   * @author odin
   * @description 一開始先取得這個登入的使用者的 可以使用的叢集列表
  */
  useEffect(() => {
    const { username } = userInfo;

    if(username) {
      proxyGetCanUseVgList(username, setSelfCanUseVgList)
    }
  }, [userInfo])

  return (
    <>
      <EntryContext.Provider value={entryContext}>
        {/* Material UI new version */}
        <div className={classes.rootContent}>

          {/* 狀態列 */}
          <section className={`${classes.statusContent}`}>
            <StatusBar />
          </section>

          {/* 內容 */}
          <section
            className={`
              ${isAdmin && classes.entryContent}
              ${!isAdmin && classes.entryContentGeneral}
            `}
          >

            {
              // 如果是 Admin 帳號就顯示 Admin 的面板
              isAdmin && (
                <AdminPanels />
              )
            }

            {
              // 如果 "不是" Admin 帳號就顯示 一般會員
              (isAdmin !== undefined) && !isAdmin && (
                <GeneralPanels />
              )
            }
          </section>
        </div>
      </EntryContext.Provider>
    </>
  );
};

export default Entry;
