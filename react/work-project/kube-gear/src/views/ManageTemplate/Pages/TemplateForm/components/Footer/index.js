/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { validate } from 'joi-browser';
import { cloneDeep, debounce } from 'lodash';
import yaml from 'js-yaml';

import { JobFinalData, JobConfigData } from '../../model/JobFinalData';
import { JobSchema, jobConfigSchema, JobSchemaMonaco } from '../../model/JobSchema';

import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MonacoPanel from 'components/monaco/monaco-panel';
import { JobBasicInfo } from '../../model/JobBasicInfo';
import { JobTaskRole } from '../../model/JobTaskRole';
import { JobTemplate } from '../../model/JobTemplate';
import { Completion } from '../../model/completion';
import { isEmpty } from 'lodash';

import ParentContext from '../../../../Context';
import Context from '../../Context';
import GlobalContext from 'layouts/Main/GlobalContext';

import styles from './index.module.scss';

import { removeEmptyProperties } from '../../utils/utils';

import { createJobTemplate, putJobTemplateJobConfig } from 'utils/api';

const transformFormat = (formData, isEditMode = false) => {
  const { canReadUsers, canWriteUsers, description, jobConfig, name, publicMode } = formData;
  const { taskRoles, extras } = jobConfig;
  return {
    name: isEditMode ? null : name,
    description: isEditMode ? null : description,
    publicMode: isEditMode ? null : publicMode,
    canReadUsers: isEditMode ? null : canReadUsers,
    canWriteUsers: isEditMode ? null : canWriteUsers,
    jobConfig: removeEmptyProperties({
      ...jobConfig,
      taskRoles: Object.entries(taskRoles).reduce((acc, [taskRoleName, details], idx) => {
        const { commands, resourcePerInstance } = details;
        const commandsToArray = commands.trim().split('\n').map(line=>(line.trim()));
        return {
          ...acc,
          [taskRoleName]: {
            ...details,
            commands: commandsToArray,
            resourcePerInstance: Object.entries(resourcePerInstance).reduce((acc, [key, details]) => {
              if (key === 'ports' && isEmpty(details)) {
                return { ...acc }
              }
              return { ...acc, [key]: details }
            }, {}),
            taskRetryCount: 0,
            dockerImage: `docker_image_${idx}`
          }
        }
      }, {}),
      prerequisites: Object.entries(taskRoles).map(([taskRoleName, details], idx) => {
        const { dockerImage } = details;
        return {
          type: 'dockerimage',
          uri: dockerImage,
          name: `docker_image_${idx}`
        }
      }),
      jobRetryCount: 0,
      extras: Object.entries(extras).reduce((acc, [key, details]) => (
        isEmpty(details) ? { ...acc } : { ...acc, [key]: details }
      ), {})
    })
  }
}

