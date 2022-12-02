import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  useMemo
} from 'react';

// # API
import {
  getUsersGlusterfs,
  getUserNfs,
  getCanUseVirtualGroups,
  getDockerStorageOptsSize,
  getNodeResource,
  getJobTemplate,
  getCanReadJobTemplate
} from 'utils/api';

// ? context
import Context from './components/context';
import GlobalContext from 'layouts/Main/GlobalContext';

// ? Self-packed Components || Functions
// sidebar
import { NFSMounts } from './components/sidebar/nfsMounts';
import { Parameters } from './components/sidebar/parameters';
import { Templates } from './components/TemplateSetting';
import { SetupEnv } from './components/SetupEnv';
// import {Secrets} from './components/sidebar/secrets';
// import {EnvVar} from './components/sidebar/env-var';
// import {DataComponent} from './components/data/data-component';
// models
import { JobBasicInfo, VIRTUAL_CLUSTER_DEFAULT_VALUE } from './models/job-basic-info';
import { JobTaskRole } from './models/job-task-role';
import { JobProtocol } from './models/job-protocol';
import { DockerInfo } from './models/docker-info';
import { SETUPENV_ERROR_MESSAGE_ID, RESOURCE_ERROR_MESSAGE_ID } from './utils/errorCode';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';
import { DefaultButton } from 'components/BaseButton';
import { JobInformation } from './components/JobInformation';
import { Footer } from './components/Footer.js';
import { TaskRoles } from './components/TaskRoles';
import { fetchJobConfigV12 } from './utils/conn';
import { getJobComponentsFromConfig } from './utils/utils';
import { TaskRolesManager } from './utils/task-roles-manager';
import Loading from 'components/Loading';
import LoadingDialog from 'components/LoadingDialog';
import BreadCrumbs from 'components/BreadCrumbs';
import { TEXT_FILED_REGX } from 'common/commonConstant'

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
import jobSubmitStyle from './jobSubmitStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...jobSubmitStyle(theme)
}))

// ^ Plugins
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  get,
  isNil,
  cloneDeep
} from 'lodash';
import queryString from 'query-string';
import cookies from 'js-cookie';
import $ from 'jquery';

