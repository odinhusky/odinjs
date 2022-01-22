import Joi from 'joi-browser';

export const setupEnvParamSchema = Joi.object().keys({
  key: Joi.string().valid('JUPYTER_ENABLE_LAB', 'TENSORBOARD_PATH', 'VNC_PASSWD', 'paiAzRDMA', 'JUPYTER_PASSWD'),
  value: Joi.when('key', {
    is: 'VNC_PASSWD',
    then: Joi.string().min(6).required(),
    otherwise: Joi.when('key', {
      is: 'JUPYTER_PASSWD',
      then: Joi.string().min(6).required(),
      otherwise: Joi.string().required()
    })
  })
    .concat(Joi.string().required().when('key', {
      is: 'TENSORBOARD_PATH',
      then: Joi.string().required(),
      otherwise: Joi.string().required()
    }))
})

export const setupEnvSchema = Joi.array().items(
  setupEnvParamSchema
)
