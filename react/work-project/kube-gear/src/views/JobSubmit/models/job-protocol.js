import { jobProtocolSchema } from '../models/protocol-schema';


import { get, isEmpty, cloneDeep, isNil, pick } from 'lodash';
import yaml from 'js-yaml';
import { validate } from 'joi-browser';
import { removeEmptyProperties } from '../utils/utils';
import { SECRET_PATTERN } from '../utils/constants';
import { TaskRolesManager } from '../utils/task-roles-manager';
import { UNDEFINED_PARAMETER, LOST_SCHEMA } from '../utils/errorCode';
// import { KB } from 'constant';

export class JobProtocol {
  constructor(props) {
    const { name, jobRetryCount, prerequisites, parameters, taskRoles, deployments,
      description, contributor, secrets, defaults, extras } = props;
    this.protocolVersion = 2;
    this.name = name || '';
    this.description = description || '';
    this.contributor = contributor || '';
    this.type = 'job';
    this.jobRetryCount = jobRetryCount || 0;
    this.prerequisites = prerequisites || [];
    this.parameters = parameters || {};
    this.taskRoles = taskRoles || {};
    this.deployments = deployments || {};
    this.secrets = secrets || {};
    this.defaults = defaults || {};
    this.extras = extras || {};
  }

  static fromSource(protocolSource, format) {
    try {
      let jobProtocol;
      switch (format) {
        case 'json':
          jobProtocol = JSON.parse(protocolSource);
          break;
        case 'yaml':
          jobProtocol = yaml.safeLoad(protocolSource);
          break;
      }
      return new JobProtocol(jobProtocol);
    } catch (e) {
      alert(e.message);
    }
  }
  static fromJson(protocolJson) {
    try {
      const jobProtocol = JSON.parse(protocolJson);
      return new JobProtocol(jobProtocol);
    } catch (e) {
      alert(e.message);
    }
  }

  static validateFromYaml(protocolYaml) {
    try {
      const protocol = yaml.safeLoad(protocolYaml);
      return JobProtocol.validateFromObject(protocol);
    } catch (err) {
      return String(err.message);
    }
  }
  static validateFromJson(protocolJson) {
    try {
      const protocol = JSON.parse(protocolJson);
      return JobProtocol.validateFromObject(protocol);
    } catch (err) {
      return String(err.message);
    }
  }

  static safePruneProtocol(protocol) {
    if (!protocol) {
      return new Error(UNDEFINED_PARAMETER);
    }
    const prunedProtocol = removeEmptyProperties(protocol);
    const taskRoles = cloneDeep(prunedProtocol.taskRoles);

    Object.keys(taskRoles).forEach(taskRoleName => {
      const taskRoleContent = taskRoles[taskRoleName];
      if (isEmpty(taskRoleContent.commands)) {
        return new Error(LOST_SCHEMA);
      }
      taskRoleContent.commands = taskRoleContent.commands.filter(
        line => !isEmpty(line),
      );
    });
    prunedProtocol.taskRoles = taskRoles;
    return prunedProtocol;
  }

  static validateFromObject(protocol) {
    const result = validate(
      JobProtocol.safePruneProtocol(protocol),
      jobProtocolSchema,
    );
    return String(result.error || '');
  }

