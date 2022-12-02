import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import Step3Context from './Step3Context';
import ScheduleContext from '../ScheduleContext';
// import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import DynamicSelectableResourceList from '../components/DynamicSelectableResourceList'
import TaskRole from './Step3/TaskRole';
// import { arrToObj } from 'common/commonMethods'

// ^ Plugins
import PropTypes from 'prop-types';
import { validate } from 'joi-browser';
import { TaskRoleSchema } from '../model/JobTaskRoleSchema';
import {
  isNil,
  // isEmpty,
  // has,
  cloneDeep
} from 'lodash';

/**
 * @author odin
 * @prop {object}
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step3
 * @prop {object} data -- 要修改的 data
 * @prop {number} dataId -- 要修改的 data ID
 * @prop {string} username -- 目前登入的使用者名稱
 * @prop {boolean} isAdminEntry -- 是否是從排程管理進來的使用者權限
 * @prop {object} jobTaskRoles -- 所有的作業模板
 * @prop {function} setJobTaskRoles -- 設定 作業模板的 setState
 * @prop {function} resetDefault -- 將 step1State | step2State 等資料都清除掉的 Func.
 * @prop {object} step1State -- step1 所有的資料
 * @prop {object} step2State -- step2 所有的資料
 * @prop {array} resOptions -- 選擇資源所有可以選的選項(陣列包物件)
 * @prop {function} setOpenNextBtn -- 是否要開啟下一步的判斷布林值 的 steState Func.
 * @prop {function} setStep3BackNum -- 設定回上一步的步數的 steStae Func.
 * @prop {function} setErrorMessage -- 紀錄錯誤訊息的函式
 * @prop {object} defaultJobTaskRolesUnit -- 預設的 taskRoles 內容
 * @prop {boolean} isReserveResourceToReserveJob -- 是否在編輯模式，由預約資源轉為預約作業
 * @prop {object} thisVgLimitedResourceObj -- 目前這個使用者被限制的資源數量列表
 * @prop {function} setStep5BackNum -- 設定要回到第五部的步數
 * @component Step3
 * @description Step3 Component
*/
export const Step3 = ({
  data,
  dataId,
  username,
  jobTaskRoles,
  setJobTaskRoles,
  setActiveStep,
  step2State,
  setOpenNextBtn,
  setErrorMessage,
  defaultJobTaskRolesUnit,
  isReserveResourceToReserveJob = false,
  thisVgLimitedResourceObj,
  setStep5BackNum
}) => {

  // ? context
  // const { getResourceUnitCount } = useContext(GlobalContext);
  const {
    classes,
    maxObj,
    remainObj,
    resourceJobRef
  } = useContext(ScheduleContext);

  // # states
  const [isOverSelectableResourceMax, setIsOverSelectableResourceMax] = useState(false);
  const [isCustomize, setIsCustomize] = useState(false);

  // - method
  /**
   * @author odin
   * @description 確認 TaskRoles 的規格是不是符合 Joi 的驗證規則
   * @return {boolean}
  */
  const checkStep3TaskRoles = (jobTaskRole) => {
    const { error: TaskRoleErr } = validate(jobTaskRole, TaskRoleSchema)

    // console.log('jobTaskRole', jobTaskRole)
    // console.log(`${jobTaskRole.name} Error`, TaskRoleErr)

    const hasError = TaskRoleErr
    if (hasError === null) {
      return true
    } else {
      return false
    }
  };

  /**
   * @author odin
   * @param {object} jobConfig -- 從模板中取出的 jobConfig
   * @description 判斷是否要轉跳到第五步
  */
  const isJumpToStep5 = (jobConfig) => {
    const { isModify, templateInfo, selectedKey } = step2State
    const owner = templateInfo?.owner

    // $ 1. 有勾選模板
    // $ 2. 該模板是自己的
    // $ 3. 沒勾修改配置
    // $ 4. 該模板內容要是符合 taskrole 所有的欄位(因為此次改版主要是資源的格式有變動，這邊先檢查資源的內容有符合，才能讓他跳到第五步驟)
    // $ 5. 除了格式以外，同時該模板內的所有資源也都不得超過目前可用資源內的最大可配置數量，只要有任一個條件沒通過，都得留在第三步驟重新修改配置

    const case1 = selectedKey === 1
    const case2 = owner === username;
    const case3 = isModify === false;
    const case4 = (() => {

      let isCase4Valid = true;

      const { taskRoles } = jobConfig;

      // 加總每一個資源的數量
      const k8sResourceTotal = Object.entries(taskRoles).reduce((acc, [, obj]) => {
        const { cpu, gpu, memoryMB } = obj.resourcePerInstance

        return {
          ...acc,
          cpu: acc.cpu += cpu,
          gpu: acc.gpu += gpu,
          memoryMB: acc.memoryMB += memoryMB
        }
      }, { cpu: 0, gpu: 0, memoryMB: 0 })

      if(
        k8sResourceTotal.cpu > maxObj.cpu ||
        k8sResourceTotal.gpu > maxObj.gpu ||
        k8sResourceTotal.memoryMB > maxObj.memoryMB
      ) {
        isCase4Valid = false;
      }

      return isCase4Valid;
    })();

    // 設定第五部可以返回的步數以及是否可以轉跳到第五步驟
    if (
      case1 && case2 && case3 && case4
    ) {
      setStep5BackNum(-3)
      setActiveStep((prevActiveStep) => prevActiveStep + 2)
    } else {
      setStep5BackNum(-1)
    }
  };

  // & handled data
  const step3Context = {
    maxObj,
    remainObj,
    resourceJobRef
  };

  // * hooks
  /**
   * @author odin
   * @description 設定是否為自定義 && 計算出每個 taskRoleCountObj
  */
  useEffect(() => {
    let jobConfig = null;
    const { selectedKey, templateInfo } = step2State;

    // 設定是否為自定義
    setIsCustomize(selectedKey === 0);

    if(dataId && !isReserveResourceToReserveJob) {
      jobConfig = data.jobConfig
    } else {
      // 新增排程
      // 如果是自定義就不帶入任何值也不需要計算
      if(selectedKey === 0) return;
      jobConfig = templateInfo.jobConfig
    }

    if(!isNil(jobConfig)) {
      // 判斷是否要轉跳到第五步
      isJumpToStep5(jobConfig);
    }
  }, [step2State])

  /**
   * @author odin
   * @description 確認 TaskRoles的規格是不是符合 Joi 的驗證規則來決定是否可以進行到下一步
  */
  useEffect(() => {
    const jobTaskRolesArr = Object.entries(jobTaskRoles).map(([, obj]) => obj);
    const validateArr = jobTaskRolesArr.map(obj => checkStep3TaskRoles(obj));

    // console.log('validateArr', validateArr);
    // console.log('isOverSelectableResourceMax', isOverSelectableResourceMax);

    // $ case1: 每一個 taskrole 的格式都要正確
    // $ case2: 資源不能超過可以分配的最大值

    const case1 = !validateArr.includes(false)
    const case2 = isOverSelectableResourceMax === false

    if (case1 && case2) {
      setOpenNextBtn(true)
    } else {
      setOpenNextBtn(false)
    }
  }, [jobTaskRoles, isOverSelectableResourceMax]);

  /**
   * @author odin
   * @description 如果是自定義的預約排程，且 taskRole 只有一個的話，才去取得資源優先來的物件，將第一個 taskRole 預設帶入外面資源優先的資源、數量
  */
  useEffect(() => {
    // const isCustomize = step2State.selectedKey === 0;
    const tabsNames = Object.keys(jobTaskRoles);

    if(isCustomize && tabsNames.length === 1) {
      const copyJobTaskRoles = cloneDeep(jobTaskRoles);
      const targetKeyName = tabsNames[0];

      const scheduleResourceItemString = localStorage.getItem('scheduleResourceItem');
      const scheduleResourceItem = !isNil(scheduleResourceItemString) ? JSON.parse(scheduleResourceItemString) : null;

      if(isNil(scheduleResourceItem)) return;

      const {
        filterCPU,
        filterGPU,
        filterMemory
      } = scheduleResourceItem;

      // console.log('copyJobTaskRoles before', copyJobTaskRoles);

      copyJobTaskRoles[targetKeyName].k8sResource = {
        cpu: filterCPU,
        gpu: filterGPU,
        memoryMB: filterMemory,
        gpuMemoryPercentage: 100
      };

      // console.log('copyJobTaskRoles after', copyJobTaskRoles);

      setJobTaskRoles(copyJobTaskRoles);
    }
  }, [isCustomize]);

  return (
    <Step3Context.Provider value={step3Context}>
      <div className={`${classes.stepsContainer}`}>

        {/* 依照權限是否顯示剩餘的 可用資源  */}
        <DynamicSelectableResourceList
          jobTaskRoles={jobTaskRoles}
          setIsOverSelectableResourceMax={setIsOverSelectableResourceMax}
        />

        {/* 各個 TaskRole 的內容 */}
        <TaskRole
          data={data}
          dataId={dataId}
          defaultJobTaskRolesUnit={defaultJobTaskRolesUnit}
          jobTaskRoles={jobTaskRoles}
          setErrorMessage={setErrorMessage}
          setJobTaskRoles={setJobTaskRoles}
          thisVgLimitedResourceObj={thisVgLimitedResourceObj}
        />
      </div>
    </Step3Context.Provider>
  )
}

Step3.propTypes = {
  data: PropTypes.object,
  dataId: PropTypes.number,
  username: PropTypes.string,
  isAdminEntry: PropTypes.bool,
  jobTaskRoles: PropTypes.object,
  setJobTaskRoles: PropTypes.func,
  setActiveStep: PropTypes.func,
  resetDefault: PropTypes.func,
  step1State: PropTypes.object,
  step2State: PropTypes.object,
  resOptions: PropTypes.array,
  setOpenNextBtn: PropTypes.func,
  setErrorMessage: PropTypes.func,
  defaultJobTaskRolesUnit: PropTypes.object,
  isReserveResourceToReserveJob: PropTypes.bool,
  thisVgLimitedResourceObj: PropTypes.object,
  setStep5BackNum: PropTypes.func
}
