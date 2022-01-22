import React, {
  useState,
  useEffect,
  useContext
} from 'react'

// ^ Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import {
  // # 取得一段時間的 jobSchedule
  getRangeJobSchedule
} from 'utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import EntryContext from '../../EntryContext';

// ^ Material-ui Componets(Functions)
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

// ? Self-packed Components || Functions
import {
  computeDayRange
} from 'common/commonMethods';
import { useInterval } from 'utils/useInterval'

// ^ plugins
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty, isNil } from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment'

/**
 * @author odin
 * @level views/Entry/StatusBar
 * @component StatusBar
 * @description Upper StatusBar
*/
export default function StatusBar() {

  // $ init data
  const { t } = useTranslation();

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);

  // % context
  const { classes, history } = useContext(EntryContext);
  const { asyncIsFileExist } = useContext(GlobalContext);

  // # states
  const [nowStamp, setNowStamp] = useState(0)     // 毫秒級 13 位
  const [welcomeIndex, seWelcomeIndex] = useState('')        // 歡迎詞的索引值
  const [schedules, setSchedules] = useState([])
  const [relatedGroups, setRelatedGroups] = useState([])
  const [weeklySchedules, setWeeklySchedules] = useState(0)
  const [weeklyRunning, setWeeklyRunning] = useState(0)
  const [weeklyPending, setWeeklyPending] = useState(0)
  const [weeklyCompleted, setWeeklyCompleted] = useState(0)
  const [statusUserName, setStatusUserName] = useState('') // 要顯示的使用者名稱，優先顯示姓名，其次用戶名

  const [svgExist, setSvgExist] = useState(false);

  useEffect(() => {
    asyncIsFileExist('/assets/img/trademark/profile_pic.svg')
      .then(res => setSvgExist(res))
  }, [])

  // - methods
  /**
   * @author odin
   * @description Get initialization data from API
  */
  const initData = async () => {
    try {
      // 取得本週的開始以及結束 timeStamp(s)
      const { start, end } = computeDayRange({ key: 'thisWeek' });

      // 取得本週的 jobSchedule
      const thisWeekJobScheduleReq = await getRangeJobSchedule(start * 1000, end * 1000);

      if(thisWeekJobScheduleReq && !isEmpty(thisWeekJobScheduleReq)){
        setSchedules(thisWeekJobScheduleReq)
      }

    } catch (err) {
    // } catch ({ message: msg }) {
      const msg = err.data.message
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @description Get now time stamp with milisecond unit
  */
  const initNowTimeStamp = () => {
    // 準確到毫秒
    const nowTimeStamp = +moment().format('x');

    setNowStamp(nowTimeStamp)
  }

  /**
   * @author odin
   * @description Get weekly running schedules number
   * @rules jobState === 1 && endAt > 現在的timeStamp
  */
  const getWeeklyRunningNum = () => {
    let count = 0

    schedules.forEach(item => {
      if(item.jobState === 1 && item.endAt > nowStamp) {
        count++;
      }
    })

    return count
  }

  /**
   * @author odin
   * @description Get weekly pending schedules number
   * @rules state === 0
  */
  const getWeeklyPendingNum = () => {
    let count = 0

    schedules.forEach(item => {
      if(item.state === 0) {
        count++;
      }
    })

    return count
  }

  /**
   * @author odin
   * @description Get weekly running schedules number
   * @rules jobState === 1 && endAt < 現在的timeStamp
  */
  const getWeeklyCompletedNum = () => {
    let count = 0

    schedules.forEach(item => {
      if(item.jobState === 1 && item.endAt < nowStamp) {
        count++;
      }
    })

    return count
  }

  /**
   * @author odin
   * @description Navigate to personal message
  */
  const naviToPersonalMessage = () => {
    history.push('/user-info')
  }

  /**
   * @author odin
   * @description 檢查現在的時間是否要更換歡迎詞
  */
  const isNeedToChangeWelcome = () => {
    const nowTimeHour = +moment().format('HH');
    let welcomeIndex = 0;

    switch(nowTimeHour) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        welcomeIndex = 0
        break;
      case 6:
      case 7:
      case 8:
        welcomeIndex = 1
        break;
      case 9:
      case 10:
      case 11:
        welcomeIndex = 2
        break;
      case 12:
      case 13:
        welcomeIndex = 3
        break;
      case 14:
      case 15:
      case 16:
        welcomeIndex = 4
        break;
      case 17:
      case 18:
        welcomeIndex = 5
        break;
      case 19:
      case 20:
      case 21:
        welcomeIndex = 6
        break;
      case 22:
      case 23:
      case 24:
        welcomeIndex = 7
        break;
    }

    seWelcomeIndex(welcomeIndex);

  }

  // * hooks
  /**
   * @author odin
   * @description Component data initialization
  */
  useEffect(()=> {
    initData();
    initNowTimeStamp();
    isNeedToChangeWelcome();
  }, [])

  /**
   * @author odin
   * @description Component data initialization
  */
  useEffect(()=> {
    const { name, username } = userInfo
    if(!isEmpty(userInfo)) {
      const { leaderGroups, userGroups } = userInfo
      const mixed = [...leaderGroups, ...userGroups]
      const eliminateRepeat = new Set(mixed)
      const relatedGroupsArr = [...eliminateRepeat]

      setRelatedGroups(relatedGroupsArr)
    }

    // 優先顯示姓名，其次用戶名
    if(!isNil(name)) {
      setStatusUserName(name)
    } else if(!isNil(username)) {
      setStatusUserName(username)
    } else {
      setStatusUserName('')
    }

  }, [userInfo])

  /**
   * @author odin
   * @description 每分鐘判斷一次現在的時間更新，確認歡迎詞是否有需要改變
  */
  useInterval(() => {
    isNeedToChangeWelcome()
  }, 60000 )

  /**
   * @author odin
   * @description Watch and handling state schedules
  */
  useEffect(()=> {

    // 如果排程內容為0
    if(isEmpty(schedules) && schedules.length === 0) {
      setWeeklySchedules(0)
      setWeeklyRunning(0)
      setWeeklyPending(0)
      setWeeklyCompleted(0)
    } else {
      // 依照不同的規則過濾
      const weeklySchedulesNum = schedules.length
      const weeklyRunningNum = getWeeklyRunningNum()
      const weeklyPendingNum = getWeeklyPendingNum()
      const weeklyCompletedNum = getWeeklyCompletedNum()

      setWeeklySchedules(weeklySchedulesNum)
      setWeeklyRunning(weeklyRunningNum)
      setWeeklyPending(weeklyPendingNum)
      setWeeklyCompleted(weeklyCompletedNum)
    }

  }, [schedules])

  return (
    <section className={classes.statusBar}>

      {/* 左邊的歡迎區塊 */}
      <section className={classes.welcomSection}>

        <div className={classes.statusBarLogo}>
          {
            svgExist &&
              <img
                alt="Logo"
                className={classes.statusBarLogoImg}
                src="/assets/img/trademark/profile_pic.svg"
              />
          }
        </div>

        <div className={classes.detailBox}>

          <Typography
            className={classes.welcomText}
            component="div"
            variant="h5"
          >
            {`${t('welcomes', { returnObjects: true })[welcomeIndex]}, ${statusUserName}`}
          </Typography>

          <div className={classes.detailLine}>

            {/* 個人信息 */}
            <Link
              className={classes.personalMsg}
              color="primary"
              onClick={naviToPersonalMessage}
            >
              {t('basicInformation')}
            </Link>

            {/* 所屬組別 system */}
            <Typography
              className={classes.categorySystemName}
              component="div"
              variant="body2"
            >
              <div className={classes.relatedGroupName}>
                <div className={classes.relatedGroupTitle}>{t('relatedGroup')}</div>
                <div className={classes.relatedGroupString}>{relatedGroups.join(', ')}</div>
              </div>
            </Typography>

          </div>

        </div>

      </section>

      {/* 右邊的狀態顯示 */}
      <section className={classes.statusSection}>

        {/* 排程數 */}
        <div className={classes.statusUnit}>
          <Typography
            className={classes.statusUnitItemName}
            component="div"
            variant="h6"
          >
            {`${t('weeklyReservation')}`}
          </Typography>

          <Typography
            className={classes.statusUnitItemValue}
            component="div"
            variant="h5"
          >
            {weeklySchedules}
          </Typography>
        </div>

        {/* 運行中排程 */}
        <div className={classes.statusUnit}>
          <Typography
            className={classes.statusUnitItemName}
            component="div"
            variant="h6"
          >
            {`${t('running')}${t('schedule')}`}
          </Typography>

          <Typography
            className={classes.statusUnitItemValue}
            component="div"
            variant="h5"
          >
            {weeklyRunning}
          </Typography>
        </div>

        {/* 待審批排程 */}
        <div className={classes.statusUnit}>
          <Typography
            className={classes.statusUnitItemName}
            component="div"
            variant="h6"
          >
            {`${t('pending')}${t('schedule')}`}
          </Typography>

          <Typography
            className={classes.statusUnitItemValue}
            component="div"
            variant="h5"
          >
            {weeklyPending}
          </Typography>
        </div>

        {/* 結束的排程 */}
        <div className={classes.statusUnit}>
          <Typography
            className={classes.statusUnitItemName}
            component="div"
            variant="h6"
          >
            {`${t('completed')}${t('schedule')}`}
          </Typography>

          <Typography
            className={classes.statusUnitItemValue}
            component="div"
            variant="h5"
          >
            {weeklyCompleted}
          </Typography>
        </div>
      </section>

    </section>
  )
}

StatusBar.propTypes = {
  // history: PropTypes.object
}