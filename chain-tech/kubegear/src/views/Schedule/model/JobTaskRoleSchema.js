import Joi from 'joi-browser';

export const TaskRoleSchema = Joi.object().keys({
  name: Joi.string().required(),
  completion: Joi.object().keys({
    minFailedInstances: Joi.number().integer().min(-1).allow(null),
    minSucceededInstances: Joi.number().integer().min(-1).allow(null)
  }),
  dockerInfo: Joi.string().required(),
  deployment: Joi.object().unknown(true),
  // isContainerSizeEnabled: Joi.boolean(),
  instances: Joi.number().integer(),
  commands: Joi.string(),
  ports: Joi.array().items(Joi.object()).allow(null),
  taskRetryCount: Joi.number().integer(),
  k8sResource: Joi.object().keys({
    cpu: Joi.number(),
    gpu: Joi.number(),
    memoryMB: Joi.number(),
    gpuMemoryPercentage: Joi.number()
  })
})