const Footer = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const {
    jobTemplate,
    setJobTemplate,
    jobInformation,
    setJobInformation,
    jobTaskRoles,
    setJobTaskRoles,
    nfsMounts,
    setNfsMountsState,
    glusterfsMounts,
    setGlusterfsMountsState,
    xdfsMounts,
    setXdfsMountsState,
    parameters,
    setParameters,
    setIsLoading,
    errorMessage,
    isEditMode,
    editId,
    resourceUnitObject,
    hivedSkuTypes,
    vgInfos,
    isXdfsEnabled
  } = useContext(Context)
  const { getData } = useContext(ParentContext);
  const { getResourceUnitCount } = useContext(GlobalContext);
  const [formData, setFromData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isCustomValid, setIsCustomValid] = useState(false);
  const [formDataJson, setFormDataJson] = useState('');
  const [isValidFormDataJson, setIsValidFormDataJson] = useState(false);
  const [errMsgFormDataJson, setErrMsgFormDataJson] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const monaco = useRef(null);
  const importInput = useRef(null);

  useEffect(
    () => {
      if (isEditMode) {
        setFromData(new JobFinalData({ jobTemplate, jobInformation, jobTaskRoles, parameters, nfsMounts, glusterfsMounts, xdfsMounts }))
      } else {
        setFromData(new JobFinalData({ jobTemplate, jobInformation, jobTaskRoles, parameters, nfsMounts, glusterfsMounts, xdfsMounts }))
      }
    },
    [jobTemplate, jobInformation, jobTaskRoles, parameters, nfsMounts, glusterfsMounts, xdfsMounts]
  );

  useEffect(() => {
    if (isEditorOpen) {
      const data = cloneDeep(formData);
      const { name, description, publicMode, jobConfig, canReadUsers, canWriteUsers } = data;
      const { extras } = jobConfig;

      const cropData = {
        ...data,
        name: isEditMode ? null : name,
        description: isEditMode ? null : description,
        publicMode: isEditMode ? null : publicMode,
        canReadUsers: isEditMode ? null : canReadUsers,
        canWriteUsers: isEditMode ? null : canWriteUsers,
        jobConfig: {
          ...jobConfig,
          extras: Object.entries(extras).reduce((acc, [key, details]) => {
            if (!isXdfsEnabled && (key === 'xdfsList')) return { ...acc }
            if (isXdfsEnabled && ((key === 'nfsList') || (key === 'glusterfsList'))) return { ...acc }
            return { ...acc, [key]: details }
          }, {})
        }
      }

      setFormDataJson(JSON.stringify(cropData, null, 2))
    }
  }, [isEditorOpen])

  useEffect(() => {
    if (isEditorOpen) {
      const errorMsg = isEditMode ? validate(formData, JobSchemaMonaco) : validate(formDataJson, JobSchemaMonaco)
      setIsValidFormDataJson(errorMsg.error === null ? true : false)
      setErrMsgFormDataJson(errorMsg.error ? errorMsg.error.message : null)
    }
  }, [formDataJson])

  useEffect(() => {
    const errorMsg = isEditMode ? validate(formData, JobSchema) : validate(formData, JobSchema)
    debounce(() => {
      const isValid = JobFinalData.validateData(formData)
      setIsCustomValid(isValid)
    }, 200)()
    const otherError = !isEmpty(errorMessage)
    setIsValid(errorMsg.error || otherError ? false : true);
  }, [formData])

  const updateData = (data, isEditMode = false) => {
    try {
      const { name, description, publicMode, jobConfig } = data;
      const { gpuType, retryCount, taskRoles, extras, parameters } = jobConfig;

      const { nfsList, glusterfsList, xdfsList } = extras;

      if (!isEditMode) {
        setJobTemplate(new JobTemplate({ name, description, publicMode }))
      }

      setJobInformation(new JobBasicInfo({ name: jobConfig.name, jobRetryCount: retryCount, virtualCluster: extras.virtualGroup, gpuType }))

      const newTaskRoles = Object.entries(taskRoles).reduce((acc, [taskRoleName, details]) => {
        const { dockerImage, taskNumber, completion, commands, resourcePerInstance } = details;
        const { ports } = resourcePerInstance;
        const unitCount = getResourceUnitCount(jobConfig, vgInfos);
        const { minFailedInstances, minSucceededInstances } = completion;

        const newPorts = Object.entries(ports).map(([ key, value ]) => {
          return ({ 'key': key, 'value': value })
        })

        const taskRole = new JobTaskRole({
          name: taskRoleName,
          dockerInfo: dockerImage,
          instances: taskNumber,
          ports: newPorts,
          commands: commands,
          completion: new Completion({ minFailedInstances, minSucceededInstances }),
          hivedScheduler: !isEmpty(unitCount) && unitCount[taskRoleName]
            ? { skuNum: unitCount[taskRoleName].count, skuType: unitCount[taskRoleName].skuType, sku: unitCount[taskRoleName].sku, vg: unitCount[taskRoleName].vc }
            : { skuNum: 1, skuType: null, sku: null, vg: null }
        })

        return {
          ...acc,
          [taskRoleName]: taskRole
        }
      }, {})
      setJobTaskRoles(newTaskRoles);

      setNfsMountsState(nfsList);
      setGlusterfsMountsState(glusterfsList);
      setXdfsMountsState(xdfsList);
      const newParameters = parameters ? Object.entries(parameters).map(([key, value]) => ({ key, value })) : []
      setParameters(newParameters)
      toast.success(`${t('save')}${t('enSpace')}${t('success')}`)
    } catch (e) {
      toast.error('Error: ' + e.message)
    }
  }

  const onJsonTextChange = text => {
    setFormDataJson(text);
  }

  // const _closeEditor = () => {
  //   setIsEditorOpen(false);

  //   try {
  //     const res = JSON.parse(formDataJson);
  //     updateData(res)
  //   } catch (e) {
  //     toast.error('Error: ' + e.message)
  //   }

  //   // Change to the default theme
  //   monaco.current.editor.setTheme('vs');
  // };

  const saveEdit = () => {
    try {
      const data = JSON.parse(formDataJson);
      const { jobConfig } = data;
      const { extras } = jobConfig;
      const nfsList = extras['nfsList'] ? extras['nfsList'] : [];
      const glusterfsList = extras['glusterfsList'] ? extras['glusterfsList'] : [];
      const xdfsList = extras['xdfsList'] ? extras['xdfsList'] : [];
      const populateData = {
        ...data,
        jobConfig: {
          ...jobConfig,
          extras: {
            ...extras,
            nfsList,
            glusterfsList,
            xdfsList
          }
        }
      }

      updateData(populateData, isEditMode)
      toast.success(`${t('save')}${t('success')}`)
    } catch (e) {
      toast.error(`${t('dateInValid')} ${e.message}`)
    }
    // monaco.current.editor.setTheme('vs');
  }

  const onSubmit = () => {
    setIsLoading(true);
    if (isEditMode) {
      putJobTemplateJobConfig({ id: editId, data: transformFormat(formData, true) })
        .then(() => {
          toast.success(`${t('edit')}${t('enSpace')}${t('success')}`)
          getData()
          history.push('/template-manage')
        })
        .catch(err => toast.error(err.data ? err.data.message : err.message))
        .finally(() => setIsLoading(false))
    } else {
      createJobTemplate(transformFormat(formData))
        .then(() => {
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`)
          getData()
          history.push('/template-manage')
        })
        .catch(err => toast.error(err.data ? err.data.message : err.message))
        .finally(() => setIsLoading(false))
    }
  };

  const exportJson = () => {
    const data = cloneDeep(formData);
    const { jobConfig } = data;
    const { extras } = jobConfig;

    const cropData = {
      ...data,
      jobConfig: {
        ...jobConfig,
        extras: Object.entries(extras).reduce((acc, [key, details]) => {
          if (!isXdfsEnabled && (key === 'xdfsList')) return { ...acc }
          if (isXdfsEnabled && ((key === 'nfsList') || (key === 'glusterfsList'))) return { ...acc }
          return { ...acc, [key]: details }
        }, {})
      }
    }

    const file = new Blob([JSON.stringify(cropData, null, 2)], { type: 'text/json' });
    const filename = (formData.name || 'template') + '.json'
    if (window.navigator.msSaveOrOpenBlob) {
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  const importJson = event => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || !files[0]) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const text = String(fileReader.result);
      try {
        updateData(JSON.parse(text));
      } catch (err) {
        toast.error(err.message);
      }
    });
    fileReader.readAsText(files[0]);
  };

  return (
    <div className={styles.footer}>
      <div className={styles.left}>
        <PrimaryButton
          children={`${t(isEditMode ? 'save' : 'add')}${t('template')}`}
          disabled={!isValid || !isCustomValid}
          onClick={onSubmit}
          style={{ marginRight: 16 }}
        />
        {
          !isEditMode &&
          <DefaultButton
            children={`${t('edit')} JSON`}
            onClick={() => setIsEditorOpen(true)}
          />
        }
      </div>
      <div className={styles.right}>
        {
          !isEditMode &&
          <>
            <DefaultButton
              children={t('import')}
              onClick={() => importInput.current.click()}
              style={{ marginRight: 16 }}
            />
            <DefaultButton
              children={t('Export')}
              onClick={exportJson}
              style={{ marginRight: 16 }}
            />
          </>
        }
        <DefaultButton
          children={t('cancel')}
          onClick={() => history.push('/template-manage')}
        />
        <input
          accept=".yml,.yaml,.json"
          onChange={importJson}
          ref={importInput}
          style={{ display: 'none' }}
          type="file"
        />
      </div>
      <MonacoPanel
        customFooterRightNode={
          <>
            <PrimaryButton
              children={t('save')}
              onClick={() => saveEdit()}
              style={{ marginRight: 10 }}
            />
          </>
        }
        header={errMsgFormDataJson && String(errMsgFormDataJson)}
        isOpen={isEditorOpen}
        monacoProps={{
          language: 'json',
          options: { wordWrap: 'on', readOnly: false },
          value: formDataJson,
          onChange: onJsonTextChange
        }}
        monacoRef={monaco}
        onDismiss={() => {
          setIsEditorOpen(false)
          monaco.current.editor.setTheme('vs')
        }}
        title="Protocol JSON Editor"
      />
    </div>
  );
};

export default Footer;