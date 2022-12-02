import React, {
  // useState,
  useEffect,
  useContext
} from 'react';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ScheduleContext from '../ScheduleContext';

// ^ Material-ui Components(Functions)
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import {
  BaseRadio
  // BaseCheckbox
} from 'components/BaseMuiInput';

// ? Self-packed Components || Functions
import { Completion } from 'views/JobSubmit/models/completion';
import { Step2Table } from './Step2Table';
import { objToArr } from 'common/commonMethods'

import {
// transferBoolean
} from 'common/commonMethods';

// ^ Plugins
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { isEmpty, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
//  * @prop {number} dataId -- 有的話就代表是編輯的模式
 * @prop {object} step2State -- 在父層的 State，用來記錄第二步驟中使用者選擇的模板以及其他相關資料
 * @prop {function} setStep2State -- 設定 step2State 的 setState function
 * @prop {function} setJobTaskRoles -- 設定要傳送給第三步驟的資料 的 setState function
 * @prop {function} setOpenNextBtn -- 決定第二步驟的下一步按鈕要不要打開的 setState function
 * @prop {function} setNfsMountsState -- 設定 nfsMounts的 setState function
 * @prop {function} setGlusterfsMountsState -- 設定 glusterfsMounts setState function
 * @prop {function} setParameters -- 設定 parameters setState function
 * @prop {object} defaultJobTaskRoles -- 預設的 jobTaskROles 物件
 * @level views/Schedule/{CreateSchedule | EditSchedule}/Step2
 * @component Step2
 * @description Step2 Component
*/
export const Step2 = ({
  // dataId,
  step2State,
  setStep2State,
  setJobTaskRoles,
  setOpenNextBtn,
  setNfsMountsState,
  setGlusterfsMountsState,
  setParameters,
  defaultJobTaskRoles
}) => {

  // $ init data
  const { t } = useTranslation();

  // <BaseRadio> 的個別設定
  const radiosList = [
    { id: 0, value: 0, label: t('Custom') },
    { id: 1, value: 1, label: t('Template') }
  ];

  // ? context
  const { classes } = useContext(ScheduleContext);

  // - methods
  /**
   * @author odin
   * @param {object} jobConfig -- 該模板的工作設定
   * @description 依據選擇的模板，組出其中設定好的 taskRoles 物件
   * @returns {object}
  */
  const buildTaskRolesObj = (jobConfig) => {

    const { taskRoles, prerequisites } = jobConfig

    return Object.entries(taskRoles).reduce((acc, [taskName, taskObj]) => {

      const { dockerImage, instances, commands, completion, resourcePerInstance, taskRetryCount } = taskObj
      const { minFailedInstances, minSucceededInstances } = completion

      // resource & ports
      const { cpu, gpu, memoryMB, ports, gpuMemoryPercentage } = resourcePerInstance
      const transformPorts = !isNil(ports)
        ? Object.entries(ports).reduce((acc, [key, value], index) => {
          return [...acc, { key: key, value: value, orderId: index + 1 }]
        }, [])
        : [{ key: '', value: 1, orderId: 1 }];

      // docker
      const findDockerImageUri = prerequisites.find(item => item.name === dockerImage)

      return {
        ...acc,
        [taskName]: {
          name: taskName,
          dockerInfo: !isEmpty(findDockerImageUri) ? findDockerImageUri.uri : '',
          instances,
          commands: isNil(commands) ? '' : commands.join('\n'),
          ports: transformPorts,
          completion: new Completion({ minFailedInstances, minSucceededInstances }),
          taskRetryCount,
          k8sResource: {
            cpu,
            gpu,
            memoryMB,
            gpuMemoryPercentage
          }
        }
      }
    }, {})
  }

  /**
   * @author odin
   * @param {object} jobConfig -- 該模板的工作設定
   * @description 依照是否為大道API，將存儲列表，則取代對應的預設的內容
  */
  const replaceMounts = (jobConfig) => {
    const { extras } = jobConfig
    const { nfsList, glusterfsList } = extras

    // 不是的場合就更新集中式 | 分散式存儲列表
    if(!isNil(nfsList)) setNfsMountsState(nfsList)
    if(!isNil(glusterfsList)) setGlusterfsMountsState(glusterfsList)
  }

  /**
   * @author odin
   * @param {object} jobConfig -- 該模板的工作設定
   * @description 依照是否有 parameter ，轉換格式並且替換預設的內容(Step4)
  */
  const replaceParameter = (jobConfig) => {
    const { parameters } = jobConfig

    if(!isNil(parameters)) {
      const parametersArr = objToArr(parameters)
      setParameters(parametersArr)
    }
  }

  // * hooks
  useEffect(() => {
    const { selectedKey, templateInfo } = step2State;
    if (selectedKey === 0) {
      // 如果已經有有選過模板的話，先清除
      if(!isEmpty(templateInfo)) {
        setJobTaskRoles(defaultJobTaskRoles)
        setStep2State(prev => ({ ...prev, templateInfo: {} }))
      }

      setOpenNextBtn(true)
    } else if (selectedKey === 1 && !isEmpty(templateInfo)) {
      const { jobConfig } = templateInfo

      // 依照是否為大道API，將存儲列表，則取代對應的預設的內容(Step4)
      replaceMounts(jobConfig)

      // 依照是否有 parameters ，轉換格式並且替換預設的內容(Step4)
      replaceParameter(jobConfig)

      // 組出 Step3 要的資料
      const newTaskRolesObj = buildTaskRolesObj(jobConfig)

      if (newTaskRolesObj !== undefined && !isEmpty(newTaskRolesObj)) {
        setJobTaskRoles(newTaskRolesObj)
        setOpenNextBtn(true)
      } else {
        toast.error(t('isNotEnough', { name: t('taskCount') }));
        setOpenNextBtn(false)
      }

    } else {
      setOpenNextBtn(false)
    }
  }, [step2State])

  return (
    <div className={`${classes.stepsContainer} ${classes.step2Container}`}>
      {/* Radio Group
        selectedKey === 0 => 自定義，不出現模板表格
        selectedKey === 1 => 模板
      */}
      <FormControl
        component="div"
      >
        <RadioGroup
          aria-label="position"
          defaultValue="top"
          name="position"
          onChange={(e) => {
            const value = +e.target.value;

            // 更新 state
            setStep2State((prev) => ({ ...prev, selectedKey: value }))
          }}
          row
          value={step2State.selectedKey}
        >
          {
            radiosList.map(radio => (
              <BaseRadio
                key={radio.id}
                label={radio.label}
                radioProps={{
                  color: 'primary',
                  className: classes.radioRoot
                }}
                value={radio.value}
              />
            ))
          }
        </RadioGroup>
      </FormControl>

      {
        // 表格內容
        step2State.selectedKey === 1 &&
        <Step2Table
          setStep2State={setStep2State}
          step2State={step2State}
        />
      }
    </div>
  )
}

Step2.propTypes = {
  step2State: PropTypes.object,
  setStep2State: PropTypes.func,
  setJobTaskRoles: PropTypes.func,
  setOpenNextBtn: PropTypes.func,
  setNfsMountsState: PropTypes.func,
  setGlusterfsMountsState: PropTypes.func,
  setParameters: PropTypes.func,
  defaultJobTaskRoles: PropTypes.object
};
