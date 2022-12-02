import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo
} from 'react';

// # API
import {
  getCanUseVirtualGroups,
  getUserNfs,
  getUsersGlusterfs
} from 'utils/api';

// ? context
import Context from './Context';
import ParentContext from '../../Context';

// ? Self-packed Components || Functions
import BasicSetting from './components/BasicSetting';
import { JobBasicInfo } from './model/JobBasicInfo';
import { JobTaskRole } from './model/JobTaskRole';
import { JobTemplate } from './model/JobTemplate';
import TaskRole from './components/TaskRole';
import GlobalContext from 'layouts/Main/GlobalContext';
import Loading from 'components/Loading'
import StorageSetting from './components/StorageSetting';
import Parameter from './components/Parameter';
import Footer from './components/Footer';
// import { Completion } from 'views/JobSubmit/models/completion';
import { RESOURCE_ERROR_MESSAGE_ID } from 'views/JobSubmit/utils/errorCode';


// ^ Plugin
import { isEmpty, isNil } from 'lodash';
import { useTranslation } from 'react-i18next';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm
 * @component TemplateForm
 * @description TemplateForm component(Add)
*/
const index = () => {

  // $ init data
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const checkEdit = (urlParams.get('name') && urlParams.get('owner')) ? true : false;
  const defaultObj = {
    cpu: 0,
    gpu: 0,
    memoryMB: 0
  };

  // 選擇資源要用到的 ref
  const resourceRef = useRef();

  // ? context
  const {
    userInfo,
    resourceUnit: resourceUnitObject,
    canSplitGPU
  } = useContext(GlobalContext);

  const currentUserName = userInfo.username;

  const {
    templateList,
    classes
  } = useContext(ParentContext);

  // # states
  const [jobTemplate, setJobTemplate] = useState(new JobTemplate({}))
  const [jobInformation, setJobInformation] = useState(
    new JobBasicInfo({ name: 'taskrole1', virtualCluster: '' })
  );
  const [jobTaskRoles, setJobTaskRoles] = useState({
    'taskrole1': new JobTaskRole({ name: 'taskrole1', commands: 'sleep infinity' })
  });

  const [nfsInfo, setNfsInfo] = useState([]);
  const [nfsMounts, setNfsMountsState] = useState([
    // { name: '', mountPoint: '' }
  ]);

  const [glusterfsInfo, setGlusterfsInfo] = useState([]);
  const [glusterfsMounts, setGlusterfsMountsState] = useState([
    // { name: '', mountPoint: '' }
  ]);

  const [parameters, setParameters] = useState([
    // { key: '', value: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [vgInfos, setVgInfos] = useState({});
  const [vgNames, setVgNames] = useState([]);
  const [errorMessage, setErrorMessageState] = useState({});

  const [editId, setEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(checkEdit);

  // 資源是否都有超過上限
  const [isResourceValid, setIsResourceValid] = useState(false);
  const [resourceUnValidObj, setResourceUnValidObj] = useState({
    cpu: false,
    gpu: false,
    memoryMB: false,
    gpuMemoryPercentage: false
  });


  // 各個資源的可使用數量(剩餘的跟被分配到的數量取小值)
  const [remainObj, setRemainObj] = useState(null);

  // const [hivedResourceUnitsList, setHivedResourceUnitsList] = useState({});
  const [hivedSkuTypes, setHivedSkuTypes] = useState([]);

  // - methods
  /**
   * @author odin
   * @description 設定錯誤訊息
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
    };

  /**
   * @author odin
   * @description 產生基本設定中的叢集選項
   * @return {array}
  */
  const basicSettingVgOptions = useMemo(() => {
    const hasSchedulable = Object.entries(vgInfos).filter(([, item]) => item.schedulable !== false).map(([, item]) => ({ key: item.name, text: item.name }))
    const notHasSchedulable = Object.entries(vgInfos).filter(([, item]) => item.schedulable === false).map(([, item]) => ({ key: item.name, text: item.name }))

    if (!isEmpty(hasSchedulable)) {
      return [
        { key: 'group', text: t('group'), itemType: 2 },
        ...notHasSchedulable,
        { key: 'divider_1', text: '-', itemType: 0 },
        { key: 'scheduleGroup', text: `${t('schedule')}${t('enSpace')}${t('group')}`, itemType: 2 },
        ...hasSchedulable
      ]
    } else {
      return [ ...notHasSchedulable ]
    }
  }
  , [vgInfos]);

  // * hooks
  /**
   * @author odin
   * @description 取得 vgInfos、vgNames、NfsInfo、 GlustersInfo
  */
  useEffect(() => {
    if (isEmpty(userInfo)) return;
    getCanUseVirtualGroups(currentUserName)
      .then(vg => {
        setVgInfos(vg.reduce((res, info) => {
          res[info.name] = info;
          return res;
        }, {}))
        setVgNames(vg.map(v => v.name))
      })

    getUserNfs(currentUserName)
      .then(nfs => {
        setNfsInfo(nfs.map(n => n.name))
      })
    getUsersGlusterfs(currentUserName)
      .then(glusterfs => {
        setGlusterfsInfo(glusterfs.map(g => g.name))
      })
  }, [userInfo])

  /**
   * @author odin
   * @description 當為編輯模板且模板列表跟vgInfos都有不為空，找出對應的模板
  */
  useEffect(() => {
    if (isEditMode && !isEmpty(templateList) && !isEmpty(vgInfos)) {
      const username = urlParams.get('name');
      const owner = urlParams.get('owner');

      const findData = templateList.find(item => item.name === username && item.owner === owner)
      if (!findData) {
        setIsEditMode(false);
        return;
      }

      setEditId(findData.id)

      const { name, description, publicMode, canReadUsers, canWriteUsers, jobConfig } = findData
      const { name: jobName, gpuType, retryCount, taskRoles, extras, parameters, prerequisites } = jobConfig;

      const { virtualGroup } = extras;
      setJobTemplate(new JobTemplate({ name, description, publicMode, canReadUsers, canWriteUsers }))
      setJobInformation(new JobBasicInfo({ name: jobName, jobRetryCount: retryCount, virtualCluster: extras.virtualGroup || 'default', gpuType }))
      const selectedVirtualGroups = vgInfos[virtualGroup];
      const canUseResourceUnit = Object.entries(selectedVirtualGroups.cells).map(([key, details]) => ({
        sku: key,
        ...details
      }))
      setHivedSkuTypes(canUseResourceUnit)
      setJobTaskRoles(Object.entries(taskRoles).reduce((acc, [taskRoleName, taskRole]) => {
        const { commands, resourcePerInstance, dockerImage } = taskRole;
        const findDockerImageUri = prerequisites.find(item => item.name === dockerImage)
        const { cpu, gpu, memoryMB, gpuMemoryPercentage, ports } = resourcePerInstance;

        const transformPorts = ports !== null
          ? Object.entries(ports).reduce((acc, [key, value]) => {
            return [...acc, { key: key, value: value }]
          }, [])
          : []

        const newJobTaskRole =  new JobTaskRole({
          ...taskRole,
          name: taskRoleName,
          k8sResource: {
            cpu,
            gpu,
            memoryMB,
            gpuMemoryPercentage
          },
          commands: commands.join('\n'),
          dockerInfo: !isEmpty(findDockerImageUri) ? findDockerImageUri.uri : '',
          ports: transformPorts
        })

        return {
          ...acc,
          [taskRoleName]: newJobTaskRole
        }
      }, {}));

      const { nfsList, glusterfsList } = extras;
      setNfsMountsState(nfsList !== null ? nfsList : []);
      setGlusterfsMountsState(glusterfsList !== null ? glusterfsList : []);
      const newParameters = parameters ? Object.entries(parameters).map(([key, value]) => ({ key, value })) : []
      setParameters(newParameters)
    }
  }, [isEditMode, templateList, vgInfos])

  useEffect(() => {
    if (vgInfos[jobInformation.virtualCluster]) {
      const virtualGroup = vgInfos[jobInformation.virtualCluster];
      const canUseResourceUnit = Object.entries(virtualGroup.cells).map(([key, details]) => ({
        sku: key,
        ...details
      }))
      setHivedSkuTypes(canUseResourceUnit)
      setJobTaskRoles(Object.entries(jobTaskRoles).reduce((acc, [taskRoleName, taskRole]) => {
        const {
          cpu,
          gpu,
          memoryMB,
          gpuMemoryPercentage
        } = taskRole.k8sResource;

        const jobTaskRole = new JobTaskRole({
          ...taskRole,
          name: taskRoleName,
          k8sResource: {
            cpu,
            gpu,
            memoryMB,
            gpuMemoryPercentage
          }
        })
        return {
          ...acc,
          [taskRoleName]: jobTaskRole
        }
      }, {}))
    }
  }, [jobInformation.virtualCluster])

  /**
   * @author odin
   * @description 計算所有的 taskRole 個別使用的數量有沒有超過上限總和
  */
  useEffect(() => {
    if(isNil(remainObj)) return;

    let isValid = true;
    let totalCPU = 0, totalGPU = 0, totalMemory = 0, totalGPUMemoryPercentage = 0;

    const {
      cpu: limitCPU,
      gpu: limitGPU,
      memory: limitMemory,
      gpuMemoryPercentage: limitGPUMemoryPercentage
    } = remainObj;

    const totalValues = Object.values(jobTaskRoles);

    totalValues.forEach(item => {
      const { cpu, gpu, memoryMB, gpuMemoryPercentage } = item.k8sResource;
      const thisJobTaskRoleSum = cpu + gpu + memoryMB;

      // 加總
      totalCPU += cpu;
      totalGPU += gpu;
      totalMemory += memoryMB;
      totalGPUMemoryPercentage += (gpu * gpuMemoryPercentage);

      // 如果有任何一個 taskRole 三個資源加總都是 0 的話，則不符合檢查規則
      if(thisJobTaskRoleSum <= 0) isValid = false;
    });

    const unValidCPU = totalCPU > limitCPU;
    const unValidGPU = totalGPU > limitGPU;
    const unValidMemoryMB = totalMemory > limitMemory;
    const unValidGPUMemoryPercentage = totalGPUMemoryPercentage > limitGPUMemoryPercentage;

    if(unValidCPU || unValidGPU || unValidMemoryMB || unValidGPUMemoryPercentage) isValid = false;

    const obj = {
      cpu: unValidCPU,
      gpu: unValidGPU,
      memoryMB: unValidMemoryMB,
      gpuMemoryPercentage: unValidGPUMemoryPercentage
    };

    // 填入錯誤訊息
    if(!isValid) {
      setErrorMessage(RESOURCE_ERROR_MESSAGE_ID, t('error'));
    } else {
      setErrorMessage(RESOURCE_ERROR_MESSAGE_ID, '');
    }

    setIsResourceValid(isValid);
    setResourceUnValidObj(obj);
  }, [remainObj, jobTaskRoles])

  // & handled value
  const ContextValue = {
    classes,
    jobTemplate,
    setJobTemplate,
    jobInformation,
    setJobInformation,
    jobTaskRoles,
    setJobTaskRoles,
    nfsMounts,
    setNfsMountsState,
    glusterfsMounts,
    setGlusterfsMountsState,
    parameters,
    setParameters,
    vgNames,
    setVgNames,
    nfsInfo,
    setNfsInfo,
    glusterfsInfo,
    setGlusterfsInfo,
    vgInfos,
    setVgInfos,
    errorMessage,
    setErrorMessage,
    isLoading,
    setIsLoading,
    isEditMode,
    setIsEditMode,
    editId,
    resourceUnitObject,
    hivedSkuTypes,
    basicSettingVgOptions,
    resourceRef,
    remainObj,
    setRemainObj,
    defaultObj,
    isResourceValid,
    resourceUnValidObj,
    canSplitGPU
  }

  return (
    <Context.Provider value={ContextValue}>
      {
        <>
          {
            isLoading && <Loading />
          }
          <div className={`${classes.manageTemplateContainer}`}>
            <BasicSetting />
            <TaskRole />
            <StorageSetting />
            <Parameter />
          </div>
          <Footer />
        </>
      }
    </Context.Provider>
  );
};

export default index;