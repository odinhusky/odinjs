import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import ScheduleContext from '../ScheduleContext';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
import DynamicSelectableResourceList from '../components/DynamicSelectableResourceList'
import TaskRole from './Step3/TaskRole';
import { arrToObj } from 'common/commonMethods'

// ^ Plugins
import PropTypes from 'prop-types';
import { validate } from 'joi-browser';
import { TaskRoleSchema } from '../model/JobTaskRoleSchema';
import {
  isNil,
  isEmpty,
  has,
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
 * @prop {object} selectedVgObj -- 最外層 calendar 選擇的集群
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
  selectedVgObj,
  jobTaskRoles,
  setJobTaskRoles,
  setActiveStep,
  step2State,
  resOptions,
  setOpenNextBtn,
  setErrorMessage,
  defaultJobTaskRolesUnit,
  isReserveResourceToReserveJob = false,
  thisVgLimitedResourceObj,
  setStep5BackNum
}) => {

  // ? context
  const { getResourceUnitCount } = useContext(GlobalContext);

  // # states
  const [resourceUnitCount, setResourceUnitCount] = useState({});
  const [isOverSelectableResourceMax, setIsOverSelectableResourceMax] = useState(false);

  // = styles
  const { classes, selfCanUseVgList } = useContext(ScheduleContext);

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
  }

  /**
   * @author odin
   * @param {array} checkArr -- 計算出來每個 taskRole 的資源以及數量
   * @description 如果陣列中對應有錯誤的，代表該資源不符合目前的規範，一次重新替換，再更新 jobTaskRoles
  */
  const clearFalseResource = (checkArr) => {
    // 過濾出哪些 taskrole 的資源不符合規則
    const filterFalseIndexArr =
      checkArr
        .map((item, idx) => {if(item === false) return idx})
        .filter(item => (item !== undefined));

    if(!isEmpty(filterFalseIndexArr)) {
      const newJobTaskRoles = cloneDeep(jobTaskRoles);
      const taskRoleNameArr = Object.keys(jobTaskRoles);
      const falseResourceTaskRoleNameArr = filterFalseIndexArr.map(item => taskRoleNameArr[item])

      // 修改 newJobTaskRoles 中不符合的資源就清空
      falseResourceTaskRoleNameArr.forEach(taskRoleName => {
        newJobTaskRoles[taskRoleName].hivedScheduler = {
          vg: null,
          skuType: null,
          sku: null,
          skuNum: 1
        }
      })

      setJobTaskRoles(newJobTaskRoles)
    }
  }

  /**
   * @author odin
   * @param {object} countObj -- 計算出來每個 taskRole 的資源以及數量
   * @description 判斷是否要轉跳到第五步
  */
  const isJumpToStep5 = (countObj) => {
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
    const case4 = !isEmpty(countObj)
    const case5 = (() => {
      if(!case4) return false

      // 加總每一個資源的數量
      const cells = Object.entries(countObj).reduce((acc, [, obj]) => {
        const { resourceName: cellName, count: skuNum } = obj

        return {
          ...acc,
          [cellName]: has(acc, cellName)
            ? acc[cellName] + skuNum
            : skuNum
        }
      }, {})

      // 檢查每一個資源的總數是不是目前的集群有，且小於等於該集群最多可分配的數量
      const checkArr = Object.entries(cells).map(([cellName, skuNum]) => {

        const result = (
          has(thisVgLimitedResourceObj, cellName)
          && (
            thisVgLimitedResourceObj[cellName] === -1 // 無限制
              || thisVgLimitedResourceObj[cellName] >= skuNum // 模板中計算出來的資源數量小於等於被限制的資源上限
          )
            ? true
            : false
        )

        return result
      })

      // 清除不符合規則的 taskrole 的 hivedScheduler，變為預設值
      clearFalseResource(checkArr)

      // 回傳是否所有的資源都有符合最大可配置的數量
      return !checkArr.includes(false)
    })()

    // 設定第五部可以返回的步數以及是否可以轉跳到第五步驟
    if (
      case1 && case2 && case3 && case4 && case5
    ) {
      setStep5BackNum(-3)
      setActiveStep((prevActiveStep) => prevActiveStep + 2)
    } else {
      setStep5BackNum(-1)
    }
  }

  // * hooks
  /**
   * @author odin
   * @description 計算出每個 taskRoleCountObj
  */
  useEffect(() => {
    let jobConfig = null;

    if(dataId && !isReserveResourceToReserveJob) {
      jobConfig = data.jobConfig
    } else {
      // 新增排程
      const { selectedKey, templateInfo } = step2State

      // 如果是自定義就不帶入任何值也不需要計算
      if(selectedKey === 0) return
      jobConfig = templateInfo.jobConfig
    }

    if(!isNil(jobConfig)) {
      const selfCanUseVgObj = arrToObj(selfCanUseVgList, false)
      const taskRoleCountObj = getResourceUnitCount(jobConfig, selfCanUseVgObj)
      setResourceUnitCount(taskRoleCountObj)

      // 判斷是否要轉跳到第五步
      isJumpToStep5(taskRoleCountObj)
    }
  }, [step2State])

  /**
   * @author odin
   * @description 確認 TaskRoles的規格是不是符合 Joi 的驗證規則來決定是否可以進行到下一步
  */
  useEffect(() => {
    const jobTaskRolesArr = Object.entries(jobTaskRoles).map(([, obj]) => obj)
    const validateArr = jobTaskRolesArr.map(obj => checkStep3TaskRoles(obj))

    // $ case1: 每一個 taskrole 的格式都要正確
    // $ case2: 資源不能超過可以分配的最大值

    const case1 = !validateArr.includes(false)
    const case2 = isOverSelectableResourceMax === false

    if (case1 && case2) {
      setOpenNextBtn(true)
    } else {
      setOpenNextBtn(false)
    }
  }, [jobTaskRoles, isOverSelectableResourceMax])

  return (
    <div className={`${classes.stepsContainer}`}>

      {/* 依照權限是否顯示剩餘的 可用資源  */}
      <DynamicSelectableResourceList
        jobTaskRoles={jobTaskRoles}
        resOptions={resOptions}
        selectedVgObj={selectedVgObj}
        setIsOverSelectableResourceMax={setIsOverSelectableResourceMax}
        thisVgLimitedResourceObj={thisVgLimitedResourceObj}
      />

      {/* 各個 TaskRole 的內容 */}
      <TaskRole
        data={data}
        dataId={dataId}
        defaultJobTaskRolesUnit={defaultJobTaskRolesUnit}
        jobTaskRoles={jobTaskRoles}
        resOptions={resOptions}
        resourceUnitCount={resourceUnitCount}
        selectedVgObj={selectedVgObj}
        setErrorMessage={setErrorMessage}
        setJobTaskRoles={setJobTaskRoles}
        thisVgLimitedResourceObj={thisVgLimitedResourceObj}
      />
    </div>
  )
}

Step3.propTypes = {
  data: PropTypes.object,
  dataId: PropTypes.number,
  username: PropTypes.string,
  isAdminEntry: PropTypes.bool,
  selectedVgObj: PropTypes.object,
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
