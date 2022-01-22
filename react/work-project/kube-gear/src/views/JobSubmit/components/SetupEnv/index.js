import React, { useState, useEffect, useContext } from 'react';
import { Label } from 'office-ui-fabric-react';
import Card from 'components/Card';
import { Checkbox } from 'components/BaseInput';
// import { FormPage } from '../form-page';
import { BasicSection } from '../basic-section';
import { SetupEnvTextField } from './text-field';
import { cloneDeep, isEmpty } from 'lodash';
import { validate } from 'joi-browser';

import { setupEnvSchema } from './setupenv-schema';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Context from '../../components/context';
import { SETUPENV_ERROR_MESSAGE_ID } from '../../utils/errorCode';
import Grid from '@material-ui/core/Grid';

export const SetupEnv = React.memo(
  ({ onParametersSelected, selected, onChangeTaskRoles, taskRoles, onChangeParma, parameters }) => {
    const { t } = useTranslation();
    const { setErrorMessage } = useContext(Context);

    const { vnc, jupyterHttp, logMonitor, RDMA } = selected;

    const [validationMsg, setValidationMsg] = useState('');
    const [isPasswordError, setIsPasswordError] = useState('');
    const [isJupyterPasswordError, setIsJupyterPasswordError] = useState('');

    const rules = {
      required: value => (value ? '' : t('fieldRequired')),
      usernameFormat(username) {
        const usernameValidation = RegExp(/^[a-z0-9]{1,254}$/, 'g');
        return usernameValidation.test(username) ? '' : t('userNameInvalid');
      },
      passwordFormat(password) {
        // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/, 'g'
        const passwordValidation = RegExp(/^[a-zA-Z0-9\u4e00-\u9fa5-._~]{6,}$/, 'g');
        return passwordValidation.test(password) ? '' : t('atLeastEnterSixDigits');
      },
      matchPassword: (password, confirmPassword) => (confirmPassword === password ? '' : t('confirmPasswordInvalid')),
      mustBeText: value => (!isNaN(value) ? t('mustInputText') : ''),
      mustBeNumber: value => (isNaN(value) ? t('mustInputNumber') : ''),
      emailFormat(email) {
        const emailValidation = RegExp(
          /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
          'g'
        );
        return emailValidation.test(email) ? '' : t('emailInValid');
      }
    };

    const validateFromArray = (parameters) => {
      const result = validate(
        parameters,
        setupEnvSchema,
      );
      return String(result.error || '');
    }

    const onSelect = (field, checked) => {
      onParametersSelected({ ...selected, [field]: checked })
    }

    const onChangeParmaValue = (field, text) => {
      const copyParam = cloneDeep(parameters)
      const param = copyParam.map(item => {
        if (item.key === field) {
          item.value = text
        }
        return item
      })
      onChangeParma(param)
    }

    const _onGetlogMonitorErrorMessage = value => {
      if (isEmpty(value)) {
        return `${t('pathCanNotbeEmpty')}`;
      }
      return '';
    };

    const _setupEnvErrorUpdate = parameters => {
      const newValidationMessage = validateFromArray(parameters);
      if (newValidationMessage !== validationMsg) {
        setValidationMsg(newValidationMessage);
      }
      setErrorMessage(SETUPENV_ERROR_MESSAGE_ID, newValidationMessage);
    };

    useEffect(() => {
      const copyParamNotInclude = cloneDeep(parameters).filter(item => item.key !== '')
      if (!isEmpty(copyParamNotInclude)) {
        _setupEnvErrorUpdate(copyParamNotInclude)
      } else {
        setErrorMessage(SETUPENV_ERROR_MESSAGE_ID, {});
      }
    }, [parameters])

    useEffect(() => {
      const ports = []
      const parma = []

      const copyTaskRoles = cloneDeep(taskRoles)

      if (selected.vnc) {
        const hasDupParam = parameters.find(item => item.key === 'VNC_PASSWD')
        if (!hasDupParam) {
          ports.push({ key: 'vnc_http', value: '1' }, { key: 'vnc', value: '1' })
          parma.push({ key: 'VNC_PASSWD', value: '' })
        } else {
          ports.push({ key: 'vnc_http', value: '1' }, { key: 'vnc', value: '1' })
          parma.push(hasDupParam)
        }
      }

      if (selected.jupyterHttp) {
        const hasDupParam = parameters.find(item => item.key === 'JUPYTER_ENABLE_LAB')
        if (!hasDupParam) {
          ports.push({ key: 'jupyter_lab_http', value: '1' })
          parma.push({ key: 'JUPYTER_ENABLE_LAB', value: 'true' })
        } else {
          ports.push({ key: 'jupyter_lab_http', value: '1' })
          parma.push(hasDupParam)
        }

        const hasDupParamPwd = parameters.find(item => item.key === 'JUPYTER_PASSWD')
        if (!hasDupParamPwd) {
          parma.push({ key: 'JUPYTER_PASSWD', value: '' })
        } else {
          parma.push(hasDupParamPwd)
        }
      }

      if (selected.logMonitor) {
        const hasDupParam = parameters.find(item => item.key === 'TENSORBOARD_PATH')
        if (!hasDupParam) {
          ports.push({ key: 'tensorboard_http', value: '1' })
          parma.push({ key: 'TENSORBOARD_PATH', value: '' })
        } else {
          ports.push({ key: 'tensorboard_http', value: '1' })
          parma.push(hasDupParam)
        }
      }

      if (selected.RDMA) {
        const hasDupParam = parameters.find(item => item.key === 'paiAzRDMA')
        if (!hasDupParam) {
          parma.push({ key: 'paiAzRDMA', value: 'true' })
        } else {
          parma.push(hasDupParam)
        }
      }

      copyTaskRoles.forEach(item => {
        item.ports = ports
      })

      onChangeTaskRoles(copyTaskRoles)
      onChangeParma(parma)

    }, [selected])

    return (
      <div style={{ paddingTop: 20 }}>
        <div style={{ backgroundColor: '#F0FAF7', padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
          <Label styles={{ root: { fontSize: 18 } }}>{t('environmentVariable')}{t('enSpace')}{t('configuration')}</Label>
        </div>
        <Card>
          <Grid
            container
            direction="column"
            justifyContent="center"
            spacing={1}
          >
            <BasicSection
              containerItem
              sectionLabel={t('vnc')}
            >
              <Checkbox
                checked={vnc}
                onChange={(event, checked) => {
                  if (!checked) {
                    setErrorMessage(SETUPENV_ERROR_MESSAGE_ID, {});
                  }
                  onSelect('vnc', checked)
                }}
                styles={{ checkbox: { borderRadius: '3px' }, label: { marginBottom: '0px' } }}
              />
            </BasicSection>
            <Grid item>
              {
                vnc &&
                <SetupEnvTextField
                  error={isPasswordError}
                  helperText={isPasswordError === '' ? '' : isPasswordError}
                  onChange={(text) => {
                    onChangeParmaValue('VNC_PASSWD', text)
                    const checkField = rules.required(text) || rules.passwordFormat(text);
                    setIsPasswordError(checkField)
                  }}
                  sectionLabel={t('Password')}
                  type="password"
                  value={
                    parameters.find(item => item.key === 'VNC_PASSWD')
                      ? parameters.find(item => item.key === 'VNC_PASSWD') ? parameters.find(item => item.key === 'VNC_PASSWD').value : ''
                      : ''
                  }
                />
              }
            </Grid>
            <Grid item>
              <BasicSection
                sectionLabel={t('jupyterHttp')}
              >
                <Checkbox
                  checked={jupyterHttp}
                  onChange={(event, checked) => {
                    onSelect('jupyterHttp', checked)
                  }}
                  styles={{ checkbox: { borderRadius: '3px' }, label: { marginBottom: '0px' } }}
                />
              </BasicSection>
            </Grid>
            <Grid item>
              {
                jupyterHttp &&
                <SetupEnvTextField
                  error={isJupyterPasswordError}
                  helperText={isJupyterPasswordError === '' ? '' : isJupyterPasswordError}
                  onChange={(text) => {
                    onChangeParmaValue('JUPYTER_PASSWD', text)
                    const checkField = rules.required(text) || rules.passwordFormat(text);
                    setIsJupyterPasswordError(checkField)
                  }}
                  sectionLabel={`${t('jupyterHttp')}${t('enSpace')}${t('Password')}`}
                  type="password"
                  value={
                    parameters.find(item => item.key === 'JUPYTER_PASSWD')
                      ? parameters.find(item => item.key === 'JUPYTER_PASSWD') ? parameters.find(item => item.key === 'JUPYTER_PASSWD').value : ''
                      : ''
                  }
                />
              }
            </Grid>
            <BasicSection
              containerItem
              sectionLabel={'TensorBoard'}
            >
              <Checkbox
                checked={logMonitor}
                onChange={(event, checked) => {
                  onSelect('logMonitor', checked)
                }}
                styles={{ checkbox: { borderRadius: '3px' }, label: { marginBottom: '0px' } }}
              />
            </BasicSection>
            <Grid item>
              {
                logMonitor &&
                <SetupEnvTextField
                  onChange={(text) => onChangeParmaValue('TENSORBOARD_PATH', text)}
                  onGetErrorMessage={_onGetlogMonitorErrorMessage}
                  sectionLabel={t('path')}
                  value={
                    parameters.find(item => item.key === 'TENSORBOARD_PATH')
                      ? parameters.find(item => item.key === 'TENSORBOARD_PATH').value
                      : ''
                  }
                />
              }
            </Grid>
            <Grid item>
              <BasicSection
                sectionLabel={'RDMA'}
              >
                <Checkbox
                  checked={RDMA}
                  onChange={(event, checked) => {
                    onSelect('RDMA', checked)
                  }}
                  styles={{ checkbox: { borderRadius: '3px' }, label: { marginBottom: '0px' } }}
                />
              </BasicSection>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  },
);

SetupEnv.propTypes = {
  selected: PropTypes.object,
  onParametersSelected: PropTypes.func,
  onChangeTaskRoles: PropTypes.func,
  taskRoles: PropTypes.array,
  onChangeParma: PropTypes.func,
  parameters: PropTypes.array
};
