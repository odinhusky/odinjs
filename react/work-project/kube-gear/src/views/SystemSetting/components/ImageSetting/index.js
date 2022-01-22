import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays';
import { Label } from 'office-ui-fabric-react';
import { TextFieldAdapter, SpinButtonAdapter } from 'components/FormAdapter';
import BasePanel from 'components/BasePanel';
import Card from 'components/Card';
import { PrimaryButton } from 'components/BaseButton';
import { mergeStyles } from 'office-ui-fabric-react';
import styles from './index.module.scss';

import { setCustomizedSystemParam, setSystemParam } from 'utils/api'
import { toast } from 'react-toastify';
import { isArray, isEmpty } from 'lodash';
import GlobalContext from 'layouts/Main/GlobalContext';

const inputStylesLifeHour = {
  wrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  subComponentStyles: {
    label: {
      root: {
        width: 210,
        textAlign: 'right',
        marginRight: 11,
        marginLeft: 90,
        padding: '18px 0'
      }
    }
  },
  fieldGroup: { borderRadius: '3px', width: 100 },
  errorMessage: { marginLeft: 311, paddingTop: 0, paddingBottom: 12 }
}

const inputStylesFirst = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: 600
  },
  subComponentStyles: {
    label: {
      root: {
        width: 210,
        textAlign: 'right',
        marginRight: 11,
        marginLeft: 90
      }
    }
  },
  fieldGroup: { borderRadius: '3px', flexGrow: 1 }
}

const inputStyles = {
  ...inputStylesFirst,
  root: {
    paddingTop: 24
  }
}

const spinButtonStylesFirst = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    width: 210,
    textAlign: 'right',
    marginLeft: 90
  },
  input: {
    width: 130
  },
  spinButtonWrapper: {
    borderRadius: '3px',
    minWidth: 100
  }
}

const spinButtonStyles = {
  ...spinButtonStylesFirst,
  label: {
    textAlign: 'right',
    marginLeft: 10
  }
}

const DivileLineComponent = ({ title }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }} >
      <Label styles={{ root: { fontSize: 18 } }}>{title}</Label>
      <div style={{ flexGrow: 1, borderBottom: '1px solid #eaeaea', marginLeft: 20 }} />
    </div>
  )
}

DivileLineComponent.propTypes = {
  title: PropTypes.string
}

