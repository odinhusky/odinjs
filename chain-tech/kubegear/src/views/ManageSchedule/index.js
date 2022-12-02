import React, {
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import { Route } from 'react-router-dom';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import {
  getJobSchedule,
  acceptJobSchedule,
  denyJobSchedule,
  getJobScheduleTable
} from 'utils/api';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../Schedule/ScheduleContext';

// ^ Material-ui Componets(Functions)
import Icon from '@material-ui/core/Icon'

// ? Self-packed Components || Functions
import { BaseTooltip } from 'components/BaseTooltip';
import CreateSchedule from './CreateSchedule';
import EditSchedule from './EditSchedule';
import ViewSchedule from '../Schedule/ViewSchedule';

import ScheduleCalendar from '../Schedule/components/ScheduleCalendar';
import {
  arrToObj,
  proxyGetCanUseVgList,
  clearScheduleResourceItem
} from 'common/commonMethods';
import { maxSafeNumber } from 'common/commonConstant';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'
import scheduleStyles from '../Schedule/scheduleStyles'
import { theme } from 'theme/palette'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    ...scheduleStyles(theme)
  }});

// ^ Plugins
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isEmpty, isObject } from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule Route
 * @component Schedule Route
 * @description Schedule Route page
*/
const ManageScheduleRoute = () => {

  // $ init data
  const { t } = useTranslation();
  const history = useHistory();

  // 資源選擇相關的
  const resourceRef = useRef();
  const resourceJobRef = useRef();

  // ! 是否為管理者
  const isAdminEntry = true;

  // ? context
  const {
    systemSetting,
    useSelector,
    selfLimitResourceObj
  } = useContext(GlobalContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);

  // = styles
  const classes = useStyles();
  const spacingClass = classes.mt_24;

  // # states
  const [selfCanUseVgList, setSelfCanUseVgList] = useState([])
  const [canUseVg, setCanUseVg] = useState([]);
  // 選擇叢集(Vg dropdown)
  const [selectedVgObj, setSelectedVgObj] = useState();
  const [schedules, setSchedules] = useState([]);
  const [createDate, setCreateDate] = useState();

  // 選完時間區段之後，過濾出可以使用的資源單位，以及該 Vg 的相關 data
  const [filteredResourceObj, setFilteredResourceObj] = useState({});

  // 限制資源的上限為共用的值
  const [remainObj, setRemainObj] = useState({
    cpu: 0,
    gpu: 0,
    memoryMB: 0
  });
  const [maxObj, setMaxObj] = useState({
    cpu: maxSafeNumber,
    gpu: maxSafeNumber,
    memoryMB: maxSafeNumber
  });

  // Schedule Calendar
  const [usedTimePeriod, setUsedTimePeriod] = useState({});
  const [totalResourceObj, setTotalResourceObj] = useState({});

  // EditSchedule
  const [editData, setEditData] = useState({});

  // 右方的過濾(filter dropdown)
  const [dropdownSelectedKey, setDropdownSelectedKey] = useState();
  const [dropdownSelectedText, setDropdownSelectedText] = useState();
  const [filterSchedulesList, setFilterSchedulesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // modal
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const [eventData, setEventData] = useState({});

  // & handled data
  const isJobNeedVerify = arrToObj(systemSetting)?.isJobNeedVerify === 'false' ? false : true

  const scheduleContext = {
    classes,
    spacingClass,
    selfCanUseVgList,
    // - 資源相關
    filteredResourceObj,
    setFilteredResourceObj,
    resourceRef,
    resourceJobRef,
    remainObj,
    maxObj
  };

  /**
   * @author odin
   * @param {number} state -- schedule state
   * @description 依照回傳 state 來設定不同的顏色
  */
  const pickColorByState = (state) => {
    switch (state) {
      case 1:
      default:
        return theme.themePrimary;
      case 0:
        return theme.themePending;
      case -1:
        return theme.themeDenyDefaultBackgroundColor;
    }
  }

  /**
   * @author odin
   * @param {string} vgName -- 預設或是選擇的 叢集名稱
   * @param {object} vgObj -- 預設或是選擇的 叢集物件
   * @description 設定選擇的 Vg 並且 重新取得排程內容
  */
  const setDropdownData = (vgName, vgObj) => {
    setSelectedVgObj(vgObj)

    // 根據選擇的 Vg name 取得不同的排程內容更新畫面
    getSchedule(vgName)
  }

  /**
   * @author odin
   * @param {string} selectedVg -- 目前選擇的 Vg 名稱
   * @description
   * - 1. 取得排程陣列
   * ^ 2. 並依照目前登陸的使用者來過濾資料
   * # 3. 依照需要的格式改寫資料結構
  */
  const getSchedule = async (selectedVg = selectedVgObj.name) => {
    setIsLoading(true)

    try{
      const jobScheduleReq = await getJobSchedule({ virtualGroup: selectedVg })

      const transformedJobSchedule = jobScheduleReq
        .map(item => {
          return (
            {
              ...item,
              start: item.startAt,
              end: item.endAt,
              color: pickColorByState(item.state)
            }
          )
        })

      setSchedules(transformedJobSchedule)
      setIsLoading(false)

    } catch (err) {
    // } catch ({ message: msg }) {

      setIsLoading(false)

      const msg = err.data.message
      toast.error(msg);
    }
  }

  /**
   * @author odin
   * @param {string} selectedVg -- 目前選擇的 Vg 名稱
   * @description 取得所有的資源分配時間段
  */
  const getTimePeriod = async (selectedVg = selectedVgObj.name) => {
    try {
      const timeReq = await getJobScheduleTable(selectedVg);

      // console.log('timeReq', timeReq);

      if(isObject(timeReq.data)){
        setUsedTimePeriod(timeReq.data);
      }

      if(timeReq && !isEmpty(timeReq.virtualGroup) && !isEmpty(timeReq.virtualGroup.cells)){
        setTotalResourceObj(timeReq.virtualGroup.cells)
      }
    } catch (err) {
    // } catch ({ message: msg }) {
      // console.log('err', err);
      const msg = err.data.message
      toast.error(msg);
    }
  };

  /**
   * @author odin]
   * @description 重新抓取目前的排程內容
  */
  const refreshEvent = () => {
    if (!isEmpty(selectedVgObj)) {
      getSchedule();
      getTimePeriod();
    }
  }

  /**
   * @author odin]
   * @description 依照時間條件判斷該屬性的值
   * @return {string | null}
  */
  const dayCellClassNames = (arg) => {
    if (moment(arg.date).valueOf() < moment().subtract(1, 'days').valueOf()) {
      return 'pastBackground'
    }
  }

  /**
   * @author odin
   * @description 每個排程在 Schedule上 顯示的內容
  */
  const eventContent = arg => {
    const eventData = filterSchedulesList.find(item => String(item.id) === arg.event.id)
    const { name, state, startAt, endAt, jobState } = eventData

    const nowTimeStamp = new Date().getTime();
    const isRunningPeriod = nowTimeStamp >= startAt && nowTimeStamp < endAt;

    // - 判斷作業是否在運行中
    // 必須要是 待審批 或是 審批成功 的狀態
    // isJobNeedVerify === false 不需要審批就會直接執行
    const isRunningJobCase1 = (isJobNeedVerify === true && state === 0) || state === 1;

    // jobState === -1: 失敗
    // jobState === 0: pending 狀態
    // jobState === 1 && isRunningPeriod === true: 運行中
    // jobState === 1 && 超出預約時間: 運行結束且成功
    const isRunningJobCase2 = jobState >= -1;
    const isRunningJob = isRunningJobCase1 && isRunningJobCase2 && isRunningPeriod;

    return (
      <BaseTooltip
        arrow
        placement="left"
        title={
          <div>
            <p>{moment(startAt).format('MM/DD HH:mm')} - {moment(endAt).format('MM/DD HH:mm')}</p>
          </div>
        }
      >
        <div className={`${classes.flex_align_center} ${classes.cursorPointer}`}>
          {/* 如果排程不需要驗證，代表所有狀態是 待審批 以及 通過 的排成在時間一到的時候就會自動運行，所以特別加上Icon給組長或是管理者區別其差異 */}
          {
            isRunningJob && (
              <Icon
                children="donut_large"
                className={`${classes.fz_12} ${classes.mr_8} ${classes.textWhite}`}
              />
            )
          }
          <div className={`fc-event-time ${classes.mr_10}`}>
            {arg.timeText}
          </div>
          <div className={'fc-event-title'}>
            {name}
          </div>
        </div>
      </BaseTooltip>
    )
  }

  /**
   * @author odin]
   * @description Calendar date click event
  */
  const handleDateClick = (item) => {
    if (selectedVgObj.name) {

      const pickToday = new Date(item.date).toDateString() === new Date().toDateString()

      // 是否不為過去的時間，但本來就沒辦法選過去的時間，比較嚴謹的寫法
      const isVaildTime = new Date(item.date).getTime() >= new Date().getTime()

      if (pickToday) {
        // - seconds(0) 屏除毫秒的尾數
        // - 後台不能送過去的時間，所以多給5分鐘的填表時間
        setCreateDate(() => moment(new Date()).seconds(0).add(5, 'm').toDate())
        history.push('/schedule-manage/create')
        return
      } else if (isVaildTime) {
        setCreateDate(() => new Date(item.date))
        history.push('/schedule-manage/create')
        return
      } else {
        // it's already handle dayCellClassNames
        toast.error(t('PleaseSelectTheCorrectScheduleDate'))
      }
    } else {
      toast.error(t('pleaseSelectVg'))
    }
  }

  /**
   * @author odin]
   * @description 回到 新增排程的 calendar 的頁面的方法
  */
  const handleBackToCalendar = () => {
    history.push('/schedule-manage')
    refreshEvent()
  }

  /**
   * @author odin]
   * @description Calendar event click event
  */
  const handleEventClick = (item) => {
    clearScheduleResourceItem();

    const id = Number(item.event._def.publicId)
    setEventData({ ...item.event._def.extendedProps, id })
    setIsShowDetailModal(true)
  }

  /**
   * @author odin
   * @param {number} id -- 該排程的 id
   * @description 管理者通過某個排程
  */
  const onAcceptSchedule = id => {
    acceptJobSchedule(id)
      .then(() => {
        setIsShowDetailModal(false);
        refreshEvent();
      })
      .catch(err => {
      // .catch(({ message: msg }) => {

        const msg = err.data.message
        toast.error(msg);
      });
  }

  /**
   * @author odin
   * @param {number} id -- 該排程的 id
   * @description 管理者拒絕某個排程
  */
  const onDenySchedule = id => {
    denyJobSchedule(id)
      .then(() => {
        setIsShowDetailModal(false);
        refreshEvent();
      })
      .catch(err => {
      // .catch(({ message: msg }) => {

        const msg = err.data.message
        toast.error(msg);
      });
  }

  /**
   * @author odin
   * @param {string} selectedVgName -- Vg dropdown 選擇的 '叢集名稱'
   * @description 將該function傳入子component中，選擇不同的叢集時，帶入名稱，並且依照選擇的叢集重新取得資料渲染畫面
  */
  const handleVgDropdownChange = (selectedVgName) => {
    // 找出 選擇的Vg 物件
    const nowSelectedVgObj = canUseVg.find(item => item.name === selectedVgName)

    // 設定選擇的 Vg 並且 重新取得排程內容
    setDropdownData(selectedVgName, nowSelectedVgObj)
  }

  /**
   * @author odin
   * @param {object} data -- 要編輯的排程物件
   * @description 進入編輯模式
  */
  const goEdit = (data) => {
    if(!isEmpty(data)) setEditData(data)
    history.push('/schedule-manage/edit')
  }

  // * hooks
  /**
   * @author odin
   * @description 過濾可以排成的叢集，並且預設第一個叢集為預設值
  */
  useEffect(() => {
    // 過濾出可以排程的叢集
    const schedulableData = selfCanUseVgList.filter(item => item.schedulable !== false);

    // 儲存結果到 state 上
    setCanUseVg(schedulableData)

    // 預設第一個叢集為目前選擇的叢集
    if (!isEmpty(schedulableData)) {
      const defaultVgObj = schedulableData[0]
      const defaultVgName = defaultVgObj.name

      // 設定選擇的 Vg 並且 重新取得排程內容
      setDropdownData(defaultVgName, defaultVgObj)
    }
  }, [selfCanUseVgList])

  /**
   * @author odin
   * @description 依照過濾的狀態過濾出目前要顯示的排程
  */
  useEffect(() => {
    setFilterSchedulesList(() => {
      switch(dropdownSelectedKey) {
        case 'all':
        default:
          return schedules;
        case 'accept':
          return schedules.filter(info => info.state === 1);
        case 'pending':
          return schedules.filter(info => info.state === 0);
        case 'deny':
          return schedules.filter(info => info.state === -1);
      }
    })
  }, [schedules, dropdownSelectedKey])

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

  /**
   * @author odin
   * @description 透過進入 Step1 藉由開始跟結束時間的選擇，得出的 filteredResourceObj
   * 外加個人限制的 selfLimitResourceObj 去計算出 remainObj 以及 maxObj
  */
  useEffect(() => {
    if(isEmpty(selectedVgObj) || isEmpty(selfLimitResourceObj) || isEmpty(filteredResourceObj)) return;

    const selectedVgName = selectedVgObj.name;
    const {
      cpu: limitedCPU,
      gpu: limitedGPU,
      memory: limitedMemoryMB
    } = selfLimitResourceObj[selectedVgName].resourceCells;

    const {
      cpu: filteredCPU,
      gpu: filteredGPU,
      memory: filteredMemoryMB
    } = filteredResourceObj;

    const resultObj = {
      cpu: Math.min(filteredCPU, (limitedCPU === -1 ? maxSafeNumber : limitedCPU)),
      gpu: Math.min(filteredGPU, (limitedGPU === -1 ? maxSafeNumber : limitedGPU)),
      memoryMB: Math.min(filteredMemoryMB, (limitedMemoryMB === -1 ? maxSafeNumber : limitedMemoryMB))
    };

    setMaxObj({ ...resultObj });
    setRemainObj({ ...resultObj });
  }, [selfLimitResourceObj, filteredResourceObj, selectedVgObj])

  return (
    <>
      {/* Material UI */}
      <ScheduleContext.Provider value={scheduleContext}>
        {/* 有日曆的 */}
        <Route
          exact
          path="/schedule-manage"
          render={matchProps => (
            <ScheduleCalendar
              calendarProps={{
                dayMaxEventRows: 4,
                dayCellClassNames,
                eventContent,
                eventDisplay: 'block',
                events: filterSchedulesList,
                handleDateClick,
                handleEventClick
              }}
              filterDropdownProps={{
                dropdownSelectedText,
                setDropdownSelectedText,
                setDropdownSelectedKey
              }}
              isLoading={isLoading}
              matchProps={matchProps}
              refreshEvent={refreshEvent}
              searchModalProps={{
                usedTimePeriod,
                totalResourceObj,
                getTimePeriod
              }}
              vgDropdownProps={{
                canUseVg,
                selectedVg: selectedVgObj?.name,
                handleVgDropdownChange
              }}
            />
          )}
        />

        {/* 新增修改 */}
        <Route
          exact
          path="/schedule-manage/create"
          render={matchProps => (
            // Create
            <CreateSchedule
              canUseVg={canUseVg}
              createDate={createDate}
              getData={getSchedule}
              pickDate={createDate}
              selectedVgObj={selectedVgObj}
              {...matchProps}
              handleBackToCalendar={handleBackToCalendar}
              isAdminEntry={isAdminEntry}
              userInfo={userInfo}
            />
          )}
        />

        <Route
          exact
          path="/schedule-manage/edit"
          render={matchProps => (
            // Edit
            <EditSchedule
              canUseVg={canUseVg}
              editData={editData}
              getData={getSchedule}
              handleBackToCalendar={handleBackToCalendar}
              {...matchProps}
              isAdminEntry={isAdminEntry}
              selectedVgObj={selectedVgObj}
              userInfo={userInfo}
            />
          )}
        />

        {
          isShowDetailModal &&
          <ViewSchedule
            eventData={eventData}
            goEdit={goEdit}
            isAdminEntry={isAdminEntry}
            isOpen={isShowDetailModal}
            onAcceptSchedule={onAcceptSchedule}
            onClose={() => {setIsShowDetailModal(false)}}
            onDenySchedule={onDenySchedule}
            refreshEvent={refreshEvent}
            selectedVg={selectedVgObj.name}
          />
        }
      </ScheduleContext.Provider>
    </>
  );
};


export default ManageScheduleRoute;