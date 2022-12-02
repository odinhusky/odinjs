import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// # API
import {
  getUserNfs,
  getUsersGlusterfs,
  getDockerStorageOptsSize,
  updateJobSchedule
} from 'utils/api';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext'
import ScheduleContext from './ScheduleContext';
import EditScheduleContext from './EditScheduleContext';

// ? Self-packed Components || Functions
import { BaseStepper } from 'components/BaseStepper';
import { Step1, Step2, Step3, Step4, Step5 } from './steps';
import { ButtonCtrlPanel } from './ButtonCtrlPanel';
import {
  objToArr,
  clearScheduleResourceItem
} from 'common/commonMethods';

// ^ Plugins
import { isEmpty, isNil, cloneDeep, get } from 'lodash';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * @author odin
 * @level views/Schedule/EditSchedule
 * @prop {object} selectedVgObj -- 選擇的叢集的物件
 * @prop {function} getData -- 重新取得 schedule 的 function
 * @prop {array} canUseVg -- 可以使用用的叢集列表(過濾出可以排程的集群)
 * @prop {function} handleBackToCalendar -- 回到選擇日期的 function
 * @prop {boolean} isAdminEntry -- 是否排程管理
 * @prop {object}} editData -- 要修改的排程的資料
 * @prop {object} userInfo -- 目前登入者的資訊，從 Redux 的 store 中取得
 * @component EditSchedule
 * @description Edit Schedule Component
