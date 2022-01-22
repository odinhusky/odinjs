import Joi from 'joi-browser';

const TaskRoleSchema = Joi.object().keys({
  // name: Joi.string().required(),
  dockerImage: Joi.string().required(),
  instances: Joi.number().integer().min(1),
  completion: Joi.object().keys({
    minFailedInstances: Joi.number().integer().min(-1).allow(null),
    minSucceededInstances: Joi.number().integer().min(-1).allow(null)
  }),
  resourcePerInstance: Joi.object().keys({
    cpu: Joi.number(),
    memoryMB: Joi.number(),
    gpu: Joi.number(),
    ports: Joi.object()
  }),
  commands: Joi.string()
})

export const JobSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  publicMode: Joi.number().integer().min(0).max(2),
  canReadUsers: Joi.array(),
  canWriteUsers: Joi.array(),
  jobConfig: Joi.object().keys({
    name: Joi.string().required(),
    virtualCluster: Joi.string().allow(null, ''),
    // gpuType: Joi.string().allow(null, ''),
    retryCount: Joi.number().integer().min(0),
    taskRoles: Joi.object().pattern(/.*/, TaskRoleSchema),
    parameters: Joi.object(),
    extras: Joi.object().keys({
      nfsList: Joi.array(),
      glusterfsList: Joi.array(),
      xdfsList: Joi.array(),
      virtualGroup: Joi.string(),
      hivedScheduler: Joi.object().keys({
        taskRoles: Joi.object()
      })
    }),
    defaults: Joi.object(),
    type: Joi.string(),
    protocolVersion: Joi.number()
  })
});

export const jobConfigSchema = Joi.object().keys({
  jobConfig: Joi.object().keys({
    jobName: Joi.string().required(),
    virtualCluster: Joi.string().allow(null, ''),
    // gpuType: Joi.string().allow(null, ''),
    retryCount: Joi.number().integer().min(0),
    taskRoles: Joi.array().items(TaskRoleSchema),
    parameters: Joi.object(),
    extras: Joi.object()
  })
});



export const JobSchemaMonaco = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  publicMode: Joi.number().integer().min(0).max(2),
  canReadUsers: Joi.array(),
  canWriteUsers: Joi.array(),
  jobConfig: Joi.object().keys({
    name: Joi.string().required(),
    virtualCluster: Joi.string().allow(null, ''),
    retryCount: Joi.number().integer().min(0),
    taskRoles: Joi.object().pattern(/^/, TaskRoleSchema),
    parameters: Joi.object(),
    extras: Joi.object().keys({
      nfsList: Joi.array(),
      glusterfsList: Joi.array(),
      xdfsList: Joi.array(),
      virtualGroup: Joi.string(),
      hivedScheduler: Joi.object()
    }),
    defaults: Joi.object(),
    type: Joi.string(),
    protocolVersion: Joi.number()
  })
});
