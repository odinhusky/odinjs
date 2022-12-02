import { isEmpty } from 'lodash';

export class JobFinalData {
  constructor(props) {
    const { jobTemplate, jobInformation, jobTaskRoles, nfsMounts, glusterfsMounts, parameters } = props;

    this.name = jobTemplate.name || '';
    this.description = jobTemplate.description || '';
    this.publicMode = jobTemplate.publicMode || 0;
    this.canReadUsers = [];
    this.canWriteUsers = [];
    this.jobConfig = new JobConfigData({ jobInformation, jobTaskRoles, nfsMounts, glusterfsMounts, parameters }).jobConfig;
  }

  static validateData(data) {
    if (isEmpty(data)) return false;
    const { jobConfig } = data;
    const {
      // extras,
      taskRoles
    } = jobConfig;
    // const { hivedScheduler } = extras;

    // function compareExtrasSKUTypeAndJobConfigTaskRoles(hivedSchedulerTaskRoles, jobConfigTaskRoles) {
    //   if (isEmpty(hivedSchedulerTaskRoles)) return [true, 'hivedScheduler TaskRoles Error'];
    //   if (isEmpty(jobConfigTaskRoles)) return [true, 'jobConfig TaskRoles Error']
    //   const taskRolesNotFind = Object.keys(jobConfigTaskRoles).reduce((acc, key) => {
    //     if (!hivedSchedulerTaskRoles[key]) {
    //       return [...acc, key]
    //     }
    //     return [...acc]
    //   }, [])
    //   if (taskRolesNotFind.length > 0) {
    //     return [true, taskRolesNotFind.join(' ')]
    //   } else {
    //     return [false]
    //   }
    // }

    function checkTaskRoleName(taskRoles) {
      if (isEmpty(Object.keys(taskRoles))) return [true, 'TaskRole Name Error']
      const TEXT_FILED_REGEX = /^[a-zA-Z][a-zA-Z0-9]*$/;
      if (Object.keys(taskRoles).some(name => !TEXT_FILED_REGEX.test(name))) {
        return [true, 'TaskRole Name Error']
      }
      return [false]
    }

    // const [isTaskRoleCompareError] = compareExtrasSKUTypeAndJobConfigTaskRoles(hivedScheduler.taskRoles, taskRoles)
    const [isTaskRoleNameError] = checkTaskRoleName(taskRoles)

    // if (isTaskRoleCompareError || isTaskRoleNameError) {
    if (isTaskRoleNameError) {
      return false
    }
    return true
  }
}

export class JobConfigData {
  constructor(props) {
    const { jobInformation, jobTaskRoles, nfsMounts, glusterfsMounts, parameters } = props;
    this.jobConfig = {
      name: jobInformation.name || '',
      // gpuType: jobInformation.gpuType,
      type: 'job',
      protocolVersion: 2,
      retryCount: jobInformation.jobRetryCount,
      taskRoles: Object.entries(jobTaskRoles).reduce((acc, [key, details]) => {
        const { dockerInfo, instances, ports, completion, commands, k8sResource } = details;
        return {
          ...acc,
          [key]: {
            dockerImage: dockerInfo,
            instances: instances,
            resourcePerInstance: {
              cpu: k8sResource.cpu,
              memoryMB: k8sResource.memoryMB,
              gpu: k8sResource.gpu,
              gpuMemoryPercentage: k8sResource.gpuMemoryPercentage,
              ports: ports && ports.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
            },
            completion: {
              minFailedInstances: completion.minFailedInstances,
              minSucceededInstances: completion.minSucceededInstances
            },
            commands: commands
          }
        }
      }, {}),
      parameters: parameters && parameters.reduce((acc, curr) => {
        if (!curr.key) return acc
        return {
          ...acc,
          [curr.key]: curr.value
        }
      }, {}),
      defaults: {
        virtualCluster: null
      },
      extras: {
        nfsList: nfsMounts ? nfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== '') : [],
        glusterfsList: glusterfsMounts ? glusterfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== '') : [],
        virtualGroup: jobInformation.virtualCluster || ''
      }
    }
  }
}
