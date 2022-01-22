import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext
} from 'react';

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
import { SETUPENV_ERROR_MESSAGE_ID } from './utils/errorCode';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { JobInformation } from './components/job-information';
import { SubmissionSection } from './components/submission-section';
import { TaskRoles } from './components/task-roles';
import { fetchJobConfigV12 } from './utils/conn';
import { getUsersXdfs, getUsersGlusterfs, getUserNfs, getCanUseVirtualGroups, getHivedResourceUnit, getDockerStorageOptsSize } from 'utils/api';
import { getJobComponentsFromConfig } from './utils/utils';
import { TaskRolesManager } from './utils/task-roles-manager';
import Loading from 'components/Loading';
import LoadingDialog from 'components/LoadingDialog';
import BreadCrumbs from 'components/BreadCrumbs';

// ^ Plugins
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isEmpty, get } from 'lodash';
import queryString from 'query-string';
import cookies from 'js-cookie';

// % style
import { makeStyles } from '@material-ui/core/styles';
import commonStyle from 'common/commonStyles'
import jobSubmitStyle from './jobSubmitStyle'

const useStyles = makeStyles((theme) => ({
  ...commonStyle(theme),
  ...jobSubmitStyle(theme)
}))

/**
 * @author odin
 * @level views/JobSubmit
 * @component JobSubmit
 * @description JobSubmit component
*/
const JobSubmit = () => {

  // $ init data
  // const SIDEBAR_NFS_MOUNTS = 'nfs';
  // const SIDEBAR_PARAM = 'param';
  // const SIDEBAR_SECRET = 'secret';
  // const SIDEBAR_ENVVAR = 'envvar';
  // const SIDEBAR_DATA = 'data';

  const loginUser = cookies.get('user');
  const submitMode = cookies.get('jobSubmitMode') === 'true';
  const permission = useCheckPrivilege('JOB');
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const parsedQuery = queryString.parse(location.search);

  const { isXdfsEnabled, getResourceUnitCount, selfLimitResourceObj } = useContext(GlobalContext);

  // = styles
  const classes = useStyles();

  // # states
  const [jobTaskRoles, setJobTaskRolesState] = useState([
    new JobTaskRole({ name: 'taskrole1', dockerInfo: new DockerInfo({ uri: parsedQuery.docker_repo }), commands: 'sleep infinity' })
  ]);

  const [nfsMounts, setNfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [glusterfsMounts, setGlusterfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [xdfsMounts, setXdfsMountsState] = useState([
    { name: '', mountPoint: '' }
  ]);
  const [templatesState, setTemplatesState] = useState({
    name: '', description: '', publicMode: 0, jobConfig: null, canReadUsers:[], canWriteUsers: []
  })

  const [parameters, setParametersState] = useState([{ key: '', value: '' }]);
  const [secrets, setSecretsState] = useState([{ key: '', value: '' }]);
  const [jobInformation, setJobInformation] = useState(
    new JobBasicInfo({
      name: `${loginUser}_${Date.now()}`,
      virtualCluster: VIRTUAL_CLUSTER_DEFAULT_VALUE
    })
  );
  const [sectionTooltip, setSectionTooltip] = useState('');
  const [sectionShowUnderVg, setSectionShowUnderVg] = useState('');


  const [isNfsSelected, setIsNfsSelected] = useState(true);
  const [advanceFlag, setAdvanceFlag] = useState(submitMode);
  const [loading, setLoading] = useState(true);
  const [isLoadingVc, setIsLoadingVc] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initJobProtocol, setInitJobProtocol] = useState(new JobProtocol({}));

  // Context variables
  const [vcNames, setVcNames] = useState([]);
  const [vcNamesWithSchedulable, setVcNamesWithSchedulable] = useState([]);
  const [vgInfos, setVgInfos] = useState({});
  const [nfsNames, setNfsNames] = useState([]);
  const [glusterfsNames, setGlusterfsNames] = useState([]);
  const [xdfsNames, setXdfsNames] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [nfsInfo, setNfsInfo] = useState([]);
  const [glusterfsInfo, setGlusterfsInfo] = useState([]);
  const [xdfsInfo, setXdfsInfo] = useState([]);
  const [systemParams ] = useState([]);
  const [existTemplateNameList, setExistTemplateNameList] = useState([]);
  const [isTemplatesSelected, setIsTemplatesSelected] = useState(false);
  const [isParametersSelected, setIsParametersSelected] = useState({
    'vnc': false,
    'jupyterHttp': false,
    'logMonitor': false,
    'RDMA': false
  });
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [systemAvailableResource ] = useState([]);
  const [hivedResourceUnits, setHivedResourceUnits] = useState({});
  const [hivedSkuTypes, setHivedSkuTypes] = useState([]);
  const [diskNum, setDiskNum] = useState(0);
  const [isResourceRemain, setIsResourceRemain] = useState(true);


  // - methods
  function getChecksum(str) {
    let res = 0;
    for (const c of str) {
      res ^= c.charCodeAt(0) & 0xff;
    }
    return res.toString(16);
  }

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
   * @param {boolean} bool - 是否切換為高級狀態
   * @description 設定是否切換為高級狀態的 state，如果為高級狀態則顯示錯物提示該錯誤提示的類別會經由context傳下去給子component
  */
  const handleModeChange = bool => {
    setAdvanceFlag(bool);
    cookies.set('jobSubmitMode', bool, { path: '/' });
    if (bool) {
      setErrorMessage(SETUPENV_ERROR_MESSAGE_ID, {});
    }
  }

  // * hook
  const setJobTaskRolesAfterCheck = useCallback(
    taskRoles => {
      if (isEmpty(taskRoles)) {
        setJobTaskRolesState([new JobTaskRole({ name: 'taskrole1' })]);
      } else {
        setJobTaskRolesState(taskRoles);
      }
    },
    [setJobTaskRolesState]
  );

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
  const setGlusterfsMounts = useCallback(
    nfsMount => {
      if (isEmpty(nfsMount)) {
        setGlusterfsMountsState([{ name: '', mountPoint: '' }]);
      } else {
        setGlusterfsMountsState(nfsMount);
      }
    },
    [setGlusterfsMountsState]
  );

  const setXdfsMounts = useCallback(
    nfsMount => {
      if (isEmpty(nfsMount)) {
        setXdfsMountsState([{ name: '', mountPoint: '' }]);
      } else {
        setXdfsMountsState(nfsMount);
      }
    },
    [setXdfsMountsState]
  )

  const setTemplates = useCallback(
    (template) => {
      if (isEmpty(template)) {
        setTemplatesState({ name: '', description: '', publicMode: 0, jobConfig: null })
      } else {
        setTemplatesState(template)
      }
    },
    [setTemplatesState]
  )

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

  useEffect(
    () => {
      const vgInfoObj = vgInfos[jobInformation.virtualCluster];
      if (vgInfoObj && !isEmpty(hivedResourceUnits)) {
        const { cells, usedCells } = vgInfoObj;
        const perTotalResource = []
        const perUsedResource = []
        // caculate pre resource and pre unit
        for (const key in cells) {
          const { resourceUnit: unit, number } = cells[key];
          perTotalResource.push({
            cpu: hivedResourceUnits[unit].cpu * number,
            memory: hivedResourceUnits[unit].memory * number,
            gpu: hivedResourceUnits[unit].gpu === null ? 0 : hivedResourceUnits[unit].gpu * number
          })
          if (usedCells[key] !== undefined) {
            perUsedResource.push({
              cpuUsed: hivedResourceUnits[unit].cpu * usedCells[key],
              memoryUsed: hivedResourceUnits[unit].memory * usedCells[key],
              gpuUsed: hivedResourceUnits[unit].gpu === null ? 0 : hivedResourceUnits[unit].gpu * usedCells[key]
            })
          }
        }

        const totalResource = perTotalResource.reduce((acc, cur) => {
          return {
            cpu: acc.cpu + cur.cpu,
            memory: acc.memory + cur.memory,
            gpu: acc.gpu + (cur.gpu === null ? 0 : cur.gpu)
          }
        }, { cpu: 0, memory: 0, gpu: 0 })

        const usedResource = perUsedResource.reduce((acc, cur) => {
          return {
            cpuUsed: acc.cpuUsed + cur.cpuUsed,
            memoryUsed: acc.memoryUsed + cur.memoryUsed,
            gpuUsed: acc.gpuUsed + cur.gpuUsed
          }
        }, { cpuUsed: 0, memoryUsed: 0, gpuUsed: 0 })

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
              <li style={{ padding: 0 }}>{`${t('use')}${t('status')} /${t('All')} `}</li>
              <li style={{ padding: 0 }}>{`${t('Memory')}: ${usedResource.memoryUsed}/${totalResource.memory}`}</li>
              <li style={{ padding: 0 }}>{`${t('CPU')}: ${usedResource.cpuUsed}/${totalResource.cpu}`}</li>
              <li style={{ padding: 0 }}>{t('graphicCard')}: {(totalResource.gpu === 0) ? t('no2') : `${usedResource.gpuUsed}/${totalResource.gpu}`}</li>
            </ul>
          </div>
        );

      } else {
        setSectionTooltip('');
        setSectionShowUnderVg('');
      }
    },
    [vgInfos, jobInformation, i18n.language, jobTaskRoles, hivedResourceUnits]
  );

  const onToggleAdvanceFlag = useCallback(
    () => {
      setAdvanceFlag(!advanceFlag);
    },
    [advanceFlag, setAdvanceFlag]
  );

  const selectNfs = useCallback(() => setIsNfsSelected(!isNfsSelected), [
    isNfsSelected
  ]);

  const selectTemplates = useCallback(
    () => setIsTemplatesSelected(!isTemplatesSelected),
    [isTemplatesSelected]
  );

  const setTemplateValue = config => {
    // const jobConfig = JobProtocol.v12JsonToV14Json(config.jobConfig);
    const { jobConfig } = config;
    const [
      jobInfo,
      taskRoles,
      parameters,
      nfsMounts,
      ,
      glusterMounts,
      xdfsMounts
    ] = getJobComponentsFromConfig(jobConfig, { vcNames }, vgInfos, getResourceUnitCount);
    jobInfo.name = generateJobName(jobInfo.name);
    if (get(jobConfig, 'extras.submitFrom')) {
      delete jobConfig.extras.submitFrom;
    }
    setJobInformation(jobInfo);
    setInitJobProtocol(new JobProtocol(jobConfig));
    setJobTaskRolesAfterCheck(taskRoles);
    setParameters(parameters);
    setNfsMounts(nfsMounts);
    setGlusterfsMounts(glusterMounts);
    setXdfsMounts(xdfsMounts)
  }

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

  useEffect(() => {
    Promise.all([getCanUseVirtualGroups(loginUser, true), getHivedResourceUnit()])
      .then(([userVgInfos, data]) => {
        // handle getCanUseVirtualGroups
        const vcNameTemp = [];
        const vcNameWithSchedulable = [];
        userVgInfos.forEach(({ name }) => {
          // Don't let user to see the "total" option.
          if (name !== 'total') {
            vcNameTemp.push(name);
          }
        });
        userVgInfos.forEach(({ name, schedulable }) => {
          // Don't let user to see the "total" option.
          if (name !== 'total') {
            vcNameWithSchedulable.push({ name, schedulable });
          }
        });
        setVcNames(vcNameTemp);
        setVcNamesWithSchedulable(vcNameWithSchedulable);
        setVgInfos(
          userVgInfos.reduce((res, info) => {
            res[info.name] = info;
            return res;
          }, {})
        );
        setJobInformation(
          new JobBasicInfo({ ...jobInformation })
        );
        // handle getHivedResourceUnit api
        setHivedResourceUnits(data)
        setIsLoadingVc(false);
      })
    getDockerStorageOptsSize()
      .then((num) => setDiskNum(num))
  }, []);

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
    getUsersXdfs(loginUser, { withInfo: true })
      .then(xdfs => {
        setXdfsInfo(xdfs)
        xdfs = xdfs.map(item => item.name)
        setXdfsNames(xdfs)
        if (xdfs.some(item => item.name === loginUser))
          setXdfsMounts([{ name: loginUser, mountPoint: 'root/data' }]);
      })
  }, []);

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
                taskRoles,
                parameters,
                nfsMounts,
                ,
                glusterMounts,
                xdfsMounts
              ] = getJobComponentsFromConfig(jobConfigV12, { vcNames }, vgInfos, getResourceUnitCount);
              jobInfo.name = generateJobName(jobInfo.name);
              if (get(jobConfigV12, 'extras.submitFrom')) {
                delete jobConfigV12.extras.submitFrom;
              }
              setJobInformation(jobInfo);
              setInitJobProtocol(new JobProtocol(jobConfigV12));
              setJobTaskRolesAfterCheck(taskRoles);
              setParameters(parameters);
              setNfsMounts(nfsMounts);
              setGlusterfsMounts(glusterMounts);
              setXdfsMounts(xdfsMounts)
              setLoading(false);
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

  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  useEffect(() => {
    if (vgInfos[jobInformation.virtualCluster]) {
      const virtualGroup = vgInfos[jobInformation.virtualCluster]
      const canUseResourceUnit = Object.entries(virtualGroup.cells).map(([key, details]) => ({
        sku: key,
        ...details
      }))
      const resourceUnits = Object.entries(virtualGroup.cells).map(([, value]) => (value.name))
      setHivedSkuTypes(canUseResourceUnit)
      setJobTaskRolesAfterCheck(jobTaskRoles.map(taskRole => {
        const { hivedScheduler } = taskRole;
        const { vg, sku, skuType } = hivedScheduler;
        const text = `${vg}.${sku === 'pinnedCellId' ? 'pinned' : 'virtual'}.${skuType}`
        const hasSkuType = resourceUnits.includes(text)
        if (hasSkuType) {
          return new JobTaskRole ({
            ...taskRole
          })
        } else {
          return new JobTaskRole ({
            ...taskRole,
            hivedScheduler: { skuNum: 1, skuType: null, sku: null, vg: null },
            containerSize: { gpu: 0, cpu: 0, memoryMB: 0 }
          })
        }
      }))
    }
  }, [jobInformation.virtualCluster])


  // % context
  const contextValue = useMemo(
    () => ({
      advanceFlag,
      classes,
      vcNames,
      vcNamesWithSchedulable,
      vgInfos,
      nfsNames,
      glusterfsNames,
      xdfsNames,
      errorMessages,
      setErrorMessage,
      nfsInfo,
      glusterfsInfo,
      xdfsInfo,
      systemParams,
      setTemplateValue,
      existTemplateNameList,
      setExistTemplateNameList,
      isTemplatesSelected,
      setEditorOpen,
      systemAvailableResource,
      hivedSkuTypes,
      hivedResourceUnits,
      jobInformation,
      isXdfsEnabled,
      selfLimitResourceObj,
      setIsResourceRemain
    }),
    [
      advanceFlag,
      vcNames,
      nfsNames,
      vgInfos,
      glusterfsNames,
      xdfsNames,
      errorMessages,
      setErrorMessage,
      nfsInfo,
      glusterfsInfo,
      xdfsInfo,
      systemParams,
      hivedSkuTypes,
      classes,
      jobInformation,
      selfLimitResourceObj
    ]
  );

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
                {
                  advanceFlag ?
                    <>
                      <DefaultButton
                        children={`${t('basic')}`}
                        classNameProps={`${classes.jobSubmitCtrlBtn_Left}`}
                        onClick={() => handleModeChange(false)}
                      />
                      <PrimaryButton
                        children={`${t('Advanced')}`}
                        classNameProps={`${classes.jobSubmitCtrlBtn_Right}`}
                        onClick={() => handleModeChange(true)}
                      />
                    </>
                    :
                    <>
                      <PrimaryButton
                        children={`${t('basic')}`}
                        classNameProps={`${classes.jobSubmitCtrlBtn_Left}`}
                        onClick={() => handleModeChange(false)}
                      />
                      <DefaultButton
                        children={`${t('Advanced')}`}
                        classNameProps={`${classes.jobSubmitCtrlBtn_Right}`}
                        onClick={() => handleModeChange(true)}
                      />
                    </>
                }
              </div>
              <div style={{ overflow: 'auto', flex: 1, marginTop: 10 }}>
                {/* 基本設置 */}
                <JobInformation
                  advanceFlag={advanceFlag}
                  jobInformation={jobInformation}
                  onChange={setJobInformation}
                  sectionShowUnderVg={sectionShowUnderVg}
                  sectionTooltip={sectionTooltip}
                />

                {/* 任務設置 */}
                <TaskRoles
                  advanceFlag={advanceFlag}
                  onChange={setJobTaskRolesAfterCheck}
                  taskRoles={jobTaskRoles}
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
                        onXdfsMountChange={setXdfsMounts}
                        selected={isNfsSelected}
                        xdfsMounts={xdfsMounts}
                      />

                      {/* 環境變數 */}
                      <Parameters
                        onChange={setParameters}
                        parameters={parameters}
                      />

                      {/* 模板 */}
                      {
                        false &&
                        <Templates
                          onSelect={selectTemplates}
                          parameters={parameters}
                          selected={isTemplatesSelected}
                          setTemplates={setTemplates}
                          templatesState={templatesState}
                        />
                      }
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

              {/* bottom - buttons */}
              <SubmissionSection
                advanceFlag={advanceFlag}
                diskNum={diskNum}
                getResourceUnitCount={getResourceUnitCount}
                glusterfsMounts={glusterfsMounts}
                initJobProtocol={initJobProtocol}
                isEditorOpen={isEditorOpen}
                isResourceRemain={isResourceRemain}
                isSubmitting={isSubmitting}
                isTemplatesSelected={isTemplatesSelected}
                isXdfsEnabled={isXdfsEnabled}
                jobInformation={jobInformation}
                jobTaskRoles={jobTaskRoles}
                nfsMounts={nfsMounts}
                onChange={(
                  updatedJobInfo,
                  updatedTaskRoles,
                  updatedParameters,
                  updatedSecrets,
                  updatedNfsMounts,
                  updateGlusterfsMounts,
                  updateXdfsMounts
                ) => {
                  setJobInformation(updatedJobInfo);
                  setJobTaskRolesAfterCheck(updatedTaskRoles);
                  setParameters(updatedParameters);
                  setSecrets(updatedSecrets);
                  setNfsMounts(updatedNfsMounts);
                  setGlusterfsMounts(updateGlusterfsMounts);
                  setXdfsMounts(updateXdfsMounts);
                }}
                onToggleAdvanceFlag={onToggleAdvanceFlag}
                parameters={parameters}
                secrets={secrets}
                setEditorOpen={setEditorOpen}
                setIsSubmitting={setIsSubmitting}
                templatesState={isTemplatesSelected && templatesState}
                vgInfos={vgInfos}
                xdfsMounts={xdfsMounts}
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