/**
 * @author odin
 * @level views/JobSubmit
 * @component JobSubmit
 * @description JobSubmit component
*/
const JobSubmit = () => {

  // $ init data
  const loginUser = cookies.get('user');
  const submitMode = cookies.get('jobSubmitMode') === 'true';
  const permission = useCheckPrivilege('JOB');
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const parsedQuery = queryString.parse(location.search);

  // 選擇資源要用到的 ref
  const resourceRef = useRef();

  const defaultObj = {
    cpu: 0,
    gpu: 0,
    memoryMB: 0
  };

  // ? context
  const {
    getResourceUnitCount,
    selfLimitResourceObj,
    userInfo,
    canSplitGPU
  } = useContext(GlobalContext);

  // = styles
  const classes = useStyles();

  // # states
  // 狀態
  const [loading, setLoading] = useState(true);
  const [isLoadingVc, setIsLoadingVc] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [advanceFlag, setAdvanceFlag] = useState(submitMode);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 是否由特定的作業複製過來
  const [isCopy, setIsCopy] = useState();

  // 系統參數
  const [systemParams] = useState([]);
  const [systemAvailableResource] = useState([]);

  // Component 資料
  const [jobInformation, setJobInformation] = useState(
    new JobBasicInfo({
      name: `${loginUser}_${Date.now()}`,
      virtualCluster: VIRTUAL_CLUSTER_DEFAULT_VALUE
    })
  );

  const [jobTaskRoles, setJobTaskRolesState] = useState([
    new JobTaskRole({ name: 'taskrole1', dockerInfo: new DockerInfo({ uri: parsedQuery.docker_repo }), commands: 'sleep infinity' })
  ]);

  // 儲存相關
  const [isNfsSelected, setIsNfsSelected] = useState(true);
  const [nfsMounts, setNfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [glusterfsMounts, setGlusterfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [nfsInfo, setNfsInfo] = useState([]);
  const [glusterfsInfo, setGlusterfsInfo] = useState([]);
  const [nfsNames, setNfsNames] = useState([]);
  const [glusterfsNames, setGlusterfsNames] = useState([]);

  // 模板相關
  const [existTemplateNameList, setExistTemplateNameList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tempTaskRoles, setTempTaskRoles] = useState(null);

  // TemplateModal Rising states
  const [templateList, setTemplateList] = useState([]);

  // 是否要儲存為模板
  const [isTemplatesSelected, setIsTemplatesSelected] = useState(false);
  const [templatesState, setTemplatesState] = useState({
    name: '', description: '', publicMode: 0, jobConfig: null, canReadUsers:[], canWriteUsers: []
  });

  // 基本模式下
  const [isParametersSelected, setIsParametersSelected] = useState({
    'vnc': false,
    'jupyterHttp': false,
    'logMonitor': false,
    'RDMA': false
  });

  // Docker 相關
  const [diskNum, setDiskNum] = useState(0);

  const [parameters, setParametersState] = useState([{ key: '', value: '' }]);
  const [secrets, setSecretsState] = useState([{ key: '', value: '' }]);

  // protocol
  const [initJobProtocol, setInitJobProtocol] = useState(new JobProtocol({}));

  // 顯示相關
  const [sectionTooltip, setSectionTooltip] = useState('');
  const [sectionShowUnderVg, setSectionShowUnderVg] = useState('');

  const [vcNames, setVcNames] = useState([]); // 所有的叢集的類型是什麼
  const [vcType, setVCType] = useState(''); // 選擇的叢集類型是哪一種 '' => 不是排程也是不是預約排隊(即時作業) | 'queueable' => 排程作業 | 'schedulable' => 預約作業

  const [vgInfos, setVgInfos] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  // 資源是否都有超過上限或是不符合規定
  const [isResourceValid, setIsResourceValid] = useState(false);
  const [resourceUnValidObj, setResourceUnValidObj] = useState({
    cpu: false,
    gpu: false,
    memoryMB: false,
    gpuMemoryPercentage: false
  });

  // 限制單一容器針對的節點最高上限值
  const [resourceOtherLimit, setResourceOtherLimit] = useState({});

  // 各個資源的可使用數量(剩餘的跟被分配到的數量取小值)
  const [remainObj, setRemainObj] = useState({
    cpu: 0,
    gpu: 0,
    memoryMB: 0,
    gpuMemoryPercentage: 100
  });

  // node resource
  const [nodeResource, setNodeResource] = useState([]); // API 原始資料
  const [showNodes, setShowNodes] = useState(); // 顯示用

  // - methods
  function getChecksum(str) {
    let res = 0;
    for (const c of str) {
      res ^= c.charCodeAt(0) & 0xff;
    }
    return res.toString(16);
  }

  /**
   * @author odin
   * @param {string} jobName - 作業名稱
   * @description 產生隨機的作業名稱
   * @return {string}
  */
  function generateJobName(jobName) {
    let name = jobName;
    if (
      /_\w{8}$/.test(name) &&
    getChecksum(name.slice(0, -2)) === name.slice(-2)
    ) {
      name = name.slice(0, -9);
    }

    let suffix = Date.now().toString(16);
    suffix = suffix.substring(suffix.length - 6);
    name = `${name}_${suffix}`;
    name = name + getChecksum(name);
    return name;
  }

  /**
   * @author odin
   * @param {array} jobTaskRoles - 要設定的集中式陣列
   * @description 如果 jobTaskRoles 為空陣列則給於預設值，不然就依照傳入的值做設定
  */
  const setJobTaskRolesAfterCheck = useCallback(
    jobTaskRoles => {
      if (isEmpty(jobTaskRoles)) {
        setJobTaskRolesState([new JobTaskRole({ name: 'taskrole1' })]);
      } else {
        setJobTaskRolesState(jobTaskRoles);
      }
    },
    [setJobTaskRolesState]
  );

  /**
   * @author odin
   * @param {array} nfsMount - 要設定的集中式陣列
   * @description 如果 nfsMount 為空陣列則給於預設值，不然就依照傳入的值做設定
  */
  const setNfsMounts = useCallback(
    nfsMount => {
      if (isEmpty(nfsMount)) {
        setNfsMountsState([{ name: '', mountPoint: '' }]);
      } else {
        setNfsMountsState(nfsMount);
      }
    },
    [setNfsMountsState]
  );

  /**
   * @author odin
   * @param {array} glusterfsMount - 要設定的分散式陣列
   * @description 如果 glusterfsMount 為空陣列則給於預設值，不然就依照傳入的值做設定
  */
  const setGlusterfsMounts = useCallback(
    glusterfsMount => {
      if (isEmpty(glusterfsMount)) {
        setGlusterfsMountsState([{ name: '', mountPoint: '' }]);
      } else {
        setGlusterfsMountsState(glusterfsMount);
      }
    },
    [setGlusterfsMountsState]
  );

  /**
   * @author odin
   * @param {array} template - 要設定的模板物件
   * @description 如果 template 為空物件則給於預設值，不然就依照傳入的值做設定
  */
  const setTemplates = useCallback(
    (template) => {
      if (isEmpty(template)) {
        setTemplatesState({ name: '', description: '', publicMode: 0, jobConfig: null })
      } else {
        setTemplatesState(template)
      }
    },
    [setTemplatesState]
  );

  /**
   * @author odin
   * @param {array} param - 要設定的關鍵字陣列
   * @description 如果 param 為空陣列則給於預設值，不然就依照傳入的值做設定
  */
  const setParameters = useCallback(
    param => {
      if (isEmpty(param)) {
        setParametersState([{ key: '', value: '' }]);
      } else {
        setParametersState(param);
      }
    },
    [setParametersState]
  );

  /**
   * @author odin
   * @param {array} secret - 要設定的 secret
   * @description 如果 secret 為空陣列則給於預設值
  */
  const setSecrets = useCallback(
    secret => {
      if (isEmpty(secret)) {
        setSecretsState([{ key: '', value: '' }]);
      } else {
        setSecretsState(secret);
      }
    },
    [setSecretsState]
  );

  /**
   * @author odin
   * @description 設定特定的 keyName 的錯誤訊息
  */
  const setErrorMessage = useCallback(
    (id, msg) => {
      setErrorMessages(prev => {
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
    },
    [setErrorMessages]
  );

  /**
   * @author odin
   * @description toggle advanceFlag 的值
  */
  const onToggleAdvanceFlag = useCallback(
    () => {
      setAdvanceFlag(!advanceFlag);
    },
    [advanceFlag, setAdvanceFlag]
  );

  /**
   * @author odin
   * @description toggle isNfsSelected 的值
  */
  const selectNfs = useCallback(
    () => setIsNfsSelected(!isNfsSelected),
    [isNfsSelected]
  );

  /**
   * @author odin
   * @description toggle isTemplatesSelected 的值
  */
  const selectTemplates = useCallback(
    () => setIsTemplatesSelected(!isTemplatesSelected),
    [isTemplatesSelected]
  );

  /**
   * @author odin
   * @description 更新元件資料的方法
  */
  const handleComponentUpdate = useCallback(({
    jobInfo,
    jobTaskRoles,
    jobProtocol,
    parameters,
    secrets,
    nfsMounts,
    glusterfsMounts
  }) => {
    if(!isNil(jobInfo)) setJobInformation(jobInfo);
    if(!isNil(jobTaskRoles)) setJobTaskRolesAfterCheck(jobTaskRoles);
    if(!isNil(jobProtocol)) setInitJobProtocol(new JobProtocol(jobProtocol));
    if(!isNil(parameters)) setParameters(parameters);
    if(!isNil(secrets)) setSecrets(secrets);
    if(!isNil(nfsMounts)) setNfsMounts(nfsMounts);
    if(!isNil(glusterfsMounts)) setGlusterfsMounts(glusterfsMounts);
  }, [
    setJobInformation,
    setJobTaskRolesAfterCheck,
    setParameters,
    setSecrets,
    setNfsMounts,
    setGlusterfsMounts,
    setInitJobProtocol
  ]);

  /**
   * @author odin
   * @param {string} currentName -- 目前這個 taskRole 的名稱
   * @description 檢查是否有重複的名稱 taskRole 名稱
   * @returns {array} -- 陣列中包含重複名稱的 jobTaskRole.name
  */
  const dupNames = useMemo(() => ((currentName) => {
    if (!jobTaskRoles) return;

    const isDuplicated = () => {
      const nameArray = jobTaskRoles.map(item => item.name);
      let count = 0;

      nameArray.forEach(name => {
        if(name === currentName) count += 1;
      })

      return count >= 2;
    };

    // 檢查名稱是否重複 & 是否符合規則
    if (isDuplicated()) {
      setErrorMessage('TaskRole', 'task role name is duplicated');
      return t('duplicateName');
    } else if (!TEXT_FILED_REGX.test(currentName)) {
      setErrorMessage('TaskRole', `${t('stringFormatIs')}${t('enSpace')}${t('taskRoleNameInvalid')}`);

      return `${t('stringFormatIs')}${t('enSpace')}${t('taskRoleNameInvalid')}`;
    } else {
      setErrorMessage('TaskRole', '');
    }

  }), [jobTaskRoles]);

  /**
   * @author odin
   * @param {boolean} bool - 是否切換為高級狀態
   * @description 設定是否切換為高級狀態的 state，如果為高級狀態則顯示錯物提示該錯誤提示的類別會經由context傳下去給子component
  */
  const handleModeChange = bool => {
    setAdvanceFlag(bool);
    cookies.set('jobSubmitMode', bool, { path: '/' });
    if (bool) {
      setErrorMessage(SETUPENV_ERROR_MESSAGE_ID, {});
    }
  };

  /**
   * @author odin
   * @param {object} remainObj - CPU GPU MemoryMB 個別資源的上限值
   * @description 計算出符合上限的個別資源數量的 jobTaskRoles
  */
  const handleProperResourceJobTaskRoles = useMemo(() => (
    remainObj = remainObj,
    jobTaskRoles
  ) => {
    const {
      cpu: remainCPU,
      gpu: remainGPU,
      memoryMB: remainMemoryMB
    } = remainObj;

    const result = jobTaskRoles.map(jobTaskRole => {

      const {
        cpu: tempCPU,
        gpu: tempGPU,
        gpuMemoryPercentage,
        memoryMB: tempMemoryMB
      } = jobTaskRole.k8sResource

      return new JobTaskRole({
        ...jobTaskRole,
        k8sResource: {
          cpu: Math.min(remainCPU, tempCPU),
          gpu: Math.min(remainGPU, tempGPU),
          gpuMemoryPercentage: gpuMemoryPercentage ?? 100,
          memoryMB: Math.min(remainMemoryMB, tempMemoryMB)
        }
      })
    });

    return result;
  }, [remainObj]);

  // * hooks
  /**
   * @author odin
   * @description 處理從 API 來的原始資料
  */
  useEffect(() => {
    if(isEmpty(nodeResource)) return;

    let maxGPU = 0;

    const showNodeResourceList = nodeResource.reduce((acc, item) => {
      const {
        nodeName,
        cpu, cpuMaybeUsed,
        gpu, gpuMaybeUsed,
        gpuMemoryPercentageMaybeUsed,
        memory, memoryMaybeUsed
      } = item;

      const cpuLeft = cpu - cpuMaybeUsed;
      const gpuLeft = gpu - gpuMaybeUsed;
      const memoryLeft = memory - memoryMaybeUsed;
      const gpuPercentageLeftArr = gpuMemoryPercentageMaybeUsed.map(item => (100 - +(item.memoryPercentage)))

      // 找出節點的最大限制為一個容器多可以分配到的 GPU 張數
      maxGPU = Math.max(maxGPU, gpuPercentageLeftArr.length);

      return {
        ...acc,
        nodes: [ ...acc.nodes, nodeName ],
        [nodeName]: {
          cpuLeft,
          gpuLeft,
          memoryLeft,
          gpuPercentageLeftArr
        }
      }
    }, { nodes: [] });

    setShowNodes(showNodeResourceList);
    setResourceOtherLimit( prev => ({ ...prev, gpu: maxGPU }));
  }, [nodeResource])

  /**
   * @author odin
   * @description 解決如果從其他頁面跳轉來提交作業的話，維持左側欄位的 highlight 在提交作業上
  */
  useEffect(() => {
    $('.treeview').removeClass('menu-open')
      .children('.treeview-menu').slideUp('fast')
      .children('.treeview-menu-li').removeClass('active');

    $('#sidebar-menu--model-training').addClass('menu-open')
      .children('.treeview-menu').slideDown('fast')
      .children('#sidebar-menu--model-training--submit-job').addClass('active');
  }, []);

  /**
   * @author odin
   * @description init to get canUseVgs & DockerStorageOptsSize(DisNum)
  */
  useEffect(() => {
    Promise.all([
      getCanUseVirtualGroups(loginUser, true),
      getDockerStorageOptsSize(),
      getNodeResource()
    ])
      .then(([
        userVgInfos,
        num,
        nodeResourceResult
      ]) => {
        // handle getCanUseVirtualGroups
        const vcNameTemp = [];

        userVgInfos.forEach(({ name, schedulable, queueable }) => {
          // Don't let user to see the "total" option.
          if (name !== 'total') {
            vcNameTemp.push({
              name,
              schedulable,
              queueable,
              type: `${schedulable ? 'schedulable' : queueable ? 'queueable' : 'immediately'}`
            });
          }
        });

        setNodeResource(nodeResourceResult);
        setVcNames(vcNameTemp);
        setVgInfos(
          userVgInfos.reduce((res, info) => {
            res[info.name] = info;
            return res;
          }, {})
        );
        setJobInformation(
          new JobBasicInfo({ ...jobInformation })
        );
        setDiskNum(num);
        setIsLoadingVc(false);
      })
    // getDockerStorageOptsSize()
    //   .then((num) => setDiskNum(num))
  }, []);

  /**
   * @author odin
   * @description init to get NfsInfo & GlusterfsInfo
  */
  useEffect(() => {
    getUserNfs(loginUser)
      .then(nfs => {
        setNfsInfo(nfs)
        nfs = nfs.map(item => item.name)
        setNfsNames(nfs)
        if (nfs.some(nfsName => nfsName === loginUser)) {
          setNfsMounts([{ name: loginUser, mountPoint: '/root/data' }]);
        }
      })
    getUsersGlusterfs(loginUser, { withInfo: true })
      .then(fs => {
        setGlusterfsInfo(fs);
        fs = fs.map(item => item.name);
        setGlusterfsNames(fs);
        if (fs.some(item => item.name === loginUser))
          setGlusterfsMounts([{ name: loginUser, mountPoint: 'root/data' }]);
      });
  }, []);

  /**
   * @author odin
   * @description 根據不同的身份別進行模板的資料取得
  */
  useEffect(() => {
    if (isEmpty(userInfo)) return;
    const hasAdminPrivileges = userInfo.admin === 'true' ? true : false;
    const getTemList = hasAdminPrivileges ? getJobTemplate() : getCanReadJobTemplate(userInfo.username);
    getTemList
      .then(res => {
        setTemplateList(res);
        setExistTemplateNameList(res.filter(item => item.owner === userInfo.username).map(item => item.name))
      })
      .catch(err => toast.error('Error:' + err.data ? err.data.message : err.message))
  }, [userInfo])

  /**
   * @author odin
   * @description isLoadingVc === false => 開始針對 URL 解析，找出對應的 jobname | user，在找出表單對應的各個值，並且填入欄位中
  */
  useEffect(
    () => {
      if (isLoadingVc) return;
      const params = new URLSearchParams(window.location.search);
      if (params.get('op') === 'resubmit') {
        const jobName = params.get('jobname') || '';
        const user = params.get('user') || '';
        if (user && jobName) {
          fetchJobConfigV12(user, jobName)
            .then(jobConfigV12 => {
              setAdvanceFlag(true)
              // const jobConfig = JobProtocol.v12JsonToV14Json(jobConfigV12);
              const [
                jobInfo,
                jobTaskRoles,
                parameters,
                nfsMounts,
                glusterfsMounts
              ] = getJobComponentsFromConfig(jobConfigV12, { vcNames });

              jobInfo.name = generateJobName(jobInfo.name);

              if (get(jobConfigV12, 'extras.submitFrom')) {
                delete jobConfigV12.extras.submitFrom;
              }

              handleComponentUpdate({
                jobInfo,
                jobTaskRoles,
                parameters,
                nfsMounts,
                glusterfsMounts,
                jobProtocol: new JobProtocol(jobConfigV12)
              });

              setLoading(false);
              setIsCopy(true);
            })
            .catch(err => {
              toast.error(err.toString())
            });
        }
      } else {
        setLoading(false);
      }
    },
    [isLoadingVc]
  );

  /**
   * @author odin
   * @description 當 taskrole 的欄位或是叢集有改變的時候，會 run 這個 taskRole 去更新整個 jobTaskRoles
   * 這邊的 jobTaskRole 是用陣列包物件的方式組成
  */
  useEffect(
    () => {
      // docker info will be updated in-place
      const preTaskRoles = JSON.stringify(jobTaskRoles);
      const taskRolesManager = new TaskRolesManager(jobTaskRoles);
      taskRolesManager.populateTaskRolesDockerInfo();
      const [
        updatedSecrets,
        isUpdated
      ] = taskRolesManager.getUpdatedSecretsAndLinkTaskRoles(secrets);

      const curTaskRoles = JSON.stringify(jobTaskRoles);
      if (preTaskRoles !== curTaskRoles) {
        setJobTaskRolesState(jobTaskRoles);
      }

      if (isUpdated) {
        setSecrets(updatedSecrets);
      }
    },
    [jobTaskRoles]
  );

  /**
   * @author odin
   * @description 透過 secret 來確認是否要更新目前的 taskRoles
  */
  useEffect(
    () => {
      const taskRolesManager = new TaskRolesManager(jobTaskRoles);
      const isUpdated = taskRolesManager.populateTaskRolesWithUpdatedSecret(
        secrets
      );
      if (isUpdated) {
        taskRolesManager.populateTaskRolesDockerInfo();
        setJobTaskRolesAfterCheck(jobTaskRoles);
      }
    },
    [secrets]
  );

  /**
   * @author odin
   * @description 計算使用狀態，該集群中的 CPU GPU Memory 總數以及使用了多少
  */
  useEffect(
    () => {
      const vgInfoObj = vgInfos[jobInformation.virtualCluster];

      if (!isEmpty(vgInfoObj)) {
        const { cells, usedCells } = vgInfoObj;

        const totalCPU = get(cells, 'cpu.number', 0);
        const totalGPU = get(cells, 'gpu.number', 0);
        const totalMemory = get(cells, 'memory.number', 0);
        const totalGPUMemoryPercentage = get(cells, 'gpuMemoryPercentage.number', 0);


        const usedCPU = get(usedCells, 'cpu', 0);
        const usedGPU = get(usedCells, 'gpu', 0);
        const usedMemory = get(usedCells, 'memory', 0);
        const usedGPUMemoryPercentage = get(usedCells, 'gpuMemoryPercentage', 0);


        setSectionTooltip(
          <div>
            <ul style={{ padding: 0 }}>
              <li style={{ padding: 4 }}>{`${t('name')}: ${vgInfoObj.name}`}</li>
              <li style={{ padding: 4, paddingBottom: 0 }}>{`${t('taskRunning')}: ${vgInfoObj.activeJobs}`}</li>
            </ul>
          </div>
        );

        setSectionShowUnderVg(
          <div>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              <li style={{ padding: 0 }}>{`${t('use')}${t('status')} / ${t('All')} `}</li>
              <li style={{ padding: 0 }}>{`${t('Memory')}: ${usedMemory} / ${totalMemory}`}</li>
              <li style={{ padding: 0 }}>{`${t('CPU')}: ${usedCPU} / ${totalCPU}`}</li>
              <li style={{ padding: 0 }}>{t('GPU')}: {(totalGPU === 0) ? t('no2') : `${usedGPU} / ${totalGPU}`}</li>
              <li style={{ padding: 0 }}>{t('GPU Percentage')}: {(totalGPUMemoryPercentage === 0) ? t('no2') : `${usedGPUMemoryPercentage} / ${totalGPUMemoryPercentage}`}</li>
            </ul>
          </div>
        );

      } else {
        setSectionTooltip('');
        setSectionShowUnderVg('');
      }
    },
    [vgInfos, jobInformation, i18n.language, jobTaskRoles]
  );

  // useEffect(() => {
  //   nfsMounts.forEach(nfs => {
  //     if (nfs.name && !nfsInfo[nfs.name]) {
  //       getNfsInfo(nfs.name).then(
  //         info => {
  //           setNfsInfo(prev => ({ ...prev,  [info.name]: info }))
  //         }
  //       )
  //     }
  //   })
  // }, [nfsMounts])

  /**
   * @author odin
   * @description 如果沒有有 permission 的話返回首頁，permission 是確認目前登入的使用者是不是有管理者權限，或是符合權限的能力
  */
  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission]);

  /**
   * @author odin
   * @description 集群切換的時候更新可以更新 taskRole
  */
  useEffect(() => {
    if (vgInfos[jobInformation.virtualCluster] && isCopy === false) {
      setJobTaskRolesAfterCheck(jobTaskRoles.map(taskRole => {
        return new JobTaskRole ({
          ...taskRole
        })
      }))
    }
  }, [jobInformation.virtualCluster, isCopy]);

  /**
   * @author odin
   * @description 計算所有的 taskRole 個別使用的數量有沒有超過上限總和，如果有錯誤的話就寫入錯誤訊息中
  */
  useEffect(() => {
    if(isNil(remainObj)) return;

    let isValid = true;
    let totalCPU = 0, totalGPU = 0, totalMemory = 0, totalGPUMemoryPercentage = 0;
    let obj = {
      cpu: false,
      gpu: false,
      memoryMB: false,
      gpuMemoryPercentage: false
    };

    const totalValues = cloneDeep(jobTaskRoles);

    if(vcType === 'queueable') {
      totalValues.forEach(item => {
        const { cpu, memoryMB } = item.k8sResource;

        // 如果 cpu memoryMB 任一個是 0 的話，則不符合檢查規則
        if(cpu <= 0) isValid = false;
        if(memoryMB <= 0) isValid = false;
      });
    } else {
      const {
        cpu: limitCPU,
        gpu: limitGPU,
        memory: limitMemory,
        gpuMemoryPercentage: limitGPUMemoryPercentage
      } = remainObj;

      totalValues.forEach(item => {
        const { cpu, gpu, memoryMB, gpuMemoryPercentage } = item.k8sResource;

        // 加總
        totalCPU += cpu;
        totalGPU += gpu;
        totalMemory += memoryMB;
        totalGPUMemoryPercentage += (gpu * gpuMemoryPercentage);

        // 如果 cpu memoryMB 任一個是 0 的話，則不符合檢查規則
        if(cpu <= 0) isValid = false;
        if(memoryMB <= 0) isValid = false;
      });

      const unValidCPU = totalCPU > limitCPU && totalCPU !== limitCPU;
      const unValidGPU = totalGPU > limitGPU && totalGPU !== limitGPU;
      const unValidMemoryMB = totalMemory > limitMemory && totalMemory !== limitMemory;
      const unValidGPUMemoryPercentage = totalGPUMemoryPercentage > limitGPUMemoryPercentage;

      if(unValidCPU || unValidGPU || unValidMemoryMB || unValidGPUMemoryPercentage) isValid = false;

      obj = {
        cpu: unValidCPU,
        gpu: unValidGPU,
        memoryMB: unValidMemoryMB,
        gpuMemoryPercentage: unValidGPUMemoryPercentage
      };
    }

    // 填入錯誤訊息
    if(!isValid) {
      setErrorMessage(RESOURCE_ERROR_MESSAGE_ID, t('error'));
    } else {
      setErrorMessage(RESOURCE_ERROR_MESSAGE_ID, '');
    }

    setIsResourceValid(isValid);
    setResourceUnValidObj(obj);
  }, [remainObj, jobTaskRoles]);

  /**
   * @author odin
   * @description
   * 1. 選擇模板後，將模板中的資料更新除了 taskRole 以外的內容，包含叢集。
  */
  useEffect(() => {
    if(isNil(selectedTemplate)) return;

    const { jobConfig } = selectedTemplate;
    const [
      jobInfo,
      taskRoles,
      parameters,
      nfsMounts,
      secrets,
      glusterfsMounts
    ] = getJobComponentsFromConfig(jobConfig, { vcNames }, vgInfos, getResourceUnitCount);

    jobInfo.name = generateJobName(jobInfo.name);

    if (get(jobConfig, 'extras.submitFrom')) {
      delete jobConfig.extras.submitFrom;
    }

    // 先更新其他資訊
    handleComponentUpdate({
      jobInfo,
      jobProtocol: new JobProtocol(jobConfig),
      parameters,
      secrets,
      nfsMounts,
      glusterfsMounts
    });

    // 更新 selectedIndex
    setSelectedIdx(0);

    // 等到其他資訊都更新完才更新 taskRole 的資訊
    setTempTaskRoles(taskRoles);

  }, [selectedTemplate]);

  /**
   * @author odin
   * @description
   * 2. 更新了叢集後，remainObj 也會跟著更新計算出各個資源的上限是多少，用更新好的 remainObj 計算應該要帶入多少數量的資源進去。
   * - 規則是，最高限制分別給每個 taskRole 計算，例如模板有兩個 taskRole，其中 CPU 數量都是 4，但CPU上限也是4，則還是會個別填入4，但最後顯示的部分還是會顯示紅字，因為全部 taskRole 加起來的數量是 8 已經超過上限的 4
  */
  useEffect(() => {
    if(isNil(tempTaskRoles) || isNil(remainObj)) return;

    const handledJobTaskRoles = handleProperResourceJobTaskRoles(remainObj, tempTaskRoles);

    handleComponentUpdate({
      jobTaskRoles: handledJobTaskRoles
    });

  }, [remainObj, tempTaskRoles]);

  // & handled data
  const contextValue = {
    advanceFlag,
    classes,
    vcNames,
    vcType,
    setVCType,
    vgInfos,
    nfsNames,
    glusterfsNames,
    errorMessages,
    setErrorMessage,
    nfsInfo,
    glusterfsInfo,
    systemParams,
    // - 是否能夠設定 gpu 使用百分比
    canSplitGPU,
    // - 模板相關
    templateList,
    userInfo,
    existTemplateNameList,
    selectedTemplate,
    setSelectedTemplate,
    setEditorOpen,
    systemAvailableResource,
    jobInformation,
    selfLimitResourceObj,
    // - jobTaskRole 相關
    selectedIdx,
    setSelectedIdx,
    dupNames,
    jobTaskRoles,
    // - 選擇資源相關
    resourceRef,
    remainObj,
    setRemainObj,
    defaultObj,
    isResourceValid,
    resourceUnValidObj,
    resourceOtherLimit,
    showNodes
  };

  return (
    <Context.Provider value={contextValue}>
      {
        loading ? <Loading />
          :
          <>
            <div
              className={`${classes.jobSubmitContainer}`}
            >
              {/* top - form */}
              <div>
                <BreadCrumbs />
              </div>

              {/* 基本 - 高級 狀態的控制按鈕 */}
              <div
                className={`${classes.mt_0} ${classes.d_flex}`}
              >
                <DefaultButton
                  children={`${t('basic')}`}
                  classNameProps={`${classes.jobSubmitCtrlBtn_Left}`}
                  isActive={advanceFlag === false}
                  onClick={() => handleModeChange(false)}
                />
                <DefaultButton
                  children={`${t('Advanced')}`}
                  classNameProps={`${classes.jobSubmitCtrlBtn_Right}`}
                  isActive={advanceFlag === true}
                  onClick={() => handleModeChange(true)}
                />
              </div>

              <div className={`${classes.overflowAuto} ${classes.flexGrow1} ${classes.mt_10}`}>
                {/* 基本設置 */}
                <JobInformation
                  jobInformation={jobInformation}
                  onChange={setJobInformation}
                  sectionShowUnderVg={sectionShowUnderVg}
                  sectionTooltip={sectionTooltip}
                  setIsCopy={setIsCopy}
                />

                {/* 任務設置 */}
                <TaskRoles
                  advanceFlag={advanceFlag}
                  jobTaskRoles={jobTaskRoles}
                  setJobTaskRolesAfterCheck={setJobTaskRolesAfterCheck}
                />
                {
                  advanceFlag
                    ?
                    <>
                      {/* 存儲 */}
                      <NFSMounts
                        glusterfsMounts={glusterfsMounts}
                        nfsMounts={nfsMounts}
                        onChange={setNfsMounts}
                        onGlusterfsMountChange={setGlusterfsMounts}
                        onSelect={selectNfs}
                        selected={isNfsSelected}
                      />

                      {/* 環境變數 */}
                      <Parameters
                        onChange={setParameters}
                        parameters={parameters}
                      />

                      {/* 詢問是否要存成模板 */}
                      <Templates
                        existTemplateNameList={existTemplateNameList}
                        isTemplatesSelected={isTemplatesSelected}
                        onSelect={selectTemplates}
                        setErrorMessage={setErrorMessage}
                        setTemplates={setTemplates}
                        templatesState={templatesState}
                      />
                    </>
                    :
                    <>
                      {/* 環境變數配置 */}
                      <SetupEnv
                        onChangeParma={setParameters}
                        onChangeTaskRoles={setJobTaskRolesAfterCheck}
                        onParametersSelected={setIsParametersSelected}
                        parameters={parameters}
                        selected={isParametersSelected}
                        taskRoles={jobTaskRoles}
                      />
                    </>
                }
              </div>

              {/* Footer */}
              <Footer
                advanceFlag={advanceFlag}
                diskNum={diskNum}
                getResourceUnitCount={getResourceUnitCount}
                glusterfsMounts={glusterfsMounts}
                handleComponentUpdate={handleComponentUpdate}
                handleProperResourceJobTaskRoles={handleProperResourceJobTaskRoles}
                initJobProtocol={initJobProtocol}
                isEditorOpen={isEditorOpen}
                isSubmitting={isSubmitting}
                isTemplatesSelected={isTemplatesSelected}
                jobInformation={jobInformation}
                jobTaskRoles={jobTaskRoles}
                nfsMounts={nfsMounts}
                onToggleAdvanceFlag={onToggleAdvanceFlag}
                parameters={parameters}
                secrets={secrets}
                setEditorOpen={setEditorOpen}
                setIsSubmitting={setIsSubmitting}
                templatesState={isTemplatesSelected && templatesState}
                vgInfos={vgInfos}
              />
            </div>

            <LoadingDialog
              isOpen={isSubmitting}
            />
          </>
      }
    </Context.Provider>
  );
};

export default JobSubmit;
