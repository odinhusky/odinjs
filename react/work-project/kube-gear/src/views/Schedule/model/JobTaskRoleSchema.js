import Joi from 'joi-browser';

export const TaskRoleSchema = Joi.object().keys({
  name: Joi.string().required(),
  completion: Joi.object().keys({
    minFailedInstances: Joi.number().integer().min(-1).allow(null),
    minSucceededInstances: Joi.number().integer().min(-1).allow(null)
  }),
  dockerInfo: Joi.string().required(),
  containerSize: Joi.object().keys({
    cpu: Joi.number().integer(),
    gpu: Joi.number().integer(),
    memoryMB: Joi.number().integer()
  }),
  deployment: Joi.object().unknown(true),
  // isContainerSizeEnabled: Joi.boolean(),
  instances: Joi.number().integer(),
  commands: Joi.string(),
  ports: Joi.array().items(Joi.object()).allow(null),
  taskRetryCount: Joi.number().integer(),
  hivedScheduler: Joi.object().keys({
    vg: Joi.string(),
    skuType: Joi.string(),
    skuNum: Joi.number().required(),
    sku: Joi.string()
  })
})