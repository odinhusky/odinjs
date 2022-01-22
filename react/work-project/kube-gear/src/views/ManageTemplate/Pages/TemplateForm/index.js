import React, { useState, useContext, useEffect } from 'react';
import BasicSetting from './components/BasicSetting';
import Context from './Context';
import { JobBasicInfo } from './model/JobBasicInfo';
import { JobTaskRole } from './model/JobTaskRole';
import { JobTemplate } from './model/JobTemplate';
import TaskRole from './components/TaskRole';
import { getCanUseVirtualGroups, getUserNfs, getUsersGlusterfs, getUsersXdfs } from 'utils/api';
import GlobalContext from 'layouts/Main/GlobalContext';
import ParentContext from '../../Context';
import Loading from 'components/Loading'
import StorageSetting from './components/StorageSetting';
import Parameter from './components/Parameter';
import Footer from './components/Footer';

// import { Completion } from 'views/JobSubmit/models/completion';

import { isEmpty } from 'lodash';

import indexStyle from './index.module.scss';

const index = () => {
  const { userInfo, isXdfsEnabled, resourceUnit: resourceUnitObject, getResourceUnitCount } = useContext(GlobalContext);
  const { templateList, classes } = useContext(ParentContext);
  const urlParams = new URLSearchParams(window.location.search);
  const currentUserName = userInfo.username
  const [jobTemplate, setJobTemplate] = useState(new JobTemplate({}))
  const [jobInformation, setJobInformation] = useState(
    new JobBasicInfo({ name: 'taskrole1', virtualCluster: '' })
  );

  const [jobTaskRoles, setJobTaskRoles] = useState({
    'taskrole1': new JobTaskRole({ name: 'taskrole1', commands: 'sleep infinity' })
  });

  const [nfsMounts, setNfsMountsState] = useState([
    // { name: '', mountPoint: '' }
  ]);
  const [glusterfsMounts, setGlusterfsMountsState] = useState([
    // { name: '', mountPoint: '' }
  ]);
  const [xdfsMounts, setXdfsMountsState] = useState([
    // { name: '', mountPoint: '' }
  ]);
  const [parameters, setParameters] = useState([
    // { key: '', value: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [vgInfos, setVgInfos] = useState({});
  const [vgNames, setVgNames] = useState([]);
  const [nfsInfo, setNfsInfo] = useState([]);
  const [glusterfsInfo, setGlusterfsInfo] = useState([]);
  const [xdfsInfo, setXdfsInfo] = useState([]);
  const [errorMessage, setErrorMessageState] = useState({});
  const checkEdit = (urlParams.get('name') && urlParams.get('owner')) ? true : false
  const [isEditMode, setIsEditMode] = useState(checkEdit);
  const [editId, setEditId] = useState(null);

  // const [hivedResourceUnitsList, setHivedResourceUnitsList] = useState({});
  const [hivedSkuTypes, setHivedSkuTypes] = useState([]);

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

    if (isXdfsEnabled) {
      getUsersXdfs(currentUserName)
        .then(xdfs => {
          setXdfsInfo(xdfs.map(x => x.name))
        })
    } else {
      getUserNfs(currentUserName)
        .then(nfs => {
          setNfsInfo(nfs.map(n => n.name))
        })
      getUsersGlusterfs(currentUserName)
        .then(glusterfs => {
          setGlusterfsInfo(glusterfs.map(g => g.name))
        })
    }
  }, [userInfo])

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
        const { ports } = resourcePerInstance;
        const unitCount = getResourceUnitCount(jobConfig, vgInfos);
        const transformPorts = ports !== null
          ? Object.entries(ports).reduce((acc, [key, value]) => {
            return [...acc, { key: key, value: value }]
          }, [])
          : []

        const newJobTaskRole =  new JobTaskRole({
          ...taskRole,
          name: taskRoleName,
          hivedScheduler: !isEmpty(unitCount) && unitCount[taskRoleName]
            ? { skuNum: unitCount[taskRoleName].count, skuType: unitCount[taskRoleName].skuType, sku: unitCount[taskRoleName].sku, vg: unitCount[taskRoleName].vc }
            : { skuNum: 1, skuType: null, sku: null, vg: null },
          containerSize: { gpu: 0, cpu: 0, memoryMB: 0 },
          commands: commands.join('\n'),
          dockerInfo: !isEmpty(findDockerImageUri) ? findDockerImageUri.uri : '',
          ports: transformPorts
        })

        return {
          ...acc,
          [taskRoleName]: newJobTaskRole
        }
      }, {}));

      const { nfsList, glusterfsList, xdfsList } = extras;
      setNfsMountsState(nfsList !== null ? nfsList : []);
      setGlusterfsMountsState(glusterfsList !== null ? glusterfsList : []);
      setXdfsMountsState(xdfsList !== null ? xdfsList : [])
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
        const jobTaskRole = new JobTaskRole({
          ...taskRole,
          name: taskRoleName,
          hivedScheduler: { skuNum: 1, skuType: null, sku: null, vg: null },
          containerSize: { gpu: 0, cpu: 0, memoryMB: 0 }
        })
        return {
          ...acc,
          [taskRoleName]: jobTaskRole
        }
      }, {}))
    }
  }, [jobInformation.virtualCluster])

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
    xdfsMounts,
    setXdfsMountsState,
    parameters,
    setParameters,
    vgNames,
    setVgNames,
    nfsInfo,
    setNfsInfo,
    glusterfsInfo,
    setGlusterfsInfo,
    xdfsInfo,
    setXdfsInfo,
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
    isXdfsEnabled
  }

  return (
    <Context.Provider value={ContextValue}>
      {
        <>
          {
            isLoading && <Loading />
          }
          <div className={indexStyle.container}>
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