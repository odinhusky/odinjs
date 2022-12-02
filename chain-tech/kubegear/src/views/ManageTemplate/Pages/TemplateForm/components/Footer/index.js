/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo
} from 'react';

// # API
import { createJobTemplate, putJobTemplateJobConfig } from 'utils/api';

// % context
// import GlobalContext from 'layouts/Main/GlobalContext';
import ManageTemplateContext from '../../../../Context';
import Context from '../../Context';

// ? Self-packed Components || Functions
import { removeEmptyProperties } from '../../utils/utils';
import { JobFinalData } from '../../model/JobFinalData';
import { JobSchema, JobSchemaMonaco } from '../../model/JobSchema';

import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import MonacoPanel from 'components/monaco/monaco-panel';
import { JobBasicInfo } from '../../model/JobBasicInfo';
import { JobTaskRole } from '../../model/JobTaskRole';
import { JobTemplate } from '../../model/JobTemplate';
import { Completion } from '../../model/completion';

// ^ Plugins
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { validate } from 'joi-browser';
import {
  cloneDeep,
  debounce,
  isEmpty,
  isArray
} from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/Footer
 * @component Footer
 * @description Footer component(新增、修改模板資料 | 匯入 | 匯出 | Monaco Panel 編輯JSON | 取消回到上一頁)
