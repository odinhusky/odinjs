/* eslint-disable react/no-multi-comp */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';

// % context
import GlobalContext from 'layouts/Main/GlobalContext';

// ^ Material-ui Componets(Functions)
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ? Self-packed Components || Functions
import { DefaultButton } from 'components/BaseButton';
import { BaseModal } from 'components/BaseModal';

import { MB } from 'constant';
import { formatBytes } from 'utils';

// ^ Plugins
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

// ? styles
import styles from './ViewModal.module.scss';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.paper
  }
}));

/**
 * @author odin
 * @level reuseContainers/ViewTemplateModal
 * @prop {boolean} isOpen -- 是否開啟
 * @prop {function} onClose -- 關閉的 function
 * @prop {object} vgInfos -- canUseVgList 轉換成物件
 * @prop {object} templateInfo -- 模板的相關資訊
 * @prop {string} title -- 標題
 * @component ViewTemplateModal
 * @description 檢視模板的的 Modal
*/
const ViewTemplateModal = ({
  isOpen,
  onClose,
  vgInfos,
  templateInfo,
  title
}) => {

  // $ init data
  const { t } = useTranslation();

  // % context
  const { isXdfsEnabled, getResourceUnitCount } = useContext(GlobalContext);

  // = styles
  const classes = useStyles();

  // # states
  const [selectedKey, setSelectedKey] = useState(false);
  const [taskRoles, setTaskRoles] = useState({});
  const [selectedTaskRole, setSelectedTaskRole] = useState();
  const [dockerInfos, setDockerInfos] = useState([]);
  const [dockerImage, setDockerImage] = useState('');
  const [nfsList, setNfsList] = useState([]);
  const [glusterfsList, setGlusterfsList] = useState([]);
  const [xdfsList, setXdfsList] = useState([]);
  const [virtualCluster, setVirtualCluster] = useState('');
  const [resourceUnitsCount, setResourceUnitsCount] = useState('');

  // - methods
  const getPortList = (portList) => {
    if (portList !== undefined && portList !== null) {
      return (
        <div className={`${styles.wrapper__block} ${styles.marginTop10} ${styles.paddingBottom10} ${styles.wrapper__borderBottom}`}>
          <div className={styles.wrapper__block__title}>
            <div className={styles.block__title__20}>{t('portName')}</div>
            <div className={styles.block__title__20}>{t('portNumber')}</div>
          </div>
          {
            portList.map((item, index) => (
              <div
                className={styles.wrapper__block__item}
                key={index}
              >
                <div className={styles.block__item__20}>{item.label}</div>
                <div className={styles.block__item__20}>{item.beginAt}</div>
              </div>
            ))
          }
        </div>
      )
    }
  }

  const storageList = (list, firstFieldName, secondFieldName) => {
    return (
      <div className={`${styles.wrapper__block} ${styles.block__borderBottom} ${styles.marginTop10} ${styles.paddingBottom10}`}>
        <div className={styles.wrapper__block__title}>
          <div className={styles.block__title__25}>{firstFieldName}</div>
          <div className={styles.block__title__25}>{secondFieldName}</div>
        </div>
        {
          list.map((item, index) => (
            <div
              className={styles.wrapper__block__item}
              key={index}
            >
              <div className={styles.block__item__25}>{item.name}</div>
              <div className={styles.block__item__25}>{item.mountPoint}</div>
            </div>
          ))
        }
      </div>
    )
  }

  // * hooks
  useEffect(() => {
    if (virtualCluster && !isEmpty(vgInfos) && !isEmpty(taskRoles[selectedKey]) && templateInfo.jobConfig !== undefined) {
      const { jobConfig } = templateInfo;
      const unitCount = getResourceUnitCount(jobConfig, vgInfos);

      const unitCountStr = !isEmpty(unitCount) && unitCount[selectedKey]
        ? `${unitCount[selectedKey].unitName} (${unitCount[selectedKey].gpuUnit} GPU, ${unitCount[selectedKey].cpuUnit} CPU, ${formatBytes(unitCount[selectedKey].memoryUnit * MB)} ${t('Memory')}) * ${unitCount[selectedKey].count}`
        : ''
      setResourceUnitsCount(unitCountStr)
    }
  }, [virtualCluster, selectedKey, taskRoles])

  useEffect(() => {
    if (templateInfo?.jobConfig !== undefined) {
      const { jobConfig } = templateInfo;
      const { taskRoles, extras, defaults, prerequisites } = jobConfig;
      const { nfsList, glusterfsList, xdfsList } = extras;
      setTaskRoles(taskRoles)
      setDockerInfos(prerequisites)
      setSelectedKey(Object.keys(jobConfig.taskRoles)[0])
      setVirtualCluster(defaults.virtualCluster)
      if (!isEmpty(nfsList)) setNfsList(nfsList)
      if (!isEmpty(glusterfsList)) setGlusterfsList(glusterfsList)
      if (!isEmpty(xdfsList)) setXdfsList(xdfsList)
    }
  }, [templateInfo])

  useEffect(() => {
    if (!selectedKey) return
    setSelectedTaskRole(taskRoles[selectedKey])
    const dockerImage = dockerInfos.find(item => item.name === taskRoles[selectedKey]['dockerImage'])
    if (!isEmpty(dockerImage)) {
      setDockerImage(dockerImage.uri)
    } else {
      setDockerImage('')
    }
  }, [selectedKey])

  return (
    <BaseModal
      isOpen={isOpen}
      styles={{
        main: {
          overflowY: ''
        },
        scrollableContent: {
          overflowY: ''
        }
      }}
      title={title}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={`${styles.top__block} ${styles.top__borderBottom} ${styles.paddingBottom10}`}>
            <div className={styles.top__block__item__title}>
              <div className={styles.top__block__item__25}>{t('Creator')}</div>
              <div className={styles.top__block__item__25}>{t('description')}</div>
            </div>
            <div className={styles.top__block__item}>
              <div className={styles.top__block__item__25}>{templateInfo.owner}</div>
              <div className={styles.top__block__item__25}>{templateInfo.description}</div>
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>

          <div className={`${styles.wrapper__block} ${styles.block__borderBottom} ${styles.marginTop10} ${styles.paddingBottom10}`}>
            <div className={styles.wrapper__block__title}>
              <div className={styles.block__title__25}>{t('virtualCluster')}</div>
              <div className={styles.block__title__25}>{t('retryCount')}</div>
            </div>
            <div className={styles.wrapper__block__item}>
              <div className={styles.block__item__25}>{templateInfo.jobConfig !== undefined && templateInfo.jobConfig.extras.virtualGroup}</div>
              <div className={styles.block__item__25}>{templateInfo.jobConfig !== undefined && templateInfo.jobConfig.retryCount}</div>
            </div>
          </div>

          { !isXdfsEnabled && !isEmpty(nfsList) && storageList(nfsList, t('NFS'), t('mountPoint')) }

          { !isXdfsEnabled && !isEmpty(glusterfsList) && storageList(glusterfsList, t('glusterfs'), t('volumeGlusterFS')) }

          { isXdfsEnabled && !isEmpty(xdfsList) && storageList(xdfsList, t('xdfs'), t('mountPoint')) }

          <div className={`${styles.wrapper__block} ${styles.block__borderBottom} ${styles.marginTop10} ${styles.paddingBottom10}`}>
            <div className={styles.wrapper__block__title}>
              <div className={styles.block__title__25}>{t('keyword')}</div>
              <div className={styles.block__title__25}>{t('Value')}</div>
            </div>
            {
              selectedTaskRole !== undefined && templateInfo.jobConfig !== undefined
              && templateInfo.jobConfig.parameters !== null
              && Object.entries(templateInfo.jobConfig.parameters).map(([key, value], index) => {
                return (
                  <div
                    className={styles.wrapper__block__item}
                    key={index}
                  >
                    <div className={styles.block__item__25}>
                      {key}
                    </div>
                    <div className={styles.block__item__25}>
                      {value}
                    </div>
                  </div>
                )
              })
            }
          </div>

          <Toolbar
            className={classes.toolbar}
            disableGutters
          >
            <Tabs
              aria-label="tabs"
              indicatorColor="primary"
              onChange={(e, value) => {
                setSelectedKey(value)
              }}
              scrollButtons="on"
              value={selectedKey}
              variant="scrollable"
            >
              {
                Object.keys(taskRoles).map((key) => (
                  <Tab
                    key={key}
                    label={key}
                    value={key}
                  />
                ))
              }
            </Tabs>
          </Toolbar>

          <div className={`${styles.wrapper__block} ${styles.marginTop10} ${styles.paddingBottom10} ${styles.wrapper__borderBottom}`}>
            <div className={styles.wrapper__block__title}>
              <div className={styles.block__title__25}>{t('command')}</div>
            </div>
            <div className={styles.wrapper__block__command}>
              {
                selectedTaskRole !== undefined &&
                selectedTaskRole.commands.map((element, index) => (<div key={index}>{element}</div>))
              }
            </div>
          </div>

          <div className={`${styles.wrapper__block} ${styles.marginTop10} ${styles.paddingBottom10} ${styles.wrapper__borderBottom}`}>
            <div className={styles.wrapper__block__title}>
              <div className={styles.block__title__50}>{t('dockerMirrors')}</div>
              <div className={styles.block__title__20}>{t('resourceUnitWithCount')}</div>
            </div>
            <div className={styles.wrapper__block__item}>
              <div className={styles.block__item__50}>{selectedTaskRole !== undefined && dockerImage}</div>
              <div className={styles.block__item__50}>{resourceUnitsCount}</div>
            </div>
          </div>


          {
            selectedTaskRole !== undefined
            && selectedTaskRole.portList !== undefined
            && selectedTaskRole.portList !== null
            && getPortList(selectedTaskRole.portList)
          }

          <div className={`${styles.wrapper__block} ${styles.marginTop10} ${styles.paddingBottom10} ${styles.wrapper__borderBottom}`}>
            <div className={styles.wrapper__block__title}>
              <div className={styles.block__title__50}>{t('conditionsOfCompletion')}: {t('minimumCountOfFailedInstances')}</div>
              <div className={styles.block__title__50}>{t('conditionsOfCompletion')}: {t('minimumCountOfSuccessfulInstances')}</div>
            </div>
            <div className={styles.wrapper__block__item}>
              <div className={styles.block__item__50}>{selectedTaskRole !== undefined && selectedTaskRole.completion && selectedTaskRole.completion.minFailedInstances}</div>
              <div className={styles.block__item__50}>{selectedTaskRole !== undefined && selectedTaskRole.completion && selectedTaskRole.completion.minSucceededInstances}</div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DefaultButton
          children={t('close')}
          onClick={() => {
            onClose()
            setSelectedKey('')
          }}
        />
      </div>
    </BaseModal>
  );
}

ViewTemplateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  vgInfos: PropTypes.object,
  templateInfo: PropTypes.object,
  title: PropTypes.string
};

export default ViewTemplateModal;
