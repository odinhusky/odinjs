import Joi from 'joi-browser';

export const TaskRoleSchema = Joi.object().keys({
  name: Joi.string().required(),
  completion: Joi.object().keys({
    minFailedInstances: Joi.number().integer().min(-1).allow(null),
    minSucceededInstances: Joi.number().integer().min(-1).allow(null)
  }),
  dockerInfo: Joi.string().required(),
  k8sResource: Joi.object().keys({
    cpu: Joi.number().integer().min(0),
    gpu: Joi.number().integer().min(0),
    memoryMB: Joi.number().integer().min(0)
  }),
  deployment: Joi.object().unknown(true),
  instances: Joi.number().integer().min(1),
  commands: Joi.string(),
  ports: Joi.array().items(Joi.object()).allow(null),
  taskRetryCount: Joi.number().integer().min(0)
  // hivedScheduler: Joi.object().keys({
  //   vg: Joi.string(),
  //   skuType: Joi.string(),
  //   skuNum: Joi.number(),
  //   sku: Joi.string()
  // })
  // isContainerSizeEnabled: Joi.boolean(),
  // shmMB: Joi.number().default(64).min(0),
  // containerSize: Joi.object().keys({
  //   cpu: Joi.number().integer().min(1),
  //   gpu: Joi.number().integer().min(0),
  //   memoryMB: Joi.number().integer().min(1),
  //   storageGB: Joi.number().integer().min(1)
  // }),
})