  getUpdatedProtocol(jobBasicInfo, jobTaskRoles, jobParameters, jobSecrets, jobNfsMounts, jobGlusterfsMounts, jobXdfsMounts) {
    const parameters = removeEmptyProperties(
      jobParameters
        .reduce((res, parameter) => {
          res[parameter.key] = parameter.value;
          return res;
        }, {})
    );

    let deployments = this._generateDeployments(jobTaskRoles);
    const deployName = get(this, 'defaults.deployment', 'defaultDeployment');
    deployments = isEmpty(deployments) ? [] : [{ name: deployName, taskRoles: deployments }];

    const prerequisites = this.prerequisites
      .filter(prerequisite => prerequisite.type !== 'dockerimage')
      .concat(TaskRolesManager.getTaskRolesPrerequisites(jobTaskRoles));

    const taskRoles = this._updateAndConvertTaskRoles(jobTaskRoles);
    const secrets = removeEmptyProperties(jobSecrets.reduce((res, secret) => {
      res[secret.key] = secret.value;
      return res;
    }, {}));

    const defaultsField = jobTaskRoles[0]?.hivedScheduler?.vg !== undefined
      ? { virtualCluster: jobTaskRoles[0]?.hivedScheduler?.vg }
      : {} ;

    const extras = this.extras || {};
    extras.virtualGroup = jobBasicInfo.getDefaults() !== '' ? removeEmptyProperties(jobBasicInfo.getDefaults()).virtualCluster : jobBasicInfo.getDefaults()
    extras.nfsList = jobNfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== '');
    extras.glusterfsList = jobGlusterfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== '');
    extras.xdfsList = jobXdfsMounts.filter(nfsMount => nfsMount.name !== '' || nfsMount.mountPoint !== '');

    if (isEmpty(extras.nfsList)) delete extras.nfsList
    if (isEmpty(extras.glusterfsList)) delete extras.glusterfsList
    if (isEmpty(extras.xdfsList)) delete extras.xdfsList

    const hivedSchedulerTypeNum = jobTaskRoles.reduce((acc, jobTask) => {
      const { hivedScheduler, name } = jobTask
      const { skuType, skuNum, sku } = hivedScheduler
      const options = {
        [name]: {
          [sku]: skuType
        }
      }
      if (skuNum === 0) {
        return { ...acc }
      }
      if (skuType === null || skuType === undefined) {
        delete acc[name]
        return acc
      } else {
        return { ...acc, ...options }
      }
    }, {})

    if (!isEmpty(hivedSchedulerTypeNum)) {
      extras.hivedScheduler = {
        taskRoles: hivedSchedulerTypeNum
      }
    } else {
      delete extras.hivedScheduler
    }

    return new JobProtocol({
      ...this,
      ...jobBasicInfo.convertToProtocolFormat(),
      parameters: parameters,
      taskRoles: taskRoles,
      prerequisites: prerequisites,
      deployments: deployments,
      secrets: secrets,
      defaults: defaultsField,
      extras: extras
    });
  }

  _updateAndConvertTaskRoles(jobTaskRoles) {
    return jobTaskRoles.reduce((res, taskRole) => ({
      ...res,
      ...taskRole.convertToProtocolFormat()
    }), {});
  }

  _generateDeployments(jobTaskRoles) {
    const deployments = jobTaskRoles.reduce((res, taskRole) => {
      res[taskRole.name] = taskRole.getDeployment();
      return res;
    }, {});
    return removeEmptyProperties(deployments);
  }

  toYaml() {
    try {
      return yaml.safeDump(JobProtocol.safePruneProtocol(this));
    } catch (e) {
      alert(e.message);
    }
  }
  toJson() {
    try {
      return JSON.stringify(this, null, 2);
    } catch (e) {
      alert(e.message);
    }
  }

  static yamlToV12Json(protocolYaml) {
    if (!protocolYaml) {
      return new Error(UNDEFINED_PARAMETER);
    }
    const jobProtocol = JobProtocol.fromSource(protocolYaml, 'yaml');
    if (isNil(jobProtocol)) {
      return {};
    }
    return removeEmptyProperties({
      jobName: jobProtocol.name,
      taskRoles: Object.entries(jobProtocol.taskRoles).map(([key, value]) => {
        const dockerImage = jobProtocol.prerequisites.find(prerequisite => prerequisite.type === 'dockerimage' && prerequisite.name === value.dockerImage);
        return {
          name: key,
          dockerImage: removeEmptyProperties({
            uri: dockerImage.uri,
            auth: dockerImage.auth && Object.assign(dockerImage.auth, { password: jobProtocol.secrets[SECRET_PATTERN.exec(dockerImage.auth.password)[1]] })
          }),
          shmMB: value.shmMB || 64,
          taskNumber: value.instances || 0,
          cpuNumber: value.resourcePerInstance.cpu,
          memoryMB: value.resourcePerInstance.memoryMB,
          storageGB: value.resourcePerInstance.storageGB,
          gpuNumber: value.resourcePerInstance.gpu,
          portList: value.resourcePerInstance.ports && Object.entries(value.resourcePerInstance.ports).map(([portName, portValue]) => ({
            label: portName,
            beginAt: portValue,
            portNumber: 1
          })),
          command: value.commands && value.commands.join(' && '),
          minFailedTaskCount: value.completion.minFailedInstances,
          minSucceededTaskCount: value.completion.minSucceededInstances
        };
      }),
      retryCount: jobProtocol.jobRetryCount,
      jobEnvs: jobProtocol.parameters,
      extras: {
        virtualGroup: jobProtocol.defaults.virtualCluster,
        nfsList: jobProtocol.extras && jobProtocol.extras.nfsList || [],
        glusterfsList: jobProtocol.extras && jobProtocol.extras.glusterfsList || [],
        xdfsList: jobProtocol.extras && jobProtocol.extras.xdfsList || [],
        totalCPU: jobProtocol.extras && jobProtocol.extras.totalCPU || 0,
        totalMemory: jobProtocol.extras && jobProtocol.extras.totalMemory || 0
        // totalStorage: jobProtocol.extras && jobProtocol.extras.totalStorage || 0
      }
    });
  }

  static v12JsonToV14Json(v12Json) {
    return removeEmptyProperties({
      protocolVersion: 2,
      type: 'job',
      name: v12Json.jobName,
      taskRoles: v12Json.taskRoles.reduce((res, taskRole) => {
        res[taskRole.name] = {
          instances: taskRole.taskNumber,
          shmMB: taskRole.shmMB,
          resourcePerInstance: removeEmptyProperties({
            cpu: taskRole.cpuNumber,
            gpu: taskRole.gpuNumber,
            memoryMB: taskRole.memoryMB,
            storageGB: taskRole.storageGB,
            ports: taskRole.portList && taskRole.portList.reduce((ports, port) => {
              ports[port.label] = port.beginAt;
              return ports;
            }, {})
          }),
          completion: {
            minFailedInstances: taskRole.minFailedTaskCount,
            minSucceededInstances: taskRole.minSucceededTaskCount
          },
          commands: taskRole.command.split(/\s*&&\s*/),
          taskRetryCount: 0,
          dockerImage: taskRole.name
        };
        return res;
      }, {}),
      jobRetryCount: v12Json.retryCount,
      defaults: { virtualCluster: v12Json.extras.virtualGroup },
      parameters: v12Json.jobEnvs,
      prerequisites: v12Json.taskRoles.map(taskRole => {
        let dockerImage = taskRole.dockerImage;
        if (!dockerImage) {
          dockerImage = { uri: v12Json.image };
        }
        return removeEmptyProperties({
          type: 'dockerimage',
          name: taskRole.name,
          uri: dockerImage.uri,
          auth: dockerImage.auth && pick(dockerImage.auth, ['username', 'registryuri'])
        });
      }),
      extras: {
        nfsList: v12Json.extras.nfsList,
        glusterfsList: v12Json.extras.glusterfsList,
        xdfsList: v12Json.extras.xdfsList
      }
    });
  }
}