const Setting = ({ systemParams, getData, isLoading }) => {
  const { t } = useTranslation();
  const { systemSetting } = useContext(GlobalContext);

  const findLifeHour = (key) => {
    const find = systemParams.find(item => item.key === key)
    if (find) {
      return find.value
    } else {
      return ''
    }
  }

  const findData = (key) => {
    const find = systemSetting.find(item => item.key === key)
    if (find) {
      return find.value
    } else {
      return ''
    }
  }

  const defaultResource = {
    'cpuAndGpu': JSON.parse(findData('cpuAndGpu') || 'null') || [
      { cpu: 2, gpu: 1 },
      { cpu: 4, gpu: 2 },
      { cpu: 8, gpu: 16 }
    ],
    'defaultJobLifeHour': findLifeHour('defaultJobLifeHour'),
    'caffeImage': findData('caffeImage') || 'ufoym/deepo:caffe-py36-cu90',
    'kerasImage': findData('kerasImage') || 'ufoym/deepo:keras-py36-cu90',
    'mxnetImage': findData('mxnetImage') || 'ufoym/deepo:mxnet-py36-cu90',
    'pytorchImage': findData('pytorchImage') || 'ufoym/deepo:pytorch-py36-cu90',
    'tensorflowImage': findData('tensorflowImage') || 'ufoym/deepo:tensorflow-py36-cu90',
    'customDLImage': findData('customDLImage'),
    'rapids': findData('rapids') || 'rapidsai/rapidsai:cuda10.0-runtime-ubuntu18.04-py3.6',
    'tensorrt': findData('tensorrt') || 'nvcr.io/nvidia/tensorrt:20.06-py3',
    'customMLImage': findData('customMLImage'),
    'slurm': findData('slurm') || 'giovtorres/slurm-docker-cluster',
    'customHPCImage': findData('customHPCImage'),
    'memorySize': findData('memorySize') || Number(1024),
    'CPUcore': findData('CPUcore') || Number(1),
    'RAM': findData('RAM') || Number(1024),
    'disk': findData('disk') || Number(5),
    'GPUamount': findData('GPUamount') || Number(2),
    'helper': findData('helper') || 'http://docs.aiserver.cn/'
  }

  const onSubmit = async(value) => {
    const lifeHour = { defaultJobLifeHour: Number(value.defaultJobLifeHour) };
    const result = Object.entries(value)
      .filter(([key]) => key !== 'defaultJobLifeHour')
      .map(([key, value]) => ({ key, value: isArray(value) ? JSON.stringify(value) : value }))

    try {
      await setCustomizedSystemParam(result);
      await setSystemParam(lifeHour);
      toast.success(`${t('edit')}${t('enSpace')}${t('success')}`);
      getData();
    } catch (err) {
      const msg = err.data ? err.data.message : err.message
      toast.error('Error:' + msg);
    }
  }

  const Rules = {
    bypass: () => null,
    required: value => (value ? undefined : t('fieldRequired')),
    mustBeNumber: value => isNaN(value) ? t('mustInputNumber') : null
  };

  const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined);

  const checkModify = values => {
    if (!isEmpty(systemSetting)) {
      return Object.entries(values).some(([key, value]) => {
        if (key === 'defaultJobLifeHour') {
          return findLifeHour(key) !== value
        } else {
          const transfromValue = isArray(value) ? JSON.stringify(value) : value
          return findData(key) !== transfromValue
        }
      })
    } else {
      return true
    }
  }

  return (
    <BasePanel
      className={styles.container}
      contentStyle={{ flexGrow: 2, display: 'flex', flexDirection: 'column' }}
      title={`${t('system')}${t('enSpace')}${t('setting')}`}
    >
      <Form
        initialValues={defaultResource}
        mutators={{
        // potentially other mutators could be merged here
          ...arrayMutators
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => {
          return (
            <form
              className={styles.form}
              id="exampleForm"
              onSubmit={handleSubmit}
            >
              <div className={styles.wrapper}>
                <BasePanel title={`${t('system')}${t('enSpace')}${t('setting')}`}>
                  <Field
                    component={TextFieldAdapter}
                    label={t('jobTimeLimit')}
                    name={'defaultJobLifeHour'}
                    styles={inputStylesLifeHour}
                    validate={composeValidators(Rules.required, Rules.mustBeNumber)}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={t('support')}
                    name={'helper'}
                    styles={inputStylesFirst}
                  />
                </BasePanel>
                <BasePanel
                  style={{ marginTop: 24, paddingBottom: 24 }}
                  title={`${t('default')}${t('enSpace')}${t('setting')}${t('enSpace')}${t('image')}`}
                >
                  <DivileLineComponent title={`${t('deep')}${t('enSpace')}${t('learning')}`} />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} Caffe ${t('image')}`}
                    name={'caffeImage'}
                    styles={inputStylesFirst}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} Keras ${t('image')}`}
                    name={'kerasImage'}
                    styles={inputStyles}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} Mxnet ${t('image')}`}
                    name={'mxnetImage'}
                    styles={inputStyles}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} PyTorch ${t('image')}`}
                    name={'pytorchImage'}
                    styles={inputStyles}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} Tensorflow ${t('image')}`}
                    name={'tensorflowImage'}
                    styles={inputStyles}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('customize')}${t('enSpace')}${t('image')}`}
                    name={'customDLImage'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStyles}
                  />
                  <DivileLineComponent title={`${t('machine')}${t('enSpace')}${t('learning')}`} />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} rapids ${t('image')}`}
                    name={'rapids'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStylesFirst}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} tensorrt ${t('image')}`}
                    name={'tensorrt'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStyles}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('customize')}${t('enSpace')}${t('image')}`}
                    name={'customMLImage'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStyles}
                  />
                  <DivileLineComponent title={`${t('high')}${t('enSpace')}${t('performance')}${t('enSpace')}${t('computing')}`} />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('default')} slurm ${t('image')}`}
                    name={'slurm'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStylesFirst}
                  />
                  <Field
                    component={TextFieldAdapter}
                    label={`${t('customize')}${t('enSpace')}${t('image')}`}
                    name={'customHPCImage'}
                    parse={value => (value === '' ? '' : value)}
                    styles={inputStyles}
                  />
                </BasePanel>
                <BasePanel title={`${t('submit')}${t('enSpace')}${t('job')}${t('enSpace')}${t('limit')}`}>
                  <DivileLineComponent title={`${t('simple')}${t('enSpace')}${t('setting')}`} />
                  <FieldArray name="cpuAndGpu">
                    {({ fields }) => {
                      return (
                        <div>
                          {fields.map((item, index) => {
                            return (
                              <div
                                className={`${styles.cpuAndGpu} ${styles.paddingTopBottom12}`}
                                key={item}
                              >
                                <div>
                                  <Field
                                    component={SpinButtonAdapter}
                                    index={index}
                                    label={`${t('resource')} ${index} CPU`}
                                    min={1}
                                    name={`${item}.cpu`}
                                    styles={spinButtonStylesFirst}
                                  />
                                </div>
                                <div>
                                  <Field
                                    component={SpinButtonAdapter}
                                    index={index}
                                    label={'GPU'}
                                    min={0}
                                    name={`${item}.gpu`}
                                    styles={spinButtonStyles}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }}
                  </FieldArray>
                  <div className={styles.paddingTopBottom12}>
                    <Field
                      component={SpinButtonAdapter}
                      // index={index}
                      label={`${t('memorySize')}${t('enSpace')}(MB)`}
                      min={0}
                      name={'memorySize'}
                      styles={spinButtonStylesFirst}
                    />
                  </div>
                  <DivileLineComponent title={`${t('Advanced')}${t('enSpace')}${t('setting')}`} />
                  <div>
                    <div className={styles.paddingTopBottom12}>
                      <Field
                        component={SpinButtonAdapter}
                        // index={index}
                        label={`${t('CPU')}`}
                        min={0}
                        name={'CPUcore'}
                        styles={spinButtonStylesFirst}
                      />
                    </div>
                    <div className={styles.paddingTopBottom12}>
                      <Field
                        component={SpinButtonAdapter}
                        // index={index}
                        label={`${t('RAM')}${t('enSpace')}(MB)`}
                        min={0}
                        name={'RAM'}
                        styles={spinButtonStylesFirst}
                      />
                    </div>
                    <div className={styles.paddingTopBottom12}>
                      <Field
                        component={SpinButtonAdapter}
                        // index={index}
                        label={`${t('disk')}${t('enSpace')}(GB)`}
                        min={0}
                        name={'disk'}
                        styles={spinButtonStylesFirst}
                      />
                    </div>
                    <div className={styles.paddingTopBottom12}>
                      <Field
                        component={SpinButtonAdapter}
                        // index={index}
                        label={`${t('GPU')}${t('enSpace')}${t('amount')}`}
                        min={0}
                        name={'GPUamount'}
                        styles={spinButtonStylesFirst}
                      />
                    </div>
                  </div>
                </BasePanel>
              </div>
              <div className={`${styles.footer} ${styles.marignTop20}`}>
                <Card>
                  <div className={styles.submit}>
                    <PrimaryButton
                      className={mergeStyles({ marginRight: 20 })}
                      disabled={isLoading || !checkModify(values)}
                      // this is another method to click form
                      // onClick={() => {
                      //   document
                      //     .getElementById('exampleForm')
                      //     .dispatchEvent(new Event('submit'))
                      // }}
                      type="submit"
                    >
                      {`${t('confirm')}`}
                    </PrimaryButton>
                  </div>
                </Card>
              </div>
            </form>
          )}}
      />
    </BasePanel>
  );
};

Setting.propTypes = {
  systemParams: PropTypes.array,
  data: PropTypes.array,
  getData: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Setting;