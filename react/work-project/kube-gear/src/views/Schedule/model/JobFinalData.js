import moment from 'moment';
export class JobFinalData {
  constructor(props) {
    const { modify, step1State, jobTaskRoles, nfsMounts, glusterfsMounts, parameters, userInfo } = props;

    this.name = step1State.name || '';
    this.users = step1State.user !== undefined ? [step1State.user] : [userInfo.username],
    this.startAt = moment(step1State.startAt).seconds(0).milliseconds(0).valueOf();
    this.endAt = moment(step1State.endAt).seconds(0).milliseconds(0).valueOf();
    this.cpu = jobTaskRoles.reduce((acc, item) => acc + item.containerSize.cpu, jobTaskRoles.length);
    this.memory = jobTaskRoles.reduce((acc, item) => acc + item.containerSize.memoryMB, jobTaskRoles.length * 1024);
    this.storage = jobTaskRoles.reduce((acc, item) => acc + item.containerSize.storageGB, 0);
    this.virtualGroup = modify ? null : step1State.virtualGroup;
    this.gpu = step1State.gpuType ? {
      ...step1State.gpu,
      [step1State.gpuType]: jobTaskRoles.reduce((acc, item) => acc + item.containerSize.gpu, 0)
    } : {}
    this.jobConfig = {
      jobName: step1State.jobName,
      gpuType: step1State.gpuType,
      retryCount: step1State.retryCount,
      taskRoles: jobTaskRoles.map(item => ({
        name: item.name,
        dockerImage: {
          uri: item.dockerInfo.uri
        },
        taskNumber: item.instances,
        cpuNumber: item.containerSize.cpu,
        memoryMB: item.containerSize.memoryMB,
        shmMB: item.shmMB,
        gpuNumber: item.containerSize.gpu,
        storageGB: item.containerSize.storageGB,
        minFailedTaskCount: item.completion.minFailedInstances,
        minSucceededTaskCount: item.completion.minSucceededInstances,
        command: item.commands.split(/\s*\n\s*/).map(item => item.trim()).filter(item => item).join(' && '),
        portList: item.ports && item.ports.map(({ key, value }) => ({
          label: key,
          beginAt: value,
          portNumber: 1
        }))
      })),
      jobEnvs: parameters && parameters.reduce((acc, curr) => {
        if (!curr.key) return acc
        return {
          ...acc,
          [curr.key]: curr.value
        }
      }, {}),
      extras: {
        nfsList: nfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== ''),
        glusterfsList: glusterfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== ''),
        virtualGroup: step1State.virtualGroup
      }
    }
  }
}