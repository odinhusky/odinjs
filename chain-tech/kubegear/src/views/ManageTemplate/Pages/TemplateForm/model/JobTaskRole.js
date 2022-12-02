// import { DockerInfo } from './docker-info';
// import {DEFAULT_DOCKER_URI} from '../utils/constants';

import { Completion } from './completion';
import { Deployment } from './deployment';
import { get, isNil, isEmpty } from 'lodash';
import { removeEmptyProperties } from '../utils/utils';
import {
  getDefaultContainerSize
  // isDefaultContainerSize
} from './ContainerSize';

export class JobTaskRole {
  constructor(props) {
    const {
      name,
      instances,
      dockerInfo,
      ports,
      commands,
      completion,
      deployment,
      taskRetryCount,
      k8sResource
      // hivedScheduler,
      // containerSize,
      // isContainerSizeEnabled
    } = props;
    this.name = name || '';
    this.instances = instances || 1;
    this.dockerInfo = dockerInfo || '';
    this.ports = ports || [];
    this.commands = commands || '';
    this.completion = completion || new Completion({});
    this.deployment = deployment || new Deployment({});
    this.k8sResource = !isNil(k8sResource) ? k8sResource : getDefaultContainerSize();
    this.taskRetryCount = taskRetryCount || 0;
    // this.hivedScheduler = hivedScheduler || { skuNum: 1, skuType: null, sku: null, vg: null };
    // this.shmMB = shmMB || 64;
    // this.isContainerSizeEnabled = isContainerSizeEnabled || false;
    // this.containerSize = containerSize || getDefaultContainerSize();
  }

  static fromProtocol(name, taskRoleProtocol, deployments, prerequisites) {
    const instances = get(taskRoleProtocol, 'instances', 1);
    const completion = get(taskRoleProtocol, 'completion', {});
    const dockerImage = get(taskRoleProtocol, 'dockerImage');
    const resourcePerInstance = get(taskRoleProtocol, 'resourcePerInstance', {});
    const commands = get(taskRoleProtocol, 'commands', []);

    // const hivedScheduler = get(taskRoleProtocol, 'hivedScheduler', {})

    const taskDeployment = get(deployments[0], `taskRoles.${name}`, {});
    const dockerInfo = prerequisites.find(prerequisite => prerequisite.name === dockerImage) || {};
    const ports = isNil(resourcePerInstance.ports) ? [] :
      Object.entries(resourcePerInstance.ports).map(([key, value]) => ({ key, value: value.toString() }));
    const taskRetryCount = get(taskRoleProtocol, 'taskRetryCount', 0);

    const jobTaskRole = new JobTaskRole({
      // name,
      instances,
      completion: Completion.fromProtocol(completion),
      commands: isNil(commands) ? '' : commands.join('\n'),
      k8sResource: {
        cpu: resourcePerInstance?.cpu ?? 0,
        gpu: resourcePerInstance?.gpu ?? 0,
        gpuMemoryPercentage: resourcePerInstance?.gpuMemoryPercentage ?? 100,
        memoryMB: resourcePerInstance?.memoryMB ?? 0
      },
      deployment: Deployment.fromProtocol(taskDeployment),
      dockerInfo: dockerInfo,
      ports,
      taskRetryCount
      // containerSize: resourcePerInstance,
      // hivedScheduler
    });

    // if (!isDefaultContainerSize(jobTaskRole.containerSize)) {
    //   jobTaskRole.isContainerSizeEnabled = true;
    // }

    return jobTaskRole;
  }

  getDockerPrerequisite() {
    return this.dockerInfo.convertToProtocolFormat();
  }

  getDeployment() {
    return this.deployment.convertToProtocolFormat();
  }

  // getHivedScheduler() {
  //   return this.hivedScheduler;
  // }

  convertToProtocolFormat() {
    const taskRole = {};
    const ports = this.ports.reduce((val, x) => {
      if (typeof x.value === 'string') {
        val[x.key] = parseInt(x.value);
      } else {
        val[x.key] = x.value;
      }
      return val;
    }, {});

    const resourcePerInstance = removeEmptyProperties({ ...this.k8sResource, ports: ports });

    taskRole[this.name] = removeEmptyProperties({
      instances: this.instances,
      shmMB: this.shmMB,
      completion: this.completion,
      dockerImage: this.dockerInfo.name,
      resourcePerInstance: resourcePerInstance,
      commands: isEmpty(this.commands) ? [] : this.commands.trim ? this.commands.trim().split('\n').map(line=>(line.trim())) : this.commands,
      taskRetryCount: this.taskRetryCount
    });

    return taskRole;
  }
}