*/
function EditSchedule({
  selectedVgObj,
  getData,
  canUseVg,
  handleBackToCalendar,
  isAdminEntry,
  editData,
  userInfo
}) {

  // $ init data
  const { t } = useTranslation();
  const username = userInfo.username;

  // const isEdit = true;
  const steps = [
    t('schedule-step1Name'),
    t('schedule-step2Name'),
    t('schedule-step3Name'),
    t('schedule-step4Name'),
    t('schedule-step5Name')
  ]

  // % context
  // const {
  //   resourceUnit
  // } = useContext(GlobalContext);

  const { classes } = useContext(ScheduleContext);

  // & handled data
  let isPreScheduledJobStatus = true

  const defaultStep1 = {
    name: editData.name,
    virtualGroup: selectedVgObj?.name ? selectedVgObj?.name : '',
    startAt: editData.startAt,
    endAt: editData.endAt,
    jobRetryCount: 0,
    jobName: `${userInfo.username}_${Date.now()}`
  }

  if(!isNil(editData.jobConfig)) {
    // 預約排程
    defaultStep1.jobRetryCount = editData.jobConfig.jobRetryCount
    defaultStep1.jobName = editData.jobConfig.name
  } else {
    // 預約資源
    isPreScheduledJobStatus = false;

    // 資源的分項
    const cells = editData.cells;
    const editK8sResource = {
      cpu: get(cells, 'cpu.number', 0),
      gpu: get(cells, 'gpu.number', 0),
      memoryMB: get(cells, 'memory.number', 0),
      gpuMemoryPercentage: get(cells, 'gpuMemoryPercentage.number', 100)
    };
    defaultStep1.k8sResource = { ...editK8sResource };
  }

  const defaultStep2 = {
    selectedKey: 0,
    isModify: true, // 除了是自己的模板，且不勾選修改配置會是， false 其他都是 true
    templateInfo: {}
  }

  const defaultTaskRoleName = 'taskrole1'
  const defaultJobTaskRolesUnit = {
    name: 'taskrole1',
    completion: {
      minFailedInstances: 1,
      minSucceededInstances: 1
    },
    commands: 'sleep infinity',
    // 預約作業單一個 taskRole 的
    k8sResource: {
      cpu: 0,
      gpu: 0,
      memoryMB: 0,
      gpuMemoryPercentage: 100
    },
    instances: 1,
    dockerInfo: '',
    ports: [{ key: '', value: 0, orderId: 1 }],
    taskRetryCount: 0
  }

  const defaultJobTaskRoles = {
    [defaultTaskRoleName]: {
      ...cloneDeep(defaultJobTaskRolesUnit)
    }
  }

  // # states
  // - 共用
  const [errorMessage, setErrorMessageState] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [jobTaskRoles, setJobTaskRoles] = useState(defaultJobTaskRoles);

  // Admin 或是 組長限制該使用者的資源上限
  const [thisVgLimitedResourceObj, setThisVgLimitedResourceObj] = useState({});

  // ^ Step 1
  const [step1State, setStep1State] = useState(defaultStep1);
  const [isStep1BtnOpen, setIsStep1BtnOpen] = useState(false);
  const [isStep1SubmitClicked, setIsStep1SubmitClicked] = useState(false);
  const [isPreScheduledJob, setIsPreScheduledJob] = useState(isPreScheduledJobStatus);

  // ^ Step 2
  const [step2State, setStep2State] = useState(defaultStep2);
  const [isStep2BtnOpen, setIsStep2BtnOpen] = useState(false);

  // ^ Step 3
  const [isStep3BtnOpen, setIsStep3BtnOpen] = useState(false);

  // ^ Step 4
  const [nfsInfo, setNfsInfo] = useState([]);
  const [glusterfsInfo, setGlusterfsInfo] = useState([]);
  const [nfsMounts, setNfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [glusterfsMounts, setGlusterfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [parameters, setParameters] = useState([{ key: '', value: '' }]);

  // ^ Step 5
  const [diskNum, setDiskNum] = useState(0);
  const [isStep5SubmitClicked, setIsStep5SubmitClicked] = useState(false);
  const [step5BackNum, setStep5BackNum] = useState(-1);

  // - methods
  /**
   * @author odin]
   * @description 處理所有步驟內會包含的錯誤訊息
  */
  const setErrorMessage =
    (id, msg) => {
      setErrorMessageState(prev => {
        if (isEmpty(msg)) {
          if (prev !== undefined && prev[id] !== undefined) {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          }
        } else {
          if (prev !== undefined && prev[id] !== msg) {
            return {
              ...prev,
              [id]: msg
            };
          }
        }
        return prev;
      });
    }

  /**
   * @author odin]
   * @description reset step1 | step2 的 state，以及重新取得 schedule
  */
  const resetDefault = () => {
    setStep1State({
      name: '',
      virtualGroup: selectedVgObj?.name ? selectedVgObj?.name : '',
      startAt: null,
      endAt: null,
      retryCount: 0
    });
    setStep2State(defaultStep2);
    getData();
    localStorage.removeItem('scheduleResourceItem');
  }

  /**
   * @author odin
   * @param {object} data -- 包含所有欄位的 key: value
   * @description 送出更新排程
  */
  const onSubmit = async (data) => {
    // isPreScheduledJob: 預約作業(true) | 預約資源(false)
    try {
      await updateJobSchedule(editData.id, data, !isPreScheduledJob)
      toast.success(t('success'));
      handleBackToCalendar();
    } catch (err) {
    // } catch ({ message: msg }) {

      const msg = err.data.message;

      toast.error(`${
        msg === 'startAt must >= now'
          ? `${t('time')}${t('enSpace')}${t('error')}`
          : msg
      }`)
    }
  }

  /**
   * @author elvis
   * @param {number} activeStep -- 目前是哪一個step 的 index
   * @description 依照不同的 stepIndex 顯示不同的 component
   * @return {Component}
  */
  const getSteps = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <Step1
            dataId={editData.id}
            defaultStep1={defaultStep1}
            handleBackToCalendar={handleBackToCalendar}
            isAdminEntry={isAdminEntry}
            isPreScheduledJob={isPreScheduledJob}
            isReserveResourceToReserveJob={isPreScheduledJob !== isPreScheduledJobStatus}
            isStep1SubmitClicked={isStep1SubmitClicked}
            onSubmit={onSubmit}
            selectedVgObj={selectedVgObj}
            selectedVgUsers={[]}
            setActiveStep={setActiveStep}
            setIsPreScheduledJob={setIsPreScheduledJob}
            setIsStep1SubmitClicked={setIsStep1SubmitClicked}
            setOpenNextBtn={setIsStep1BtnOpen}
            setStep1State={setStep1State}
            setThisVgLimitedResourceObj={setThisVgLimitedResourceObj}
            step1State={step1State}
            thisVgLimitedResourceObj={thisVgLimitedResourceObj}
            username={username}
          />
        );
      case 1:
        return (
          <Step2
            dataId={editData.id}
            defaultJobTaskRoles={defaultJobTaskRoles}
            setActiveStep={setActiveStep}
            setGlusterfsMountsState={setGlusterfsMountsState}
            setJobTaskRoles={setJobTaskRoles}
            setNfsMountsState={setNfsMountsState}
            setOpenNextBtn={setIsStep2BtnOpen}
            setParameters={setParameters}
            setStep2State={setStep2State}
            step2State={step2State}
          />
        );
      case 2:
        return (
          <Step3
            data={editData}
            dataId={editData.id}
            defaultJobTaskRoles={defaultJobTaskRoles}
            defaultJobTaskRolesUnit={defaultJobTaskRolesUnit}
            isAdminEntry={isAdminEntry}
            isPreScheduledJob={isPreScheduledJob}
            isPreScheduledJobStatus={isPreScheduledJobStatus}
            isReserveResourceToReserveJob={isPreScheduledJob !== isPreScheduledJobStatus}
            jobTaskRoles={jobTaskRoles}
            selectedVgObj={selectedVgObj}
            setActiveStep={setActiveStep}
            setErrorMessage={setErrorMessage}
            setJobTaskRoles={setJobTaskRoles}
            setOpenNextBtn={setIsStep3BtnOpen}
            setStep5BackNum={setStep5BackNum}
            step1State={step1State}
            step2State={step2State}
            thisVgLimitedResourceObj={thisVgLimitedResourceObj}
            username={username}
          />
        );
      case 3:
        return (
          <Step4
            glusterfsInfo={glusterfsInfo}
            glusterfsMounts={glusterfsMounts}
            nfsInfo={nfsInfo}
            nfsMounts={nfsMounts}
            parameters={parameters}
            setActiveStep={setActiveStep}
            setErrorMessage={setErrorMessage}
            setGlusterfsMountsState={setGlusterfsMountsState}
            setNfsMountsState={setNfsMountsState}
            setParameters={setParameters}
          />
        );
      default:
        return (
          <Step5
            diskNum={diskNum}
            glusterfsInfo={glusterfsInfo}
            glusterfsMounts={glusterfsMounts}
            isStep5SubmitClicked={isStep5SubmitClicked}
            jobTaskRoles={jobTaskRoles}
            nfsInfo={nfsInfo}
            nfsMounts={nfsMounts}
            onSubmit={onSubmit}
            parameters={parameters}
            selectedVgObj={selectedVgObj}
            setIsStep5SubmitClicked={setIsStep5SubmitClicked}
            step1State={step1State}
            step2State={step2State}
            vgState={canUseVg.find(item => item.name === selectedVgObj?.name)}
          />
        );
    }
  }

  // ? context
  const context = {
    userInfo,
    errorMessage,
    activeStep
  }

  // * hooks
  /**
   * @author odin
   * @description 清除 localStorage 的 scheduleResourceItem
  */
  useEffect(() => {
    clearScheduleResourceItem();
  }, [])

  /**
   * @author odin
   * @description 要重新載入網站嗎？ 的提示
  */
  useEffect(() => {
    window.addEventListener('beforeunload', function (e) {
      // Cancel the event
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = ' ';
    });
  }, [])

  /**
   * @author odin
   * @description 取得 Disk Number 顯示在第五步驟的分配圖
  */
  useEffect(() => {
    getDockerStorageOptsSize()
      .then((num) => setDiskNum(num))
  }, [])

  /**
   * @author odin
   * @description 初始化 | 更新 集中式存儲 API 資料
  */
  useEffect(() => {
    if (isEmpty(userInfo)) return;

    Promise.all([getUserNfs(username), getUsersGlusterfs(username)])
      .then(([nfs, glusterfs]) => {
        setNfsInfo(nfs)
        setGlusterfsInfo(glusterfs)
      })
  }, [userInfo])

  /**
   * @author odin
   * @description 編輯模式下將 data 的內容轉換成前端資料格式的 taskRoles
  */
  useEffect(() => {
    if(!isEmpty(editData) && !isEmpty(editData.jobConfig)) {
      const { jobConfig } = editData
      const { extras, parameters, prerequisites, taskRoles } = jobConfig
      const { glusterfsList, nfsList } = extras;

      // - 處理第三步驟相關資料
      const transformedTaskRoles = Object.entries(taskRoles).reduce((acc, [taskName, obj]) => {
        // const { pinnedCellId, skuType } = hivedScheduler.taskRoles[taskName]
        const { commands, resourcePerInstance, dockerImage } = obj;
        const { cpu, gpu, memoryMB, gpuMemoryPercentage } = resourcePerInstance;

        const portsArr = isNil(resourcePerInstance.ports) ? [] : objToArr(resourcePerInstance.ports);
        const ports = portsArr.length === 0
          ? [{ key: '', value: 1, orderId: 1 }]
          : portsArr.map((item, index) => ({
            ...item,
            orderId: index + 1
          }));

        const dockerInfo = prerequisites.find(item => item.name === dockerImage).uri;

        const copyObj = { ...obj };
        delete copyObj.resourcePerInstance;
        delete copyObj.dockerImage;
        delete copyObj.entrypoint;
        delete copyObj.hivedPodSpec;

        const resultObj = {
          ...acc,
          [taskName]: {
            ...copyObj,
            name: taskName,
            ports,
            commands: isNil(commands) ? '' : commands.join('\n'),
            dockerInfo,
            k8sResource: {
              cpu,
              gpu,
              memoryMB,
              gpuMemoryPercentage
            }
          }
        }

        return resultObj
      }, {});

      setJobTaskRoles(transformedTaskRoles);

      // - 處理第四步驟相關的資料
      // 存儲列表
      if(!isEmpty(nfsList)) setNfsMountsState(nfsList);
      if(!isEmpty(glusterfsList)) setGlusterfsMountsState(glusterfsList);

      // 關鍵字
      if(!isNil(parameters)) setParameters(objToArr(parameters))
    }
  }, [editData])


  return (
    <EditScheduleContext.Provider value={context}>
      <div className={`${classes.scheduleContainer}`}>
        <div className={`${classes.scheduleForm}`}>
          {/* 標題 */}
          <div className={`${classes.scheduleTitle} ${classes.mb_20}`}>
            {t('edit')}{t('enSpace')}{t('schedule')}
          </div>

          {/* 進度以及內容 */}
          <section className={`${classes.stepSection}`}>
            {/* 上方的步驟進度 */}
            <div className={`${classes.stepper} ${classes.mb_20}`}>
              <BaseStepper
                activeStep={activeStep}
                classNameObj={{
                  outDiv: `${classes.borderRadius_4}`,
                  stepper: `${classes.borderRadius_4} ${classes.stepperClass}`
                }}
                steps={steps}
              />
            </div>

            {/* 下方的步驟內容 */}
            <div className={`${classes.stepContent}`}>
              {getSteps(activeStep)}
            </div>
          </section>
        </div>

        {/* 最下方的控制板 */}
        <ButtonCtrlPanel
          activeStep={activeStep}
          handleBackToCalendar={handleBackToCalendar}
          isPreScheduledJob={isPreScheduledJob}
          isStep1BtnOpen={isStep1BtnOpen}
          isStep1SubmitClicked={isStep1SubmitClicked}
          isStep2BtnOpen={isStep2BtnOpen}
          isStep3BtnOpen={isStep3BtnOpen}
          resetDefault={resetDefault}
          setActiveStep={setActiveStep}
          setIsStep1SubmitClicked={setIsStep1SubmitClicked}
          setIsStep5SubmitClicked={setIsStep5SubmitClicked}
          step3BackNum={
            (isPreScheduledJobStatus !== isPreScheduledJob)
              ? -1 : -2
          }
          step4BackNum={-1}
          step5BackNum={step5BackNum}
        />

      </div>

    </EditScheduleContext.Provider>
  );
}

EditSchedule.propTypes = {
  onClose: PropTypes.func,
  createDate: PropTypes.instanceOf(Date),
  getData: PropTypes.func,
  selectedVgObj: PropTypes.object,
  canUseVg: PropTypes.array,
  handleBackToCalendar: PropTypes.func,
  isAdminEntry: PropTypes.bool,
  editData: PropTypes.object,
  userInfo: PropTypes.object
}

export default EditSchedule;