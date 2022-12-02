import React, {
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';

// ^ Redux
import { selectUserInfo } from 'layouts/Main/features/userinfo/userinfoSlice';

// # API
import { getJobScheduleTable, getUserAllLimitedVgResource } from 'utils/api';

// % context
import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../ScheduleContext';

// ^ Material-ui Components(Functions)
import { RadioGroup } from '@material-ui/core'

// ? Self-packed Components || Functions
import MuiDropdown from 'components/BaseMuiDropdown';
import MuiAutocomplete from 'components/BaseMuiAutocomplete';
import { DebounceRestrictRangeNumberInput } from 'components/Debounce/DebounceRestrictRangeNumberInput'
import { BaseRadio } from 'components/BaseMuiInput'
import { BaseDateTimePicker } from 'components/BaseDateTimePicker';
import { checkCanUseResource } from '../../ManageSchedule/utils';
import rules from 'common/commonValidation'
import { getTimeSec } from 'common/commonMethods'

import BaseResource from 'components/BaseResource';

// ^ Plugins
import moment from 'moment';
import {
  isEmpty,
  isNull,
  isNil,
  isEqual,
  isNumber
} from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step1
 * @component Step1
//  * @prop {object} editData -- 要修改的 data
 * @prop {number} dataId -- 要修改的 data ID
 * @prop {number} defaultStep1 -- 預設值 step1State 的預設值
 * @prop {function} setStep1State -- 父層 CreateSchedule 定義的 setState 方法
 * @prop {object} step1State -- 第一步驟所有的資料
 * @prop {object} selectedVgObj -- 選擇集群的物件
 * @prop {instanceOf(Date)} createDate -- 由最外層 ScheduleRoute 的元件在挑選玩日期之後判斷，如果是今天會多給 5 分鐘的填表時間，如果不是今天就直接帶入該日子的凌晨 0 時
 * @prop {boolean} isPreScheduledJob -- 父層 CreateSchedule 定義的 isPreScheduledJob state，true => 預約排程 | false => 預約資源
 * @prop {function} setIsPreScheduledJob -- 父層 CreateSchedule 定義針對 isPreScheduledJob 的 setState 方法
 * @prop {function} setActiveStep -- 父層 CreateSchedule 定義針對 activeStep 的 setState 方法
 * @prop {boolean} isAdminEntry -- 是否是由管理者的權限進入新增排程的流程的身份別，會影響是否呈現 選擇用戶 | 由此判斷限制可使用的資源列表
 * @prop {boolean} isStep1SubmitClicked -- 因為 button control bar 跟 step 不在同一個階層，透過這個按鈕
 * @prop {function} setIsStep1SubmitClicked -- 父層 CreateSchedule 定義針對 isStep1SubmitClicked 的 setState 方法
 * @prop {function} setOpenNextBtn -- 父層 CreateSchedule 定義針對 isStep1BtnOpen 的 setState 方法
 * @prop {function} onSubmit -- 新增排程的 Func.
 * @prop {boolean} isReserveResourceToReserveJob -- 是否在編輯模式，由預約資源轉為預約作業
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者被限制的資源數量列表
 * @prop {funciton} setThisVgLimitedResourceObj -- 設定目前這個使用者被限制的資源以及數量列表
 * @description Step1 Component
*/
export const Step1 = ({
  // editData,
  dataId,
  defaultStep1,
  setStep1State,
  step1State,
  selectedVgObj,
  createDate,
  isPreScheduledJob,
  setIsPreScheduledJob,
  setActiveStep,
  isAdminEntry,
  isStep1SubmitClicked,
  setIsStep1SubmitClicked,
  setOpenNextBtn,
  onSubmit,
  isReserveResourceToReserveJob,
  thisVgLimitedResourceObj,
  setThisVgLimitedResourceObj
}) => {

  // $ init data
  const { t } = useTranslation();
  const radioList = [
    { value: true, label: `${t('reserve')}${t('enSpace')}${t('job')}` },
    { value: false, label: `${t('reserve')}${t('enSpace')}${t('resource')}` }
  ]

  const defaultErrMsg = {
    scheduleName: '',
    jobName: '',
    user: ''
  }

  // ? context
  const {
    selfLimitResourceObj,
    useSelector
  } = useContext(GlobalContext);

  const {
    classes,
    spacingClass,
    setFilteredResourceObj,
    setTotalVgObj,
    resourceRef,
    maxObj,
    remainObj,
    canSplitGPU
  } = useContext(ScheduleContext);

  // ^ Redux
  const userInfo = useSelector(selectUserInfo);

  // # states
  const [userOptions, setUserOptions] = useState([]);
  const [errMsg, setErrMsg] = useState(defaultErrMsg)
  const [timePickerStartErrMsg, setTimePickerStartErrMsg] = useState('');
  const [timePickerEndErrMsg, setTimePickerEndErrMsg] = useState('');

  const [jobName, setJobName] = useState(`${userInfo.username}_${Date.now()}`); // `${user}_${Date.now()}`
  const [user, setUser] = useState(''); // 選擇用戶
  const [name, setName] = useState(''); // 排成名稱
  const [retryCount, setRetryCount] = useState(0); // 重試次數
  const [startAt, setStartAt] = useState(null); // 開始日期
  const [endAt, setEndAt] = useState(null); // 結束日期

  // 預約資源的資源格式
  const [k8sResource, setK8sResource] = useState({
    cpu: 0,
    gpu: 0,
    gpuMemoryPercentage: 100,
    memoryMB: 0
  });

  // - methods
  /**
   * @author odin
   * @param {number} selectedStartDate -- 開始時間的 timestamp
   * @param {number} selectedEndDate -- 結束時間的 timestamp
   * @description 根據現在選擇的叢集名稱，取得所有時間段可以用的資源
  */
  const getCanUseResource = (selectedStartDate, selectedEndDate) => {
    getJobScheduleTable(selectedVgObj.name, dataId)
      .then((res) => {
        const totalVg = res.virtualGroup
        const canUseResourceObj = checkCanUseResource(
          moment(selectedStartDate).valueOf(),
          moment(selectedEndDate).valueOf(),
          res.data,
          totalVg
        )

        // 設定可以用的資源
        setFilteredResourceObj(canUseResourceObj);
        setTotalVgObj(totalVg);
      })
      .catch(err => {
      // .catch(({ message: msg }) => {
        const msg = err?.data?.message
        const errorText = isNil(msg) ? err : msg;
        toast.error(errorText);
      });
  }

  const addDropDownOptionKeys = (optionItems, defaultSelect) => {
    if (defaultSelect !== undefined) {
      return [defaultSelect, ...optionItems].map((item, index) => ({
        key: index,
        text: item.name,
        ...item
      }));
    } else {
      return optionItems.map((item, index) => ({
        key: index,
        text: item.name,
        ...item
      }));
    }
  };

  const handleResourceUpdate = useCallback((param) => {
    setK8sResource(param);
  }, [setK8sResource]);

  // * hooks
  /**
   * @author odin
   * @description 以資源為優先的考量進入到排程的步驟中
  */
  useEffect(() => {
    const scheduleResourceItemString = localStorage.getItem('scheduleResourceItem');
    const scheduleResourceItem = !isNil(scheduleResourceItemString) ? JSON.parse(scheduleResourceItemString) : null;

    if(isNil(scheduleResourceItem)) return;

    const {
      filterHour,
      startTimeStamp
    } = scheduleResourceItem;

    const newStartAt = startTimeStamp;
    const newEndAt = newStartAt + getTimeSec(filterHour, 'h')

    setStartAt(newStartAt);
    setEndAt(newEndAt);
  }, []);

  /**
   * @author odin
   * @description step1State 解構出來分別塞入成為預設的內容
  */
  useEffect(() => {
    if (!isEqual(step1State, defaultStep1) || dataId) {
      const {
        user,
        name,
        startAt,
        endAt,
        jobName,
        jobRetryCount,
        k8sResource: editK8sResource
      } = step1State;

      setName(name)
      setStartAt(startAt)
      setEndAt(endAt)
      setJobName(jobName)
      setRetryCount(jobRetryCount)
      setK8sResource({ ...editK8sResource })

      if (user !== undefined) {
        setUser(user)
      }
    }
  }, [step1State])

  /**
   * @author odin
   * @description 會依照 外面選擇的日期來產生 createDate，依此來填入 startAt 的欄位
  */
  useEffect(() => {
    if (!isNil(createDate)) {
      setStartAt(createDate)
    }
  }, [createDate])

  /**
   * @author odin
   * @description startAt, endAt 兩個 日期不為空就會自動取得這段時間可以用的資源
  */
  useEffect(() => {
    if (
      !isNull(startAt) &&
      !isNull(endAt) &&
      !isNil(selectedVgObj)
    ) {
      getCanUseResource(startAt, endAt)
    }
  }, [startAt, endAt, selectedVgObj])

  /**
   * @author odin
   * @description 依照目前這個集群的使用者列表，繪製可以選擇的使用者有哪些
  */
  useEffect(() => {
    if(!isEmpty(selectedVgObj)) {
      const userList = selectedVgObj.users;
      const options = [...userList].map((item, idx) => ({
        key: idx,
        text: item,
        optionkey: idx
      }))

      setUserOptions(options)
    }
  }, [selectedVgObj])

  /**
   * @author odin
   * @description 只要進入第一步就會觸發
   * 取得管理者或是組長限制特定使用者的資源限制數量列表，以及目前這個集群被限制的資源數量列表
  */
  useEffect(() => {

    // 如果已經有了 且 selfLimitResourceObj 為空的，則不重新指定目前登入使用者的限制資源列表
    if(!isEmpty(thisVgLimitedResourceObj) && isEmpty(selfLimitResourceObj)) return

    const vgName = selectedVgObj?.name

    if(vgName) {
      const resourceCells  = selfLimitResourceObj[vgName].resourceCells
      setThisVgLimitedResourceObj(resourceCells)
    }

  }, [selectedVgObj, selfLimitResourceObj])

  /**
   * @author odin
   * @description 選取不同使用者的時候，就帶入該使用者的限制資源列表
  */
  useEffect(() => {
    const vgName = selectedVgObj?.name

    if(vgName && user) {

      getUserAllLimitedVgResource(user)
        .then(res => {
          let resourceCells = {}

          // 設定目前集群中被限制的資源物件詳情
          if(!isNil(res[vgName])) {
            resourceCells  = res[vgName].resourceCells
            setThisVgLimitedResourceObj(resourceCells)
          }
        })
        .catch(err => {
          // .catch(({ message: msg }) => {
          const msg = err.data.message
          toast.error(msg)
        });
    }
  }, [selectedVgObj, userInfo, user])

  /**
   * @author odin
   * @description 依照規則來判斷控制是否要進入到下一步
  */
  useEffect(() => {

    const timeDiff = moment(endAt).valueOf() - moment(startAt).valueOf();
    const isValidTime = (isNumber(timeDiff) && timeDiff <= 0) ? false : true;

    if(isPreScheduledJob) {
      // 預約作業的檢查規則
      if (isAdminEntry && user === '') {
        setOpenNextBtn(false)
      } else if (name === '') {
        setOpenNextBtn(false)
      } else if (
        moment(endAt).valueOf() - moment(startAt).valueOf() <= 0 ||
        isNaN(moment(endAt).valueOf() - moment(startAt).valueOf())
      ) {
        setOpenNextBtn(false)
      } else if(jobName === '') {
        setOpenNextBtn(false)
      } else {
        setOpenNextBtn(true)
      }

    } else {
      // 預約資源的檢查規則
      const { cpu, gpu, memoryMB } = k8sResource;
      const totalNum = cpu + gpu + memoryMB;

      // console.log(0, 'totalNum =>', totalNum)
      if (isAdminEntry && user === '') {
        // console.log(1, isAdminEntry, user)
        setOpenNextBtn(false);
      } else if (name === '') {
        setOpenNextBtn(false);
        // console.log(2, name)
      } else if (
        moment(endAt).valueOf() - moment(startAt).valueOf() <= 0 ||
        isNaN(moment(endAt).valueOf() - moment(startAt).valueOf())
      ) {
        setOpenNextBtn(false);
        // console.log(3, moment(endAt).valueOf(), moment(startAt).valueOf())
      } else if (totalNum === 0) {
        setOpenNextBtn(false)
        // console.log(4, totalNum)
      } else if(timePickerStartErrMsg !== '' || !isValidTime) {
        // console.log(5, timePickerStartErrMsg, timePickerEndErrMsg)
        setOpenNextBtn(false)
      } else {
        setOpenNextBtn(true)
      }
    }

  }, [isPreScheduledJob, name, startAt, endAt, jobName, user, k8sResource])

  /**
   * @author odin
   * @description 預約作業 => 通過的話就往下一步 | 預約資源 => 直接送出
  */
  useEffect(() => {
    if(isStep1SubmitClicked) {
      // 基本內容
      const state = {
        user: user ? user : userInfo.username,
        name: name,
        virtualGroup: dataId ? null : selectedVgObj.name,
        startAt: moment(startAt).valueOf(),
        endAt: moment(endAt).valueOf(),
        jobName: jobName,
        retryCount: retryCount
      }

      if (!isPreScheduledJob) {
        // 預約資源
        const { cpu, gpu, memoryMB, gpuMemoryPercentage } = k8sResource
        const cells = {};

        if(cpu !== 0 && isNumber(cpu)) cells.cpu = { name: 'cpu', number: cpu }
        if(gpu !== 0 && isNumber(gpu)) cells.gpu = { name: 'gpu', number: gpu }
        if(memoryMB !== 0 && isNumber(memoryMB)) cells.memory = { name: 'memoryMB', number: memoryMB }

        cells.gpuMemoryPercentage = { name: 'gpuMemoryPercentage', number: (canSplitGPU ? gpuMemoryPercentage : 100) }

        const data = {
          ...state,
          cells
        }

        onSubmit(data)
      } else {
        // 預約作業
        setStep1State(prev => ({ ...prev, ...state }))

        // 編輯模式下 且 是從 預約資源轉為預約作業 的排程，才能夠直接跳過第二步驟
        setActiveStep(prevActiveStep =>
          dataId && isReserveResourceToReserveJob === false
            ? prevActiveStep + 2
            : prevActiveStep + 1
        )
      }

      // 被觸發完之後改回 false
      setIsStep1SubmitClicked(false)
    }
  }, [isStep1SubmitClicked])

  return (
    <div className={`${classes.stepsContainer} ${classes.contentContainer}`}>

      <div className={`${spacingClass} ${classes.flexInputTotal}`}>
        <div className={`${classes.flex_align_center} ${classes.w_full}`}>
          {/* 選擇用戶(排程管理 且 新增排程的時候才會出現) */}
          {
            (isAdminEntry && !dataId) &&
            <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
              <MuiDropdown
                classNameObj={{
                  container: classes.w_full
                }}
                list={addDropDownOptionKeys(userOptions)}
                onChange={(e) => {
                  const text = e.target.value;

                  setJobName(`${text}_${Date.now()}`)
                  setUser(text)
                }}
                text={`${t('select')}${t('enSpace')}${t('User')}`}
                textFieldProps={{
                  error: user === '' ? true : false,
                  helperText: t('fieldRequired')
                }}
                value={user}
              />
            </div>
          }

          {/* 排程名稱 */}
          <div className={`${classes.flexBackInput} ${(isAdminEntry && !dataId) ? classes.pl_10 : classes.pr_10}`}>
            <MuiAutocomplete
              classes={{ root: `${classes.w_full}` }}
              onInputChange={(e, scheduleName) => {
                setName(scheduleName)

                // 檢查欄位並置放錯誤訊息
                const checkField = rules.required(scheduleName, t);
                setErrMsg(prev => ({ ...prev, userCode: checkField }))
              }}
              placeholder={`${t('schedule')}${t('enSpace')}${t('name')}`}
              required
              textFieldProps={{
                error: errMsg.scheduleName ? true : false,
                helperText: errMsg.scheduleName
              }}
              value={name}
            />
          </div>
        </div>
      </div>

      {/* Radios: 選擇要 預約作業(true) 還是 預約資源(false) */}
      <div className={`${classes.flexInputTotal} ${spacingClass}`}>
        <div className={`${classes.flex_align_center} ${classes.w_full} ${classes.h_30}`}>
          <RadioGroup
            className={`${classes.w_full}`}
            name={'jobLifeHour'}
            onChange={(e) => {
              const value = e.target.value === 'true' ? true : false
              setIsPreScheduledJob(value)
            }}
            row
            value={isPreScheduledJob}
          >
            {
              !isEmpty(radioList) && ( radioList.map(item => (
                <BaseRadio
                  key={item.label}
                  label={item.label}
                  radioProps={{
                    color: 'primary',
                    className: classes.radioRoot
                  }}
                  value={item.value}
                />
              ))
              )
            }
          </RadioGroup>
        </div>
      </div>

      {/* 作業名稱 & 重試次數 */}
      {
        isPreScheduledJob &&
          <div className={`${classes.flexInputTotal} ${spacingClass}`}>
            <div className={`${classes.flex_align_center} ${classes.w_full}`}>

              {/* 作業名稱 */}
              <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
                <MuiAutocomplete
                  classes={{ root: `${classes.w_full}` }}
                  onInputChange={(e, jobName) => {
                    setJobName(jobName)

                    // 檢查欄位並置放錯誤訊息(當預約作業的時候才需要做檢查的動作)
                    if(isPreScheduledJob) {
                      const checkField = rules.required(jobName, t);
                      setErrMsg(prev => ({ ...prev, jobName: checkField }))
                    }
                  }}
                  placeholder={`${t('job')}${t('enSpace')}${t('name')}`}
                  required
                  textFieldProps={{
                    error: errMsg.jobName ? true : false,
                    helperText: errMsg.jobName
                  }}
                  value={jobName}
                />
              </div>

              {/* 重試次數 */}
              <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
                {/* 有限制範圍的 Number Input */}
                <DebounceRestrictRangeNumberInput
                  classNameProps={`${classes.unlimitWidthInput}`}
                  min={0}
                  onChange={(retryCount) => {
                    setRetryCount(retryCount)
                  }}
                  textInputProps={{
                    label: `${t('retryCount')}(${t('optional')})`
                  }}
                  value={retryCount}
                />
              </div>
            </div>
          </div>
      }

      {/* 開始日期 & 結束日期(不論是 預約作業 還是 預約資源都會存在的欄位) */}
      <div className={`${classes.flexInputTotal} ${spacingClass}`}>
        <div className={`${classes.flex_align_center} ${classes.w_full}`}>

          <div className={`${classes.flexFrontInput} ${classes.pr_10}`}>
            <BaseDateTimePicker
              classNameProps={`${classes.unlimitWidthInput} ${classes.errorText}`}
              error={timePickerStartErrMsg}
              helperText={timePickerStartErrMsg}
              inputVariant="outlined"
              invalidDateMessage={t('dateInValid')}
              isRequired
              label={t('selectastartdate')}
              minDate={step1State.startAt}
              onChange={(item) => setStartAt(item)}
              onError={(err) => {
                if (err) {
                  setTimePickerStartErrMsg(err)
                } else {
                  setTimePickerStartErrMsg('')
                }
              }}
              value={startAt}
              variant="dialog"
            />
          </div>

          <div className={`${classes.flexBackInput} ${classes.pl_10}`}>
            <BaseDateTimePicker
              classNameProps={`${classes.unlimitWidthInput} ${classes.errorText}`}
              error={timePickerEndErrMsg}
              helperText={timePickerEndErrMsg}
              inputVariant="outlined"
              invalidDateMessage={t('dateInValid')}
              isRequired
              label={t('selectaenddate')}
              minDate={startAt}
              minDateMessage={t('DateShouldNotOverStartDay')}
              onChange={(item) => (setEndAt(item))}
              onError={(err) => {
                if (err) {
                  setTimePickerEndErrMsg(err)
                } else {
                  const timeDiff = moment(endAt).valueOf() - moment(startAt).valueOf();
                  const errMsg = (isNumber(timeDiff) && timeDiff <= 0) ? t('DateShouldNotOverStartDay') : '';

                  setTimePickerEndErrMsg(errMsg);
                }
              }}
              value={endAt}
              variant="dialog"
            />
          </div>
        </div>
      </div>

      {/* 如果是管理者權限進來這頁，要選擇姓名以後才會顯示選擇資源的區塊 */}
      {/* 非管理者頁面一切換成預約資源就顯示該區塊 */}
      <div className={`${classes.flexInputTotal} ${classes.mt_20}`} />
      {
        (
          isAdminEntry === true && user !== '' ||
            isAdminEntry === false
        ) && (
          <>
            {/* 選擇資源(預約資源的時候才顯示) */}
            {
              isPreScheduledJob === false  &&
              <div
                className={`
                ${classes.flexInputTotal}
                ${(isPreScheduledJob === false && !isNil(startAt) && !isNil(endAt)) ? spacingClass : ''}
              `}
              >
                <div className={`${classes.flexBothInput}`}>
                  <BaseResource
                    canSplitGPU={canSplitGPU}
                    handleUpdate={handleResourceUpdate}
                    hasGPUMemoryPercentageLimit={false}
                    maxObj={maxObj}
                    ref={resourceRef}
                    remainObj={remainObj}
                    value={k8sResource}
                  />
                </div>
              </div>
            }
          </>
        )
      }
    </div>
  )
}

Step1.propTypes = {
  // editData: PropTypes.object,
  dataId: PropTypes.number,
  defaultStep1: PropTypes.object,
  setStep1State: PropTypes.func,
  step1State: PropTypes.object,
  selectedVgObj: PropTypes.object,
  selectedVgUsers: PropTypes.array,
  createDate: PropTypes.instanceOf(Date),
  isPreScheduledJob: PropTypes.bool,
  setIsPreScheduledJob: PropTypes.func,
  setActiveStep: PropTypes.func,
  isAdminEntry: PropTypes.bool,
  isStep1SubmitClicked: PropTypes.bool,
  setIsStep1SubmitClicked: PropTypes.func,
  isStep1Submit: PropTypes.bool,
  setOpenNextBtn: PropTypes.func,
  onSubmit: PropTypes.func,
  isReserveResourceToReserveJob: PropTypes.bool,
  thisVgLimitedResourceObj: PropTypes.object,
  setThisVgLimitedResourceObj: PropTypes.func
};
