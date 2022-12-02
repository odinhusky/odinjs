import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  memo,
  useCallback
} from 'react';

// ? context
import Context from './context';

// ? Self-packed Components || Functions
import { MB } from 'constant';
import PreviewModal from './PreviewModal';
import { DefaultButton, PrimaryButton } from 'components/BaseButton';
import { JobProtocol } from '../models/job-protocol';
import { JobBasicInfo } from '../models/job-basic-info';
import { JobTaskRole } from '../models/job-task-role';
import { submitJobV12 } from '../utils/conn';
import { createJobTemplate } from 'utils/api';
import MonacoPanel from 'components/monaco/monaco-panel';
import Card from 'components/Card';
import TemplateModal from './TemplateModal';
import { getJobComponentsFromConfig } from '../utils/utils';
import { VALIDATION_ERROR_MESSAGE_ID } from '../utils/errorCode';

// const JOB_PROTOCOL_SCHEMA_URL =
//   'https://github.com/microsoft/pai/blob/master/docs/pai-job-protocol.yaml';

// ^ Plugins
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import {
  isNil,
  isEqual,
  isEmpty,
  cloneDeep,
  get
} from 'lodash';

/**
 * @author odin
 * @level views/JobSubmit/Footer
 * @component Footer
 * @description Footer component
*/
export const Footer = memo(props => {

  // $ init data
  const {
    advanceFlag,
    jobInformation,
    jobTaskRoles,
    parameters,
    secrets,
    nfsMounts,
    handleComponentUpdate,
    initJobProtocol,
    setIsSubmitting,
    glusterfsMounts,
    templatesState,
    isTemplatesSelected,
    isEditorOpen,
    setEditorOpen,
    vgInfos,
    diskNum,
    getResourceUnitCount,
    handleProperResourceJobTaskRoles
  } = props;

  const history = useHistory();
  const user = cookies.get('user');
  const { t } = useTranslation();
  const uploadInputRef = useRef(null);

  // ? context
  const {
    vcNames,
    errorMessages,
    setErrorMessage,
    nfsInfo,
    glusterfsInfo,
    classes,
    remainObj,
    isResourceValid,
    vcType
  } = useContext(Context);

  // # states
  const [jobProtocol, setJobProtocol] = useState(
    new JobProtocol(initJobProtocol)
  );
  const [protocolYaml, setProtocolYaml] = useState ('');
  const [latestYamlText, setLatestYamlText] = useState ('');

  // const [protocolJson, setProtocolJson] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const monaco = useRef(null);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 更新 taskRole 將要更新的 jobTaskRoles，但是還沒有跟 remainObj 比較過
  const [updateTaskRoles, setUpdateTaskRoles] = useState(null);


  // - methods
  /**
   * @author Ben, elvis, odin
   * @param {object} protocol -- 要更新的 protocol 的值
   * @description 資料有變動的時候就確定 protocol 的內容是否有變動，如果有不相同的資料才進行更新
  */
  const _protocolAndErrorUpdate = protocol => {
    if (!isEqual(jobProtocol, protocol)) {
      setJobProtocol(protocol);
    }
    const newValidationMessage = JobProtocol.validateFromObject(protocol);
    if (newValidationMessage !== validationMsg) {
      setValidationMsg(newValidationMessage);
    }
    setErrorMessage(VALIDATION_ERROR_MESSAGE_ID, newValidationMessage);
  };

  const _openEditor = async event => {
    if (event) event.preventDefault();
    setEditorOpen(true);
  };

  /**
   * @author Ben, elvis, odin
   * @description 關閉 monaco 的時候，同步 protocolYaml 以及 latestYamlText 兩個 state
  */
  const _closeEditor = () => {
    setEditorOpen(false);

    // 同步 protocolYaml 以及 latestYamlText
    setLatestYamlText(protocolYaml);

    // _updatedComponent(protocolJson);
    // _updatedComponent(protocolYaml)

    // Change to the default theme
    monaco.current.editor.setTheme('vs');
  };

  /**
   * @author odin
   * @description 1. 儲存目前改動的 Yaml 到 protocol 的 Yaml 裏面
   * 2. 更新提交作業的元件內容
  */
  const saveEditedYaml = () => {
    setProtocolYaml(latestYamlText);
    _updatedComponent(latestYamlText);

    toast.success(`${t('success')}`)
  }

  /**
   * @author odin
   * @description 依據 jobProtocol(state) 準備好資料格式，建立 protocol 的 URL，並在畫面上新增一個帶有該 URL 的 a tag，然後點擊該連結，下載完之後刪除 a 連結
  */
  const _exportJson = async event => {
    event.preventDefault();
    const protocol = cloneDeep(jobProtocol);
    try {
      // await populateProtocolWithDataCli(user, protocol, jobData);
      _exportFile(
        protocol.toJson(),
        (protocol.name || 'job') + '.json',
        'text/json'
      );
    } catch (err) {
      alert(err);
    }
  };

  /**
   * @author odin
   * @description 在畫面上新增一個帶有該 URL 的 a tag，然後點擊該連結，下載完之後刪除 a 連結
  */
  const _exportFile = (data, filename, type) => {
    const file = new Blob([data], { type: type });
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
   * @param {object} event -- 原生的 event 物件
   * @description 匯入檔案的 func
  */
  const _importFile = event => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || !files[0]) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const text = String(fileReader.result);
      try {
        _updatedComponent(text);
      } catch (err) {
        alert(err.message);
      }
    });
    fileReader.readAsText(files[0]);
  };

  /**
   * @author odin
   * @param {yaml} text -- yaml 檔案的內容
   * @description Monaco 的 onChange function，這裡的 Monaco 是用 Yaml 寫的
  */
  const _onYamlTextChange = text => {
    // 設定最後編輯完的 yaml text
    setLatestYamlText(text);
    // setProtocolYaml (text);
    // setProtocolJson(text);

    // 設定 validationMsg
    const validationText = JobProtocol.validateFromYaml(text);
    setValidationMsg(validationText);
  };

  /**
   * @author odin
   * @description 送出提交作業，處理 protocol 的資料格式
  */
  const handleProperProtocol = useCallback(() => {
    const p = cloneDeep(jobProtocol);

    // 如果 gpu 為 0，則移除 gpuMemoryPercentage 的屬性
    p.taskRoles = Object.entries(p.taskRoles).reduce((acc, [name, obj]) => {
      const taskRoleObj = cloneDeep(obj);
      const thisGpu = get(taskRoleObj, 'resourcePerInstance.gpu', 0);
      if(thisGpu === 0) delete taskRoleObj.resourcePerInstance.gpuMemoryPercentage;

      return {
        ...acc,
        [name]: taskRoleObj
      }
    }, {})

    return p;
  }, [jobProtocol]);

  /**
   * @author odin
   * @description 送出提交作業，完成之後轉跳到作業管理的頁面
  */
  const _submitJob = async event => {
    event.preventDefault();
    const protocol = handleProperProtocol();

    try {
      setIsSubmitting(true);
      // await populateProtocolWithDataCli(user, protocol, jobData);
      // await submitJob(protocol.toYaml());
      await submitJobV12(user, protocol.toYaml());

      // 詢問是否要存成模板 有關
      if (isTemplatesSelected) {
        const jobConfig = JSON.parse(protocol.toJson());

        await createJobTemplate({ ...templatesState, jobConfig })
      }

      if(vcType === 'queueable') {
        history.push('/queue-manage');
      } else {
        history.push(`/job-detail/${protocol.name}?username=${user}&jobName=${protocol.name}`);
      }
    } catch (err) {
      toast.error(err.data.message);
      setIsSubmitting(false);
    }
  };

  // * hooks
  /**
   * @author odin
   * @description 只要提交作業的欄位一有變動
   * 1. 將所有的資料統整成一份 protocol 再轉格式為 Yaml 存在 protocolYaml
   * 2. 更新是否符合驗證規則
  */
  useEffect(
    () => {
      const protocol = jobProtocol.getUpdatedProtocol(
        jobInformation,
        jobTaskRoles,
        parameters,
        secrets,
        nfsMounts,
        glusterfsMounts,
      );
      _protocolAndErrorUpdate(protocol);

      try {
      // await populateProtocolWithDataCli(user, protocol, jobData);
        setProtocolYaml(protocol.toYaml());
      } catch (err) {
        alert(err);
      }
    },
    [jobInformation, jobTaskRoles, parameters, secrets, nfsMounts, glusterfsMounts, jobProtocol, templatesState]
  );

  /**
   * @author odin
   * @description protocolYaml 一有變動，就同樣存到 latestYamlText，同時也是 monaco panel 的 value
  */
  useEffect(() => {
    setLatestYamlText(protocolYaml)
  }, [protocolYaml]);

  useEffect(() => {
    if (isEditorOpen) {
      _openEditor()
    } else {
      if (isFirstTimeLoading) {
        setIsFirstTimeLoading(false)
      } else {
        _closeEditor()
      }
    }
  }, [isEditorOpen]);

  // - 更新元件的邏輯 start(包含匯入、編輯JSON)

  /**
   * @author Ben, elvis
   * @param {simport('typescript').string}} protocolJson -- 設定檔案內容
   * @description 更新元件內的各個 state
  */
  const _updatedComponent = protocolJson => {
    const updatedJob = JobProtocol.fromSource(protocolJson, 'yaml');

    if (isNil(updatedJob)) return;
    if (isNil(handleComponentUpdate)) return;

    const [
      updatedJobInformation,
      updatedTaskRoles,
      updatedParameters,
      updatedNfsMounts,
      updatedSecrets,
      updatedGlusterfsMounts
    ] = getJobComponentsFromConfig(updatedJob, { vcNames }, vgInfos, getResourceUnitCount);

    // 設定要比較的 jobTaskRoles
    setUpdateTaskRoles(updatedTaskRoles);

    handleComponentUpdate({
      jobInfo: updatedJobInformation,
      parameters: updatedParameters,
      secrets: updatedSecrets,
      nfsMounts: updatedNfsMounts,
      glusterfsMounts: updatedGlusterfsMounts
    });
  };

  /**
   * @author odin
   * @description protocolYaml 一有變動，就同樣存到 latestYamlText，同時也是 monaco panel 的 value
  */
  useEffect(() => {
    if(isNil(updateTaskRoles) || isNil(remainObj)) return;

    const handledJobTaskRoles = handleProperResourceJobTaskRoles(remainObj, updateTaskRoles);

    handleComponentUpdate({
      jobTaskRoles: handledJobTaskRoles
    });

    setUpdateTaskRoles(null);
  }, [updateTaskRoles, remainObj]);

  // - 更新元件的邏輯 end(包含匯入、編輯JSON)


  return (
    <>
      <Card className={`${classes.borderRadius_4} ${classes.mt_10}`}>
        <div
          className={`
          ${classes.d_flex}
          ${classes.justify_between}
          ${classes.m_auto}
          ${classes.maxW_1200px}
          `}
        >
          <div>
            {/* 編輯 JSON */}
            {
              advanceFlag &&
              <DefaultButton
                children={`${t('Edit')} JSON`}
                classNameProps={`${classes.mr_20}`}
                onClick={_openEditor}
              />
            }

            {/* 選擇模板 */}
            {
              advanceFlag &&
              <DefaultButton
                children={`${t('chooseTemplate')}`}
                onClick={() => { setIsModalOpen(true) }}
              />
            }

            {/* 匯出的按鈕 */}
            {/* <DefaultButton
              children={t('Export')}
              onClick={_exportJson}
              style={{ marginRight: 20 }}
            /> */}

            {/* 匯入的 input 放在外面，放在元件裡面功能就不能更新 */}
            <label htmlFor="import-files">
              {/* <DefaultButton
              children={t('import')}
              onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
            /> */}

              <input
                accept=".yml,.yaml,.json"
                id="import-files"
                onChange={_importFile}
                ref={uploadInputRef}
                style={{ display: 'none' }}
                type="file"
              />
            </label>
          </div>

          {/* 提交按鈕 */}
          <div>
            <PrimaryButton
              children={`${t('submit')}`}
              classNameProps={`${classes.mr_20} ${classes.fw_bold}`}
              disabled={!isEmpty(errorMessages) || !isResourceValid}
              onClick={() => setIsPreviewModalOpen(true)}
            />
          </div>
        </div>

        {/* 編輯 JSON 的 Modal */}
        <MonacoPanel
          customFooterLeftNode={
            <>
              {/* 匯出 */}
              <DefaultButton
                children={t('Export')}
                classNameProps={`${classes.mr_20}`}
                onClick={_exportJson}
              />

              {/* 匯入 */}
              <DefaultButton
                children={t('import')}
                onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
              />
            </>
          }
          customFooterRightNode={
            <PrimaryButton
              children={t('save')}
              disabled={validationMsg}
              onClick={() => {
                saveEditedYaml();
              }}
            />
          }
          header={`${validationMsg && String(validationMsg)}`}
          isOpen={isEditorOpen}
          monacoProps={{
            language: 'yaml',
            options: { wordWrap: 'on', readOnly: false },
            value: latestYamlText,
            onChange: _onYamlTextChange
          }}
          monacoRef={monaco}
          onDismiss={_closeEditor}
          title="Protocol JSON Editor"
          uploadInputRef={uploadInputRef}
        />

        {/* 資源分配圖 的 Modal */}
        <PreviewModal
          data={{
            disk: diskNum || 0,
            cpu: jobTaskRoles.reduce((acc, curr) => acc += curr.k8sResource.cpu, 0),
            gpu: {
              num: jobTaskRoles.reduce((acc, curr) => acc += curr.k8sResource.gpu, 0)
            // type: jobInformation.gpuType
            },
            rdma: parameters.find(param => param.key === 'paiAzRDMA') && parameters.find(param => param.key === 'paiAzRDMA').value === 'true' ? true : false,
            ram: jobTaskRoles.reduce((acc, curr) => acc += curr.k8sResource.memoryMB, 0),
            shm: jobTaskRoles.reduce((acc, curr) => {
              const value = curr.k8sResource.memoryMB;
              return acc += value
            }, 0),
            nfs: nfsMounts.reduce((acc, curr) => {
              if (!nfsInfo.find(nfs => nfs.name === curr.name)) return acc

              // available is KB
              const { available } = nfsInfo.find(nfs => nfs.name === curr.name)

              // convert to GB
              return acc += available / MB
            }, 0),
            glusterfs: glusterfsMounts.reduce((acc, curr) => {
              if (!glusterfsInfo.find(fs => fs.name === curr.name)) return acc

              // available is KB
              const { available } = glusterfsInfo.find(fs => fs.name === curr.name)

              // convert to GB
              return acc += available / MB
            }, 0)
          }}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onSubmit={_submitJob}
        />
      </Card>

      {/* Modal */}
      {
        // 選擇模板的 Modal
        isModalOpen &&
          <TemplateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
      }
    </>
  );
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

Footer.propTypes = {
  advanceFlag: PropTypes.bool,
  jobInformation: PropTypes.instanceOf(JobBasicInfo).isRequired,
  jobTaskRoles: PropTypes.arrayOf(PropTypes.instanceOf(JobTaskRole))
    .isRequired,
  parameters: PropTypes.array.isRequired,
  secrets: PropTypes.array.isRequired,

  nfsMounts: PropTypes.array.isRequired,
  glusterfsMounts: PropTypes.array.isRequired,

  handleComponentUpdate: PropTypes.func,
  initJobProtocol: PropTypes.object,
  isSubmitting: PropTypes.bool,
  setIsSubmitting: PropTypes.func,
  templatesState: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  isTemplatesSelected: PropTypes.bool,
  isEditorOpen: PropTypes.bool,
  setEditorOpen: PropTypes.func,
  vgInfos: PropTypes.object,
  diskNum: PropTypes.number,
  getResourceUnitCount: PropTypes.func,
  handleProperResourceJobTaskRoles: PropTypes.func
};