*/
const Footer = () => {

  // $ init data
  const history = useHistory();
  const { t } = useTranslation();

  // ? context
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
    parameters,
    setParameters,
    setIsLoading,
    errorMessage,
    isEditMode,
    editId,
    basicSettingVgOptions,
    resourceRef,
    isResourceValid
    // vgInfos
  } = useContext(Context)

  const { getData, classes } = useContext(ManageTemplateContext);

  // # states
  // 透過 JobFinalData 建立的資料結構，當欄位有變動的時候就會重新建立
  const [formData, setFormData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isCustomValid, setIsCustomValid] = useState(false);

  // Monaco的 value，型別為字串。當在Monaco編輯內容的時候，會同步更新字串的結構到這個 state 上
  const [formDataJson, setFormDataJson] = useState('');
  // const [isValidFormDataJson, setIsValidFormDataJson] = useState(false);
  const [errMsgFormDataJson, setErrMsgFormDataJson] = useState(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const monaco = useRef(null);
  const importInput = useRef(null);

  // - methods
  /**
   * @author odin
   * @param {object} formData - 依照該物件的資料產生最後的資料格式
   * @param {boolean} isEditMode - 是否為編輯模式，藉此產生不同的資料
   * @description 產生最後要送 API 的 data 格式
  */
  const transformFormat = useMemo(() => ((formData, isEditMode = false) => {

    const {
      canReadUsers,
      canWriteUsers,
      description,
      jobConfig,
      name,
      publicMode
    } = formData;

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
  }), [])

  /**
   * @author odin
   * @param {string} text - Monaco 回傳的字串結構
   * @description Monaco 的 onChange 事件，更新到 state formDataJson 上
  */
  const onJsonTextChange = text => {
    setFormDataJson(text);
  }

  /**
   * @author odin
   * @description 當開啟 編輯JSON 並且按下儲存的時候觸發的事件，將資料更新到畫面的欄位上
  */
  const saveEdit = () => {
    try {
      const data = JSON.parse(formDataJson);
      const { jobConfig } = data;
      const { extras } = jobConfig;
      const nfsList = extras['nfsList'] ? extras['nfsList'] : [];
      const glusterfsList = extras['glusterfsList'] ? extras['glusterfsList'] : [];

      // 處理 virtualGroup 有可能在編輯 Json 之後填入不符合選項的文字字串，過濾成為新的 virtualGroup
      const virtualGroup = extras['virtualGroup'];
      const virtualGroupTextArr = basicSettingVgOptions.map(item => item.text);
      const hasCorrectVirtualGroup = virtualGroupTextArr.includes(virtualGroup);
      const newVirtualGroup = hasCorrectVirtualGroup ? virtualGroup : '';

      // 組合資料結構
      const populateData = {
        ...data,
        jobConfig: {
          ...jobConfig,
          extras: {
            ...extras,
            nfsList,
            glusterfsList,
            virtualGroup: newVirtualGroup
          }
        }
      }

      // 提示，如果在 編輯Json 的狀態下， virtualGroup 是空字串的話，選擇資源的相關設定將不會更新
      if(isEditorOpen && virtualGroup === '') toast.info(`${t('infoWithoutSelectVirtualGroup')}`);

      updateData(populateData, isEditMode);
    } catch (e) {
      toast.error(`${t('dateInValid')} ${e.message}`)
    }
    // monaco.current.editor.setTheme('vs');
  }

  /**
   * @author odin
   * @param {object} data - 點選上傳的檔案或是自己傳入的物件結構
   * @param {Boolean} isEditMode - 是否為編輯模式
   * @description 將對應的資料放入對應的欄位中
  */
  const updateData = (data, isEditMode = false) => {
    try {
      const { name, description, publicMode, jobConfig } = data;
      const { gpuType, retryCount, taskRoles, extras, parameters } = jobConfig;
      const { nfsList, glusterfsList } = extras;

      // 取出更新畫面資源單位的方法
      const {
        setCPU,
        setGPU,
        setMemory,
        setGPUMemoryPercentage
      } = resourceRef.current;

      if (!isEditMode) {
        setJobTemplate(new JobTemplate({ name, description, publicMode }))
      }

      setJobInformation(new JobBasicInfo({ name: jobConfig.name, jobRetryCount: retryCount, virtualCluster: extras.virtualGroup, gpuType }))

      const newTaskRoles = Object.entries(taskRoles).reduce((acc, [taskRoleName, details]) => {
        const { dockerImage, taskNumber, completion, commands, resourcePerInstance } = details;
        // const unitCount = getResourceUnitCount(jobConfig, vgInfos);
        const { minFailedInstances, minSucceededInstances } = completion;
        const { ports, cpu, gpu, memoryMB, gpuMemoryPercentage } = resourcePerInstance;

        const newPorts = Object.entries(ports).map(([ key, value ]) => {
          return ({ 'key': key, 'value': value })
        });

        const taskRole = new JobTaskRole({
          name: taskRoleName,
          dockerInfo: dockerImage,
          instances: taskNumber,
          ports: newPorts,
          commands: commands,
          completion: new Completion({ minFailedInstances, minSucceededInstances }),
          k8sResource: { cpu, gpu, memoryMB, gpuMemoryPercentage }
        })

        // 資源相關設定
        setCPU(cpu);
        setGPU(gpu);
        setGPUMemoryPercentage(gpuMemoryPercentage);
        setMemory(memoryMB);

        return {
          ...acc,
          [taskRoleName]: taskRole
        }
      }, {});

      const newParameters = parameters ? Object.entries(parameters).map(([key, value]) => ({ key, value })) : [];

      setJobTaskRoles(newTaskRoles);
      if(isArray(nfsList)) setNfsMountsState(nfsList);
      if(isArray(glusterfsList)) setGlusterfsMountsState(glusterfsList);
      setParameters(newParameters);

      toast.success(`${t('success')}`);
    } catch (e) {
      toast.error('Error: ' + e.message)
    }
  }

  /**
   * @author odin
   * @description 依據 formData(state) 準備好資料格式，建立 cropData 的 URL，並在畫面上新增一個帶有該 URL 的 a tag，然後點擊該連結，下載完之後刪除 a 連結
  */
  const exportJson = () => {
    const data = cloneDeep(formData);
    const { jobConfig } = data;
    const { extras } = jobConfig;

    const cropData = {
      ...data,
      jobConfig: {
        ...jobConfig,
        extras: Object.entries(extras).reduce((acc, [key, details]) => ({ ...acc, [key]: details }), {})
      }
    };

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
  };

  /**
   * @author odin
   * @description 匯入檔案時，input 的 onChange 事件，創建 FileReader，並且等該檔案 load 完，就將其解析，更新到畫面上
  */
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

  /**
   * @author odin
   * @description 根據 isEditMode 決定要打哪一隻 API，並且透過 Fn. transformFormat 來產生要送出去的資料格式。送出成功後，會重新取得模板資料，並且回到模板管理的詳細模板頁面。
  */
  const onSubmit = () => {
    setIsLoading(true);
    if (isEditMode) {
      putJobTemplateJobConfig({ id: editId, data: transformFormat(formData, true) })
        .then(() => {
          toast.success(`${t('edit')}${t('enSpace')}${t('success')}`);
          getData();
          history.push('/template-manage');
        })
        .catch(err => toast.error(err.data ? err.data.message : err.message))
        .finally(() => setIsLoading(false))
    } else {
      createJobTemplate(transformFormat(formData))
        .then(() => {
          toast.success(`${t('add')}${t('enSpace')}${t('success')}`);
          getData();
          history.push('/template-manage');
        })
        .catch(err => toast.error(err.data ? err.data.message : err.message))
        .finally(() => setIsLoading(false))
    }
  };

  // * hooks
  /**
   * @author odin
   * @description 根據 Dependencies 的變數(由Context取得)，重新更新到 formData 這個 state 上，並且透過 JobFinalData 這個 class 產生的 instance
  */
  useEffect(
    () => {
      const data = new JobFinalData({ jobTemplate, jobInformation, jobTaskRoles, parameters, nfsMounts, glusterfsMounts })

      if (isEditMode) {
        setFormData(data);
      } else {
        setFormData(data);
      }
    },
    [jobTemplate, jobInformation, jobTaskRoles, parameters, nfsMounts, glusterfsMounts]
  );

  /**
   * @author odin
   * @description 當 Monaco Panel 被打開，也就是點選編輯Json 的時候，組出 formDataJson 的字串，並且 setFormDataJson
  */
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
          extras: Object.entries(extras).reduce((acc, [key, details]) => ({ ...acc, [key]: details }), {})
        }
      }

      setFormDataJson(JSON.stringify(cropData, null, 2))
    }
  }, [isEditorOpen]);

  /**
   * @author odin
   * @description  當 formData 更新，透過 JOI 來驗證各個結構是否符合規格
透過 JOI 的 validate 來驗證資料結構是不是有誤
  */
  useEffect(() => {
    const errorMsg = isEditMode ? validate(formData, JobSchema) : validate(formData, JobSchema)
    debounce(() => {
      const isValid = JobFinalData.validateData(formData)
      setIsCustomValid(isValid)
    }, 200)()

    const otherError = !isEmpty(errorMessage)
    setIsValid(errorMsg.error || otherError ? false : true);
  }, [formData]);

  /**
   * @author odin
   * @description 當 formDataJson 更新，且 Monaco Panel 是打開的時候，透過 JOI 來驗證各個結構是否符合規格
  */
  useEffect(() => {
    if (isEditorOpen) {
      const errorMsg = isEditMode ? validate(formData, JobSchemaMonaco) : validate(formDataJson, JobSchemaMonaco);
      // setIsValidFormDataJson(errorMsg.error === null ? true : false);
      setErrMsgFormDataJson(errorMsg.error ? errorMsg.error.message : null);
    }
  }, [formDataJson]);

  return (
    <div className={`${classes.manageTemplateFooter}`}>
      <div className={`${classes.manageTemplateFooterLeft}`}>
        <PrimaryButton
          children={`${t(isEditMode ? 'save' : 'add')}${t('template')}`}
          classNameProps={`${!isEditMode && classes.mr_20}`}
          disabled={!isValid || !isCustomValid || !isResourceValid}
          onClick={onSubmit}
        />
        {
          !isEditMode &&
          <DefaultButton
            children={`${t('edit')} JSON`}
            onClick={() => setIsEditorOpen(true)}
          />
        }
      </div>
      <div className={`${classes.manageTemplateFooterRight}`}>
        {
          !isEditMode &&
          <>
            <DefaultButton
              children={t('import')}
              classNameProps={`${classes.mr_16}`}
              onClick={() => importInput.current.click()}
            />

            <DefaultButton
              children={t('Export')}
              classNameProps={`${classes.mr_16}`}
              onClick={exportJson}
            />
          </>
        }

        <DefaultButton
          children={t('cancel')}
          onClick={() => history.push('/template-manage')}
        />

        <input
          accept=".yml,.yaml,.json"
          className={`${classes.d_none}`}
          onChange={importJson}
          ref={importInput}
          type="file"
        />
      </div>

      <MonacoPanel
        customFooterRightNode={
          <>
            <PrimaryButton
              children={t('save')}
              disabled={errMsgFormDataJson}
              onClick={() => saveEdit()}
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